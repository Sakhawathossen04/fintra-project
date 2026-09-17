"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PLANS, PLAN_ORDER, planFeatureTable, priceFor } from "@/lib/plans";

export function PlanCards({ authed }: { authed: boolean }) {
  const [interval, setInterval] = useState<"monthly" | "annual">("annual");

  function planHref(id: string) {
    if (id === "enterprise") return "/contact";
    if (id === "free") return authed ? "/checkout?plan=free" : "/signup?redirect=/checkout?plan=free";
    return authed ? `/checkout?plan=${id}` : `/signup?redirect=${encodeURIComponent(`/checkout?plan=${id}`)}`;
  }

  return (
    <div>
      {/* Billing selector */}
      <div className="mx-auto flex w-fit items-center rounded-full border border-line-strong bg-surface p-1">
        {(["monthly", "annual"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setInterval(opt)}
            aria-pressed={interval === opt}
            className={`rounded-full px-5 py-2 text-[13.5px] font-medium transition-colors ${
              interval === opt ? "bg-charcoal text-paper" : "text-ink-mute hover:text-ink"
            }`}
          >
            {opt === "annual" ? "Annual" : "Monthly"}
            {opt === "annual" && (
              <span className="ml-1.5 rounded-full bg-sage-soft px-1.5 py-0.5 text-[10.5px] font-semibold text-sage">
                −17%
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {PLAN_ORDER.map((id) => {
          const plan = PLANS[id];
          const price = priceFor(id, interval);
          return (
            <div
              key={id}
              className={`relative flex flex-col rounded-[var(--radius-card)] border p-6 ${
                plan.highlighted
                  ? "border-copper/50 bg-paper shadow-[var(--shadow-card)]"
                  : "border-line bg-surface"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-copper px-3 py-0.5 text-[11px] font-semibold text-white">
                  Most popular
                </span>
              )}
              <p className="text-[15px] font-semibold text-ink">{plan.name}</p>
              <p className="mt-1 min-h-[36px] text-[13px] leading-snug text-ink-mute">{plan.tagline}</p>
              <p className="mt-4 text-[32px] font-semibold leading-none tracking-tight text-ink">
                {id === "enterprise" ? (
                  "Custom"
                ) : (
                  <>
                    ${price}
                    <span className="text-[14px] font-normal text-ink-faint"> / mo</span>
                  </>
                )}
              </p>
              <p className="mt-1.5 min-h-[18px] text-[12px] text-ink-faint">
                {id !== "enterprise" &&
                  (interval === "annual" && price > 0
                    ? `Billed annually ($${price * 12}/yr)`
                    : price === 0
                      ? "Free forever"
                      : "Billed monthly")}
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13.5px] text-ink-soft">
                    <svg viewBox="0 0 24 24" className="mt-[3px] size-3.5 shrink-0 text-sage" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={planHref(id)}
                className={`mt-6 inline-flex h-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-copper text-white hover:bg-copper-strong"
                    : "border border-line-strong text-ink hover:bg-paper-deep"
                }`}
              >
                {id === "enterprise" ? "Contact sales" : id === "free" ? "Start free" : `Choose ${plan.name}`}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ComparisonTable() {
  const [query, setQuery] = useState("");
  const sections = useMemo(() => {
    const all = planFeatureTable();
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all
      .map((s) => ({
        category: s.category,
        rows: s.rows.filter((r) => r.label.toLowerCase().includes(q)),
      }))
      .filter((s) => s.rows.length > 0);
  }, [query]);

  return (
    <div>
      <div className="relative mt-8 max-w-sm">
        <Search aria-hidden className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search features…"
          aria-label="Search features"
          className="h-10 w-full rounded-full border border-line-strong bg-surface pl-10 pr-4 text-[14px] text-ink placeholder:text-ink-faint focus:border-copper focus:outline-none"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface">
        <table className="w-full min-w-[640px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-line">
              <th className="px-5 py-4 text-[12px] font-medium uppercase tracking-wider text-ink-faint">
                Compare plans
              </th>
              {PLAN_ORDER.map((id) => (
                <th key={id} className="px-4 py-4 text-center text-[13px] font-semibold text-ink">
                  {PLANS[id].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <>
                <tr key={section.category} className="bg-paper-deep/60">
                  <td
                    colSpan={5}
                    className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-mute"
                  >
                    {section.category}
                  </td>
                </tr>
                {section.rows.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 text-ink-soft">{row.label}</td>
                    <td className="px-4 py-3 text-center text-ink-soft">{row.free}</td>
                    <td className="px-4 py-3 text-center text-ink-soft">{row.pro}</td>
                    <td className="px-4 py-3 text-center text-ink-soft">{row.max}</td>
                    <td className="px-4 py-3 text-center text-ink-soft">{row.enterprise}</td>
                  </tr>
                ))}
              </>
            ))}
            {sections.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-ink-mute">
                  No features match "{query}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
