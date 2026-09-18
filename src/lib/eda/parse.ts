/**
 * Dataset parsing for the EDA engine.
 *
 * Accepts raw CSV / TSV / semicolon / pipe delimited text, or JSON (array of
 * objects, or an object of arrays). Produces a normalized dataset with typed
 * columns — no external dependencies.
 */

export type ColumnType = "numeric" | "date" | "categorical" | "boolean";

export interface Column {
  name: string;
  type: ColumnType;
  values: (number | string | boolean | null)[];
}

export interface ParsedDataset {
  name: string;
  columns: Column[];
  rowCount: number;
  /** First rows as string records, for LLM context. */
  sample: Record<string, string>[];
  /** True when the source was JSON rather than delimited text. */
  sourceFormat: "csv" | "json";
  warnings: string[];
}

const DATE_PATTERNS: RegExp[] = [
  /^\d{4}-\d{2}-\d{2}$/, // 2024-01-31
  /^\d{4}-\d{2}$/, // 2024-01 (monthly series)
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?/, // 2024-01-31T10:30
  /^\d{1,2}\/\d{1,2}\/\d{4}$/, // 1/31/2024
  /^\d{1,2}-\d{1,2}-\d{4}$/, // 31-1-2024
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[- ]\d{1,2},?[- ]?\d{0,4}$/i,
  /^\d{4}[/.]\d{1,2}[/.]\d{1,2}$/,
];

const MISSING = new Set(["", "na", "n/a", "nan", "null", "none", "undefined", "-", "--", "?"]);

export function isMissingValue(raw: string | null | undefined): boolean {
  return raw == null || MISSING.has(raw.trim().toLowerCase());
}

function looksNumeric(raw: string): boolean {
  const t = raw.trim();
  if (t === "") return false;
  const cleaned = t.replace(/[$€£¥₹,%\s]/g, "").replace(/[kKmMbB]$/, (m) =>
    m === m.toUpperCase() && /(\d|\.\d)$/.test(t) ? "" : m
  );
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(cleaned)) return true;
  // Parenthesized negatives (accounting style): (1,234.5)
  if (/^\(\s*-?\d+(\.\d+)?\s*\)$/.test(t)) return true;
  return false;
}

export function parseNumeric(raw: string): number | null {
  const t = raw.trim();
  if (t === "" || isMissingValue(t)) return null;
  let s = t;
  const negativeParens = /^\(.*\)$/.test(s);
  if (negativeParens) s = s.slice(1, -1).trim();
  s = s.replace(/[$€£¥₹,\s]/g, "");
  let multiplier = 1;
  const suffix = s.slice(-1).toLowerCase();
  if (suffix === "k" && /^-?\d/.test(s)) { multiplier = 1e3; s = s.slice(0, -1); }
  else if (suffix === "m" && /^-?\d/.test(s)) { multiplier = 1e6; s = s.slice(0, -1); }
  else if (suffix === "b" && /^-?\d/.test(s)) { multiplier = 1e9; s = s.slice(0, -1); }
  s = s.replace(/%$/, "");
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return n * multiplier * (negativeParens ? -1 : 1);
}

export function looksLikeDate(raw: string): boolean {
  const t = raw.trim();
  if (t.length < 6 || t.length > 32) return false;
  return DATE_PATTERNS.some((p) => p.test(t));
}

export function parseDate(raw: string): string | null {
  const t = raw.trim();
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  // Sanity window: 1970..2100
  const year = d.getUTCFullYear();
  if (year < 1970 || year > 2100) return null;
  return d.toISOString().slice(0, 10);
}

/* ─────────────────────────── CSV parsing ─────────────────────────── */

function detectDelimiter(text: string): string {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "").slice(0, 10);
  const candidates = [",", ";", "\t", "|"];
  let best = ",";
  let bestScore = -1;
  for (const d of candidates) {
    const counts = lines.map((l) => l.split(d).length - 1);
    const avg = counts.reduce((a, b) => a + b, 0) / (counts.length || 1);
    const consistent = counts.every((c) => Math.abs(c - avg) <= 1);
    const score = consistent ? avg : avg * 0.4;
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  return best;
}

/** RFC-4180-ish splitter: handles quoted fields, escaped quotes, embedded newlines. */
function splitCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export function parseDelimited(text: string, name: string): ParsedDataset {
  const warnings: string[] = [];
  const clean = text.replace(/^\uFEFF/, "").trim();
  const delimiter = detectDelimiter(clean);
  const rawLines = clean.split(/\r?\n/).filter((l) => l.trim() !== "");

  if (rawLines.length < 2) {
    return { name, columns: [], rowCount: 0, sample: [], sourceFormat: "csv", warnings: ["Not enough rows to parse a table."] };
  }

  // Handle quoted multi-line fields: naive split may break them; the splitter
  // above handles quotes within a line, so stitch lines with unbalanced quotes.
  const lines: string[] = [];
  let buffer = "";
  for (const line of rawLines) {
    const quotes = (line.match(/"/g) ?? []).length;
    if (buffer === "") {
      if (quotes % 2 === 0) lines.push(line);
      else buffer = line;
    } else {
      buffer += "\n" + line;
      if ((buffer.match(/"/g) ?? []).length % 2 === 0) {
        lines.push(buffer);
        buffer = "";
      }
    }
  }
  if (buffer !== "") lines.push(buffer);

  const header = splitCsvLine(lines[0], delimiter).map((h, i) => (h === "" ? `column_${i + 1}` : h));
  const records = lines.slice(1).map((l) => splitCsvLine(l, delimiter));

  const width = header.length;
  const rows: string[][] = records.filter((r) => r.some((c) => c !== ""));
  if (rows.length === 0) {
    return { name, columns: [], rowCount: 0, sample: [], sourceFormat: "csv", warnings: ["No data rows found."] };
  }

  // Normalize row lengths
  for (const r of rows) {
    while (r.length < width) r.push("");
    if (r.length > width) {
      warnings.push(`Some rows had more fields than the header — extras were dropped.`);
      r.length = width;
    }
  }

  // Type inference per column using a sample of up to 200 rows
  const inferCount = Math.min(rows.length, 200);
  const columns: Column[] = header.map((h, ci) => {
    let numericHits = 0;
    let dateHits = 0;
    let boolHits = 0;
    let total = 0;
    for (let ri = 0; ri < inferCount; ri++) {
      const v = rows[ri][ci];
      if (isMissingValue(v)) continue;
      total++;
      if (looksNumeric(v)) numericHits++;
      else if (/^(true|false|yes|no|y|n|t|f)$/i.test(v)) boolHits++;
      else if (looksLikeDate(v)) dateHits++;
    }
    let type: ColumnType;
    if (total === 0) type = "categorical";
    else if (numericHits / total >= 0.85) type = "numeric";
    else if (dateHits / total >= 0.85) type = "date";
    else if (boolHits / total >= 0.9 && boolHits > 0) type = "boolean";
    else type = "categorical";

    const values = rows.map((r) => {
      const v = r[ci];
      if (isMissingValue(v)) return null;
      if (type === "numeric") return parseNumeric(v);
      if (type === "date") return parseDate(v) ?? v;
      if (type === "boolean") return /^(true|yes|y|t|1)$/i.test(v);
      return v;
    });
    return { name: h, type, values };
  });

  const sample = rows.slice(0, 12).map((r) => {
    const o: Record<string, string> = {};
    header.forEach((h, i) => (o[h] = r[i] ?? ""));
    return o;
  });

  return { name, columns, rowCount: rows.length, sample, sourceFormat: "csv", warnings };
}

/* ─────────────────────────── JSON parsing ─────────────────────────── */

export function parseJsonDataset(text: string, name: string): ParsedDataset {
  const warnings: string[] = [];
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    // Tolerate trailing commas / single quotes common in hand-made files
    try {
      data = JSON.parse(text.replace(/,\s*([}\]])/g, "$1"));
      warnings.push("The JSON had trailing commas — parsed with a lenient pass.");
    } catch {
      return { name, columns: [], rowCount: 0, sample: [], sourceFormat: "json", warnings: ["Could not parse JSON."] };
    }
  }

  let records: Record<string, unknown>[] = [];
  if (Array.isArray(data)) {
    records = data.filter((r) => r && typeof r === "object" && !Array.isArray(r)) as Record<string, unknown>[];
  } else if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    // { "colA": [..], "colB": [..] } — column-oriented
    const arrays = Object.entries(obj).filter(([, v]) => Array.isArray(v));
    if (arrays.length > 0 && arrays.length === Object.keys(obj).length) {
      const len = Math.max(...arrays.map(([, v]) => (v as unknown[]).length));
      const names = Object.keys(obj);
      const rows: Record<string, unknown>[] = [];
      for (let i = 0; i < len; i++) {
        const r: Record<string, unknown> = {};
        for (const n of names) r[n] = (obj[n] as unknown[])[i];
        rows.push(r);
      }
      records = rows;
    } else {
      records = [obj];
    }
  }

  if (records.length === 0) {
    return { name, columns: [], rowCount: 0, sample: [], sourceFormat: "json", warnings: ["No object records found in the JSON."] };
  }

  const keys: string[] = [];
  for (const r of records) {
    for (const k of Object.keys(r)) if (!keys.includes(k)) keys.push(k);
  }

  const inferCount = Math.min(records.length, 200);
  const columns: Column[] = keys.map((k) => {
    let numericHits = 0;
    let dateHits = 0;
    let boolHits = 0;
    let total = 0;
    for (let i = 0; i < inferCount; i++) {
      const v = records[i][k];
      if (v == null || v === "") continue;
      total++;
      if (typeof v === "number" && Number.isFinite(v)) numericHits++;
      else if (typeof v === "boolean") boolHits++;
      else if (typeof v === "string") {
        if (looksNumeric(v)) numericHits++;
        else if (looksLikeDate(v)) dateHits++;
      }
    }
    let type: ColumnType;
    if (total === 0) type = "categorical";
    else if (numericHits / total >= 0.85) type = "numeric";
    else if (dateHits / total >= 0.85) type = "date";
    else if (boolHits / total >= 0.9 && boolHits > 0) type = "boolean";
    else type = "categorical";

    const values = records.map((r) => {
      const v = r[k];
      if (v == null || v === "" || (typeof v === "number" && !Number.isFinite(v))) return null;
      if (type === "numeric") {
        if (typeof v === "number") return v;
        return parseNumeric(String(v));
      }
      if (type === "date") {
        if (typeof v === "string") return parseDate(v) ?? v;
        return String(v);
      }
      if (type === "boolean") {
        if (typeof v === "boolean") return v;
        return /^(true|yes|y|t|1)$/i.test(String(v));
      }
      return String(v);
    });
    return { name: k, type, values };
  });

  const sample = records.slice(0, 12).map((r) => {
    const o: Record<string, string> = {};
    for (const k of keys) o[k] = r[k] == null ? "" : String(r[k]);
    return o;
  });

  return { name, columns, rowCount: records.length, sample, sourceFormat: "json", warnings };
}

/* ─────────────────────────── Entry point ─────────────────────────── */

export function parseDataset(text: string, name = "dataset"): ParsedDataset {
  const trimmed = text.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    return parseJsonDataset(trimmed, name);
  }
  return parseDelimited(text, name);
}
