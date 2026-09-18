import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { Disclosure } from "@/components/ui/Brand";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Guides",
  description: "Practical guides for AI-assisted analysis: dataset triage, quality audits, segment discovery, and reporting.",
  path: "/resources/guides",
});

const GUIDES = [
  {
    title: "Triage a new dataset in five minutes",
    read: "5 min",
    body: "Drop the file, read the quality score, and skim the auto-figures. You'll know the shape, the dirty columns, and the two most interesting relationships before your notebook would have finished importing.",
  },
  {
    title: "Run a data-quality audit worth sharing",
    read: "7 min",
    body: "Upload the export, open the Findings tab, and export the stats CSV. Missing-value and duplicate counts arrive with context — enough to hand engineering a concrete fix list.",
  },
  {
    title: "From CSV to stakeholder report in one sitting",
    read: "8 min",
    body: "Profile the data, ask the two questions your audience will ask, generate the report with the sections they read, and export the Markdown. The whole loop happens in the workspace.",
  },
  {
    title: "When to distrust an average",
    read: "6 min",
    body: "Skew and outliers change which summary numbers are honest. A short tour of the EDA flags — skewness, IQR outliers, small segments — and what to use instead.",
  },
  {
    title: "Choose the right model for an analysis task",
    read: "5 min",
    body: "Quick lookups want fast models; correlation questions want reasoning models. How DataLens's smart routing decides, and when to pin a model manually.",
  },
];

export default function GuidesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Resources · Guides"
        title="Data analysis playbooks."
        description="Short, practical guides for putting DataLens to work on real analysis tasks."
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <div className="space-y-4">
            {GUIDES.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.04}>
                <Disclosure title={g.title}>
                  <p className="text-[14.5px] leading-relaxed">{g.body}</p>
                  <p className="mt-2 font-mono text-[11px] text-ink-faint">{g.read} read</p>
                </Disclosure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Try these in your workspace."
        description="Every guide works on the free tier — no account needed."
        primary={{ label: "Open workspace", href: "/agent" }}
      />
    </PageShell>
  );
}
