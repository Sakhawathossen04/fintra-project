import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Resources",
  description: "Guides, templates, security, and help for Fintra users.",
  path: "/resources",
});

const CARDS = [
  { title: "Guides", href: "/resources/guides", desc: "Practical playbooks for finance AI work." },
  { title: "Templates", href: "/resources/templates", desc: "Start from proven finance formats." },
  { title: "Security", href: "/resources/security", desc: "How Fintra protects your data." },
  { title: "Help center", href: "/resources/help", desc: "Answers and support." },
];

export default function ResourcesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Resources"
        title="Get more from Fintra."
        description="Playbooks, templates, and answers — built with the same care as the product."
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <a
                  href={c.href}
                  className="group block h-full rounded-[var(--radius-card)] border border-line bg-surface p-7 transition-all hover:border-line-strong hover:shadow-[var(--shadow-card)]"
                >
                  <h2 className="text-[17px] font-semibold tracking-tight text-ink group-hover:text-copper-strong">
                    {c.title}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-mute">{c.desc}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        title="Start putting Fintra to work."
        description="Free to try, minutes to set up."
        secondary={{ label: "View pricing", href: "/pricing" }}
      />
    </PageShell>
  );
}
