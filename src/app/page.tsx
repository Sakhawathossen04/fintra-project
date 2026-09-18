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
  title: "DataLens — Chat with your data. Analysis on autopilot.",
  description:
    "Upload a CSV or JSON file and get a complete analysis: automatic EDA, charts, correlations, segments, and AI-narrated findings. No login, no notebook, no code.",
  path: "/",
});

const USE_CASES = [
  {
    title: "Instant dataset profiling",
    desc: "Drop any CSV and get structure, types, missing values, duplicates, and quality scores in seconds — the work that eats the first hour of every notebook.",
    href: "/product/eda",
  },
  {
    title: "Ask questions in plain language",
    desc: "\"Why did sales dip in March?\" Answers are grounded in the verified statistics computed from your file — with figures rendered alongside.",
    href: "/product/chat",
  },
  {
    title: "Relationships & segments",
    desc: "Correlation matrices, scatter fits, and group comparisons are detected and drawn automatically — no wrangling matplotlib.",
    href: "/product/charts",
  },
  {
    title: "Report-ready output",
    desc: "Turn any analysis into a structured, exportable report with executive summary, findings, and recommended next steps.",
    href: "/product/reports",
  },
];

const FAQS = [
  {
    q: "What is DataLens?",
    a: "DataLens is an AI data-analysis workspace. Upload a CSV or JSON dataset and it runs a full exploratory analysis — summary statistics, distributions, correlations, segments, outliers, and data-quality checks — then lets you ask questions about the results in plain language.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. The workspace is open — open it and start working. Your threads are kept private to your browser; there is no login wall between you and your analysis.",
  },
  {
    q: "Which AI models power the narration?",
    a: "DataLens routes across leading models via OpenRouter — including DeepSeek, Llama, Gemini, GPT, and Claude. Free models are included by default; a smart router picks the right model for each question.",
  },
  {
    q: "Can the AI invent numbers?",
    a: "No. Every statistic in your analysis is computed deterministically by the EDA engine first. The AI narrates those verified numbers — it cannot fabricate figures that contradict your data.",
  },
  {
    q: "What file types can I analyze?",
    a: "CSV, TSV, and JSON (including column-oriented JSON). Delimiters, currency symbols, percentages, and missing-value conventions are detected automatically.",
  },
  {
    q: "Can I export my work?",
    a: "Yes — export the full analysis as JSON, the summary statistics as CSV, chat transcripts and reports as Markdown. Your work is never locked in.",
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
                <Eyebrow>AI Data Analysis Workspace</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-ink">
                  Your data,
                  <br />
                  analyzed on arrival.
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-mute">
                  Upload a CSV or JSON file. DataLens profiles it, charts it, and
                  answers your questions — the notebook work, done before you open one.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <ButtonLink href="/agent" size="lg">
                    Open workspace — free
                  </ButtonLink>
                  <ButtonLink href="/product" variant="secondary" size="lg">
                    Explore the platform
                  </ButtonLink>
                </div>
              </Reveal>
              <Reveal delay={0.24}>
                <p className="mt-5 text-[13px] text-ink-faint">
                  No signup · No credit card · Works without an account
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
                  <p className="text-[13px] font-medium text-ink">Distribution — auto-detected</p>
                  <span className="font-mono text-[11px] text-sage">skew +0.42</span>
                </div>
                <div className="mt-4">
                  <AreaChart points={[8, 14, 22, 34, 41, 38, 30, 24, 16, 11, 7, 4]} />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
                  {[
                    ["Rows", "12,480"],
                    ["Columns", "14"],
                    ["Quality", "96/100"],
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
                eyebrow="One upload"
                title="The EDA, before you finish your coffee."
                description="DataLens parses your file, infers every column type, computes the statistics, and renders the figures — then the AI walks you through what matters. What used to be an afternoon of notebook code is now one drag-and-drop."
              />
              <ul className="mt-7 space-y-3.5">
                {[
                  "Types, missing values, and duplicates detected automatically",
                  "Distributions, outliers, correlations, and segments charted for you",
                  "Every number verified by the engine — the AI can't invent your data",
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

      {/* ── Workflow story ── */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Built for analysis"
              title="Not a chatbot. An analyst's workspace."
              description="Chat is where DataLens starts — not where it ends. Everything an analyst does after loading a file, wired into one flow."
            />
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Upload",
                desc: "Drop a CSV or JSON file. Parsing, type inference, and quality scoring happen instantly — right in the browser's workspace.",
              },
              {
                n: "02",
                title: "Explore",
                desc: "Read the auto-generated EDA: figures, findings, and quality flags. Then ask follow-ups in plain language, grounded in verified stats.",
              },
              {
                n: "03",
                title: "Deliver",
                desc: "Generate a structured report, export figures and statistics, and share the results. Analysis becomes a deliverable, not a scratchpad.",
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
                title="The right model for every question."
                description="Quick lookups want speed; deep statistical reasoning wants care. DataLens routes each question to the model that handles it best — via OpenRouter, with free models included by default."
              />
              <div className="mt-8 flex flex-wrap gap-2.5">
                {["DeepSeek", "Llama", "Gemini", "Qwen", "GPT", "Claude"].map((m) => (
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
                  How smart routing works
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="rounded-[var(--radius-card)] border border-white/10 bg-charcoal-soft p-5 sm:p-6">
                <p className="font-mono text-[11px] text-paper/40">routing preview</p>
                <div className="mt-4 space-y-3">
                  {[
                    ["\"How many rows have nulls?\"", "Quick lookup", "Gemini Flash"],
                    ["\"Explain this correlation\"", "Deep reasoning", "DeepSeek R1"],
                    ["\"Write the analysis report\"", "Long-form", "Claude"],
                    ["\"Convert to pandas\"", "Code", "Qwen Coder"],
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

      {/* ── Verified numbers ── */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="lg:order-2">
              <SectionHeading
                eyebrow="Verified analysis"
                title="The AI narrates. The engine computes."
                description="Every figure in your analysis is calculated deterministically before the AI says a word. The model's job is explanation — not invention — so the numbers in the story are always the numbers in the data."
              />
              <ul className="mt-7 space-y-3.5">
                {[
                  "Statistics computed by the EDA engine, not the LLM",
                  "Outliers and skew flagged with IQR fences you can verify",
                  "Export the raw analysis JSON to reproduce every figure",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3 text-[15px] text-ink-soft">
                    <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-sage" />
                    {li}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink href="/product/eda" variant="secondary">
                  See the EDA engine
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:order-1">
              <div className="rounded-[var(--radius-card)] border border-line bg-paper p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-ink">Group comparison — auto-detected</p>
                  <span className="rounded-full bg-copper-soft px-2.5 py-0.5 font-mono text-[10.5px] text-copper-strong">
                    segment view
                  </span>
                </div>
                <div className="mt-4">
                  <BarsChart values={[62, 84, 51, 73, 45]} labels={["North", "South", "East", "West", "Other"]} />
                </div>
                <div className="mt-4 space-y-2 border-t border-line pt-4 font-mono text-[11.5px]">
                  {[
                    ["segments found", "5 of 5 categories"],
                    ["strongest gap", "South vs Other — 39 pts"],
                    ["recommendation", "test South drivers first"],
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
              title="Where teams put DataLens to work."
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
              title="Start free. Stay free if you like."
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
                        href={plan.monthly === 0 ? "/agent" : "/pricing"}
                        variant={plan.highlighted ? "primary" : "secondary"}
                        className="w-full"
                      >
                        {plan.monthly === 0 ? "Open workspace" : `Choose ${plan.name}`}
                      </ButtonLink>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-8 text-center text-[13.5px] text-ink-mute">
              Running analysis for a larger organization?{" "}
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
                eyebrow="Privacy & security"
                title="Your data stays yours."
                description="Datasets are processed to produce your analysis and kept private to your browser's workspace. No account required means no account data to leak."
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
                  ["No training on your data", "Workspace content is never used to train models."],
                  ["Encryption in transit", "Modern TLS on every request, uploads included."],
                  ["Browser-scoped privacy", "Threads live in a private cookie — no account needed."],
                  ["Verified computation", "Statistics come from our engine, not model guesses."],
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
              Stop writing boilerplate. Start seeing answers.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-paper/60">
              Open the workspace, drop a file, and read the analysis — free, without an account.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/agent" size="lg">
                Open workspace — free
              </ButtonLink>
              <ButtonLink href="/contact" variant="outlineLight" size="lg">
                Contact us
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
