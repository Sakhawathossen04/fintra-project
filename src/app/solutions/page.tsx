import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Solutions",
  description:
    "Fintra for FP&A, accounting, audit, CFO teams, investment analysis, and financial advisory.",
  path: "/solutions",
});

const SOLUTIONS = [
  {
    name: "FP&A",
    href: "/solutions/fpa",
    desc: "Budgeting, forecasting, variance analysis, and management reporting.",
  },
  {
    name: "Accounting",
    href: "/solutions/accounting",
    desc: "Statement analysis, close workflows, reconciliations, and research.",
  },
  {
    name: "Audit",
    href: "/solutions/audit",
    desc: "Document review, anomaly investigation, and evidence organization.",
  },
  {
    name: "CFO teams",
    href: "/solutions/cfo",
    desc: "Board reporting, executive summaries, and scenario analysis.",
  },
  {
    name: "Investment analysis",
    href: "/solutions/investment",
    desc: "Company research, model checking, and investment memos.",
  },
  {
    name: "Financial advisory",
    href: "/solutions/advisory",
    desc: "Client research, analysis, and deliverable preparation at scale.",
  },
];

export default function SolutionsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Solutions"
        title="Fintra, shaped around your finance role."
        description="The same workspace, tuned to how each finance team works — from FP&A to advisory."
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.05}>
                <Link
                  href={s.href}
                  className="group block h-full rounded-[var(--radius-card)] border border-line bg-surface p-7 transition-all duration-200 hover:border-line-strong hover:shadow-[var(--shadow-card)]"
                >
                  <h2 className="text-[18px] font-semibold tracking-tight text-ink group-hover:text-copper-strong">
                    {s.name}
                  </h2>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-mute">{s.desc}</p>
                  <p className="mt-4 text-[13px] font-medium text-copper-strong opacity-0 transition-opacity group-hover:opacity-100">
                    Explore →
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Not sure where you fit?"
        description="Tell us how your team works and we'll point you to the right setup."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Explore the product", href: "/product" }}
      />
    </PageShell>
  );
}
