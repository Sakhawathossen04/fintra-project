"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Original FINTRA finance animation:
 *   Phase 1 — live metrics tick up, analysis narration scrolls
 *   Phase 2 — work is routed across AI models
 */
const METRICS = [
  { label: "Revenue", value: "$24.8M", delta: "+6.2%" },
  { label: "Operating margin", value: "24.8%", delta: "+120 bps" },
  { label: "Cash runway", value: "14.2 mo", delta: "+0.8" },
];

const STEPS = [
  "Analyzing Q3 performance…",
  "3 major variance drivers identified",
  "Checking historical assumptions…",
  "Forecast updated",
  "Board summary generated",
  "Consistency check complete",
];

const MODELS = [
  { name: "GPT", tint: "#10a37f" },
  { name: "Claude", tint: "#d97757" },
  { name: "Gemini", tint: "#4285f4" },
  { name: "DeepSeek", tint: "#4d6bfe" },
  { name: "Qwen", tint: "#615ced" },
];

export default function HeroAnimation() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"analysis" | "models">("analysis");

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      setStep((s) => {
        const next = s + 1;
        if (next >= STEPS.length) {
          setPhase("models");
          return 0;
        }
        return next;
      });
    }, 1800);
    return () => clearInterval(t);
  }, [reduce]);

  if (reduce) {
    // Calm static composition for reduced motion
    return (
      <div className="space-y-4" aria-hidden>
        <div className="grid grid-cols-3 gap-3">
          {METRICS.map((m) => (
            <div key={m.label} className="rounded-xl border border-line bg-surface p-4">
              <p className="text-[11px] uppercase tracking-wider text-ink-faint">{m.label}</p>
              <p className="mt-1 text-xl font-semibold text-ink">{m.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 text-[13px] text-ink-mute">
          Board summary generated · Forecast updated · Consistency check complete
        </div>
      </div>
    );
  }

  const visibleSteps = STEPS.slice(Math.max(0, step - 2), step + 1);

  return (
    <div aria-hidden className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[11px] text-ink-faint">fintra · q3-review</span>
        <span className="rounded-full bg-sage-soft px-2.5 py-0.5 font-mono text-[10px] text-sage">
          {phase === "analysis" ? "analysis" : "routing"}
        </span>
      </div>

      {phase === "analysis" ? (
        <div className="p-4 sm:p-5">
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {METRICS.map((m, i) => (
              <div key={m.label} className="rounded-xl border border-line bg-paper p-3.5">
                <p className="text-[10.5px] uppercase tracking-wider text-ink-faint">{m.label}</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-ink sm:text-xl">{m.value}</p>
                <p className="font-mono text-[10.5px] text-sage">{m.delta}</p>
              </div>
            ))}
          </div>

          {/* Analysis narration */}
          <div className="mt-4 space-y-1.5 font-mono text-[12px]">
            {visibleSteps.map((s, i) => {
              const isActive = i === visibleSteps.length - 1;
              return (
                <div
                  key={s}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${
                    isActive ? "bg-copper-soft text-copper-strong" : "text-ink-mute"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${isActive ? "animate-pulse bg-copper" : "bg-sage"}`}
                  />
                  {s}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <div className="space-y-2">
            {MODELS.map((m, i) => (
              <div
                key={m.name}
                className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-3"
                style={{
                  opacity: 0.55 + 0.45 * Math.sin((step + i) % MODELS.length * (Math.PI / 3) + 1.2) ** 2,
                  transition: "opacity 900ms ease",
                }}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ background: m.tint }}
                />
                <span className="text-[13px] font-medium text-ink">{m.name}</span>
                <span className="ml-auto font-mono text-[10.5px] text-ink-faint">
                  {["variance drivers", "forecast update", "board summary", "doc review", "consistency check"][i % 5]}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center font-mono text-[11px] text-ink-faint">
            Fintra routes each task to the model that does it best
          </p>
        </div>
      )}
    </div>
  );
}
