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
  fpa: {
    slug: "fpa",
    name: "FP&A",
    eyebrow: "Solutions · FP&A",
    title: "Budgets, forecasts, and variance work — dramatically faster.",
    description:
      "Fintra supports the FP&A cycle end to end: budgeting, forecasting, variance analysis, and management reporting, with AI that works from your actual numbers.",
    intro: {
      title: "The FP&A cycle, with AI in every step",
      description:
        "Monthly close feeds forecast, forecast feeds variance, variance feeds the board. Fintra plugs into that cycle — grounded in your files and consistent period over period.",
      bullets: [
        "Budgeting: draft department budgets from historicals and assumptions",
        "Forecasting: rolling updates with tracked assumption changes",
        "Variance analysis: driver decomposition with drafted commentary",
        "Management reporting: consistent packs your readers recognize",
      ],
    },
    workflows: [
      {
        title: "Monthly variance pack",
        description: "Actuals land, Fintra decomposes the deltas, drafts commentary, and assembles exhibits — before the review meeting.",
        bullets: ["Driver ranking", "Draft memo", "Exhibit tables"],
      },
      {
        title: "Rolling forecast refresh",
        description: "Update the forecast with latest actuals, track what changed in assumptions, and summarize the movement.",
        bullets: ["Assumption tracking", "Movement summary", "Updated outputs"],
      },
      {
        title: "Scenario modeling",
        description: "Side-by-side scenarios with consistent structure — base, upside, downside — and sensitivity on the drivers that matter.",
        bullets: ["Structured scenarios", "Sensitivity tables", "Comparable outputs"],
      },
    ],
    capabilities: [
      { title: "Budget drafting", description: "Department budgets drafted from historicals and your guidance." },
      { title: "Driver analysis", description: "Price/volume/mix decomposition with impact ranking." },
      { title: "Forecast maintenance", description: "Rolling refreshes with visible assumption changes." },
      { title: "Management packs", description: "Consistent monthly reporting from live analysis." },
    ],
    visual: "chart",
    outcomes: [
      { title: "Days → hours", description: "Variance commentary drafted before the review, not the night before." },
      { title: "Comparable periods", description: "December looks like October — structure holds without manual effort." },
      { title: "Defensible numbers", description: "Every figure traces to a source document." },
    ],
    faq: [
      { q: "Does this replace our planning tool?", a: "No — Fintra complements it. Planning systems of record stay; Fintra accelerates the analysis and reporting around them." },
      { q: "How does Fintra get our data?", a: "Files you already have: actuals exports, budget spreadsheets, prior packs. Bring them into a project and work from there." },
    ],
  },
  accounting: {
    slug: "accounting",
    name: "Accounting",
    eyebrow: "Solutions · Accounting",
    title: "A calmer close, with documentation that holds up.",
    description:
      "Financial statement analysis, close workflows, reconciliation assistance, and document review — with consistency checks that catch what tired eyes miss.",
    intro: {
      title: "Close support that compounds",
      description:
        "Every close generates documentation, reconciliations, and questions. Fintra keeps them organized, checks consistency across periods, and drafts the research memos.",
      bullets: [
        "Statement analysis: trends, ratios, and anomalies across periods",
        "Close workflows: checklist progression and documentation in one place",
        "Reconciliation assistance: trace items, summarize reconciling differences",
        "Accounting research: draft memos with sources you can verify",
      ],
    },
    workflows: [
      {
        title: "Close checklist",
        description: "The close as a pipeline — steps sequenced, documentation attached, open items visible.",
        bullets: ["Sequenced steps", "Attached docs", "Open-item list"],
      },
      {
        title: "Reconciliation review",
        description: "Fintra reads reconciliations, traces items, and summarizes what needs attention — with references back to source.",
        bullets: ["Item tracing", "Difference summaries", "Source references"],
      },
      {
        title: "Research memos",
        description: "Draft accounting memos with structure and citations, ready for reviewer pass.",
        bullets: ["Standard structure", "Cited sources", "Reviewer-ready drafts"],
      },
    ],
    capabilities: [
      { title: "Statement analysis", description: "Period-over-period analysis with anomaly flags." },
      { title: "Document review", description: "Contracts, schedules, and support read and summarized." },
      { title: "Consistency checks", description: "Cross-foot totals and cross-document agreement." },
      { title: "Research drafting", description: "Memos with standard structure and citations." },
    ],
    visual: "workflow",
    outcomes: [
      { title: "Fewer surprises", description: "Consistency checks catch issues during the close, not after." },
      { title: "Documented close", description: "Support organized as you go, not reconstructed later." },
      { title: "Faster reviews", description: "Drafts arrive structured; reviewers focus on substance." },
    ],
    faq: [
      { q: "Is Fintra our system of record?", a: "No. Your ledger and close tools stay authoritative. Fintra works alongside them for analysis, documentation, and review." },
      { q: "Can it check our workpapers?", a: "Yes — upload them to a project and Fintra can trace figures and flag inconsistencies across documents." },
    ],
  },
  audit: {
    slug: "audit",
    name: "Audit",
    eyebrow: "Solutions · Audit",
    title: "Document review and evidence work, accelerated.",
    description:
      "Review populations faster, organize evidence as you go, and keep working papers consistent — with every AI observation traceable to its source.",
    intro: {
      title: "AI assistance that respects the audit trail",
      description:
        "Audit work lives or dies on traceability. Fintra is built to cite everything: every summary, every flag, every drafted observation points back to the document it came from.",
      bullets: [
        "Document review: summarize and extract from large populations",
        "Anomaly investigation: flags with the context to assess them",
        "Evidence organization: requests, responses, and follow-ups in one thread",
        "Working-paper assistance: consistent structure across the file",
      ],
    },
    workflows: [
      {
        title: "Population review",
        description: "Upload a population; Fintra summarizes documents, extracts key terms, and flags outliers for your judgment.",
        bullets: ["Document summaries", "Term extraction", "Outlier flags"],
      },
      {
        title: "Evidence organization",
        description: "Requests, received items, and follow-ups organized per account — with gaps visible.",
        bullets: ["Request tracking", "Gap visibility", "Follow-up drafts"],
      },
      {
        title: "Consistency checks",
        description: "Cross-document checks: do the numbers in the deck match the statements and the working papers?",
        bullets: ["Cross-document figures", "Discrepancy lists", "Tick-mark support"],
      },
    ],
    capabilities: [
      { title: "Document summarization", description: "Long documents condensed with section citations." },
      { title: "Anomaly flags", description: "Statistical and contextual outliers, surfaced with context." },
      { title: "Working-paper structure", description: "Consistent section formats across the file." },
      { title: "Observation drafting", description: "Draft findings with referenced evidence." },
    ],
    visual: "agent",
    outcomes: [
      { title: "More coverage, same hours", description: "Review more of the population, spend judgment where it counts." },
      { title: "Cleaner files", description: "Consistent working-paper structure across the engagement." },
      { title: "Traceable AI", description: "Every AI output cites its source — reviewable like any other work." },
    ],
    faq: [
      { q: "Does AI output go into the file directly?", a: "No. Fintra produces drafts for your review. What enters the working papers is what you approve." },
      { q: "How is client confidentiality handled?", a: "Workspace content stays in your workspace, is not used for model training, and access is session-scoped. See Security for details." },
    ],
  },
  cfo: {
    slug: "cfo",
    name: "CFO teams",
    eyebrow: "Solutions · CFO",
    title: "Board-ready reporting and decision support.",
    description:
      "Executive summaries, board packs, scenario analysis, and performance views — assembled from live numbers, consistent every period.",
    intro: {
      title: "The executive layer, without the fire drill",
      description:
        "CFO work is synthesis: what happened, why, what it means, what we recommend. Fintra assembles that layer from the team's analysis — so the story and the numbers always agree.",
      bullets: [
        "Board reporting: packs assembled from live analysis and exhibits",
        "Executive summaries: the period's story, drafted and sourced",
        "Scenario analysis: decision framing with consistent structure",
        "Performance views: the metrics that matter, tracked over time",
      ],
    },
    workflows: [
      {
        title: "Board pack assembly",
        description: "Exhibits, commentary, and summary assembled from the team's period work — reviewed by you before it ships.",
        bullets: ["Executive summary", "Exhibit set", "Talking points"],
      },
      {
        title: "Decision memos",
        description: "Frame a decision with scenarios, sensitivities, and a recommendation — structured for an executive read.",
        bullets: ["Scenario framing", "Sensitivity view", "Drafted recommendation"],
      },
      {
        title: "Performance reviews",
        description: "The month's numbers in executive language: what moved, why, and what the team is doing about it.",
        bullets: ["Movement summary", "Driver attribution", "Action tracking"],
      },
    ],
    capabilities: [
      { title: "Board pack generation", description: "Consistent structure period over period." },
      { title: "Executive drafting", description: "Summaries in plain, decision-ready language." },
      { title: "Scenario framing", description: "Options structured for comparison." },
      { title: "KPI tracking", description: "Metrics and movements across periods." },
    ],
    visual: "report",
    outcomes: [
      { title: "Numbers and story agree", description: "The pack is generated from the analysis — no reconciliation fire drills." },
      { title: "Board prep in hours", description: "Assembly automated; your time goes to judgment and messaging." },
      { title: "Institutional memory", description: "Prior periods' framing and metrics are always comparable." },
    ],
    faq: [
      { q: "Can Fintra match our board format?", a: "Yes — templates define structure once, and every period's pack follows it. Changes are versioned." },
      { q: "Who reviews before sending?", a: "You do. Everything is draft-then-approve; nothing ships without your sign-off." },
    ],
  },
  investment: {
    slug: "investment",
    name: "Investment analysis",
    eyebrow: "Solutions · Investment",
    title: "Research and memos, grounded in the filings.",
    description:
      "Company analysis, financial modeling assistance, and investment memos — with document synthesis that keeps every claim traceable to a source.",
    intro: {
      title: "From filings to thesis, faster",
      description:
        "Investment work is reading, modeling, and synthesizing under time pressure. Fintra compresses the reading, checks the model's consistency, and drafts the memo.",
      bullets: [
        "Company analysis: filings, transcripts, and presentations synthesized",
        "Financial modeling assistance: structure checks and scenario math",
        "Investment memos: structured drafts with cited evidence",
        "Document synthesis: the source set stays connected to the thesis",
      ],
    },
    workflows: [
      {
        title: "Company deep dive",
        description: "The full filing set synthesized: segments, margins, capital structure, risks — with citations.",
        bullets: ["Filing synthesis", "Metric extraction", "Cited summaries"],
      },
      {
        title: "Model consistency checks",
        description: "Does the model foot? Do assumptions match the memo? Fintra checks and lists discrepancies.",
        bullets: ["Cross-foot checks", "Assumption audit", "Discrepancy list"],
      },
      {
        title: "Memo drafting",
        description: "Thesis, evidence, valuation summary, and risks in your standard memo structure.",
        bullets: ["Standard structure", "Evidence links", "IC-ready drafts"],
      },
    ],
    capabilities: [
      { title: "Filing synthesis", description: "10-Ks, 10-Qs, and decks read with citations." },
      { title: "Extraction", description: "Segments, KPIs, and financials pulled into tables." },
      { title: "Model checking", description: "Structural and assumption consistency tests." },
      { title: "Memo generation", description: "Standard-format memos from your analysis." },
    ],
    visual: "chat",
    outcomes: [
      { title: "More source coverage", description: "The whole filing set gets read, not just the highlights." },
      { title: "Thesis-to-evidence links", description: "Every claim traces to a document and page." },
      { title: "Faster first drafts", description: "Memos start structured, not blank." },
    ],
    faq: [
      { q: "Does Fintra pick investments?", a: "No. Fintra accelerates research and drafting. Judgment, decisions, and recommendations remain yours." },
      { q: "Can it work with our model template?", a: "Yes — upload the template and Fintra works within its structure, checking consistency against it." },
    ],
  },
  advisory: {
    slug: "advisory",
    name: "Financial advisory",
    eyebrow: "Solutions · Advisory",
    title: "Client work that scales without diluting quality.",
    description:
      "Client research, financial analysis, and deliverables — reports and presentations prepared in your firm's formats, consistent across every engagement.",
    intro: {
      title: "More clients, same standard",
      description:
        "Advisory economics improve when senior time goes to judgment instead of assembly. Fintra drafts the research, the analysis, and the deliverable — you keep the client relationship and the final call.",
      bullets: [
        "Client research: industry, peers, and market context synthesized",
        "Financial analysis: client data analyzed with consistent methods",
        "Deliverables: reports and presentations in firm templates",
        "Preparation: meeting briefs and supporting exhibits assembled",
      ],
    },
    workflows: [
      {
        title: "Engagement kickoff",
        description: "Industry and peer context synthesized, engagement plan drafted, data requests organized.",
        bullets: ["Context brief", "Plan draft", "Request lists"],
      },
      {
        title: "Analysis sprints",
        description: "Client financials analyzed against the standard playbook — comparable across engagements.",
        bullets: ["Standard analyses", "Consistent methods", "Reusable structure"],
      },
      {
        title: "Deliverable assembly",
        description: "Reports and decks assembled in firm templates, with exhibits generated from live analysis.",
        bullets: ["Firm templates", "Generated exhibits", "Review-ready drafts"],
      },
    ],
    capabilities: [
      { title: "Research synthesis", description: "Markets and peers summarized with citations." },
      { title: "Client analysis", description: "Financials analyzed with repeatable methods." },
      { title: "Deliverable templates", description: "Firm-standard reports and decks." },
      { title: "Meeting prep", description: "Briefs and exhibits assembled per meeting." },
    ],
    visual: "routing",
    outcomes: [
      { title: "Leverage", description: "Associates produce senior-review-ready drafts." },
      { title: "Consistency", description: "Every engagement follows the firm's playbook." },
      { title: "Firmer margins", description: "Assembly time drops; judgment time holds." },
    ],
    faq: [
      { q: "Can Fintra use our firm templates?", a: "Yes — templates capture your formats once and apply them across engagements." },
      { q: "How do we keep client data separated?", a: "Each engagement lives in its own project with its own files and history. Access is session-scoped to your account." },
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
            <a href="/signup" className="inline-flex h-11 items-center rounded-full bg-copper px-6 text-[15px] font-medium text-white hover:bg-copper-strong">
              Start using Fintra
            </a>
            <a href="/contact" className="inline-flex h-11 items-center rounded-full border border-line-strong px-6 text-[15px] font-medium text-ink hover:bg-paper-deep">
              Talk to sales
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
            <SectionHeading eyebrow="Capabilities" title="Built on the Fintra platform." />
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
        title={`Bring Fintra to your ${s.name.toLowerCase()} work.`}
        description="Start free, or talk to us about rolling Fintra out across the team."
        secondary={{ label: "Contact sales", href: "/contact" }}
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
            <p className="text-[13px] font-medium text-ink">Variance decomposition — Q3</p>
            <span className="font-mono text-[11px] text-copper-strong">−180 bps</span>
          </div>
          <div className="mt-3">
            <AreaChart points={[24.8, 24.1, 23.9, 24.4, 23.6, 23.2, 23.0]} height={100} />
          </div>
          <div className="mt-4 space-y-2 border-t border-line pt-3 font-mono text-[11.5px]">
            {[
              ["COGS mix", "−120 bps"],
              ["Discounting", "−60 bps"],
              ["Volume", "+40 bps"],
              ["FX", "−40 bps"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-ink-soft">{k}</span>
                <span className={v.startsWith("+") ? "text-sage" : "text-copper-strong"}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "workflow":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <p className="text-[13px] font-medium text-ink">{name} pipeline</p>
          <div className="mt-3">
            {["Inputs received", "AI analysis", "Draft outputs", "Your review", "Final deliverable"].map((step, i, arr) => (
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
            <p className="text-[13px] font-medium text-ink">{name} Agent</p>
            <span className="rounded-full bg-sage-soft px-2.5 py-0.5 font-mono text-[10.5px] text-sage">scheduled</span>
          </div>
          <div className="mt-3 space-y-2 font-mono text-[11.5px]">
            {[
              ["input", "period files + prior outputs"],
              ["process", "analyze, cross-check, draft"],
              ["output", "reviewable draft + sources"],
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
          <p className="font-mono text-[11px] text-ink-faint">Board-Pack-Q3.pdf</p>
          <div className="mt-3 space-y-2.5">
            {["Executive summary", "Financial exhibits", "Variance commentary", "Outlook"].map((sec, i) => (
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
              ["You", "Summarize the target's segment margins from the 10-K."],
              ["Fintra", "Three segments: A (34.2%, +120bps YoY), B (21.8%, −80bps, pricing pressure), C (12.4%, stable). Sources: 10-K Item 7, pp. 34–41."],
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
          <p className="font-mono text-[11px] text-ink-faint">engagement workloads</p>
          <div className="mt-3 space-y-2">
            {[
              ["Market research synthesis", "Gemini"],
              ["Client data analysis", "GPT"],
              ["Deliverable drafting", "Claude"],
              ["Number checks", "Qwen"],
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
