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
    "Fintra is an integrated Finance AI environment: multi-model AI, analysis, reports, agents, workflows, and model routing in one workspace.",
  path: "/product",
});

export default function ProductPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Product"
        title="A Finance AI operating environment."
        description="One workspace where leading AI models meet the analysis, documents, reports, and recurring work of a professional finance team."
        actions={
          <>
            <a href="/signup" className="inline-flex h-11 items-center rounded-full bg-copper px-6 text-[15px] font-medium text-white hover:bg-copper-strong">
              Start using Fintra
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
              title="The AI workspace for finance"
              description="Chat, files, projects, and history organized around finance work. Bring a model, bring your numbers, and keep every thread of context in one place."
              bullets={[
                "Multi-model chat with full finance context",
                "Files: spreadsheets, statements, decks, PDFs",
                "Projects keep each close, forecast, or deal separate",
              ]}
              visual={
                <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
                  <p className="font-mono text-[11px] text-ink-faint">fintra · workspace</p>
                  <div className="mt-4 space-y-3">
                    {[
                      ["You", "Why did gross margin compress in Q3?"],
                      ["Fintra", "Two drivers: COGS per unit +4.1% (supplier mix), discounting on the mid-tier line. Sources: Q3 P&L, pricing sheet v3."],
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
              title="Every leading model, one subscription"
              description="Stop managing five AI tools. Fintra includes GPT, Claude, Gemini, DeepSeek, and Qwen — pick per task or let routing decide."
              bullets={[
                "Model picker on every conversation",
                "Routing by task type, cost, and capability",
                "New models added as they arrive",
              ]}
              visual={
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {["GPT", "Claude", "Gemini", "DeepSeek", "Qwen", "+ more"].map((m) => (
                    <div key={m} className="grid h-20 place-items-center rounded-[var(--radius-card)] border border-line bg-surface text-[14px] font-medium text-ink">
                      {m}
                    </div>
                  ))}
                </div>
              }
            />
          </Reveal>

          <Reveal>
            <FeatureRow
              title="Analysis grounded in your numbers"
              description="Ask questions in plain language. Fintra answers with figures traced to your documents, shows its sources, and flags assumptions it made."
              bullets={[
                "Variance, trend, and ratio analysis",
                "Scenario and sensitivity comparisons",
                "Cited sources on every answer",
              ]}
              visual={
                <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-ink">Revenue by quarter</p>
                    <span className="font-mono text-[11px] text-sage">$24.8M ARR</span>
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
              description="Each capability is a deep product area — and they share the same context, files, and models."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Finance AI workspace", description: "Chat, files, projects, and history for finance work.", href: "/product/workspace" },
              { title: "Multi-model AI", description: "GPT, Claude, Gemini, DeepSeek, and Qwen in one place.", href: "/product/models" },
              { title: "Financial analysis", description: "Answers with real numbers and cited sources.", href: "/product/analysis" },
              { title: "Report builder", description: "Reports and decks generated from your analysis.", href: "/product/reports" },
              { title: "Finance agents", description: "Recurring tasks that run on schedule.", href: "/product/agents" },
              { title: "Automated workflows", description: "Close, forecast, and board-pack pipelines.", href: "/product/workflows" },
              { title: "Model routing", description: "Every task handled by the best model for it.", href: "/product/model-routing" },
              { title: "Templates", description: "Standard formats your team reuses.", href: "/resources/templates" },
              { title: "Security", description: "Designed for confidential finance data.", href: "/resources/security" },
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
        description="Start free, or explore each capability in depth."
        secondary={{ label: "Talk to sales", href: "/contact" }}
      />
    </PageShell>
  );
}
