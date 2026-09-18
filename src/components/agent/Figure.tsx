"use client";

import { fmt } from "@/lib/eda/analyze";
import type { FigureSpec } from "@/lib/eda/analyze";

/**
 * Renders EDA figure specs as inline SVG. Pure client component, no chart
 * library — deterministic, exportable, and fast.
 */

const PALETTE = ["#b45309", "#6b7f5e", "#1c1917", "#92400e", "#78716c", "#a8a29e", "#44403c", "#e7e5e4"];

export default function Figure({ spec }: { spec: FigureSpec }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-2.5">
        <figcaption className="text-[13px] font-semibold text-ink">{spec.title}</figcaption>
        {spec.subtitle && <span className="font-mono text-[10.5px] text-ink-faint">{spec.subtitle}</span>}
      </div>
      <div className="p-4">{body(spec)}</div>
    </figure>
  );
}

function body(spec: FigureSpec): React.ReactNode {
  switch (spec.kind) {
    case "histogram":
      return <Histogram data={spec.data as HistogramData} />;
    case "bar":
      return <BarChart data={spec.data as BarData} />;
    case "pie":
      return <Pie data={spec.data as BarData} />;
    case "line":
      return <LineChart data={spec.data as LineData} />;
    case "scatter":
      return <Scatter data={spec.data as ScatterData} />;
    case "box":
      return <BoxPlot data={spec.data as BoxData} />;
    case "correlation":
      return <CorrMatrix data={spec.data as CorrData} />;
    case "heatmap":
      return <CatHeatmap data={spec.data as CrossTabData} />;
    case "missing":
      return <MissingBars data={spec.data as { name: string; missing: number }[]} />;
    default:
      return <p className="text-[13px] text-ink-faint">Unsupported figure.</p>;
  }
}

/* ────────────────────────── Shared bits ────────────────────────── */

function Empty({ msg }: { msg: string }) {
  return <p className="py-6 text-center text-[12.5px] text-ink-faint">{msg}</p>;
}

/* ────────────────────────── Histogram ────────────────────────── */

interface HistogramData {
  bins: { binStart: number; binEnd: number; count: number }[];
  outliers: number;
  skew: number;
}

function Histogram({ data }: { data: HistogramData }) {
  if (!data.bins.length) return <Empty msg="No numeric values." />;
  const W = 560, H = 180, pad = { l: 34, r: 8, t: 8, b: 22 };
  const max = Math.max(...data.bins.map((b) => b.count), 1);
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const bw = iw / data.bins.length;
  const fmtLbl = (n: number) => fmt(n);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Histogram">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih * (1 - f)} y2={pad.t + ih * (1 - f)} stroke="var(--color-line)" strokeDasharray="3 3" />
          <text x={pad.l - 5} y={pad.t + ih * (1 - f) + 3} textAnchor="end" fontSize="9" fill="var(--color-ink-faint)">{Math.round(max * f)}</text>
        </g>
      ))}
      {data.bins.map((b, i) => {
        const h = (b.count / max) * ih;
        return (
          <rect key={i} x={pad.l + i * bw + 1} y={pad.t + ih - h} width={Math.max(bw - 2, 2)} height={h} rx="2" fill="var(--color-copper)" opacity={0.85} />
        );
      })}
      {data.bins.map((b, i) =>
        i % Math.ceil(data.bins.length / 6) === 0 ? (
          <text key={i} x={pad.l + i * bw + bw / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--color-ink-faint)">{fmtLbl(b.binStart)}</text>
        ) : null
      )}
      <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih} y2={pad.t + ih} stroke="var(--color-line-strong)" />
    </svg>
  );
}

/* ────────────────────────── Bar ────────────────────────── */

type BarDatum = { label: string; value: number; pct?: number };
type BarData = BarDatum[];

function BarChart({ data }: { data: BarData }) {
  if (!data?.length) return <Empty msg="No data." />;
  const W = 560, H = Math.max(150, Math.min(320, data.length * 34));
  const pad = { l: 110, r: 56, t: 8, b: 8 };
  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1e-9);
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const rh = ih / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Bar chart">
      {data.map((d, i) => {
        const w = (Math.abs(d.value) / max) * iw;
        const y = pad.t + i * rh + rh * 0.18;
        const h = rh * 0.64;
        const truncated = d.label.length > 16 ? d.label.slice(0, 15) + "…" : d.label;
        return (
          <g key={i}>
            <text x={pad.l - 8} y={y + h / 2 + 3} textAnchor="end" fontSize="10" fill="var(--color-ink-soft)">{truncated}</text>
            <rect x={pad.l} y={y} width={Math.max(w, 2)} height={h} rx="3" fill={i === 0 ? "var(--color-copper)" : "var(--color-sage)"} opacity={0.9 - i * (0.5 / data.length)} />
            <text x={pad.l + Math.max(w, 2) + 6} y={y + h / 2 + 3} fontSize="10" fill="var(--color-ink-mute)" fontFamily="var(--font-mono)">{fmt(d.value)}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ────────────────────────── Pie / donut ────────────────────────── */

function Pie({ data }: { data: BarData }) {
  if (!data?.length) return <Empty msg="No data." />;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const R = 62, CX = 84, CY = 76;
  const arc = (r: number, a0: number, a1: number) => {
    const x0 = CX + r * Math.cos(a0), y0 = CY + r * Math.sin(a0);
    const x1 = CX + r * Math.cos(a1), y1 = CY + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${CX} ${CY} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
  };

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 168 152" className="h-[150px] w-[166px]" role="img" aria-label="Composition chart">
        {data.map((d, i) => {
          const a0 = (acc / total) * Math.PI * 2 - Math.PI / 2;
          acc += d.value;
          const a1 = (acc / total) * Math.PI * 2 - Math.PI / 2;
          return <path key={i} d={arc(R, a0, a1)} fill={PALETTE[i % PALETTE.length]} opacity={0.9} stroke="var(--color-surface)" strokeWidth="1.5" />;
        })}
        <circle cx={CX} cy={CY} r={R * 0.55} fill="var(--color-surface)" />
        <text x={CX} y={CY + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--color-ink)">{data.length}</text>
      </svg>
      <ul className="min-w-[150px] flex-1 space-y-1.5">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2 text-[12px]">
            <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="min-w-0 flex-1 truncate text-ink-soft" title={d.label}>{d.label}</span>
            <span className="font-mono text-ink-mute">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ────────────────────────── Line ────────────────────────── */

interface LineData {
  series: { date: string; value: number }[];
  trend: { a: number; b: number; r2: number };
}

function LineChart({ data }: { data: LineData }) {
  if (!data.series?.length) return <Empty msg="No time column detected." />;
  const W = 560, H = 200, pad = { l: 44, r: 12, t: 10, b: 26 };
  const vals = data.series.map((s) => s.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const px = (i: number) => pad.l + (i / (data.series.length - 1)) * iw;
  const py = (v: number) => pad.t + ih - ((v - min) / range) * ih;

  const line = data.series.map((s, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(s.value).toFixed(1)}`).join(" ");
  const area = `${line} L${px(data.series.length - 1).toFixed(1)},${(pad.t + ih).toFixed(1)} L${px(0).toFixed(1)},${(pad.t + ih).toFixed(1)} Z`;
  const t0 = data.trend ? { x1: px(0), y1: py(data.trend.a), x2: px(data.series.length - 1), y2: py(data.trend.a + data.trend.b * (data.series.length - 1)) } : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Trend line">
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih * (1 - f)} y2={pad.t + ih * (1 - f)} stroke="var(--color-line)" strokeDasharray="3 3" />
          <text x={pad.l - 5} y={pad.t + ih * (1 - f) + 3} textAnchor="end" fontSize="9" fill="var(--color-ink-faint)">{fmt(min + range * f)}</text>
        </g>
      ))}
      <path d={area} fill="var(--color-copper-soft)" opacity={0.7} />
      <path d={line} fill="none" stroke="var(--color-copper)" strokeWidth="2" strokeLinecap="round" />
      {t0 && <line {...t0} stroke="var(--color-sage)" strokeDasharray="5 4" strokeWidth="1.5" />}
      {data.series.map((s, i) =>
        i % Math.ceil(data.series.length / 6) === 0 || i === data.series.length - 1 ? (
          <text key={i} x={px(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--color-ink-faint)">{s.date}</text>
        ) : null
      )}
    </svg>
  );
}

/* ────────────────────────── Scatter ────────────────────────── */

interface ScatterData {
  x: number[];
  y: number[];
  fit: { a: number; b: number };
  xName: string;
  yName: string;
}

function Scatter({ data }: { data: ScatterData }) {
  if (!data.x?.length) return <Empty msg="Not enough paired values." />;
  const W = 560, H = 220, pad = { l: 44, r: 12, t: 10, b: 28 };
  const xmin = Math.min(...data.x), xmax = Math.max(...data.x);
  const ymin = Math.min(...data.y), ymax = Math.max(...data.y);
  const rx = xmax - xmin || 1, ry = ymax - ymin || 1;
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const px = (v: number) => pad.l + ((v - xmin) / rx) * iw;
  const py = (v: number) => pad.t + ih - ((v - ymin) / ry) * ih;

  const dots = data.x.map((xv, i) => ({ cx: px(xv), cy: py(data.y[i]) }));
  const f0 = data.fit.a, f1 = data.fit.a + data.fit.b * xmax;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Scatter plot">
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih * (1 - f)} y2={pad.t + ih * (1 - f)} stroke="var(--color-line)" strokeDasharray="3 3" />
          <text x={pad.l - 5} y={pad.t + ih * (1 - f) + 3} textAnchor="end" fontSize="9" fill="var(--color-ink-faint)">{fmt(ymin + ry * f)}</text>
        </g>
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="3" fill="var(--color-copper)" opacity={0.45} />
      ))}
      <line x1={px(xmin)} y1={py(f0)} x2={px(xmax)} y2={py(f1)} stroke="var(--color-sage)" strokeWidth="2" />
      <text x={pad.l} y={H - 8} fontSize="9" fill="var(--color-ink-faint)">{data.xName}</text>
      <text x={pad.l + iw} y={H - 8} textAnchor="end" fontSize="9" fill="var(--color-ink-faint)">{data.yName}</text>
    </svg>
  );
}

/* ────────────────────────── Box plot ────────────────────────── */

interface BoxData { min: number; q1: number; median: number; q3: number; max: number; outliers: number[]; name: string }

function BoxPlot({ data }: { data: BoxData }) {
  const W = 560, H = 120, pad = { l: 44, r: 16, t: 18, b: 26 };
  const lo = Math.min(data.min, ...data.outliers);
  const hi = Math.max(data.max, ...data.outliers);
  const range = hi - lo || 1;
  const iw = W - pad.l - pad.r;
  const px = (v: number) => pad.l + ((v - lo) / range) * iw;
  const cy = H / 2 - 4;
  const q1 = px(data.q1), q3 = px(data.q3);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Box plot">
      {/* whiskers */}
      <line x1={px(data.min)} x2={q1} y1={cy} y2={cy} stroke="var(--color-ink-faint)" />
      <line x1={q3} x2={px(data.max)} y1={cy} y2={cy} stroke="var(--color-ink-faint)" />
      <line x1={px(data.min)} x2={px(data.min)} y1={cy - 9} y2={cy + 9} stroke="var(--color-ink-faint)" />
      <line x1={px(data.max)} x2={px(data.max)} y1={cy - 9} y2={cy + 9} stroke="var(--color-ink-faint)" />
      {/* box */}
      <rect x={q1} y={cy - 16} width={Math.max(q3 - q1, 2)} height={32} rx="4" fill="var(--color-copper-soft)" stroke="var(--color-copper)" />
      <line x1={px(data.median)} x2={px(data.median)} y1={cy - 16} y2={cy + 16} stroke="var(--color-copper-strong)" strokeWidth="2.5" />
      {data.outliers.map((o, i) => (
        <circle key={i} cx={px(o)} cy={cy} r="2.5" fill="var(--color-copper-strong)" opacity={0.6} />
      ))}
      {[["min", data.min], ["q1", data.q1], ["med", data.median], ["q3", data.q3], ["max", data.max]].map(([lbl, v], i) => (
        <text key={i} x={px(v as number)} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--color-ink-faint)" fontFamily="var(--font-mono)">{fmt(v as number)}</text>
      ))}
      <text x={W - pad.r} y={14} textAnchor="end" fontSize="10" fill="var(--color-ink-mute)">{data.name}</text>
    </svg>
  );
}

/* ────────────────────────── Correlation matrix ────────────────────────── */

interface CorrData { names: string[]; matrix: number[][] }

function CorrMatrix({ data }: { data: CorrData }) {
  if (!data.names?.length) return <Empty msg="Need ≥ 2 numeric columns." />;
  const n = data.names.length;
  const cell = Math.min(52, 360 / n);
  const labelW = 96;
  const W = labelW + n * cell + 10;
  const H = 26 + n * cell + 10;
  const color = (r: number) => {
    if (r >= 0) return `rgba(107, 127, 94, ${0.15 + Math.abs(r) * 0.8})`;
    return `rgba(180, 83, 9, ${0.15 + Math.abs(r) * 0.8})`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Correlation matrix">
      {data.names.map((nm, j) => (
        <text key={j} x={labelW + j * cell + cell / 2} y={16} textAnchor="middle" fontSize="9" fill="var(--color-ink-mute)">
          {nm.length > 8 ? nm.slice(0, 7) + "…" : nm}
        </text>
      ))}
      {data.names.map((nm, i) => (
        <g key={i}>
          <text x={labelW - 6} y={26 + i * cell + cell / 2 + 3} textAnchor="end" fontSize="9" fill="var(--color-ink-mute)">
            {nm.length > 12 ? nm.slice(0, 11) + "…" : nm}
          </text>
          {data.matrix[i].map((r, j) => (
            <g key={j}>
              <rect x={labelW + j * cell} y={26 + i * cell} width={cell - 2} height={cell - 2} rx="3" fill={color(r)} />
              {cell > 34 && (
                <text x={labelW + j * cell + (cell - 2) / 2} y={26 + i * cell + (cell - 2) / 2 + 3} textAnchor="middle" fontSize="9" fill="var(--color-ink)" fontFamily="var(--font-mono)">
                  {r.toFixed(2).replace("0.", ".").replace("-0", "-")}
                </text>
              )}
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ────────────────────────── Categorical heatmap ────────────────────────── */

interface CrossTabData { rowLevels: string[]; colLevels: string[]; counts: number[][] }

function CatHeatmap({ data }: { data: CrossTabData }) {
  if (!data.rowLevels?.length) return <Empty msg="Not enough categorical levels." />;
  const totals = data.counts.map((row) => row.reduce((s, v) => s + v, 0) || 1);
  const nR = data.rowLevels.length, nC = data.colLevels.length;
  const cell = 56;
  const labelW = 100;
  const W = labelW + nC * cell + 8;
  const H = 22 + nR * cell + 8;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Categorical heatmap">
      {data.colLevels.map((c, j) => (
        <text key={j} x={labelW + j * cell + cell / 2} y={14} textAnchor="middle" fontSize="9" fill="var(--color-ink-mute)">
          {c.length > 8 ? c.slice(0, 7) + "…" : c}
        </text>
      ))}
      {data.rowLevels.map((r, i) => (
        <g key={i}>
          <text x={labelW - 6} y={22 + i * cell + cell / 2 + 3} textAnchor="end" fontSize="9" fill="var(--color-ink-mute)">
            {r.length > 13 ? r.slice(0, 12) + "…" : r}
          </text>
          {data.counts[i].map((v, j) => {
            const share = v / totals[i];
            return (
              <g key={j}>
                <rect x={labelW + j * cell} y={22 + i * cell} width={cell - 2} height={cell - 2} rx="3" fill={`rgba(180, 83, 9, ${0.08 + share * 0.85})`} />
                <text x={labelW + j * cell + (cell - 2) / 2} y={22 + i * cell + (cell - 2) / 2 + 3} textAnchor="middle" fontSize="9" fill={share > 0.55 ? "#fff" : "var(--color-ink)"} fontFamily="var(--font-mono)">
                  {Math.round(share * 100)}%
                </text>
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/* ────────────────────────── Missing bars ────────────────────────── */

function MissingBars({ data }: { data: { name: string; missing: number }[] }) {
  if (!data.length) return <Empty msg="No missing values." />;
  const max = Math.max(...data.map((d) => d.missing), 1);
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate text-right text-[12px] text-ink-soft" title={d.name}>{d.name}</span>
          <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-paper-deep">
            <div className="h-full rounded-full bg-copper/80" style={{ width: `${(d.missing / max) * 100}%` }} />
          </div>
          <span className="w-14 shrink-0 text-right font-mono text-[11px] text-ink-mute">{d.missing.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
