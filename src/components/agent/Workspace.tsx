"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MessageSquare, BarChart3, FileText, History, Plus, ArrowUp, Paperclip, X,
  Loader2, Sparkles, PanelLeftClose, PanelLeftOpen, FileJson, Download, ChevronDown,
} from "lucide-react";
import type { CatalogModel, DatasetRef, ModelsInfo, Thread, ThreadSummary, Turn, View } from "./types";
import type { EdaReport } from "@/lib/eda/analyze";
import { consumeSse } from "./ReportsPanel";
import AnalysisPanel from "./AnalysisPanel";
import ReportsPanel from "./ReportsPanel";
import HistoryPanel from "./HistoryPanel";
import ModelPicker from "./ModelPicker";
import Markdown from "./Markdown";

/**
 * The DataLens agent workspace — a faithful, login-free clone of the target
 * product's flow: chat with a dataset attached, smart model routing with a
 * Quick/Deep effort toggle, one-click "Run full EDA", figures integrated
 * automatically, and save/export everywhere.
 */

const VIEW_TABS: { key: View; label: string; icon: typeof MessageSquare }[] = [
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "analysis", label: "Analysis", icon: BarChart3 },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "history", label: "History", icon: History },
];

const SUGGESTIONS = [
  "Run a full EDA on my dataset",
  "Which columns have missing values and how would you handle them?",
  "Show the strongest relationships and explain them",
  "Find outliers and tell me if they look like errors",
  "Summarize the key segments and how they differ",
];

const EXAMPLE_CSV = `month,region,product,sales,units,discount_pct
2024-01,North,Widget A,12500,340,4
2024-01,South,Widget A,9800,265,6
2024-01,North,Widget B,18200,410,2
2024-02,North,Widget A,13100,352,4
2024-02,South,Widget B,11400,275,7
2024-02,East,Widget A,8700,236,5
2024-03,North,Widget B,19600,438,2
2024-03,South,Widget A,10450,281,6
2024-03,East,Widget B,12300,300,3`;

export default function Workspace({ initialThreads }: { initialThreads: ThreadSummary[] }) {
  const [view, setView] = useState<View>("chat");
  const [threads, setThreads] = useState<ThreadSummary[]>(initialThreads);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [thread, setThread] = useState<Thread | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [datasets, setDatasets] = useState<DatasetRef[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [modelId, setModelId] = useState("auto");
  const [effort, setEffort] = useState<"quick" | "deep">("deep");
  const [modelsInfo, setModelsInfo] = useState<ModelsInfo | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const turnCount = turns.length;
  const dsCount = datasets.length;

  /* ── Bootstrap: models + latest thread ── */
  useEffect(() => {
    fetch("/api/agent/models")
      .then((r) => r.json())
      .then((j: ModelsInfo) => setModelsInfo(j))
      .catch(() => {});
  }, []);

  const openThread = useCallback(async (id: string) => {
    setView("chat");
    try {
      const res = await fetch(`/api/agent/threads?id=${encodeURIComponent(id)}`);
      const j = (await res.json()) as { thread: Thread };
      if (j.thread) {
        setThreadId(j.thread.id);
        setThread(j.thread);
        setTurns(j.thread.turns);
        setDatasets(j.thread.datasets);
      }
    } catch { /* keep current state */ }
  }, []);

  useEffect(() => {
    const first = initialThreads[0];
    if (first) void openThread(first.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turnCount, streamText]);

  /* ── Thread helpers ── */
  function newThread() {
    setThreadId(null);
    setThread(null);
    setTurns([]);
    setDatasets([]);
    setView("chat");
    setStreamText("");
  }

  function refreshThreadList() {
    fetch("/api/agent/threads")
      .then((r) => r.json())
      .then((j: { threads: ThreadSummary[] }) => setThreads(j.threads ?? []))
      .catch(() => {});
  }

  /* ── Upload ── */
  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setNotice(null);
      try {
        const fd = new FormData();
        fd.append("file", file);
        if (threadId) fd.append("threadId", threadId);
        const res = await fetch("/api/agent/upload", { method: "POST", body: fd });
        const j = (await res.json()) as {
          error?: string;
          threadId: string;
          datasetId: string;
          dataset: { name: string; rows: number; columns: number };
          eda: EdaReport;
        };
        if (j.error || !res.ok) throw new Error(j.error ?? `Upload failed (${res.status})`);

        setThreadId(j.threadId);
        setView("analysis");
        // Refetch full thread so datasets + turns stay in sync.
        await openThread(j.threadId);
        refreshThreadList();
        setNotice(
          `Analyzed ${j.dataset.name}: ${j.dataset.rows.toLocaleString()} rows × ${j.dataset.columns} columns. ${j.eda.figures.length} figures generated.`
        );
      } catch (e) {
        setNotice(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [threadId, openThread]
  );

  /* ── Chat send with SSE streaming ── */
  const send = useCallback(
    async (message: string, runAnalysis = false) => {
      const text = message.trim();
      if (!text || streaming) return;

      setNotice(null);
      setInput("");
      setTurns((t) => [
        ...t,
        { id: `local-${Date.now()}`, role: "user", content: text, at: new Date().toISOString() },
      ]);
      setStreaming(true);
      setStreamText("");
      setView("chat");

      const ac = new AbortController();
      abortRef.current = ac;

      let assistantId = "";
      let acc = "";
      let usedModel = "";
      let noKey = false;

      try {
        const res = await fetch("/api/agent/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ac.signal,
          body: JSON.stringify({
            threadId,
            message: text,
            modelId,
            effort,
            datasetId: datasets[datasets.length - 1]?.id,
            runAnalysis,
          }),
        });

        if (!res.ok || !res.body) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error ?? `Request failed (${res.status})`);
        }

        await consumeSse(res.body, {
          meta: (d) => {
            assistantId = String(d.threadId ?? "");
            if (assistantId && !threadId) setThreadId(assistantId);
          },
          model: (m) => (usedModel = m),
          delta: (t) => {
            acc += t;
            setStreamText(acc);
          },
          error: (e) => {
            if (e.code === "NO_API_KEY") noKey = true;
            setNotice(e.message);
          },
          done: (d) => {
            assistantId = String(d.threadId ?? assistantId);
          },
        });
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          setNotice(e instanceof Error ? e.message : "Request failed.");
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
        const finalText = noKey
          ? acc || "The AI narration model is not configured on this server (no OPENROUTER_API_KEY). Upload your dataset and open the Analysis tab — the full EDA engine works without any API key."
          : acc;
        setTurns((t) => [
          ...t,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: finalText,
            at: new Date().toISOString(),
            model: usedModel || undefined,
            effort,
          },
        ]);
        setStreamText("");
        refreshThreadList();
      }
    },
    [streaming, threadId, modelId, effort, datasets]
  );

  /* ── Render ── */
  const activeDataset = datasets[datasets.length - 1] ?? null;

  return (
    <div className="flex h-dvh overflow-hidden bg-[#0a0908] text-paper">
      {/* ── Sidebar ── */}
      <aside
        className={`${
          sidebarOpen ? "w-[280px]" : "w-0"
        } hidden shrink-0 overflow-hidden border-r border-white/[0.07] bg-[#0d0c0a] transition-all duration-300 md:block`}
      >
        <div className="flex h-full w-[280px] flex-col">
          <div className="px-4 pb-2 pt-5">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-paper text-charcoal">
                <svg viewBox="0 0 24 24" className="size-4" fill="none">
                  <path d="M5 19V10m0 0 4.5 4M5 10l-3 3M19 5v9m0 0 4.5-4M19 14l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-paper">Personal workspace</p>
                <p className="text-[11px] text-paper/45">No login required · private to this browser</p>
              </div>
              <ChevronDown aria-hidden className="size-3.5 text-paper/35" />
            </div>
          </div>

          <div className="px-4">
            <button
              type="button"
              onClick={newThread}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-[13.5px] font-medium text-paper transition-colors hover:bg-white/[0.08]"
            >
              <Plus className="size-4" /> New Thread
            </button>
          </div>

          <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
            {VIEW_TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] transition-colors ${
                  view === key
                    ? "border border-white/[0.14] bg-white/[0.07] font-medium text-paper"
                    : "text-paper/60 hover:bg-white/[0.045] hover:text-paper"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            ))}

            <p className="px-3.5 pb-1.5 pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/35">
              Recent threads {threads.length > 0 && <span className="ml-1">{threads.length}</span>}
            </p>
            <div className="space-y-0.5">
              {threads.slice(0, 12).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => void openThread(t.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3.5 py-2 text-left text-[12.5px] transition-colors ${
                    t.id === threadId
                      ? "bg-white/[0.07] text-paper"
                      : "text-paper/50 hover:bg-white/[0.04] hover:text-paper/85"
                  }`}
                >
                  <span className={`size-1.5 shrink-0 rounded-full ${t.hasAnalysis ? "bg-emerald-400" : "bg-paper/25"}`} />
                  <span className="min-w-0 flex-1 truncate">{t.title}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="border-t border-white/[0.07] px-4 py-3.5">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-paper/35">
              <span>OpenRouter</span>
              <span className={modelsInfo?.keyConfigured ? "text-emerald-300" : "text-amber-300"}>
                {modelsInfo?.keyConfigured ? "connected" : "key needed"}
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className={`h-full rounded-full ${modelsInfo?.keyConfigured ? "w-full bg-emerald-400" : "w-1/3 bg-amber-400"}`}
              />
            </div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-paper/35">
              {modelsInfo?.keyConfigured
                ? `${modelsInfo.freeCount} free models available via smart routing`
                : "Add OPENROUTER_API_KEY to enable AI narration; EDA runs offline"}
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-[58px] shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((v) => !v)}
              className="hidden size-9 place-items-center rounded-full text-paper/60 transition-colors hover:bg-white/[0.06] hover:text-paper md:grid"
            >
              {sidebarOpen ? <PanelLeftClose className="size-4.5" /> : <PanelLeftOpen className="size-4.5" />}
            </button>
            <a
              href="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] text-paper/60 transition-colors hover:bg-white/[0.06] hover:text-paper"
            >
              ← Website
            </a>
          </div>

          <ModelPicker
            models={modelsInfo?.models ?? [{ id: "auto", name: "Auto (Smart Router)", provider: "Built-in", free: true, reasoning: false, contextK: 200, tags: ["balanced"], blurb: "Loading…" }]}
            value={modelId}
            onChange={setModelId}
            keyConfigured={modelsInfo?.keyConfigured ?? false}
          />

          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-white/[0.12] p-0.5">
              {(["quick", "deep"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setEffort(m)}
                  className={`h-7 rounded-full px-3 text-[12px] capitalize transition-colors ${
                    effort === m ? "bg-paper font-medium text-charcoal" : "text-paper/55 hover:text-paper"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </header>

        {notice && (
          <div className="mx-3 mt-2 flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-3.5 py-2.5 text-[12.5px] text-amber-200 sm:mx-4">
            <span className="min-w-0 flex-1">{notice}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">
              <X className="size-3.5 shrink-0 opacity-70 hover:opacity-100" />
            </button>
          </div>
        )}

        {/* Views */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          {view === "chat" && (
            <ChatView
              turns={turns}
              streaming={streaming}
              streamText={streamText}
              activeDataset={activeDataset}
              threadId={threadId}
              uploading={uploading}
              dragOver={dragOver}
              setDragOver={setDragOver}
              onFile={(f) => void uploadFile(f)}
              fileInputRef={fileInputRef}
              input={input}
              setInput={setInput}
              onSend={send}
              onStop={() => abortRef.current?.abort()}
              onNewThread={newThread}
              hasThread={Boolean(threadId)}
              onOpenAnalysis={() => setView("analysis")}
            />
          )}
          {view === "analysis" && (
            <AnalysisPanel
              dataset={activeDataset}
              threadId={threadId}
              onGoChat={() => setView("chat")}
            />
          )}
          {view === "reports" && (
            <ReportsPanel
              threadId={threadId}
              dataset={activeDataset}
              savedReports={[]}
            />
          )}
          {view === "history" && (
            <HistoryPanel onOpenThread={(id) => void openThread(id)} currentThreadId={threadId} />
          )}
        </main>
      </div>
    </div>
  );
}

/* ────────────────────────── Chat view ────────────────────────── */

function ChatView({
  turns, streaming, streamText, activeDataset, threadId, uploading, dragOver, setDragOver,
  onFile, fileInputRef, input, setInput, onSend, onStop, onNewThread, hasThread, onOpenAnalysis,
}: {
  turns: Turn[];
  streaming: boolean;
  streamText: string;
  activeDataset: DatasetRef | null;
  threadId: string | null;
  uploading: boolean;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  onFile: (f: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  input: string;
  setInput: (v: string) => void;
  onSend: (msg: string, runAnalysis?: boolean) => void;
  onStop: () => void;
  onNewThread: () => void;
  hasThread: boolean;
  onOpenAnalysis: () => void;
}) {
  const isEmpty = turns.length === 0 && !streaming;

  return (
    <div
      className="flex min-h-full flex-col"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
    >
      {dragOver && (
        <div className="pointer-events-none fixed inset-0 z-40 grid place-items-center bg-charcoal/60 backdrop-blur-sm">
          <div className="rounded-2xl border-2 border-dashed border-emerald-400/60 bg-[#0c0b09]/90 px-10 py-8 text-center">
            <p className="text-[16px] font-semibold text-paper">Drop your dataset</p>
            <p className="mt-1 text-[12.5px] text-paper/55">CSV · TSV · JSON — up to 6 MB</p>
          </div>
        </div>
      )}

      {isEmpty ? (
        /* ── Empty state (matches target hero) ── */
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16">
          <h1 className="text-center text-[clamp(1.8rem,4.5vw,2.6rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-paper">
            What data questions or analysis are you working on?
          </h1>
          <div className="mt-9 w-full">
            <Composer
              input={input}
              setInput={setInput}
              onSend={onSend}
              onStop={onStop}
              streaming={streaming}
              onFile={onFile}
              uploading={uploading}
              fileInputRef={fileInputRef}
              hasDataset={Boolean(activeDataset)}
              datasetName={activeDataset?.name}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {SUGGESTIONS.slice(0, 3).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSend(s, /full EDA/i.test(s))}
                className="rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-[12.5px] text-paper/65 transition-colors hover:bg-white/[0.07] hover:text-paper"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-10 grid w-full gap-3 sm:grid-cols-3">
            {[
              { t: "Upload any CSV or JSON", d: "Instant parsing, typing, and quality checks — no notebook needed." },
              { t: "Automatic EDA + figures", d: "Distributions, correlations, segments, and outliers rendered automatically." },
              { t: "Verified numbers only", d: "The AI narrates the computed statistics — it can't invent your data." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                <p className="text-[13px] font-semibold text-paper">{c.t}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-paper/50">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-[11px] text-paper/30">
            DataLens AI · by using it you agree to our <a href="/terms" className="underline hover:text-paper/60">Terms</a> &{" "}
            <a href="/privacy" className="underline hover:text-paper/60">Privacy Policy</a>
          </p>
        </div>
      ) : (
        /* ── Conversation ── */
        <>
          <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-6 sm:px-6">
            {activeDataset && turns.length > 0 && <DatasetChip dataset={activeDataset} />}
            {turns.map((t) =>
              t.role === "user" ? (
                <div key={t.id} className="mt-6 flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-white/[0.09] px-4 py-3 text-[14px] leading-relaxed text-paper">
                    {t.content}
                  </div>
                </div>
              ) : (
                <div key={t.id} className="mt-6">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-md bg-paper text-charcoal">
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none">
                        <path d="M5 19V10m0 0 4.5 4M5 10l-3 3M19 5v9m0 0 4.5-4M19 14l-3-3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper/40">
                      DataLens{t.model ? ` · ${t.model}` : ""}{t.effort ? ` · ${t.effort}` : ""}
                    </span>
                    <SaveAnswerButton content={t.content} />
                  </div>
                  <div className="mt-2.5 pl-8">
                    <Markdown text={t.content} className="text-[14px] leading-relaxed text-paper/85" />
                  </div>
                </div>
              )
            )}

            {streaming && (
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <span className="grid size-6 animate-pulse place-items-center rounded-md bg-paper text-charcoal">
                    <svg viewBox="0 0 24 24" className="size-3.5" fill="none">
                      <path d="M5 19V10m0 0 4.5 4M5 10l-3 3M19 5v9m0 0 4.5-4M19 14l-3-3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper/40">DataLens is analyzing…</span>
                </div>
                {streamText ? (
                  <div className="mt-2.5 pl-8">
                    <Markdown text={streamText} className="text-[14px] leading-relaxed text-paper/85" />
                  </div>
                ) : (
                  <div className="mt-2.5 flex items-center gap-1.5 pl-8">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="size-1.5 animate-bounce rounded-full bg-paper/40" style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeDataset && turns.length > 0 && (
              <div className="mt-8 rounded-2xl border border-white/[0.09] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-emerald-300" />
                  <p className="text-[13px] font-semibold text-paper">Analysis ready</p>
                  <span className="font-mono text-[10.5px] text-paper/40">
                    {activeDataset.eda.figures.length} figures · {activeDataset.eda.insights.length} findings
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-paper/55">
                  Full figures, column stats, and quality checks for <strong className="text-paper/80">{activeDataset.name}</strong> are in the Analysis tab.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onOpenAnalysis}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-paper px-3.5 text-[12px] font-medium text-charcoal"
                  >
                    Open Analysis →
                  </button>
                  {threadId && (
                    <a
                      href={`/api/agent/export?kind=stats-csv&threadId=${encodeURIComponent(threadId)}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 px-3.5 text-[12px] text-paper/70 transition-colors hover:bg-white/[0.06]"
                    >
                      <Download className="size-3.5" /> Stats CSV
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sticky composer */}
          <div className="sticky bottom-0 border-t border-white/[0.07] bg-[#0a0908]/95 px-5 py-3.5 backdrop-blur sm:px-6">
            <div className="mx-auto max-w-3xl">
              <Composer
                input={input}
                setInput={setInput}
                onSend={onSend}
                onStop={onStop}
                streaming={streaming}
                onFile={onFile}
                uploading={uploading}
                fileInputRef={fileInputRef}
                hasDataset={Boolean(activeDataset)}
                datasetName={activeDataset?.name}
              />
              <div className="mt-2 flex items-center justify-between text-[10.5px] text-paper/30">
                <span>Enter to send · Shift+Enter for newline</span>
                <span>Verified EDA figures · save &amp; export anytime</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────────────────── Composer ────────────────────────── */

function Composer({
  input, setInput, onSend, onStop, streaming, onFile, uploading, fileInputRef, hasDataset, datasetName,
}: {
  input: string;
  setInput: (v: string) => void;
  onSend: (msg: string, runAnalysis?: boolean) => void;
  onStop: () => void;
  streaming: boolean;
  onFile: (f: File) => void;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  hasDataset: boolean;
  datasetName?: string;
}) {
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [pasteName, setPasteName] = useState("");

  async function submitPaste() {
    if (!pasteText.trim()) return;
    setPasteOpen(false);
    await fetch("/api/agent/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvText: pasteText, name: pasteName || "pasted-dataset" }),
    }).catch(() => {});
    onSend(`Analyze this pasted dataset: ${pasteName || "pasted-dataset"}`, true);
    setPasteText("");
    setPasteName("");
  }

  return (
    <div>
      <div
        className={`flex items-end gap-2 rounded-2xl border bg-white/[0.04] px-3 py-2.5 transition-colors ${
          "border-white/[0.1] focus-within:border-white/25"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,.txt,.json,.ndjson,.jsonl"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.currentTarget.value = "";
          }}
        />
        <button
          type="button"
          aria-label="Attach dataset"
          title="Upload CSV or JSON"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="grid size-9 shrink-0 place-items-center rounded-full text-paper/60 transition-colors hover:bg-white/[0.07] hover:text-paper disabled:opacity-40"
        >
          {uploading ? <Loader2 className="size-4.5 animate-spin" /> : <Paperclip className="size-4.5" />}
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend(input);
            }
          }}
          rows={1}
          placeholder={hasDataset ? "Ask about your data…" : "Ask a question or attach a CSV / JSON dataset…"}
          className="max-h-[160px] min-h-[36px] w-full resize-none bg-transparent py-2 text-[14.5px] text-paper placeholder:text-paper/35 focus:outline-none"
        />
        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-paper text-charcoal transition-transform hover:scale-105"
          >
            <span className="size-3 rounded-[2px] bg-charcoal" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Send message"
            onClick={() => onSend(input)}
            disabled={!input.trim()}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-paper text-charcoal transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
          >
            <ArrowUp className="size-4.5" />
          </button>
        )}
      </div>

      {datasetName && (
        <p className="mt-1.5 px-1 font-mono text-[10.5px] text-emerald-300/80">
          attached: {datasetName} — answers will use verified stats from this file
        </p>
      )}

      {pasteOpen && (
        <div className="mt-2 rounded-2xl border border-white/[0.1] bg-white/[0.03] p-3">
          <input
            value={pasteName}
            onChange={(e) => setPasteName(e.target.value)}
            placeholder="Dataset name (optional)"
            className="mb-2 h-8 w-full rounded-lg border border-white/10 bg-transparent px-3 text-[12.5px] text-paper placeholder:text-paper/35 focus:outline-none"
          />
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={5}
            placeholder="Paste CSV or JSON here…"
            className="w-full resize-y rounded-lg border border-white/10 bg-transparent px-3 py-2 font-mono text-[12px] text-paper placeholder:text-paper/35 focus:outline-none"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setPasteOpen(false)} className="h-8 rounded-full px-3 text-[12px] text-paper/55 hover:text-paper">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void submitPaste()}
              disabled={!pasteText.trim()}
              className="h-8 rounded-full bg-paper px-4 text-[12px] font-medium text-charcoal disabled:opacity-40"
            >
              Analyze
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── Bits ────────────────────────── */

function DatasetChip({ dataset }: { dataset: DatasetRef }) {
  const eda = dataset.eda;
  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-white/[0.09] bg-white/[0.03] px-3.5 py-2.5">
      <FileJson className="size-4 shrink-0 text-emerald-300" />
      <span className="truncate text-[12.5px] font-medium text-paper">{dataset.name}</span>
      <span className="font-mono text-[10.5px] text-paper/45">
        {eda.rowCount.toLocaleString()} rows × {eda.columnCount} cols · quality {eda.quality.score}/100
      </span>
      <span className="ml-auto rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-300">
        grounded
      </span>
    </div>
  );
}

function SaveAnswerButton({ content }: { content: string }) {
  const [saved, setSaved] = useState(false);
  const copy = () => {
    try {
      void navigator.clipboard?.writeText(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-auto inline-flex h-6 items-center rounded-full border border-white/10 px-2 text-[10.5px] text-paper/45 transition-colors hover:bg-white/[0.06] hover:text-paper"
      title="Copy answer"
    >
      {saved ? "copied ✓" : "copy"}
    </button>
  );
}
