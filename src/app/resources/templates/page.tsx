import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Templates",
  description: "Finance templates for Fintra: variance memos, board packs, investment memos, and close checklists.",
  path: "/resources/templates",
});

const TEMPLATES = [
  { name: "Monthly variance memo", desc: "Driver commentary with exhibit tables, ready for review.", cat: "FP&A" },
  { name: "Board pack", desc: "Executive summary, exhibits, and outlook in a consistent structure.", cat: "CFO" },
  { name: "Rolling forecast summary", desc: "Assumption changes and movement narrative, period over period.", cat: "FP&A" },
  { name: "Close checklist", desc: "Sequenced close steps with documentation slots and open items.", cat: "Accounting" },
  { name: "Reconciliation summary", desc: "Item tracing and difference summaries with source references.", cat: "Accounting" },
  { name: "Investment memo", desc: "Thesis, evidence, valuation summary, and risks — IC-ready.", cat: "Investment" },
  { name: "Client engagement brief", desc: "Context, scope, and plan for advisory engagements.", cat: "Advisory" },
  { name: "Audit observation draft", desc: "Finding structure with referenced evidence.", cat: "Audit" },
];

export default function TemplatesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Resources · Templates"
        title="Start from a proven format."
        description="Finance templates that keep your team's outputs consistent — every period, every engagement."
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
                    href="/signup"
                    className="mt-4 inline-flex h-9 items-center justify-center rounded-full border border-line-strong text-[13px] font-medium text-ink hover:bg-paper-deep"
                  >
                    Use in Fintra
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Templates work best in the workspace."
        description="Sign up and apply them to your real numbers."
        primary={{ label: "Start free", href: "/signup" }}
      />
    </PageShell>
  );
}
