/**
 * The EDA engine: turns a parsed dataset into a full automatic analysis —
 * summary statistics, data-quality findings, correlations, distributions,
 * group comparisons, and figure specifications the UI renders as charts.
 *
 * Everything runs server-side in pure TypeScript: no Python, no notebook,
 * no external service. The LLM narrates on top of these verified numbers.
 */

import type { ParsedDataset, Column } from "./parse";
import {
  summarizeColumn,
  summarizeNumeric,
  summarizeCategorical,
  numericValues,
  pearson,
  spearman,
  linearRegression,
  groupAggregate,
  crossTab,
  histogram,
  outlierRows,
  type ColumnSummary,
} from "./stats";

/* ─────────────────────────── Types ─────────────────────────── */

export type FigureKind =
  | "histogram"
  | "bar"
  | "line"
  | "scatter"
  | "box"
  | "heatmap"
  | "pie"
  | "correlation"
  | "missing"
  | "table";

export interface FigureSpec {
  id: string;
  kind: FigureKind;
  title: string;
  subtitle?: string;
  /** Data payload interpreted by kind. */
  data: unknown;
}

export interface Insight {
  title: string;
  detail: string;
  tone: "positive" | "warning" | "info";
  tag: string;
}

export interface EdaReport {
  datasetName: string;
  rowCount: number;
  columnCount: number;
  format: "csv" | "json";
  overviews: ColumnSummary[];
  quality: {
    score: number;
    duplicateRows: number;
    missingCells: number;
    totalCells: number;
    issues: Insight[];
  };
  insights: Insight[];
  figures: FigureSpec[];
  narrativeFacts: string[];
  schemaLine: string;
  warnings: string[];
}

/* ─────────────────────────── Main entry ─────────────────────────── */

export function runEda(ds: ParsedDataset): EdaReport {
  const cols = ds.columns;
  const numericCols = cols.filter((c) => c.type === "numeric");
  const catCols = cols.filter((c) => c.type === "categorical");
  const dateCols = cols.filter((c) => c.type === "date");

  const overviews = cols.map(summarizeColumn);
  const figures: FigureSpec[] = [];
  const insights: Insight[] = [];
  const narrativeFacts: string[] = [];

  /* ── Data quality ── */
  const totalCells = cols.reduce((s, c) => s + c.values.length, 0);
  const missingCells = overviews.reduce((s, o) => s + ("missing" in o.data ? o.data.missing : 0), 0);
  const seenRows = new Set<string>();
  let duplicateRows = 0;
  const rowJson: string[] = [];
  const rowCount = ds.rowCount;
  for (let r = 0; r < rowCount; r++) {
    const row = cols.map((c) => String(c.values[r] ?? "")).join("\u0001");
    if (seenRows.has(row)) duplicateRows++;
    else {
      seenRows.add(row);
      if (r < 4000) rowJson.push(row);
    }
  }

  const completeness = totalCells ? 1 - missingCells / totalCells : 1;
  const uniqueness = rowCount ? 1 - duplicateRows / rowCount : 1;
  const qualityScore = Math.round((completeness * 0.6 + uniqueness * 0.4) * 100);

  const qualityIssues: Insight[] = [];
  for (const o of overviews) {
    if ("missing" in o.data && o.data.missing > 0) {
      const pct = Math.round((o.data.missing / Math.max(rowCount, 1)) * 100);
      qualityIssues.push({
        title: `Missing values in "${o.data.name}"`,
        detail: `${o.data.missing} of ${rowCount} rows (${pct}%) are missing. Consider imputation or row filtering before modeling.`,
        tone: pct > 20 ? "warning" : "info",
        tag: "quality",
      });
    }
  }
  if (duplicateRows > 0) {
    qualityIssues.push({
      title: "Duplicate rows detected",
      detail: `${duplicateRows} duplicate row${duplicateRows === 1 ? "" : "s"} found. Deduplicate before aggregating to avoid double counting.`,
      tone: "warning",
      tag: "quality",
    });
  }
  const constantCols = numericCols.filter((c) => {
    const s = summarizeNumeric(c);
    return s.count > 0 && s.min === s.max;
  });
  for (const c of constantCols) {
    qualityIssues.push({
      title: `"${c.name}" is constant`,
      detail: `Every row has the same value — it carries no signal for modeling or comparison.`,
      tone: "info",
      tag: "quality",
    });
  }

  /* ── Missing-data figure ── */
  const missingByCol = overviews
    .filter((o) => "missing" in o.data && o.data.missing > 0)
    .map((o) => ({ name: o.data.name, missing: (o.data as { missing: number }).missing }));
  if (missingByCol.length > 0) {
    figures.push({
      id: "missing",
      kind: "missing",
      title: "Missing values by column",
      subtitle: `${missingCells.toLocaleString()} missing cells of ${totalCells.toLocaleString()}`,
      data: missingByCol,
    });
  }

  /* ── Distributions of numeric columns (up to 4) ── */
  for (const c of numericCols.slice(0, 4)) {
    const s = summarizeNumeric(c);
    const nums = numericValues(c);
    figures.push({
      id: `hist-${c.name}`,
      kind: "histogram",
      title: `Distribution of ${c.name}`,
      subtitle: `mean ${fmt(s.mean)} · median ${fmt(s.median)} · σ ${fmt(s.std)}`,
      data: {
        bins: histogram(nums, Math.min(14, Math.max(6, Math.ceil(Math.sqrt(nums.length))))),
        outliers: s.outliers,
        skew: s.skewness,
      },
    });
    if (Math.abs(s.skewness) > 1) {
      insights.push({
        title: `"${c.name}" is heavily skewed`,
        detail: `Skewness ${s.skewness.toFixed(2)} — the mean is pulled by the tail; prefer the median (${fmt(s.median)}) when summarizing.`,
        tone: "info",
        tag: "distribution",
      });
    }
    if (s.outliers > 0 && nums.length > 0) {
      const pct = Math.round((s.outliers / nums.length) * 100);
      insights.push({
        title: `${s.outliers} outlier${s.outliers === 1 ? "" : "s"} in "${c.name}"`,
        detail: `Outside IQR fences [${fmt(s.q1 - 1.5 * s.iqr)}, ${fmt(s.q3 + 1.5 * s.iqr)}] — ${pct}% of values. Verify whether they are data errors or genuine extremes.`,
        tone: pct > 5 ? "warning" : "info",
        tag: "outliers",
      });
    }
  }

  /* ── Categorical composition (up to 3 pies/bars) ── */
  for (const c of catCols.slice(0, 3)) {
    const s = summarizeCategorical(c);
    if (s.unique > 1) {
      figures.push({
        id: `cat-${c.name}`,
        kind: s.unique <= 6 ? "pie" : "bar",
        title: s.unique <= 6 ? `Composition of ${c.name}` : `Top categories in ${c.name}`,
        subtitle: `${s.unique} unique values`,
        data: s.top.map((t) => ({ label: t.value, value: t.count, pct: t.pct })),
      });
    }
    if (s.unique === 1 && rowCount > 1) {
      insights.push({
        title: `"${c.name}" has a single value`,
        detail: `All ${rowCount} rows are "${s.top[0]?.value}" — consider dropping it from segment comparisons.`,
        tone: "info",
        tag: "quality",
      });
    }
  }

  /* ── Correlation matrix (≤ 8 numeric columns) ── */
  if (numericCols.length >= 2) {
    const picked = numericCols.slice(0, 8);
    const matrix = picked.map((a) =>
      picked.map((b) => {
        const pairs = alignedPairs(a, b);
        return pairs ? pearson(pairs.a, pairs.b) : 0;
      })
    );
    figures.push({
      id: "corr",
      kind: "correlation",
      title: "Correlation matrix (Pearson)",
      subtitle: `${picked.length} numeric columns`,
      data: { names: picked.map((c) => c.name), matrix },
    });

    // Top pairs → scatter plots + insights
    type Pair = { a: Column; b: Column; r: number };
    const pairs: Pair[] = [];
    for (let i = 0; i < picked.length; i++) {
      for (let j = i + 1; j < picked.length; j++) {
        const ap = alignedPairs(picked[i], picked[j]);
        if (!ap) continue;
        pairs.push({ a: picked[i], b: picked[j], r: pearson(ap.a, ap.b) });
      }
    }
    pairs.sort((x, y) => Math.abs(y.r) - Math.abs(x.r));
    for (const p of pairs.slice(0, 2)) {
      const ap = alignedPairs(p.a, p.b)!;
      const reg = linearRegression(ap.a, ap.b);
      figures.push({
        id: `scatter-${p.a.name}-${p.b.name}`,
        kind: "scatter",
        title: `${p.b.name} vs ${p.a.name}`,
        subtitle: `r = ${p.r.toFixed(2)} · R² = ${reg.r2.toFixed(2)}`,
        data: {
          x: ap.a.slice(0, 600),
          y: ap.b.slice(0, 600),
          fit: { a: reg.a, b: reg.b },
          xName: p.a.name,
          yName: p.b.name,
        },
      });
      if (Math.abs(p.r) >= 0.5) {
        insights.push({
          title: `Strong ${p.r > 0 ? "positive" : "negative"} link: ${p.a.name} ↔ ${p.b.name}`,
          detail: `Pearson r = ${p.r.toFixed(2)}. A one-unit change in ${p.a.name} is associated with ${reg.b >= 0 ? "+" : ""}${fmt(reg.b)} in ${p.b.name} (R² ${reg.r2.toFixed(2)}). Correlation is not causation.`,
          tone: "info",
          tag: "correlation",
        });
      }
    }
  }

  /* ── Time trend for first date column + numeric ── */
  if (dateCols.length > 0 && numericCols.length > 0) {
    const dCol = dateCols[0];
    const vCol = numericCols[0];
    const byDate = new Map<string, number[]>();
    dCol.values.forEach((d, i) => {
      if (typeof d !== "string") return;
      const v = vCol.values[i];
      if (!byDate.has(d)) byDate.set(d, []);
      if (typeof v === "number") byDate.get(d)!.push(v);
    });
    const series = [...byDate.entries()]
      .sort((x, y) => x[0].localeCompare(y[0]))
      .map(([date, vals]) => ({ date, value: vals.reduce((s, v) => s + v, 0) / (vals.length || 1) }));
    if (series.length >= 3) {
      figures.push({
        id: `trend-${vCol.name}`,
        kind: "line",
        title: `${vCol.name} over ${dCol.name}`,
        subtitle: `${series.length} periods · first ${series[0].date} → last ${series[series.length - 1].date}`,
        data: {
          series,
          trend: (() => {
            const xs = series.map((_, i) => i);
            const ys = series.map((s2) => s2.value);
            return linearRegression(xs, ys);
          })(),
        },
      });
      const first = series.slice(0, Math.ceil(series.length / 3));
      const last = series.slice(-Math.ceil(series.length / 3));
      const avg = (arr: typeof series) => arr.reduce((s, x) => s + x.value, 0) / (arr.length || 1);
      const f = avg(first), l = avg(last);
      if (f !== 0) {
        const change = ((l - f) / Math.abs(f)) * 100;
        insights.push({
          title: `${vCol.name} ${change >= 0 ? "trended up" : "trended down"} over time`,
          detail: `Average moved from ${fmt(f)} to ${fmt(l)} (${change >= 0 ? "+" : ""}${change.toFixed(1)}%) across the ${series.length}-period span.`,
          tone: "info",
          tag: "trend",
        });
      }
    }
  }

  /* ── Group comparisons: best categorical × numeric pairs ── */
  const groupPairs: { cat: Column; num: Column }[] = [];
  for (const c of catCols) {
    const s = summarizeCategorical(c);
    if (s.unique >= 2 && s.unique <= 8) {
      for (const n of numericCols.slice(0, 3)) groupPairs.push({ cat: c, num: n });
      break;
    }
  }
  for (const gp of groupPairs.slice(0, 2)) {
    const means = groupAggregate(
      gp.cat.values,
      gp.num.values as (number | null)[],
      "mean"
    ).slice(0, 10);
    if (means.length >= 2) {
      figures.push({
        id: `group-${gp.cat.name}-${gp.num.name}`,
        kind: "bar",
        title: `Average ${gp.num.name} by ${gp.cat.name}`,
        subtitle: "group means",
        data: means.map((m) => ({ label: m.group, value: m.value })),
      });
      const spread = means[0].value - means[means.length - 1].value;
      if (means[0].value !== 0) {
        insights.push({
          title: `"${gp.cat.name}" drives differences in ${gp.num.name}`,
          detail: `"${means[0].group}" averages ${fmt(means[0].value)} vs "${means[means.length - 1].group}" at ${fmt(means[means.length - 1].value)} — a gap of ${fmt(spread)}.`,
          tone: "info",
          tag: "segments",
        });
      }
    }
  }

  /* ── Cross-tab heat between two categoricals ── */
  if (catCols.length >= 2) {
    const ct = crossTab(catCols[0].values, catCols[1].values, 6);
    if (ct.rowLevels.length >= 2 && ct.colLevels.length >= 2) {
      figures.push({
        id: `heat-${catCols[0].name}-${catCols[1].name}`,
        kind: "heatmap",
        title: `${catCols[1].name} share within ${catCols[0].name}`,
        subtitle: "row-normalized counts",
        data: ct,
      });
    }
  }

  /* ── Box plots for top numeric columns ── */
  for (const c of numericCols.slice(0, 2)) {
    const s = summarizeNumeric(c);
    figures.push({
      id: `box-${c.name}`,
      kind: "box",
      title: `Spread of ${c.name}`,
      subtitle: `IQR ${fmt(s.iqr)} · whiskers at 1.5×IQR`,
      data: {
        min: s.min, q1: s.q1, median: s.median, q3: s.q3, max: s.max,
        outliers: outlierRows(c, 6).map((o) => o.value),
        name: c.name,
      },
    });
  }

  /* ── Headline insights ── */
  if (rowCount > 0) {
    narrativeFacts.push(`Dataset "${ds.name}": ${rowCount.toLocaleString()} rows × ${cols.length} columns (${ds.sourceFormat.toUpperCase()}), quality score ${qualityScore}/100.`);
    narrativeFacts.push(`Column types: ${numericCols.length} numeric, ${catCols.length} categorical, ${dateCols.length} date, ${cols.filter((c) => c.type === "boolean").length} boolean.`);
    if (numericCols.length > 0) {
      const s = summarizeNumeric(numericCols[0]);
      narrativeFacts.push(`"${s.name}" ranges ${fmt(s.min)} → ${fmt(s.max)} (mean ${fmt(s.mean)}, median ${fmt(s.median)}, σ ${fmt(s.std)}).`);
    }
    if (catCols.length > 0) {
      const s = summarizeCategorical(catCols[0]);
      narrativeFacts.push(`"${s.name}" has ${s.unique} unique values; most common is "${s.top[0]?.value}" (${Math.round((s.top[0]?.pct ?? 0) * 100)}%).`);
    }
  }

  return {
    datasetName: ds.name,
    rowCount,
    columnCount: cols.length,
    format: ds.sourceFormat,
    overviews,
    quality: {
      score: qualityScore,
      duplicateRows,
      missingCells,
      totalCells,
      issues: qualityIssues,
    },
    insights,
    figures,
    narrativeFacts,
    schemaLine: cols.map((c) => `${c.name}(${c.type})`).join(", "),
    warnings: ds.warnings,
  };
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function alignedPairs(a: Column, b: Column): { a: number[]; b: number[] } | null {
  if (a.type !== "numeric" || b.type !== "numeric") return null;
  const va: number[] = [];
  const vb: number[] = [];
  for (let i = 0; i < Math.min(a.values.length, b.values.length); i++) {
    const x = a.values[i];
    const y = b.values[i];
    if (typeof x === "number" && Number.isFinite(x) && typeof y === "number" && Number.isFinite(y)) {
      va.push(x);
      vb.push(y);
    }
  }
  return va.length >= 3 ? { a: va, b: vb } : null;
}

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (abs >= 1e4) return (n / 1e3).toFixed(1) + "k";
  if (abs >= 100) return n.toFixed(1);
  if (abs >= 1) return n.toFixed(2);
  if (abs === 0) return "0";
  return n.toPrecision(3);
}

/** Compact schema + stats context string for the LLM. */
export function edaContextForLlm(report: EdaReport): string {
  const lines: string[] = [];
  lines.push(`DATASET: ${report.datasetName} — ${report.rowCount} rows × ${report.columnCount} columns (${report.format.toUpperCase()})`);
  lines.push(`SCHEMA: ${report.schemaLine}`);
  lines.push(`QUALITY: score ${report.quality.score}/100, ${report.quality.missingCells} missing cells, ${report.quality.duplicateRows} duplicate rows`);
  lines.push("");
  lines.push("COLUMN STATISTICS:");
  for (const o of report.overviews) {
    if (o.kind === "numeric") {
      const d = o.data;
      lines.push(`- ${d.name} [numeric]: n=${d.count}, missing=${d.missing}, mean=${d.mean.toFixed(3)}, median=${d.median.toFixed(3)}, std=${d.std.toFixed(3)}, min=${d.min}, q1=${d.q1}, q3=${d.q3}, max=${d.max}, outliers=${d.outliers}, skew=${d.skewness.toFixed(2)}`);
    } else {
      const d = o.data;
      const tops = d.top.slice(0, 5).map((t) => `${t.value}(${Math.round(t.pct * 100)}%)`).join(", ");
      lines.push(`- ${d.name} [${o.kind}]: n=${d.count}, missing=${d.missing}, unique=${d.unique}, top: ${tops}`);
    }
  }
  if (report.insights.length > 0) {
    lines.push("");
    lines.push("DETECTED PATTERNS:");
    for (const i of report.insights) lines.push(`- [${i.tag}] ${i.title}: ${i.detail}`);
  }
  return lines.join("\n");
}
