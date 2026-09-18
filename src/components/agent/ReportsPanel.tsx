"use client";

import { useState } from "react";
import { FileText, Download, Loader2, Sparkles } from "lucide-react";
import type { DatasetRef, SavedItem } from "./types";
import Markdown from "./Markdown";

/**
 * The Reports tab: generate a structured markdown analysis report from the
 * thread's dataset (LLM-synthesized with deterministic fallback), preview it,
 * and download as .md.
 */

const DEFAULT_SECTIONS = [
  "Executive Summary",
  "Data Overview",
  "Data Quality",
  "Key Findings",
  "Relationships & Segments",
  "Risks & Caveats",
  "Recommended Next Steps",
];

interface ReportState {
  markdown: string;
  model?: string;
  notice?: string;
  done: boolean;
}

export default function ReportsPanel({
  threadId,
  dataset,
  savedReports,
}: {
  threadId: string | null;
  dataset: DatasetRef | null;
  savedReports: SavedItem[];
}) {
  const [sections, setSections] = useState<string[]>(DEFAULT_SECTIONS);
  const [state, setState] = useState<ReportState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!threadId || !dataset) return;
    setBusy(true);
    setError(null);
    setState({ markdown: "", done: false });

    try {
      const res = await fetch("/api/agent/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, datasetId: dataset.id, sections }),
      });
      if (!res.ok || !res.body) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `Request failed (${res.status})`);
      }
      await consumeSse(res.body, {
        model: (m) => setState((s) => (s ? { ...s, model: m } : s)),
        delta: (t) => setState((s) => (s ? { ...s, markdown: s.markdown + t } : s)),
        notice: (n) => setState((s) => (s ? { ...s, notice: n.message } : s)),
        error: (e) => setError(e.message),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Report generation failed.");
    } finally {
      setBusy(false);
      setState((s) => (s ? { ...s, done: true } : s));
    }
  }

  function download() {
    if (!state?.markdown) return;
    const blob = new Blob([state.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `datalens-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8">
      <h1 className="text-[26px] font-semibold tracking-tight text-paper">Reports</h1>
      <p className="mt-1 text-[13.5px] text-paper/55">
        Synthesize the verified analysis into a structured, board-ready report — then export it.
      </p>

      {/* Section picker */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper/45">Report sections</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {DEFAULT_SECTIONS.map((s) => {
            const on = sections.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSections((cur) => (on ? cur.filter((x) => x !== s) : [...cur, s]))}
                className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] transition-colors ${
                  on ? "bg-paper text-charcoal font-medium" : "border border-white/12 text-paper/55 hover:bg-white/[0.06]"
                }`}
              >
                {on ? "✓" : "+"} {s}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={generate}
            disabled={busy || !dataset}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-paper px-5 text-[13.5px] font-medium text-charcoal transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {busy ? "Generating…" : "Generate report"}
          </button>
          {state?.done && state.markdown && (
            <button
              type="button"
              onClick={download}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-5 text-[13.5px] text-paper/80 transition-colors hover:bg-white/[0.06]"
            >
              <Download className="size-4" /> Download .md
            </button>
          )}
          {!dataset && <p className="text-[12px] text-paper/40">Upload a dataset in Chat first.</p>}
        </div>
        {state?.notice && (
          <p className="mt-3 rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-[12px] text-amber-200">{state.notice}</p>
        )}
        {error && (
          <p className="mt-3 rounded-lg border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-[12px] text-rose-200">{error}</p>
        )}
      </div>

      {/* Preview */}
      {state && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0c0b09] p-6 sm:p-8">
          {state.model && (
            <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper/40">generated by {state.model}</p>
          )}
          <Markdown text={state.markdown || "*Generating…*"} className="dl-report" />
        </div>
      )}

      {/* Previously saved */}
      {savedReports.length > 0 && !state && (
        <div className="mt-8">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper/45">Saved reports in this workspace</p>
          <ul className="mt-3 space-y-2">
            {savedReports.map((r) => (
              <li key={r.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <FileText className="size-4 shrink-0 text-paper/50" />
                <span className="min-w-0 flex-1 truncate text-[13.5px] text-paper/85">{r.title}</span>
                <a
                  href={`/api/agent/export?kind=report&id=${r.id}&threadId=${r.threadId}`}
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 px-2.5 text-[11.5px] text-paper/70 hover:bg-white/[0.06]"
                >
                  <Download className="size-3" /> .md
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── SSE consumer shared by panels ── */
export async function consumeSse(
  body: ReadableStream<Uint8Array>,
  handlers: {
    meta?: (d: Record<string, unknown>) => void;
    model?: (m: string) => void;
    delta?: (text: string) => void;
    notice?: (n: { message: string }) => void;
    error?: (e: { message: string; code?: string }) => void;
    done?: (d: Record<string, unknown>) => void;
  }
): Promise<void> {
  const reader = body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const frames = buf.split("\n\n");
    buf = frames.pop() ?? "";
    for (const frame of frames) {
      const lines = frame.split("\n");
      const event = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
      const dataLine = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
      if (!event || !dataLine) continue;
      try {
        const data = JSON.parse(dataLine) as Record<string, unknown>;
        switch (event) {
          case "meta": handlers.meta?.(data); break;
          case "model": handlers.model?.(String(data.model ?? "")); break;
          case "delta": handlers.delta?.(String(data.text ?? "")); break;
          case "notice": handlers.notice?.(data as { message: string }); break;
          case "error": handlers.error?.(data as { message: string }); break;
          case "done": handlers.done?.(data); break;
        }
      } catch { /* ignore malformed frames */ }
    }
  }
}
