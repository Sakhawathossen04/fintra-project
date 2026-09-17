import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { SectionHeading, Eyebrow } from "@/components/ui/Brand";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Fintra API",
  description:
    "The Fintra API will provide programmatic access to analyses and reports. See the planned surface and register interest.",
  path: "/developers/api",
});

export default function ApiPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Developers · API"
        title="The Fintra API."
        description="Programmatic access to the Finance AI workspace — run analyses, generate reports, and retrieve outputs from your own systems. In design, with early access planned."
        actions={
          <a href="/contact" className="inline-flex h-11 items-center rounded-full bg-copper px-6 text-[15px] font-medium text-white hover:bg-copper-strong">
            Register interest
          </a>
        }
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Planned surface</Eyebrow>
              <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-ink">
                A small, sharp API.
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-ink-mute">
                The first version targets the highest-leverage operations finance teams
                automate first. The shape below is the current design direction.
              </p>
              <ul className="mt-7 space-y-3.5">
                {[
                  "Create an analysis from uploaded files and a prompt",
                  "Retrieve a generated report or exhibit set",
                  "Trigger an agent run and poll for its draft output",
                  "List workspace projects and their documents",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3 text-[14.5px] text-ink-soft">
                    <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-copper" />
                    {li}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-charcoal">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                  <span className="font-mono text-[11px] text-paper/40">planned example</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-paper/60">v0 design</span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed text-paper/80"><code>{`curl https://api.fintra.example.com/v1/analyses \\
  -H "Authorization: Bearer $FINTRA_API_KEY" \\
  -d '{
    "project": "q3-close",
    "files": ["actuals.xlsx", "budget.xlsx"],
    "prompt": "Decompose Q3 revenue variance"
  }'

# → {
#     "id": "an_8x2...",
#     "status": "queued",
#     "outputs": ["variance-memo", "exhibits"]
#   }`}</code></pre>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Honesty note"
              title="Clearly labeled, clearly planned."
              description="This page describes the API design direction, not a live product. Everything marked 'planned' on the developers hub is exactly that — and we'd rather show the real boundary than blur it."
            />
          </Reveal>
        </div>
      </section>
      <CtaBand
        title="Want early access?"
        description="Tell us what you'd build — early design partners get first access."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Back to developers", href: "/developers" }}
      />
    </PageShell>
  );
}
