"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, Zap } from "lucide-react";
import type { CatalogModel } from "./types";

/**
 * Model catalog dropdown modeled on the target workspace: search box,
 * filter chips (All / Free / Reasoning / Balanced / Fast / Specialist),
 * FREE badges, context sizes, and a check mark on the active model.
 */

const FILTERS = [
  { key: "all", label: "All" },
  { key: "free", label: "Free" },
  { key: "reasoning", label: "Reasoning" },
  { key: "balanced", label: "Balanced" },
  { key: "fast", label: "Fast" },
  { key: "specialist", label: "Specialist" },
] as const;

export default function ModelPicker({
  models,
  value,
  onChange,
  keyConfigured,
}: {
  models: CatalogModel[];
  value: string;
  onChange: (id: string) => void;
  keyConfigured: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const active = models.find((m) => m.id === value) ?? models[0];
  const freeCount = models.filter((m) => m.free).length;

  const filtered = models.filter((m) => {
    const q = query.toLowerCase();
    const matchesQuery =
      q === "" ||
      m.name.toLowerCase().includes(q) ||
      m.provider.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      (m.free && /free/.test(q));
    const matchesFilter =
      filter === "all" ||
      (filter === "free" && m.free) ||
      m.tags.includes(filter as string);
    return matchesQuery && matchesFilter;
  });

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[13.5px] font-medium text-paper transition-colors hover:bg-white/[0.08]"
      >
        <span>{active?.name ?? "Auto (Smart Router)"}</span>
        {active?.free && <FreeBadge />}
        <ChevronDown aria-hidden className={`size-3.5 text-paper/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-[400px] max-w-[92vw] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0c0b09] shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper/50">
              Model catalog ({models.length} total · {freeCount} free)
            </p>
            <span className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[10px] text-paper/70">OpenRouter Gateway</span>
          </div>

          <div className="border-b border-white/10 p-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-3">
              <Search className="size-3.5 text-paper/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, provider, free, or ID…"
                className="h-9 w-full bg-transparent text-[13px] text-paper placeholder:text-paper/35 focus:outline-none"
              />
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-2.5 py-1 text-[11.5px] transition-colors ${
                    filter === f.key
                      ? "bg-paper text-charcoal"
                      : f.key === "free"
                        ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border border-white/10 text-paper/60 hover:bg-white/[0.06]"
                  }`}
                >
                  {f.key === "free" && <Zap aria-hidden className="mr-1 inline size-3" />}
                  {f.label}
                  {f.key === "free" ? ` (${freeCount})` : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[340px] overflow-y-auto p-2">
            {filtered.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onChange(m.id);
                  setOpen(false);
                }}
                className={`block w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                  m.id === value ? "bg-white/[0.08]" : "hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="truncate text-[13.5px] font-semibold text-paper">{m.name}</span>
                  {m.free && <FreeBadge />}
                  {!m.free && keyConfigured && <span className="rounded border border-white/15 px-1.5 py-px font-mono text-[9.5px] text-paper/60">PAID</span>}
                  {m.id === value && <Check aria-hidden className="ml-auto size-4 shrink-0 text-emerald-400" />}
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-paper/45">
                  <span className="max-w-[110px] truncate">{m.provider}</span>
                  {m.tags.slice(0, 1).map((t) => (
                    <span key={t} className="rounded-full border border-white/10 px-1.5 py-px capitalize">{t}</span>
                  ))}
                  <span>{m.contextK}k ctx</span>
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-paper/55">{m.blurb}</p>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-[12.5px] text-paper/40">No models match.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FreeBadge() {
  return (
    <span className="rounded border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-px font-mono text-[9.5px] font-medium tracking-wide text-emerald-300">
      FREE
    </span>
  );
}
