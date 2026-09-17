import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { SectionHeading } from "@/components/ui/Brand";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Developers",
  description:
    "Build on Fintra: the Fintra API, documentation, and integrations for extending your finance workspace.",
  path: "/developers",
});

const CARDS = [
  {
    title: "Fintra API",
    href: "/developers/api",
    desc: "Programmatic access to workspaces, analyses, and generated reports — planned and documented transparently.",
  },
  {
    title: "Documentation",
    href: "/developers/docs",
    desc: "Guides and reference for working with Fintra's platform capabilities today.",
  },
  {
    title: "Integrations",
    href: "/developers/integrations",
    desc: "How Fintra connects to the tools finance teams already use — and what's on the roadmap.",
  },
];

export default function DevelopersPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Developers"
        title="Build on Fintra."
        description="A platform for extending Fintra across your finance stack — with an API and integrations on a transparent roadmap."
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <a
                  href={c.href}
                  className="group block h-full rounded-[var(--radius-card)] border border-line bg-surface p-7 transition-all duration-200 hover:border-line-strong hover:shadow-[var(--shadow-card)]"
                >
                  <h2 className="text-[18px] font-semibold tracking-tight text-ink group-hover:text-copper-strong">
                    {c.title}
                  </h2>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-mute">{c.desc}</p>
                  <p className="mt-4 text-[13px] font-medium text-copper-strong">Learn more →</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Status"
              title="What's real, and what's coming."
              description="We document the platform honestly. Today, Fintra is a complete product workspace; the developer platform below is planned and scoped."
            />
          </Reveal>
          <div className="mt-10 space-y-4">
            {[
              ["Available today", "Workspace, multi-model AI, analysis, reports, agents, workflows, and templates — all live in the product.", true],
              ["In design", "The Fintra API: programmatic access to run analyses and retrieve reports.", false],
              ["Planned", "Native integrations with accounting and planning systems.", false],
            ].map(([status, desc, live]) => (
              <Reveal key={status as string}>
                <div className="flex items-start gap-4 rounded-[var(--radius-card)] border border-line bg-paper p-5">
                  <span className={`mt-1 rounded-full px-2.5 py-0.5 font-mono text-[10.5px] font-medium ${live ? "bg-sage-soft text-sage" : "bg-paper-deep text-ink-mute"}`}>
                    {live ? "live" : "planned"}
                  </span>
                  <div>
                    <p className="text-[14.5px] font-semibold text-ink">{status as string}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-ink-mute">{desc as string}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Building something on Fintra?"
        description="Tell us what you'd want from the API — early design feedback shapes the roadmap."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Read the docs", href: "/developers/docs" }}
      />
    </PageShell>
  );
}
