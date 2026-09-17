import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { Disclosure } from "@/components/ui/Brand";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Guides",
  description: "Practical guides for finance work with AI: variance analysis, board packs, close support, and more.",
  path: "/resources/guides",
});

const GUIDES = [
  {
    title: "Run a monthly variance review with Fintra",
    read: "8 min",
    body: "Upload actuals, budget, and prior period. Ask for driver decomposition, review the ranked drivers against your knowledge of the month, then generate the memo and exhibits. The whole review fits in an hour — with sources attached.",
  },
  {
    title: "Assemble a board pack from live numbers",
    read: "10 min",
    body: "Start from your team's period analysis, generate the executive summary, and build exhibits in your standard template. Because the pack draws from the analysis, the story and the numbers agree.",
  },
  {
    title: "Use agents for recurring close tasks",
    read: "6 min",
    body: "Define the task once — checklist progression, documentation organization, open-item summaries. The agent runs each period, produces a draft, and you approve before anything ships.",
  },
  {
    title: "Check a financial model for consistency",
    read: "7 min",
    body: "Upload the model and its memo. Fintra cross-foots totals, tests whether assumptions match the narrative, and lists discrepancies with references — a review pass that takes minutes.",
  },
  {
    title: "Choose the right model for a finance task",
    read: "5 min",
    body: "Fast extraction? Long-context synthesis? Careful reasoning? A short tour of model strengths and when Fintra's routing picks each one.",
  },
];

export default function GuidesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Resources · Guides"
        title="Finance AI playbooks."
        description="Short, practical guides for putting Fintra to work on real finance tasks."
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
        description="Every guide works on the Free plan."
        primary={{ label: "Start free", href: "/signup" }}
      />
    </PageShell>
  );
}
