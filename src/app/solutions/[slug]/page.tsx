import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, FeatureRow, CtaBand } from "@/lib/marketing";
import { SectionHeading, Disclosure } from "@/components/ui/Brand";
import { AreaChart } from "@/components/ui/charts";
import { pageMeta } from "@/lib/site";

interface Solution {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: { title: string; description: string; bullets: string[] };
  workflows: { title: string; description: string; bullets: string[] }[];
  capabilities: { title: string; description: string }[];
  visual: "chart" | "workflow" | "agent" | "report" | "chat" | "routing";
  outcomes: { title: string; description: string }[];
  faq: { q: string; a: string }[];
}

const SOLUTIONS: Record<string, Solution> = {
  marketing: {
    slug: "marketing",
    name: "Marketing",
    eyebrow: "Solutions · Marketing",
    title: "Campaign data, analyzed between meetings.",
    description:
      "Channel performance, campaign comparisons, funnel conversion, and spend efficiency — analyzed from the exports you already have, without waiting for the BI queue.",
    intro: {
      title: "From export to insight in one sitting",
      description:
        "Marketing runs on platform exports: ads managers, analytics tools, CRM dumps. DataLens reads those CSVs directly and answers the questions the dashboard can't — why, not just what.",
      bullets: [
        "Channel comparison: spend vs conversion side by side",
        "Campaign analysis: what separated winners from losers",
        "Funnel data: where the drop-offs actually concentrate",
        "Audience segments: which groups over- and under-perform",
      ],
    },
    workflows: [
      {
        title: "Weekly channel review",
        description: "Drop the weekly export; get spend, conversion, and segment comparisons with commentary — before the standup.",
        bullets: ["Group comparisons", "Trend lines", "Key findings"],
      },
      {
        title: "Campaign post-mortems",
        description: "Compare campaigns on every metric at once; the correlation and segment views surface what drove the difference.",
        bullets: ["Correlation matrix", "Outlier flags", "Quality checks"],
      },
      {
        title: "Stakeholder writeups",
        description: "Turn the analysis into a structured report with summary, findings, and recommendations — exported as Markdown.",
        bullets: ["Report sections", "Consistent format", "One-click export"],
      },
    ],
    capabilities: [
      { title: "Multi-channel CSVs", description: "Every platform's export, parsed and joined mentally by the analyst in you." },
      { title: "Segment views", description: "Auto group-bys on any categorical dimension." },
      { title: "Trend detection", description: "Date-aware trend lines with regression." },
      { title: "Report export", description: "Markdown deliverables in minutes." },
    ],
    visual: "chart",
    outcomes: [
      { title: "Hours back weekly", description: "The profiling that ate Monday morning happens on upload." },
      { title: "Sharper narratives", description: "Answers cite real computed numbers, not vibes." },
      { title: "No BI queue", description: "Self-serve analysis from the files you already have." },
    ],
    faq: [
      { q: "Does it connect to ad platforms?", a: "Not yet — DataLens works on the CSV/JSON exports you already download, which covers essentially every platform." },
      { q: "Can it handle large exports?", a: "Yes — up to 6 MB per file on the free tier, typically tens of thousands of rows." },
    ],
  },
  operations: {
    slug: "operations",
    name: "Operations",
    eyebrow: "Solutions · Operations",
    title: "Operational data, understood at a glance.",
    description:
      "Supply chain, logistics, inventory, and process data — profiled, compared, and explained, so the anomalies surface before they become incidents.",
    intro: {
      title: "The operational record, readable",
      description:
        "Ops data is messy: mixed units, missing entries, duplicated shipments. DataLens's quality scoring and outlier detection make those problems visible first — then the analysis starts from clean ground.",
      bullets: [
        "Data quality: missing and duplicate records quantified",
        "Outlier detection: shipments or cycles far outside the norm",
        "Supplier/vendor comparisons: segment gaps made explicit",
        "Time patterns: seasonality and drift over your date columns",
      ],
    },
    workflows: [
      {
        title: "Vendor performance",
        description: "Compare lead times, defect rates, and volumes across vendors with automatic group statistics.",
        bullets: ["Group means", "Spread comparisons", "Segment rankings"],
      },
      {
        title: "Anomaly triage",
        description: "IQR-fence outliers ranked by z-score — investigate the extremes first, with the evidence attached.",
        bullets: ["Ranked outliers", "Context stats", "Exportable findings"],
      },
      {
        title: "Period reviews",
        description: "Month-over-month operational reports generated from the latest data drop, in the same structure every time.",
        bullets: ["Trend analysis", "Report builder", "Consistent format"],
      },
    ],
    capabilities: [
      { title: "Quality scoring", description: "Know the data's condition before trusting the analysis." },
      { title: "Outlier detection", description: "Tukey fences with z-score ranking." },
      { title: "Segment statistics", description: "Any categorical split, quantified." },
      { title: "Date handling", description: "Multiple date formats parsed automatically." },
    ],
    visual: "agent",
    outcomes: [
      { title: "Fewer surprises", description: "Anomalies flagged during review, not during the incident." },
      { title: "Cleaner vendor talks", description: "Negotiate with computed evidence, not anecdotes." },
      { title: "Standard reviews", description: "Same report structure every period." },
    ],
    faq: [
      { q: "Can it handle our ERP export?", a: "If it's CSV or JSON — yes, including messy real-world exports with mixed types and missing values." },
      { q: "Is our operational data kept private?", a: "Uploads are processed to produce your analysis and stay private to your browser's workspace. No model training, ever." },
    ],
  },
  product: {
    slug: "product",
    name: "Product & growth",
    eyebrow: "Solutions · Product & Growth",
    title: "Usage data that answers back.",
    description:
      "Event exports, funnel data, cohort tables, and survey results — analyzed conversationally, with the figures to back every claim.",
    intro: {
      title: "Growth questions, answered from the exports",
      description:
        "Product teams swim in CSVs: analytics exports, A/B results, cohort pivots, NPS dumps. DataLens turns those files into analysis you can interrogate — why did retention dip? Which cohort converts?",
      bullets: [
        "Funnel analysis: conversion by segment, computed",
        "Cohort comparisons: retention curves side by side",
        "Experiment reads: distribution and outlier checks before you trust the mean",
        "Survey analysis: response distributions and cross-tabs",
      ],
    },
    workflows: [
      {
        title: "Weekly metrics review",
        description: "Upload the week's export; get trends, segments, and anomalies flagged with figures attached.",
        bullets: ["Trend lines", "Segment gaps", "Anomaly flags"],
      },
      {
        title: "Experiment analysis",
        description: "Check distributions and outliers before believing the averages; the EDA catches skewed data that breaks naive comparisons.",
        bullets: ["Distribution checks", "Skew warnings", "Median vs mean"],
      },
      {
        title: "Cohort deep dives",
        description: "Cross-tab heatmaps and group comparisons that make retention differences concrete.",
        bullets: ["Cross-tabs", "Group stats", "Exportable views"],
      },
    ],
    capabilities: [
      { title: "Event-level data", description: "Long, skinny event exports handled natively." },
      { title: "Cross-tabs", description: "Two-dimension segment shares as heatmaps." },
      { title: "Conversational follow-ups", description: "Ask \"why\" after seeing the what." },
      { title: "Report output", description: "Findings formatted for the product review." },
    ],
    visual: "chat",
    outcomes: [
      { title: "Faster reads", description: "Experiment and cohort checks in minutes, not sprints." },
      { title: "Defensible claims", description: "Every number traces to the engine's computation." },
      { title: "Democratized analysis", description: "PMs self-serve without SQL." },
    ],
    faq: [
      { q: "Can it replace our product analytics tool?", a: "No — it complements them. Export from your analytics tool and DataLens handles the analysis and narrative layer." },
      { q: "Does it understand experiment data?", a: "It profiles both groups' distributions and flags skew/outliers — a solid pre-read before formal significance testing." },
    ],
  },
  analysts: {
    slug: "analysts",
    name: "Data analysts",
    eyebrow: "Solutions · Analysts",
    title: "Notebook-speed EDA — without the notebook.",
    description:
      "The 80% of your workflow that's boilerplate — loading, typing, profiling, first charts — handled on upload, so your time goes to the 20% that's judgment.",
    intro: {
      title: "Your first-hour work, done on arrival",
      description:
        "Every analysis starts the same way: read the file, check the types, count the nulls, eyeball the distributions, look for duplicates. DataLens does all of it instantly — then you take over from the interesting part.",
      bullets: [
        "Instant profiling: describe() and info() equivalent, rendered",
        "First figures: histograms, box plots, correlations, group-bys",
        "Verified statistics: deterministic engine, not model guesses",
        "Full export: analysis JSON reproduces everything downstream",
      ],
    },
    workflows: [
      {
        title: "Dataset triage",
        description: "New file? Get the full profile in the time it takes to type `import pandas`.",
        bullets: ["Type inference", "Quality score", "Top findings"],
      },
      {
        title: "Client questions",
        description: "Answer ad-hoc questions against the attached dataset in plain language — grounded in the verified stats.",
        bullets: ["Grounded chat", "Follow-up context", "Copyable answers"],
      },
      {
        title: "Handoff documentation",
        description: "Export the EDA as JSON and the report as Markdown so whoever continues has the full picture.",
        bullets: [".json analysis", ".md report", ".csv stats"],
      },
    ],
    capabilities: [
      { title: "Deterministic core", description: "Same file in, same stats out — always." },
      { title: "Messy-data tolerant", description: "Currency, commas, percent signs, parentheses negatives parsed." },
      { title: "Everything exportable", description: "Your analysis is data, not a black box." },
      { title: "Multi-model narration", description: "Pick the model that explains it best." },
    ],
    visual: "workflow",
    outcomes: [
      { title: "The 80% automated", description: "Boilerplate profiling happens on upload." },
      { title: "Verified grounding", description: "Engine-computed stats back every answer." },
      { title: "Portable work", description: "Exports keep your analysis out of silos." },
    ],
    faq: [
      { q: "Is this trying to replace pandas?", a: "No — it replaces the loading-and-looking part. Deep modeling still belongs in your notebook; exports bridge the two." },
      { q: "Can I trust the statistics?", a: "Yes — they're computed by deterministic TypeScript (means, quartiles, Pearson/Spearman, IQR fences), not generated by an LLM." },
    ],
  },
  research: {
    slug: "research",
    name: "Researchers",
    eyebrow: "Solutions · Research",
    title: "Survey and experiment data, analyzed with care.",
    description:
      "Response distributions, cross-tabulations, and data-quality checks for research datasets — with every statistic deterministic and exportable for the writeup.",
    intro: {
      title: "From raw responses to readable results",
      description:
        "Research data has stakes: the numbers end up in papers and decisions. DataLens computes the standard descriptives deterministically, flags quality issues honestly, and lets you interrogate the results before writing a word.",
      bullets: [
        "Response profiling: distributions and frequencies for every item",
        "Cross-tabs: two-way relationships as share heatmaps",
        "Quality checks: missingness, duplicates, straight-lining signals",
        "Reproducibility: export the full analysis as data",
      ],
    },
    workflows: [
      {
        title: "Survey fielding checks",
        description: "During fielding, track response distributions and missingness by wave.",
        bullets: ["Missing-value views", "Frequency tables", "Wave comparisons"],
      },
      {
        title: "Segment comparisons",
        description: "Cross demographic segments against outcomes with computed group statistics.",
        bullets: ["Group means", "Cross-tab heatmaps", "Concentration stats"],
      },
      {
        title: "Writeup support",
        description: "Generate the descriptive section of your report from the verified statistics, then edit in your voice.",
        bullets: ["Report sections", "Markdown export", "Reproducible stats"],
      },
    ],
    capabilities: [
      { title: "Deterministic statistics", description: "Means, medians, quartiles — computed, auditable." },
      { title: "Likert-friendly", description: "Ordinal scales profiled as both numeric and categorical." },
      { title: "Missingness maps", description: "Item-level missing data, visualized." },
      { title: "Clean exports", description: "CSV stats for your methods appendix." },
    ],
    visual: "report",
    outcomes: [
      { title: "Trustworthy descriptives", description: "Engine-computed, not model-generated." },
      { title: "Faster fielding reads", description: "Quality issues caught mid-collection." },
      { title: "Writeup-ready numbers", description: "Stats export straight into your document." },
    ],
    faq: [
      { q: "Is this suitable for academic work?", a: "The statistics are standard and deterministic (documented formulas). For publication, verify against your own pipeline — the JSON export makes that trivial." },
      { q: "Can it handle coded qualitative data?", a: "Categorical codes analyze natively — frequencies, cross-tabs, and concentration metrics." },
    ],
  },
  executives: {
    slug: "executives",
    name: "Executives",
    eyebrow: "Solutions · Executives",
    title: "Answers without the dashboard backlog.",
    description:
      "When the question can't wait for the BI ticket: upload the data, ask in plain language, read the analysis — and get the report formatted for forwarding.",
    intro: {
      title: "Self-serve clarity for decision-makers",
      description:
        "Between meetings, the question arrives: which region slowed? what changed last month? DataLens answers from the actual export — computed figures, explained — instead of a forwarded screenshot with someone's opinion.",
      bullets: [
        "Direct answers: ask the question, get the numbers",
        "Executive summaries: the report's first section is the decision brief",
        "No tool learning curve: chat and files, nothing else",
        "Forwardable output: Markdown reports ready for email",
      ],
    },
    workflows: [
      {
        title: "The pre-meeting check",
        description: "Before the review, run the latest export through a Deep analysis and walk in with the findings.",
        bullets: ["Deep mode EDA", "Key findings", "Segment gaps"],
      },
      {
        title: "The sanity check",
        description: "When a claim doesn't smell right, upload the data and check it against the computed numbers.",
        bullets: ["Verified stats", "Outlier flags", "Quality score"],
      },
      {
        title: "The brief",
        description: "Generate the executive summary and forward the Markdown — the analysis travels with the decision.",
        bullets: ["Executive summary", "Risks & caveats", "Markdown export"],
      },
    ],
    capabilities: [
      { title: "Plain-language questions", description: "No query syntax, no dashboard configuration." },
      { title: "Quality transparency", description: "Know how good the underlying data is." },
      { title: "Caveats included", description: "Reports flag skew, outliers, and small samples." },
      { title: "No account friction", description: "Open the workspace and work." },
    ],
    visual: "chat",
    outcomes: [
      { title: "Minutes, not tickets", description: "Analysis on your schedule, not the BI team's." },
      { title: "Grounded judgment", description: "Decisions backed by computed numbers." },
      { title: "Shareable clarity", description: "Reports your team can actually read." },
    ],
    faq: [
      { q: "Do I need to understand statistics?", a: "No — the AI explains what each figure means in context. The caveats are written in plain language too." },
      { q: "What if the data is messy?", a: "That's exactly what the quality scoring is for — you'll know what the data can and cannot support." },
    ],
  },
};

const SLUGS = Object.keys(SOLUTIONS);

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = SOLUTIONS[slug];
  if (!s) return {};
  return pageMeta({
    title: `${s.name} solutions`,
    description: s.description,
    path: `/solutions/${s.slug}`,
  });
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = SOLUTIONS[slug];
  if (!s) notFound();

  return (
    <PageShell>
      <PageHero
        eyebrow={s.eyebrow}
        title={s.title}
        description={s.description}
        actions={
          <>
            <a href="/agent" className="inline-flex h-11 items-center rounded-full bg-copper px-6 text-[15px] font-medium text-white hover:bg-copper-strong">
              Open the workspace
            </a>
            <a href="/contact" className="inline-flex h-11 items-center rounded-full border border-line-strong px-6 text-[15px] font-medium text-ink hover:bg-paper-deep">
              Talk to us
            </a>
          </>
        }
      />

      <nav aria-label="Other solutions" className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-5 py-3 sm:px-8">
          {SLUGS.map((sl) => (
            <Link
              key={sl}
              href={`/solutions/${sl}`}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                sl === slug ? "bg-charcoal text-paper" : "text-ink-mute hover:bg-paper-deep hover:text-ink"
              }`}
            >
              {SOLUTIONS[sl].name}
            </Link>
          ))}
        </div>
      </nav>

      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow="Overview" title={s.intro.title} description={s.intro.description} />
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {s.intro.bullets.map((b, i) => (
              <Reveal key={b} delay={i * 0.05}>
                <li className="flex h-full items-start gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5 text-[14.5px] text-ink-soft">
                  <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-copper" />
                  {b}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto space-y-24 px-5 py-20 sm:max-w-7xl sm:px-8 lg:py-24">
          <Reveal>
            <FeatureRow
              title={s.workflows[0].title}
              description={s.workflows[0].description}
              bullets={s.workflows[0].bullets}
              visual={<SolutionVisual kind={s.visual} name={s.name} />}
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {s.workflows.slice(1).map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06}>
                <div className="h-full rounded-[var(--radius-card)] border border-line bg-paper p-7">
                  <h3 className="text-[17px] font-semibold text-ink">{w.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-mute">{w.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {w.bullets.map((b) => (
                      <span key={b} className="rounded-full border border-line bg-surface px-3 py-1 text-[12px] text-ink-soft">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow="Capabilities" title="Built on the DataLens platform." />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.04}>
                <div className="h-full rounded-[var(--radius-card)] border border-line bg-surface p-6">
                  <h3 className="text-[15.5px] font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-mute">{c.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-charcoal">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading dark eyebrow="Outcomes" title="What teams get back." />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {s.outcomes.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.05}>
                <div className="border-t border-white/15 pt-5">
                  <h3 className="text-[17px] font-semibold text-paper">{o.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-paper/60">{o.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <Reveal>
            <SectionHeading align="center" eyebrow="FAQ" title="Common questions." />
          </Reveal>
          <div className="mt-8">
            {s.faq.map((f) => (
              <Disclosure key={f.q} title={f.q}>
                {f.a}
              </Disclosure>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={`Bring DataLens to your ${s.name.toLowerCase()} work.`}
        description="Open the workspace free — or talk to us about rolling it out across the team."
        primary={{ label: "Open workspace", href: "/agent" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </PageShell>
  );
}

function SolutionVisual({ kind, name }: { kind: string; name: string }) {
  switch (kind) {
    case "chart":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">Conversion by channel — Q3</p>
            <span className="font-mono text-[11px] text-copper-strong">+2.1 pts</span>
          </div>
          <div className="mt-3">
            <AreaChart points={[3.2, 3.4, 3.1, 3.8, 4.2, 4.0, 4.6, 5.3]} height={100} />
          </div>
          <div className="mt-4 space-y-2 border-t border-line pt-3 font-mono text-[11.5px]">
            {[
              ["Search", "5.3% conv"],
              ["Social", "4.1% conv"],
              ["Email", "3.8% conv"],
              ["Display", "2.2% conv"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-ink-soft">{k}</span>
                <span className="text-sage">{v}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "workflow":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <p className="text-[13px] font-medium text-ink">{name} analysis flow</p>
          <div className="mt-3">
            {["File received", "Auto-profiled", "Questions asked", "Findings explained", "Report exported"].map((step, i, arr) => (
              <div key={step} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className={`size-2.5 rounded-full ${i < arr.length - 1 ? "bg-copper" : "bg-sage"}`} />
                  {i < arr.length - 1 && <span className="h-6 w-px bg-line-strong" />}
                </div>
                <p className="pb-1 text-[13px] text-ink-soft">{step}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "agent":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">{name} EDA</p>
            <span className="rounded-full bg-sage-soft px-2.5 py-0.5 font-mono text-[10.5px] text-sage">automatic</span>
          </div>
          <div className="mt-3 space-y-2 font-mono text-[11.5px]">
            {[
              ["input", "operations-export.csv"],
              ["check", "quality score 91/100"],
              ["flags", "3 outliers · 2% missing"],
              ["output", "figures + findings ready"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3 rounded-lg bg-paper px-3 py-2">
                <span className="w-16 shrink-0 text-ink-faint">{k}</span>
                <span className="text-ink-soft">{v}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "report":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <p className="font-mono text-[11px] text-ink-faint">survey-analysis.md</p>
          <div className="mt-3 space-y-2.5">
            {["Executive summary", "Response overview", "Segment comparisons", "Recommended next steps"].map((sec, i) => (
              <div key={sec} className="flex items-center justify-between rounded-lg border border-line px-3.5 py-2.5 text-[13px] text-ink-soft">
                <span>{i + 1}. {sec}</span>
                <span className="font-mono text-[10.5px] text-sage">drafted</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "chat":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="space-y-3">
            {[
              ["You", "Which cohort retained worst last quarter?"],
              ["DataLens", "March cohort: 31% 90-day retention vs 46% average. The gap concentrates in the mobile-only signup segment (58% of March signups). Figures: cohort cross-tab, n=8,412."],
            ].map(([who, msg]) => (
              <div key={who} className={`rounded-xl px-4 py-3 text-[13.5px] leading-relaxed ${who === "You" ? "bg-paper text-ink-soft" : "bg-copper-soft text-ink"}`}>
                <p className="mb-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">{who}</p>
                {msg}
              </div>
            ))}
          </div>
        </div>
      );
    case "routing":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <p className="font-mono text-[11px] text-ink-faint">team workloads</p>
          <div className="mt-3 space-y-2">
            {[
              ["Weekly metric lookups", "Gemini Flash"],
              ["Cohort deep dives", "DeepSeek R1"],
              ["Stakeholder reports", "Claude"],
              ["Data cleaning advice", "Qwen Coder"],
            ].map(([task, model]) => (
              <div key={task} className="flex items-center justify-between rounded-lg border border-line px-3.5 py-2.5">
                <span className="text-[13px] text-ink-soft">{task}</span>
                <span className="rounded-full bg-paper-deep px-2.5 py-0.5 font-mono text-[11px] text-ink">{model}</span>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}
