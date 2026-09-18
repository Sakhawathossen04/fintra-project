import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { SectionHeading } from "@/components/ui/Brand";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Integrations",
  description:
    "How DataLens works with the tools data teams use: file-based workflows today, native integrations planned.",
  path: "/developers/integrations",
});

const GROUPS = [
  {
    title: "Works with your files, today",
    status: "live",
    items: [
      ["Excel & CSV", "Upload spreadsheets and models; tables and structure are preserved."],
      ["PDF", "Statements, filings, and reports read with layout awareness."],
      ["Slide decks", "Presentations analyzed and generated as outputs."],
      ["Any export", "If your system exports files, DataLens can work with them."],
    ],
  },
  {
    title: "Native integrations, planned",
    status: "planned",
    items: [
      ["Accounting systems", "Direct connections to your ledger — in design."],
      ["Planning tools", "Budget and forecast sync — planned."],
      ["Data warehouses", "Scheduled pulls from your warehouse — planned."],
      ["Collaboration", "Sharing outputs where your team communicates — planned."],
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Developers · Integrations"
        title="DataLens fits your stack."
        description="Today, DataLens works with the files your systems already produce. Native integrations are on the roadmap — designed with transparency about what's live."
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {GROUPS.map((g, gi) => (
              <Reveal key={g.title} delay={gi * 0.06}>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-[19px] font-semibold tracking-tight text-ink">{g.title}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10.5px] font-medium ${g.status === "live" ? "bg-sage-soft text-sage" : "bg-paper-deep text-ink-mute"}`}>
                      {g.status}
                    </span>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {g.items.map(([name, desc]) => (
                      <li key={name} className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                        <p className="text-[14.5px] font-semibold text-ink">{name}</p>
                        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-mute">{desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Which integration would help most?"
        description="Tell us what you'd connect first — it shapes the roadmap."
        primary={{ label: "Tell us", href: "/contact" }}
        secondary={{ label: "Back to developers", href: "/developers" }}
      />
    </PageShell>
  );
}
