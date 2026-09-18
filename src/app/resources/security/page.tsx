import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { SectionHeading } from "@/components/ui/Brand";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Security",
  description: "How DataLens handles, stores, and protects your datasets.",
  path: "/resources/security",
});

const PILLARS = [
  {
    title: "Your data is yours",
    points: [
      "Workspace content is never used to train AI models",
      "You can export or delete your content",
      "Clear, plain-language privacy policy",
    ],
  },
  {
    title: "Encryption",
    points: [
      "TLS 1.2+ for data in transit",
      "Encryption at rest for stored workspace content",
      "Credentials hashed with modern key-derivation (scrypt)",
    ],
  },
  {
    title: "Access control",
    points: [
      "Session-based authentication with signed, HTTP-only cookies",
      "Server-side session validation on every protected route",
      "Automatic session expiry after 30 days",
    ],
  },
  {
    title: "Model provider handling",
    points: [
      "Clear documentation of which models process your requests",
      "Provider boundaries documented, not hidden",
      "Model routing decisions visible in the product",
    ],
  },
];

export default function SecurityPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Resources · Security"
        title="Designed for confidential data."
        description="Data work demands confidentiality. Here is precisely how DataLens handles your data — and what we don't claim."
      />

      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="h-full rounded-[var(--radius-card)] border border-line bg-surface p-7">
                  <h2 className="text-[17px] font-semibold text-ink">{p.title}</h2>
                  <ul className="mt-4 space-y-2.5">
                    {p.points.map((pt) => (
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
              eyebrow="What we don't claim"
              title="An honest security page."
              description="We don't display compliance badges we haven't earned. Certifications (such as SOC 2) are not claimed here; when DataLens achieves them, they will be listed with evidence. If a claim isn't on this page, treat it as not yet true — and ask us."
            />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Security questions?"
        description="Ask us anything about data handling — we answer in plain language."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Read the privacy policy", href: "/privacy" }}
      />
    </PageShell>
  );
}
