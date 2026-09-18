/** Small SVG primitives for analysis visuals — no chart library, fully static HTML. */

export function AreaChart({
  points,
  width = 320,
  height = 96,
  stroke = "var(--color-copper)",
  fill = "var(--color-copper-soft)",
  animate = true,
}: {
  points: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  animate?: boolean;
}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const coords = points.map((p, i) => [i * step, height - 8 - ((p - min) / range) * (height - 20)] as const);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="Trend chart"
      style={{ height }}
    >
      <path d={area} fill={fill} opacity={0.7} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "chart-line" : undefined}
        style={animate ? { strokeDasharray: 900, strokeDashoffset: 900 } : undefined}
      />
      <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="3.5" fill={stroke} />
    </svg>
  );
}

export function BarsChart({
  values,
  labels,
  height = 120,
}: {
  values: number[];
  labels: string[];
  height?: number;
}) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-2" style={{ height }} role="img" aria-label="Bar chart">
      {values.map((v, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <div
            className={`w-full rounded-t-[4px] chart-bar ${i === values.length - 1 ? "bg-copper" : "bg-sage/70"}`}
            style={{ height: `${(v / max) * 82}%` }}
          />
          <span className="text-[10px] text-ink-faint">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
