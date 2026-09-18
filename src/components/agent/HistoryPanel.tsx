"use client";

import { useEffect, useState } from "react";
import { History, Trash2, FileText, MessageSquare, Loader2 } from "lucide-react";
import type { ThreadSummary, SavedItem } from "./types";

/**
 * The History tab: every past thread in this browser's workspace with
 * open/delete actions, plus saved analyses and reports counts.
 */
export default function HistoryPanel({
  onOpenThread,
  currentThreadId,
}: {
  onOpenThread: (id: string) => void;
  currentThreadId: string | null;
}) {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/threads");
      const j = (await res.json()) as { threads: ThreadSummary[] };
      setThreads(j.threads ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [currentThreadId]);

  async function remove(id: string) {
    setThreads((t) => t.filter((x) => x.id !== id));
    await fetch(`/api/agent/threads?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8">
      <h1 className="text-[26px] font-semibold tracking-tight text-paper">History</h1>
      <p className="mt-1 text-[13.5px] text-paper/55">
        Every analysis thread in this browser&apos;s workspace. Nothing requires an account.
      </p>

      {loading ? (
        <div className="mt-10 grid place-items-center">
          <Loader2 className="size-6 animate-spin text-paper/40" />
        </div>
      ) : threads.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/12 py-14 text-center">
          <History aria-hidden className="mx-auto size-7 text-paper/35" />
          <p className="mt-3 text-[14px] text-paper/55">No threads yet — start a chat and upload a dataset.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {threads.map((t) => (
            <li
              key={t.id}
              className={`group flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-colors ${
                t.id === currentThreadId
                  ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.055]"
              }`}
            >
              <MessageSquare aria-hidden className="size-4 shrink-0 text-paper/45" />
              <button type="button" onClick={() => onOpenThread(t.id)} className="min-w-0 flex-1 text-left">
                <p className="truncate text-[13.5px] font-medium text-paper">{t.title}</p>
                <p className="mt-0.5 font-mono text-[10.5px] text-paper/45">
                  {t.turns} message{t.turns === 1 ? "" : "s"} · {t.datasets.length > 0 ? t.datasets.join(", ") : "no dataset"}
                  {t.hasAnalysis ? " · analyzed" : ""} · {new Date(t.updatedAt).toLocaleDateString()}
                </p>
              </button>
              {t.hasAnalysis && (
                <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300 sm:inline">
                  EDA
                </span>
              )}
              <button
                type="button"
                aria-label={`Delete thread ${t.title}`}
                onClick={() => remove(t.id)}
                className="rounded-full p-1.5 text-paper/35 opacity-0 transition-opacity hover:bg-white/[0.06] hover:text-rose-300 group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 flex items-center gap-2 text-[11.5px] text-paper/35">
        <FileText className="size-3.5" />
        Threads are stored per browser cookie — clear cookies to start fresh, export anything before you do.
      </p>
    </div>
  );
}
