import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero } from "@/lib/marketing";
import { pageMeta } from "@/lib/site";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: "Talk to the Fintra team — sales, enterprise, support, or feedback.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title="Talk to the Fintra team."
        description="Sales, enterprise, support, or product feedback — this form reaches us, and we reply."
      />
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_380px]">
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-4">
              {[
                ["Sales & Enterprise", "Scoping, pricing, pilots, and procurement questions."],
                ["Support", "Account, billing, and workspace help — see the help center for quick answers."],
                ["Security", "Data handling questions answered in plain language."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                  <p className="text-[15px] font-semibold text-ink">{t}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-mute">{d}</p>
                </div>
              ))}
              <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                <p className="text-[15px] font-semibold text-ink">Prefer email?</p>
                <p className="mt-1.5 text-[13.5px] text-ink-mute">hello@fintra.example.com</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
