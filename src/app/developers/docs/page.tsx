import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { SectionHeading } from "@/components/ui/Brand";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Documentation",
  description:
    "Documentation for working with Fintra: workspace concepts, models, analysis, reports, agents, and workflows.",
  path: "/developers/docs",
});

const SECTIONS = [
  {
    title: "Workspace concepts",
    status: "live",
    items: [
      ["Projects", "A project bundles the files, conversations, and outputs for one body of work — a close, a forecast, a deal."],
      ["Models", "Each conversation selects a model (GPT, Claude, Gemini, DeepSeek, Qwen) or uses automatic routing."],
      ["History", "Conversations and outputs persist with model provenance and sources."],
    ],
  },
  {
    title: "Analysis & reports",
    status: "live",
    items: [
      ["Grounded analysis", "Answers cite the documents they came from; untraceable figures are flagged, not invented."],
      ["Reports", "Generated from analyses, editable before export, refreshable from source."],
      ["Templates", "Reusable structures that keep outputs consistent across periods."],
    ],
  },
  {
    title: "Agents & workflows",
    status: "live",
    items: [
      ["Agents", "Scheduled tasks producing defined deliverables, draft-then-approve by default."],
      ["Workflows", "Multi-step pipelines with approval gates and run history."],
      ["Model routing", "Per-task model selection, visible and overridable."],
    ],
  },
  {
    title: "Platform API",
    status: "planned",
    items: [
      ["REST API", "Programmatic analyses and report retrieval — in design; see the API page."],
      ["Webhooks", "Notify your systems when agent runs complete — planned."],
    ],
  },
];

export default function DocsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Developers · Documentation"
        title="Fintra documentation."
        description="How the platform works today, and a transparent view of what's planned."
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <div className="space-y-12">
            {SECTIONS.map((sec, i) => (
              <Reveal key={sec.title} delay={i * 0.04}>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-[20px] font-semibold tracking-tight text-ink">{sec.title}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10.5px] font-medium ${sec.status === "live" ? "bg-sage-soft text-sage" : "bg-paper-deep text-ink-mute"}`}>
                      {sec.status}
                    </span>
                  </div>
                  <dl className="mt-5 space-y-4">
                    {sec.items.map(([term, desc]) => (
                      <div key={term} className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                        <dt className="text-[14.5px] font-semibold text-ink">{term}</dt>
                        <dd className="mt-1.5 text-[14px] leading-relaxed text-ink-mute">{desc}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Questions about the platform?"
        description="Our team answers technical questions about how Fintra works under the hood."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Security overview", href: "/resources/security" }}
      />
    </PageShell>
  );
}
