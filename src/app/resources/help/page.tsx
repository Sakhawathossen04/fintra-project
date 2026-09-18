import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, CtaBand } from "@/lib/marketing";
import { Disclosure } from "@/components/ui/Brand";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Help center",
  description: "Answers about DataLens accounts, billing, workspace, and data.",
  path: "/resources/help",
});

const CATEGORIES = [
  {
    title: "Getting started",
    items: [
      ["Do I need an account?", "No. The workspace at /agent is open — open it and start analyzing. An account is only needed for billing and settings."],
      ["How do I analyze a file?", "Open the workspace, drag in a CSV, TSV, or JSON file (or paste raw data), and the full EDA runs automatically. Then ask questions in chat."],
      ["Which AI models are included?", "A set of capable free models is included by default via smart routing. Add an OpenRouter key to unlock frontier models like GPT, Claude, and Gemini Pro."],
    ],
  },
  {
    title: "Billing",
    items: [
      ["How do I upgrade?", "Go to Pricing, choose Pro or Max, and complete checkout. Upgrades take effect immediately; manage everything under Settings → Billing."],
      ["How do I cancel?", "Switch to the Free plan from Settings → Billing. Your workspace stays available; paid features turn off at the end of the period."],
    ],
  },
  {
    title: "Workspace & data",
    items: [
      ["Where is my data stored?", "Threads and datasets are stored per-browser in the workspace storage, private to your session, and are not used for model training. See the Security page for details."],
      ["Can I export my work?", "Yes — the full analysis as JSON, summary statistics as CSV, reports and transcripts as Markdown."],
      ["What file types are supported?", "CSV, TSV, and JSON (including column-oriented JSON), up to 6 MB. Delimiters, currency formats, and missing-value conventions are detected automatically."],
    ],
  },
];

export default function HelpPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Resources · Help"
        title="Help center."
        description="Quick answers about accounts, billing, and your workspace."
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          {CATEGORIES.map((cat, ci) => (
            <div key={cat.title} className={ci > 0 ? "mt-12" : ""}>
              <Reveal delay={ci * 0.05}>
                <h2 className="text-[20px] font-semibold tracking-tight text-ink">{cat.title}</h2>
              </Reveal>
              <div className="mt-4">
                {cat.items.map(([q, a]) => (
                  <Disclosure key={q} title={q}>
                    {a}
                  </Disclosure>
                ))}
              </div>
            </div>
          ))}
          <Reveal>
            <p className="mt-12 rounded-[var(--radius-card)] border border-line bg-surface p-6 text-[14.5px] text-ink-mute">
              Didn't find your answer?{" "}
              <Link href="/contact" className="font-medium text-copper-strong hover:underline">
                Contact us
              </Link>{" "}
              — we reply to every message.
            </p>
          </Reveal>
        </div>
      </section>
      <CtaBand
        title="Still stuck?"
        description="Send us a note and we'll help you directly."
        primary={{ label: "Contact support", href: "/contact" }}
      />
    </PageShell>
  );
}
