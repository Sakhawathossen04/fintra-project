"use client";

import { useMemo, useState } from "react";
import { Download, FileJson, Sparkles, Table2, ShieldCheck, Lightbulb } from "lucide-react";
import type { DatasetRef } from "./types";
import Figure from "./Figure";
import { fmt } from "@/lib/eda/analyze";

/**
 * The Analysis tab: renders the full EDA of the thread's active dataset —
 * quality scorecard, auto-figures, detected patterns, and column stats —
 * with CSV/JSON export of the verified statistics.
 */
export default function AnalysisPanel({
  dataset,
  threadId,
  onGoChat,
}: {
  dataset: DatasetRef | null;
  threadId: string | null;
  onGoChat: () => void;
}) {
  const [tab, setTab] = useState<"figures" | "columns" | "quality">("figures");

  const exportUrls = useMemo(() => {
    if (!threadId) return null;
    const q = (extra: string) => `/api/agent/export?threadId=${encodeURIComponent(threadId)}&${extra}`;
    return {
      json: q(`kind=analysis${dataset ? `&id=${dataset.id}` : ""}`),
      csv: q("kind=stats-csv"),
      transcript: q("kind=transcript"),
    };
  }, [threadId, dataset]);

  if (!dataset) {
    return (
      <div className="grid h-full place-items-center px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Sparkles aria-hidden className="size-6 text-paper/50" />
          </div>
          <h2 className="mt-5 text-[19px] font-semibold text-paper">No Analysis Yet for This Thread</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-paper/55">
            Switch to <strong className="text-paper/80">Chat</strong> and upload a CSV or JSON dataset to generate
            distributions, correlations, segments, and data-quality findings automatically.
          </p>
          <button
            type="button"
            onClick={onGoChat}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-paper px-5 text-[13.5px] font-medium text-charcoal transition-transform hover:scale-[1.02]"
          >
            Start a chat →
          </button>
        </div>
      </div>
    );
  }

  const eda = dataset.eda;
  const qualityTone = eda.quality.score >= 90 ? "text-emerald-300" : eda.quality.score >= 70 ? "text-amber-300" : "text-rose-300";

  return (
    <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-paper">Data Analysis</h1>
          <p className="mt-1 text-[13.5px] text-paper/55">
            {dataset.name} — {eda.rowCount.toLocaleString()} rows × {eda.columnCount} columns · auto-generated EDA
          </p>
        </div>
        {exportUrls && (
          <div className="flex gap-2">
            <a href={exportUrls.json} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 px-3 text-[12px] text-paper/75 transition-colors hover:bg-white/[0.06]">
              <FileJson className="size-3.5" /> Export JSON
            </a>
            <a href={exportUrls.csv} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 px-3 text-[12px] text-paper/75 transition-colors hover:bg-white/[0.06]">
              <Download className="size-3.5" /> Stats CSV
            </a>
            <a href={exportUrls.transcript} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 px-3 text-[12px] text-paper/75 transition-colors hover:bg-white/[0.06]">
              <Download className="size-3.5" /> Transcript
            </a>
          </div>
        )}
      </div>

      {/* Quality strip */}
      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <Stat label="Quality score" value={`${eda.quality.score}/100`} tone={qualityTone} />
        <Stat label="Rows" value={eda.rowCount.toLocaleString()} />
        <Stat label="Missing cells" value={eda.quality.missingCells.toLocaleString()} tone={eda.quality.missingCells > 0 ? "text-amber-300" : undefined} />
        <Stat label="Duplicates" value={eda.quality.duplicateRows.toLocaleString()} tone={eda.quality.duplicateRows > 0 ? "text-amber-300" : undefined} />
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1.5">
        {([
          ["figures", `Figures (${eda.figures.length})`, Table2],
          ["columns", `Columns (${eda.columnCount})`, Table2],
          ["quality", `Findings (${eda.insights.length + eda.quality.issues.length})`, Lightbulb],
        ] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] transition-colors ${
              tab === key ? "bg-paper text-charcoal font-medium" : "border border-white/12 text-paper/60 hover:bg-white/[0.06]"
            }`}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
        <span className="ml-auto hidden items-center gap-1.5 text-[11.5px] text-paper/40 sm:inline-flex">
          <ShieldCheck className="size-3.5 text-emerald-400" /> verified deterministic stats
        </span>
      </div>

      {/* Panels */}
      {tab === "figures" && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {eda.figures.map((f) => (
            <Figure key={f.id} spec={f} />
          ))}
          {eda.figures.length === 0 && <EmptyBlock text="No figures could be generated for this dataset." />}
        </div>
      )}

      {tab === "columns" && (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <div className="max-h-[62vh] overflow-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead className="sticky top-0 bg-[#14120e] text-paper/55">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Column</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Summary</th>
                  <th className="px-4 py-2.5 font-medium">Missing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {eda.overviews.map((o) => {
                  if (o.kind === "numeric") {
                    const d = o.data;
                    return (
                      <tr key={d.name} className="text-paper/80">
                        <td className="px-4 py-2.5 font-medium text-paper">{d.name}</td>
                        <td className="px-4 py-2.5"><TypeChip t="numeric" /></td>
                        <td className="px-4 py-2.5 font-mono text-[11.5px] text-paper/65">
                          μ {fmt(d.mean)} · med {fmt(d.median)} · σ {fmt(d.std)} · [{fmt(d.min)}, {fmt(d.max)}]
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[11.5px]">{d.missing || "—"}</td>
                      </tr>
                    );
                  }
                  const d = o.data;
                  return (
                    <tr key={d.name} className="text-paper/80">
                      <td className="px-4 py-2.5 font-medium text-paper">{d.name}</td>
                      <td className="px-4 py-2.5"><TypeChip t={o.kind} /></td>
                      <td className="px-4 py-2.5 font-mono text-[11.5px] text-paper/65">
                        {d.unique} unique · top: {d.top.slice(0, 3).map((t: { value: string; pct: number }) => `${t.value} (${Math.round(t.pct * 100)}%)`).join(", ")}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[11.5px]">{d.missing || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "quality" && (
        <div className="mt-4 space-y-3">
          {[...eda.quality.issues, ...eda.insights].map((ins, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${ins.tone === "warning" ? "bg-amber-300" : "bg-sky-300"}`} />
                <p className="text-[13.5px] font-semibold text-paper">{ins.title}</p>
                <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-paper/50">{ins.tag}</span>
              </div>
              <p className="mt-1.5 pl-4 text-[13px] leading-relaxed text-paper/60">{ins.detail}</p>
            </div>
          ))}
          {eda.insights.length + eda.quality.issues.length === 0 && (
            <EmptyBlock text="No issues or notable patterns detected — the dataset is clean." />
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">{label}</p>
      <p className={`mt-1 text-[18px] font-semibold ${tone ?? "text-paper"}`}>{value}</p>
    </div>
  );
}

function TypeChip({ t }: { t: string }) {
  return (
    <span className="rounded-full border border-white/12 px-2 py-0.5 font-mono text-[10px] text-paper/60">{t}</span>
  );
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="col-span-full rounded-xl border border-dashed border-white/12 py-10 text-center text-[13px] text-paper/45">
      {text}
    </div>
  );
}
