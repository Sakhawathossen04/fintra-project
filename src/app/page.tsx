import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import HeroAnimation from "@/components/home/HeroAnimation";
import { Eyebrow, SectionHeading, Disclosure } from "@/components/ui/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { AreaChart, BarsChart } from "@/components/ui/charts";
import { PLANS } from "@/lib/plans";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Fintra — Finance AI Workspace",
  description:
    "Fintra brings leading AI models, financial analysis, research, reporting, and recurring finance workflows into one professional workspace.",
  path: "/",
});

const USE_CASES = [
  {
    title: "Variance analysis",
    desc: "Compare actuals, budget, and prior period. Get drivers, not just deltas — with commentary drafted and cited.",
    href: "/solutions/fpa",
  },
  {
    title: "Board reporting",
    desc: "Turn a month of numbers into a board-ready pack: executive summary, exhibits, and talking points.",
    href: "/solutions/cfo",
  },
  {
    title: "Close & reconciliation",
    desc: "Review statements, trace reconciling items, and keep documentation consistent across the close.",
    href: "/solutions/accounting",
  },
  {
    title: "Investment research",
    desc: "Synthesize filings and models into research notes and investment memos with consistent assumptions.",
    href: "/solutions/investment",
  },
];

const FAQS = [
  {
    q: "What is Fintra?",
    a: "Fintra is a Finance AI workspace. It brings leading AI models together with the analysis, reporting, and recurring workflows finance teams do every week — in one professional place.",
  },
  {
    q: "Which AI models does Fintra support?",
    a: "Fintra supports leading models including GPT, Claude, Gemini, DeepSeek, and Qwen. You can pick a model per task or let Fintra route work automatically based on what the task needs.",
  },
  {
    q: "Do I need to connect my accounting systems?",
    a: "No. Fintra works with files you already have — spreadsheets, statements, and documents. You can bring data in and start analyzing immediately, with deeper integrations on the way.",
  },
  {
    q: "Is my financial data used to train models?",
    a: "No. Your workspace content is yours. See the security page for how data is handled, stored, and protected.",
  },
  {
    q: "Can I try Fintra before paying?",
    a: "Yes. The Free plan includes workspace access, standard models, and daily agent runs — enough to try Fintra on real work.",
  },
];

export default function HomePage() {
  return (
    <PageShell>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-copper-soft),transparent)] opacity-70"
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Reveal>
                <Eyebrow>Finance AI Workspace</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-ink">
                  Think clearly.
                  <br />
                  Work with numbers.
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-mute">
                  Fintra brings AI models, financial analysis, reporting, research, and
                  recurring finance workflows together in one professional workspace.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <ButtonLink href="/signup" size="lg">
                    Start using Fintra
                  </ButtonLink>
                  <ButtonLink href="/product" variant="secondary" size="lg">
                    Explore the platform
                  </ButtonLink>
                </div>
              </Reveal>
              <Reveal delay={0.24}>
                <p className="mt-5 text-[13px] text-ink-faint">
                  Free plan available · No credit card required
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <HeroAnimation />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Product demonstration ── */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="rounded-[var(--radius-card)] border border-line bg-paper p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-ink">Operating margin — trailing 12 months</p>
                  <span className="font-mono text-[11px] text-sage">+120 bps</span>
                </div>
                <div className="mt-4">
                  <AreaChart points={[19.2, 19.8, 20.1, 20.6, 21.0, 20.8, 21.9, 22.4, 22.9, 23.5, 24.1, 24.8]} />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
                  {[
                    ["Gross margin", "61.4%"],
                    ["EBITDA", "$6.1M"],
                    ["Headcount", "212"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[11px] uppercase tracking-wider text-ink-faint">{label}</p>
                      <p className="mt-0.5 text-[15px] font-semibold text-ink">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <SectionHeading
                eyebrow="One workspace"
                title="Your numbers, finally in conversation."
                description="Bring spreadsheets, statements, and reports into Fintra and ask real questions. Every answer is grounded in your documents — with sources you can check, not invented figures."
              />
              <ul className="mt-7 space-y-3.5">
                {[
                  "Ask in plain language, get analysis-grade answers",
                  "Every figure traced back to the source document",
                  "Share outputs with your team as reports or decks",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3 text-[15px] text-ink-soft">
                    <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-copper" />
                    {li}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Finance AI workspace story ── */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Built for finance work"
              title="Not a chatbot. A workspace."
              description="Chat is where Fintra starts — not where it ends. Fintra is organized around how finance teams actually operate."
            />
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Analyze",
                desc: "Upload files, connect context, and interrogate the numbers. Fintra keeps history and assumptions in one thread.",
              },
              {
                n: "02",
                title: "Build",
                desc: "Turn analysis into reports, decks, and memos with reusable templates your team can standardize on.",
              },
              {
                n: "03",
                title: "Automate",
                desc: "Recurring tasks become agents and workflows — close checklists, variance memos, and board packs that run themselves.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="h-full rounded-[var(--radius-card)] border border-line bg-surface p-7">
                  <p className="font-mono text-[12px] text-copper">{s.n}</p>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{s.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-mute">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Multi-model AI ── */}
      <section className="border-t border-line bg-charcoal">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading
                dark
                eyebrow="Multi-model AI"
                title="The right model for every finance task."
                description="Different models excel at different work — fast extraction, careful reasoning, long documents. Fintra gives you all of them under one roof, and routes each task to the model that handles it best."
              />
              <div className="mt-8 flex flex-wrap gap-2.5">
                {["GPT", "Claude", "Gemini", "DeepSeek", "Qwen", "More arriving"].map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-paper/80"
                  >
                    {m}
                  </span>
                ))}
              </div>
              <div className="mt-8">
                <ButtonLink href="/product/models" variant="outlineLight">
                  How model routing works
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="rounded-[var(--radius-card)] border border-white/10 bg-charcoal-soft p-5 sm:p-6">
                <p className="font-mono text-[11px] text-paper/40">routing preview</p>
                <div className="mt-4 space-y-3">
                  {[
                    ["Variance commentary", "Deep reasoning", "Claude"],
                    ["Invoice extraction", "High volume", "GPT"],
                    ["Long filings synthesis", "1M context", "Gemini"],
                    ["Numeric checking", "Precision", "Qwen"],
                  ].map(([task, why, model]) => (
                    <div key={task} className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium text-paper">{task}</p>
                        <p className="font-mono text-[11px] text-paper/40">{why}</p>
                      </div>
                      <span className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[11px] text-paper/80">
                        {model}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Agents & workflows ── */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="lg:order-2">
              <SectionHeading
                eyebrow="Agents & workflows"
                title="Set the work on a schedule."
                description="Define it once — Fintra runs it every period. Agents draft the variance memo, refresh the forecast, and assemble the board pack. You review, refine, and approve."
              />
              <ul className="mt-7 space-y-3.5">
                {[
                  "Variance Agent — memo + exhibit tables",
                  "Forecast Agent — rolling update with assumptions",
                  "Close Agent — checklist, docs, and follow-ups",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3 text-[15px] text-ink-soft">
                    <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-sage" />
                    {li}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink href="/product/agents" variant="secondary">
                  Explore finance agents
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:order-1">
              <div className="rounded-[var(--radius-card)] border border-line bg-paper p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-ink">Recurring runs</p>
                  <span className="rounded-full bg-copper-soft px-2.5 py-0.5 font-mono text-[10.5px] text-copper-strong">
                    monthly
                  </span>
                </div>
                <div className="mt-4">
                  <BarsChart values={[62, 68, 64, 74, 71, 78, 82, 88]} labels={["F", "M", "A", "M", "J", "J", "A", "S"]} />
                </div>
                <div className="mt-4 space-y-2 border-t border-line pt-4 font-mono text-[11.5px]">
                  {[
                    ["Variance memo", "drafted · 09:00"],
                    ["Forecast refresh", "updated · 09:04"],
                    ["Board pack", "assembled · 09:11"],
                  ].map(([name, when]) => (
                    <div key={name} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                      <span className="text-ink-soft">{name}</span>
                      <span className="text-sage">{when}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Use cases"
              title="Where finance teams put Fintra to work."
            />
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {USE_CASES.map((u, i) => (
              <Reveal key={u.title} delay={i * 0.06}>
                <Link href={u.href} className="group block border-t border-line pt-6">
                  <h3 className="text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-copper-strong">
                    {u.title}
                  </h3>
                  <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-mute">{u.desc}</p>
                  <p className="mt-3 text-[13.5px] font-medium text-copper-strong opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more →
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing introduction ── */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Pricing"
              title="Start free. Scale when you're ready."
            />
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-3">
            {(["free", "pro", "max"] as const).map((id, i) => {
              const plan = PLANS[id];
              return (
                <Reveal key={id} delay={i * 0.07}>
                  <div
                    className={`flex h-full flex-col rounded-[var(--radius-card)] border p-7 ${
                      plan.highlighted
                        ? "border-copper/40 bg-paper shadow-[var(--shadow-card)]"
                        : "border-line bg-paper"
                    }`}
                  >
                    <p className="text-sm font-semibold text-ink">{plan.name}</p>
                    <p className="mt-1 text-[13px] text-ink-mute">{plan.tagline}</p>
                    <p className="mt-5 text-3xl font-semibold tracking-tight text-ink">
                      ${plan.monthly}
                      <span className="text-sm font-normal text-ink-faint"> / mo</span>
                    </p>
                    <ul className="mt-5 flex-1 space-y-2.5">
                      {plan.features.slice(0, 4).map((f) => (
                        <li key={f} className="text-[13.5px] text-ink-soft">
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <ButtonLink
                        href="/pricing"
                        variant={plan.highlighted ? "primary" : "secondary"}
                        className="w-full"
                      >
                        {plan.monthly === 0 ? "Start free" : `Choose ${plan.name}`}
                      </ButtonLink>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-8 text-center text-[13.5px] text-ink-mute">
              Running finance for a larger organization?{" "}
              <Link href="/enterprise" className="font-medium text-copper-strong hover:underline">
                Talk to us about Enterprise
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                eyebrow="Trust & security"
                title="Built for professional finance data."
                description="Your workspace content is yours. Fintra is designed for the confidentiality finance work demands — with clear controls over who sees what."
              />
              <div className="mt-7">
                <ButtonLink href="/resources/security" variant="secondary">
                  Read about security
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Your data, your property", "Workspace content is never used to train models."],
                  ["Encryption in transit & at rest", "Modern TLS and encrypted storage."],
                  ["Session-based access control", "Signed-in users see only their workspace."],
                  ["Clear model boundaries", "Provider handling documented, not hidden."],
                ].map(([t, d]) => (
                  <li key={t} className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                    <p className="text-[14.5px] font-semibold text-ink">{t}</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-mute">{d}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal>
            <SectionHeading align="center" eyebrow="FAQ" title="Questions, answered." />
          </Reveal>
          <div className="mt-10">
            {FAQS.map((f) => (
              <Disclosure key={f.q} title={f.q}>
                {f.a}
              </Disclosure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-line bg-charcoal">
        <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8 lg:py-32">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-paper">
              Do your best finance work with Fintra.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-paper/60">
              Join the workspace where analysis, reporting, and agents come together.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/signup" size="lg">
                Start using Fintra
              </ButtonLink>
              <ButtonLink href="/contact" variant="outlineLight" size="lg">
                Contact sales
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
