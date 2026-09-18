/**
 * Descriptive statistics + analysis primitives for the EDA engine.
 * Pure functions over typed columns — no dependencies.
 */

import type { Column, ColumnType } from "./parse";

export interface NumericSummary {
  name: string;
  count: number;
  missing: number;
  mean: number;
  median: number;
  mode: number | null;
  std: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
  outliers: number;
}

export interface CategoricalSummary {
  name: string;
  count: number;
  missing: number;
  unique: number;
  top: { value: string; count: number; pct: number }[];
}

export type ColumnSummary = { kind: "numeric"; data: NumericSummary } | { kind: "categorical" | "date" | "boolean"; data: CategoricalSummary };

/* ─────────────────────────── Helpers ─────────────────────────── */

export function numericValues(col: Column): number[] {
  if (col.type !== "numeric") return [];
  return col.values.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
}

export function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = sorted[base + 1] ?? sorted[base];
  return sorted[base] + rest * (next - sorted[base]);
}

export function pearson(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 3) return 0;
  let sa = 0, sb = 0;
  for (let i = 0; i < n; i++) { sa += a[i]; sb += b[i]; }
  const ma = sa / n, mb = sb / n;
  let num = 0, da = 0, dbb = 0;
  for (let i = 0; i < n; i++) {
    const va = a[i] - ma, vb = b[i] - mb;
    num += va * vb; da += va * va; dbb += vb * vb;
  }
  const den = Math.sqrt(da * dbb);
  return den === 0 ? 0 : num / den;
}

export function spearman(a: number[], b: number[]): number {
  return pearson(rankArray(a), rankArray(b));
}

function rankArray(arr: number[]): number[] {
  const idx = arr.map((v, i) => ({ v, i })).sort((x, y) => x.v - y.v);
  const ranks = new Array<number>(arr.length);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1].v === idx[i].v) j++;
    const rank = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) ranks[idx[k].i] = rank;
    i = j + 1;
  }
  return ranks;
}

/** Least-squares simple linear regression y = a + b·x. */
export function linearRegression(x: number[], y: number[]): { a: number; b: number; r2: number } {
  const n = Math.min(x.length, y.length);
  if (n < 2) return { a: 0, b: 0, r2: 0 };
  const mx = x.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const my = y.slice(0, n).reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  const b = sxx === 0 ? 0 : sxy / sxx;
  const a = my - b * mx;
  return { a, b, r2: syy === 0 ? 0 : (sxy * sxy) / (sxx * syy) };
}

/* ─────────────────────────── Summaries ─────────────────────────── */

export function summarizeNumeric(col: Column): NumericSummary {
  const all = col.values;
  const nums = numericValues(col);
  const missing = all.filter((v) => v === null).length;
  const sorted = [...nums].sort((x, y) => x - y);
  const n = nums.length || 1;
  const mean = nums.reduce((s, v) => s + v, 0) / n;
  const variance = nums.reduce((s, v) => s + (v - mean) ** 2, 0) / (nums.length > 1 ? nums.length - 1 : 1);
  const std = Math.sqrt(variance);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const lo = q1 - 1.5 * iqr;
  const hi = q3 + 1.5 * iqr;
  const outliers = nums.filter((v) => v < lo || v > hi).length;

  let m3 = 0, m4 = 0;
  for (const v of nums) {
    const d = (v - mean) / (std || 1);
    m3 += d ** 3;
    m4 += d ** 4;
  }
  const skewness = nums.length ? m3 / nums.length : 0;
  const kurtosis = nums.length ? m4 / nums.length - 3 : 0;

  // Mode: most frequent value
  const freq = new Map<number, number>();
  for (const v of nums) freq.set(v, (freq.get(v) ?? 0) + 1);
  let mode: number | null = null;
  let modeCount = 0;
  for (const [v, c] of freq) if (c > modeCount) { mode = v; modeCount = c; }
  if (modeCount <= 1 || nums.length === 0) mode = null;

  return {
    name: col.name,
    count: nums.length,
    missing,
    mean,
    median: quantile(sorted, 0.5),
    mode,
    std,
    min: sorted[0] ?? 0,
    max: sorted[sorted.length - 1] ?? 0,
    q1, q3, iqr, skewness, kurtosis,
    outliers,
  };
}

export function summarizeCategorical(col: Column): CategoricalSummary {
  const missing = col.values.filter((v) => v === null).length;
  const present = col.values.filter((v) => v !== null) as (string | boolean | number)[];
  const freq = new Map<string, number>();
  for (const v of present) freq.set(String(v), (freq.get(String(v)) ?? 0) + 1);
  const total = present.length || 1;
  const top = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([value, count]) => ({ value, count, pct: count / total }));
  return { name: col.name, count: present.length, missing, unique: freq.size, top };
}

export function summarizeColumn(col: Column): ColumnSummary {
  if (col.type === "numeric") return { kind: "numeric", data: summarizeNumeric(col) };
  return { kind: col.type, data: summarizeCategorical(col) };
}

/* ─────────────────────────── Group-bys & aggregates ─────────────────────────── */

export function groupAggregate(
  groups: (string | number | boolean | null)[],
  values: (number | null)[],
  agg: "mean" | "sum" | "count" | "min" | "max" | "median"
): { group: string; value: number }[] {
  const buckets = new Map<string, number[]>();
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g === null) continue;
    const key = String(g);
    const v = values[i];
    if (!buckets.has(key)) buckets.set(key, []);
    if (typeof v === "number" && Number.isFinite(v)) buckets.get(key)!.push(v);
  }
  const out: { group: string; value: number }[] = [];
  for (const [group, nums] of buckets) {
    let value: number;
    switch (agg) {
      case "sum": value = nums.reduce((s, v) => s + v, 0); break;
      case "count": value = nums.length; break;
      case "min": value = Math.min(...nums); break;
      case "max": value = Math.max(...nums); break;
      case "median": value = quantile([...nums].sort((x, y) => x - y), 0.5); break;
      default: value = nums.reduce((s, v) => s + v, 0) / (nums.length || 1);
    }
    out.push({ group, value });
  }
  return out.sort((a, b) => b.value - a.value);
}

/** Contingency counts between two categorical columns. */
export function crossTab(
  a: (string | number | boolean | null)[],
  b: (string | number | boolean | null)[],
  maxLevels = 8
): { rowLevels: string[]; colLevels: string[]; counts: number[][] } {
  const rowFreq = new Map<string, number>();
  const colFreq = new Map<string, number>();
  for (let i = 0; i < a.length; i++) {
    if (a[i] === null || b[i] === null) continue;
    const ra = String(a[i]), cb = String(b[i]);
    rowFreq.set(ra, (rowFreq.get(ra) ?? 0) + 1);
    colFreq.set(cb, (colFreq.get(cb) ?? 0) + 1);
  }
  const rowLevels = [...rowFreq.entries()].sort((x, y) => y[1] - x[1]).slice(0, maxLevels).map((e) => e[0]);
  const colLevels = [...colFreq.entries()].sort((x, y) => y[1] - x[1]).slice(0, maxLevels).map((e) => e[0]);
  const counts = rowLevels.map(() => colLevels.map(() => 0));
  for (let i = 0; i < a.length; i++) {
    const ra = a[i] === null ? null : String(a[i]);
    const cb = b[i] === null ? null : String(b[i]);
    const ri = rowLevels.indexOf(ra as string);
    const ci = colLevels.indexOf(cb as string);
    if (ri >= 0 && ci >= 0) counts[ri][ci]++;
  }
  return { rowLevels, colLevels, counts };
}

/* ─────────────────────────── Distribution binning ─────────────────────────── */

export function histogram(nums: number[], bins = 12): { binStart: number; binEnd: number; count: number }[] {
  if (nums.length === 0) return [];
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (min === max) return [{ binStart: min, binEnd: max, count: nums.length }];
  const width = (max - min) / bins;
  const out = Array.from({ length: bins }, (_, i) => ({
    binStart: min + i * width,
    binEnd: min + (i + 1) * width,
    count: 0,
  }));
  for (const v of nums) {
    let bi = Math.floor((v - min) / width);
    if (bi >= bins) bi = bins - 1;
    if (bi < 0) bi = 0;
    out[bi].count++;
  }
  return out;
}

/** Find numeric outlier rows via IQR fences. */
export function outlierRows(col: Column, limit = 10): { index: number; value: number; z: number }[] {
  const s = summarizeNumeric(col);
  const lo = s.q1 - 1.5 * s.iqr;
  const hi = s.q3 + 1.5 * s.iqr;
  const out: { index: number; value: number; z: number }[] = [];
  col.values.forEach((v, i) => {
    if (typeof v === "number" && Number.isFinite(v) && (v < lo || v > hi)) {
      out.push({ index: i, value: v, z: s.std === 0 ? 0 : (v - s.mean) / s.std });
    }
  });
  return out.sort((a, b) => Math.abs(b.z) - Math.abs(a.z)).slice(0, limit);
}
