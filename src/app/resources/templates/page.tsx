import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Templates",
  description: "Analysis templates for DataLens: dataset profiling reports, EDA summaries, comparison reports, and data-quality audits.",
  path: "/resources/templates",
});

const TEMPLATES = [
  { name: "Dataset profiling report", desc: "Full EDA summary: schema, quality score, and headline figures.", cat: "EDA" },
  { name: "Data-quality audit", desc: "Missing values, duplicates, and anomalies with concrete fixes.", cat: "Quality" },
  { name: "Segment comparison", desc: "Group means, gaps, and cross-tab shares for any categorical split.", cat: "Segments" },
  { name: "Trend review", desc: "Period-over-period movement with regression context.", cat: "Trends" },
  { name: "Outlier investigation", desc: "Ranked extremes with z-scores and review recommendations.", cat: "Quality" },
  { name: "Correlation deep dive", desc: "Relationship scan with the strongest pairs explained.", cat: "EDA" },
  { name: "Executive brief", desc: "One-page summary: findings, caveats, and recommended actions.", cat: "Reporting" },
  { name: "Stakeholder report", desc: "Full structured deliverable generated from verified stats.", cat: "Reporting" },
];

export default function TemplatesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Resources · Templates"
        title="Start from a proven format."
        description="Analysis templates that keep your team's outputs consistent — every period, every engagement."
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.03}>
                <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6">
                  <span className="w-fit rounded-full bg-paper-deep px-2.5 py-0.5 text-[11px] font-medium text-ink-mute">
                    {t.cat}
                  </span>
                  <h2 className="mt-3 text-[15.5px] font-semibold text-ink">{t.name}</h2>
                  <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-ink-mute">{t.desc}</p>
                  <a
                    href="/agent"
                    className="mt-4 inline-flex h-9 items-center justify-center rounded-full border border-line-strong text-[13px] font-medium text-ink hover:bg-paper-deep"
                  >
                    Use in DataLens
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Templates work best in the workspace."
        description="Open the workspace free and apply them to your real data."
        primary={{ label: "Open workspace", href: "/agent" }}
      />
    </PageShell>
  );
}
