import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { SectionHeading } from "@/components/ui/Brand";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Enterprise",
  description:
    "Fintra Enterprise: SSO, centralized administration, audit logs, custom retention, and dedicated support for large finance organizations.",
  path: "/enterprise",
});

const CAPABILITIES = [
  {
    title: "Security & access",
    points: ["SSO / SAML", "Domain capture", "Role-based access", "Session and device controls"],
  },
  {
    title: "Administration",
    points: ["Centralized billing", "Usage analytics", "Seat management", "Organization policies"],
  },
  {
    title: "Compliance support",
    points: ["Audit logs", "Custom data retention", "Data export & deletion", "Documented provider boundaries"],
  },
  {
    title: "Partnership",
    points: ["Dedicated support", "Onboarding for finance teams", "Template & rollout assistance", "Roadmap input"],
  },
];

export default function EnterprisePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Enterprise"
        title="Fintra for large finance organizations."
        description="Everything in Max, plus the security, administration, and support that enterprise finance teams require — scoped and priced with your team."
        actions={
          <>
            <a href="/contact" className="inline-flex h-11 items-center rounded-full bg-copper px-6 text-[15px] font-medium text-white hover:bg-copper-strong">
              Contact sales
            </a>
            <a href="/pricing" className="inline-flex h-11 items-center rounded-full border border-line-strong px-6 text-[15px] font-medium text-ink hover:bg-paper-deep">
              Compare plans
            </a>
          </>
        }
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <div className="h-full rounded-[var(--radius-card)] border border-line bg-surface p-7">
                  <h2 className="text-[17px] font-semibold text-ink">{c.title}</h2>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {c.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-[14px] text-ink-soft">
                        <svg viewBox="0 0 24 24" className="mt-[3px] size-3.5 shrink-0 text-sage" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Rollout"
              title="A pilot that becomes a rollout."
              description="Most enterprise teams start with one finance function — FP&A or accounting — prove the time savings in a month, then expand. We help you scope the pilot, set the success criteria, and support the rollout."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Week 1", "Pilot scoped, team onboarded"],
                ["Weeks 2–4", "Live work on real periods"],
                ["Review", "Results, expansion plan, pricing"],
              ].map(([w, d]) => (
                <div key={w} className="rounded-[var(--radius-card)] border border-line bg-paper p-5">
                  <p className="font-mono text-[11px] text-copper">{w}</p>
                  <p className="mt-1.5 text-[14px] text-ink-soft">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand
        title="Talk to us about Enterprise."
        description="Tell us about your organization and we'll scope the right starting point."
        primary={{ label: "Contact sales", href: "/contact" }}
        secondary={{ label: "View pricing", href: "/pricing" }}
      />
    </PageShell>
  );
}
