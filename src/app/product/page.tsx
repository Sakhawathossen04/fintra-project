import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, FeatureRow, CapabilityCard, CtaBand } from "@/lib/marketing";
import { SectionHeading } from "@/components/ui/Brand";
import { AreaChart } from "@/components/ui/charts";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Product",
  description:
    "DataLens is an integrated analysis environment: automatic EDA, charts, grounded chat, reports, and smart model routing in one workspace.",
  path: "/product",
});

export default function ProductPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Product"
        title="An operating environment for data analysis."
        description="One workspace where uploaded datasets meet automatic profiling, charted figures, grounded conversation, and exportable reports — no login required."
        actions={
          <>
            <a href="/agent" className="inline-flex h-11 items-center rounded-full bg-copper px-6 text-[15px] font-medium text-white hover:bg-copper-strong">
              Open the workspace
            </a>
            <a href="/pricing" className="inline-flex h-11 items-center rounded-full border border-line-strong px-6 text-[15px] font-medium text-ink hover:bg-paper-deep">
              View pricing
            </a>
          </>
        }
      />

      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl space-y-24 px-5 py-20 sm:px-8 lg:py-28">
          <Reveal>
            <FeatureRow
              title="The analysis workspace"
              description="Chat, datasets, figures, and history organized around analysis work. Drop a file, ask a question, keep every thread of context in one place."
              bullets={[
                "Multi-model chat with full dataset context",
                "Files: CSV, TSV, and JSON with automatic type inference",
                "Threads keep each dataset and its analysis together",
              ]}
              visual={
                <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
                  <p className="font-mono text-[11px] text-ink-faint">datalens · workspace</p>
                  <div className="mt-4 space-y-3">
                    {[
                      ["You", "Why did March sales dip in the South region?"],
                      ["DataLens", "Two factors: units sold fell 12% (lowest month in the series), and discount depth rose to 7% — the highest in the dataset. See: trend + segment figures."],
                    ].map(([who, msg]) => (
                      <div key={who} className={`rounded-xl px-4 py-3 text-[13.5px] leading-relaxed ${who === "You" ? "bg-paper text-ink-soft" : "bg-copper-soft text-ink"}`}>
                        <p className="mb-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">{who}</p>
                        {msg}
                      </div>
                    ))}
                  </div>
                </div>
              }
            />
          </Reveal>

          <Reveal>
            <FeatureRow
              flip
              title="Automatic EDA, verified numbers"
              description="The moment a file lands, the engine profiles every column — statistics, distributions, correlations, outliers — deterministically. The AI explains; it never invents."
              bullets={[
                "Full column statistics on upload",
                "Quality scoring with actionable flags",
                "Same file, same numbers, every time",
              ]}
              visual={
                <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
                  <p className="font-mono text-[11px] text-ink-faint">eda engine · deterministic</p>
                  <div className="mt-4 space-y-2 font-mono text-[11.5px]">
                    {[
                      ["parse", "12,480 rows · 14 columns"],
                      ["types", "6 numeric · 4 categorical · 2 date"],
                      ["quality", "96/100 · 0.4% missing"],
                      ["figures", "histograms, scatter, heatmap, trend"],
                      ["findings", "6 patterns flagged"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-3 rounded-lg bg-paper px-3 py-2">
                        <span className="w-16 shrink-0 text-ink-faint">{k}</span>
                        <span className="text-ink-soft">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              }
            />
          </Reveal>

          <Reveal>
            <FeatureRow
              title="From analysis to deliverable"
              description="Generate a structured report from the verified statistics, export figures and summary stats, and hand off a complete analysis — not a screenshot."
              bullets={[
                "Section-by-section report generation",
                "Markdown, CSV, and JSON exports",
                "Consistent structure across periods",
              ]}
              visual={
                <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-ink">Metric trend — auto-charted</p>
                    <span className="font-mono text-[11px] text-sage">R² 0.87</span>
                  </div>
                  <div className="mt-3">
                    <AreaChart points={[16.2, 17.1, 18.4, 19.0, 20.2, 21.6, 22.5, 23.1, 24.8]} height={110} />
                  </div>
                </div>
              }
            />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Capabilities"
              title="Everything works together."
              description="Each capability is a deep product area — and they share the same datasets, figures, and context."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Analysis workspace", description: "Chat, datasets, figures, and history in one place.", href: "/product/workspace" },
              { title: "Automatic EDA", description: "A complete profile of every column, on arrival.", href: "/product/eda" },
              { title: "Charts & figures", description: "Distributions, correlations, and segments, drawn for you.", href: "/product/charts" },
              { title: "Chat with data", description: "Answers grounded in verified statistics.", href: "/product/chat" },
              { title: "Report builder", description: "Structured, exportable reports from your analysis.", href: "/product/reports" },
              { title: "Multi-model AI", description: "Free models included; frontier models optional.", href: "/product/models" },
              { title: "Smart routing", description: "Every question handled by the best model for it.", href: "/product/model-routing" },
              { title: "Templates", description: "Standard report formats your team reuses.", href: "/resources/templates" },
              { title: "Security", description: "Designed for confidential data.", href: "/resources/security" },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.04}>
                <CapabilityCard {...c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="See the workspace in action."
        description="Open it free — no signup — or explore each capability in depth."
        primary={{ label: "Open workspace", href: "/agent" }}
        secondary={{ label: "Talk to us", href: "/contact" }}
      />
    </PageShell>
  );
}
