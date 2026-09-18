import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Solutions",
  description:
    "DataLens for marketing, operations, product & growth, data analysts, researchers, and executives.",
  path: "/solutions",
});

const SOLUTIONS = [
  {
    name: "Marketing",
    href: "/solutions/marketing",
    desc: "Channel performance, campaign comparisons, and spend efficiency from the exports you already have.",
  },
  {
    name: "Operations",
    href: "/solutions/operations",
    desc: "Supply chain, logistics, and process data with quality checks and outlier triage.",
  },
  {
    name: "Product & growth",
    href: "/solutions/product",
    desc: "Event exports, funnels, cohorts, and experiment pre-reads — analyzed conversationally.",
  },
  {
    name: "Data analysts",
    href: "/solutions/analysts",
    desc: "Notebook-speed EDA and profiling without the notebook boilerplate.",
  },
  {
    name: "Researchers",
    href: "/solutions/research",
    desc: "Survey and experiment data with deterministic statistics you can cite.",
  },
  {
    name: "Executives",
    href: "/solutions/executives",
    desc: "Plain-language answers and forwardable reports, without the BI queue.",
  },
];

export default function SolutionsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Solutions"
        title="DataLens, shaped around your work."
        description="The same analysis workspace, tuned to how each team actually uses data — from marketing to research."
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
        description="Tell us how your team works with data and we'll point you to the right setup."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Explore the product", href: "/product" }}
      />
    </PageShell>
  );
}
