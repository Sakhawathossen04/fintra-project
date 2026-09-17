import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { PageHero, FeatureRow, CtaBand } from "@/lib/marketing";
import { SectionHeading, Disclosure } from "@/components/ui/Brand";
import { AreaChart } from "@/components/ui/charts";
import { pageMeta } from "@/lib/site";

interface ProductFeature {
  slug:
    | "workspace"
    | "models"
    | "analysis"
    | "reports"
    | "agents"
    | "workflows"
    | "model-routing";
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  // Three narrative rows, each with distinct visual
  rows: {
    title: string;
    description: string;
    bullets: string[];
    visual: "chat" | "models" | "chart" | "report" | "agent" | "workflow" | "routing";
  }[];
  capabilities: { title: string; description: string }[];
  useCases: { title: string; description: string }[];
  faq: { q: string; a: string }[];
}

const FEATURES: Record<string, ProductFeature> = {
  workspace: {
    slug: "workspace",
    eyebrow: "Product · Workspace",
    title: "The workspace where finance work comes together.",
    description:
      "Conversations, files, projects, and history — organized around how finance teams actually operate, with the model of your choice one click away.",
    cta: { label: "Start using the workspace", href: "/signup" },
    rows: [
      {
        title: "Projects keep work separated",
        description:
          "Each close, forecast, or deal lives in its own project with its own files, chats, and outputs. Switching context doesn't mean losing it.",
        bullets: ["Per-project files and history", "Share outputs with teammates", "Pick up any thread where you left it"],
        visual: "chat",
      },
      {
        title: "Files that are ready to analyze",
        description:
          "Upload spreadsheets, statements, and decks. Fintra reads tables and structure — so answers reflect the real numbers, not a paraphrase.",
        bullets: ["Excel, CSV, PDF, and slide support", "Tables preserved, not flattened", "Source-linked citations"],
        visual: "report",
      },
      {
        title: "History you can audit",
        description:
          "Every conversation and output is preserved with its model, sources, and timestamps — so you can always answer 'where did this number come from?'",
        bullets: ["Full conversation history", "Model and source provenance", "Export anything, anytime"],
        visual: "chart",
      },
    ],
    capabilities: [
      { title: "Multi-model chat", description: "Switch models per message or set a default per project." },
      { title: "File library", description: "Keep statements, models, and decks attached to the right work." },
      { title: "Templates", description: "Start reports and analyses from your team's standard formats." },
      { title: "Search across history", description: "Find that analysis from last quarter in seconds." },
    ],
    useCases: [
      { title: "Monthly close", description: "Keep the whole close in one project — analyses, docs, and follow-ups." },
      { title: "Board prep", description: "Build the pack, the exhibits, and the talking points side by side." },
      { title: "Deal review", description: "Analyze a target's filings and model alongside the deal team." },
    ],
    faq: [
      { q: "Is the workspace just a chat interface?", a: "No — chat is the starting point. Projects, files, reports, agents, and workflows build on it, all sharing the same context." },
      { q: "Can I export my work?", a: "Yes. Reports, tables, and conversations can be exported — your work is never locked in." },
    ],
  },
  models: {
    slug: "models",
    eyebrow: "Product · Multi-model AI",
    title: "Every leading model. One subscription.",
    description:
      "GPT, Claude, Gemini, DeepSeek, and Qwen — included in Fintra. Choose the right model per task without juggling five separate tools.",
    cta: { label: "Try the models", href: "/signup" },
    rows: [
      {
        title: "Pick per task, not per tool",
        description:
          "Different models have different strengths — extraction speed, careful reasoning, long-document synthesis. Fintra puts them side by side.",
        bullets: ["Model picker on every conversation", "Compare answers across models", "Defaults per project or per task type"],
        visual: "models",
      },
      {
        title: "Consistent context across models",
        description:
          "Your files, project context, and history carry across models — so switching models never means re-explaining the work.",
        bullets: ["Shared file and project context", "Consistent system guidance", "No copy-paste between tools"],
        visual: "chat",
      },
      {
        title: "Always current",
        description:
          "New models are added as they arrive. Your workspace evolves with the model landscape without changing how you work.",
        bullets: ["New models added continuously", "Clear notes on what changed", "No workflow retraining"],
        visual: "routing",
      },
    ],
    capabilities: [
      { title: "GPT family", description: "Fast, versatile reasoning and high-volume extraction." },
      { title: "Claude family", description: "Careful long-form reasoning and nuanced drafting." },
      { title: "Gemini family", description: "Very long context for filings and document sets." },
      { title: "DeepSeek & Qwen", description: "Strong numeric and analytical performance." },
    ],
    useCases: [
      { title: "Model comparison", description: "Run the same variance question across models and compare answers." },
      { title: "Right tool per task", description: "Extraction on GPT, synthesis on Gemini, drafting on Claude." },
      { title: "Cost awareness", description: "Route routine work to efficient models automatically." },
    ],
    faq: [
      { q: "Do all plans include all models?", a: "Free includes standard models; Pro and Max include premium models across all five families." },
      { q: "Can I bring my own API keys?", a: "Not yet — model access is bundled with your Fintra plan. Enterprise can discuss dedicated capacity." },
    ],
  },
  analysis: {
    slug: "analysis",
    eyebrow: "Product · Financial analysis",
    title: "Answers with real numbers — and the sources to prove it.",
    description:
      "Ask in plain language. Get analysis-grade answers grounded in your documents, with every figure traced to a source you can open.",
    cta: { label: "Start analyzing", href: "/signup" },
    rows: [
      {
        title: "Variance analysis that finds drivers",
        description:
          "Compare actuals vs. budget vs. prior period. Fintra identifies the drivers behind the deltas and drafts the commentary.",
        bullets: ["Price, volume, mix decomposition", "Driver ranking by impact", "Commentary drafted with citations"],
        visual: "chart",
      },
      {
        title: "Ratio and trend analysis",
        description:
          "Margins, working capital, runway, coverage — tracked over time and explained in context, not in a vacuum.",
        bullets: ["Trend and cohort views", "Peer and prior-period comparisons", "Anomaly flags worth your attention"],
        visual: "chart",
      },
      {
        title: "Assumptions made explicit",
        description:
          "When Fintra assumes, it says so. Every analysis states what it assumed, so review is about substance, not detective work.",
        bullets: ["Explicit assumption listing", "One-click sensitivity checks", "Reviewer-friendly output format"],
        visual: "report",
      },
    ],
    capabilities: [
      { title: "Document Q&A", description: "Interrogate statements, filings, and models directly." },
      { title: "Scenario comparison", description: "Side-by-side scenarios with consistent structure." },
      { title: "Numeric consistency checks", description: "Cross-foot totals, catch broken links and stale figures." },
      { title: "Exhibit generation", description: "Clean, presentation-ready tables from raw data." },
    ],
    useCases: [
      { title: "FP&A reviews", description: "Monthly variance packs with drivers, not just deltas." },
      { title: "Audit support", description: "Trace figures and test consistency across documents." },
      { title: "Deal analysis", description: "Quality-of-earnings style checks on target financials." },
    ],
    faq: [
      { q: "Does Fintra invent numbers?", a: "No. Analysis is grounded in the documents you provide, and answers cite their sources. If a figure can't be traced, Fintra says so." },
      { q: "What file types work?", a: "Spreadsheets (Excel, CSV), PDFs, and slide decks — tables and structure are preserved." },
    ],
  },
  reports: {
    slug: "reports",
    eyebrow: "Product · Report builder",
    title: "From analysis to boardroom, in one flow.",
    description:
      "Turn any analysis into reports, decks, and memos — formatted to your team's standard, consistent with your numbers, ready to present.",
    cta: { label: "Build your first report", href: "/signup" },
    rows: [
      {
        title: "Generate from your analysis",
        description:
          "Reports build directly from conversations and analyses — the numbers, sources, and charts carry over. No retyping, no stale figures.",
        bullets: ["One-click report from any thread", "Charts and exhibits generated for you", "Numbers stay consistent end to end"],
        visual: "report",
      },
      {
        title: "Templates your team standardizes on",
        description:
          "Define the monthly pack once. Every period's report follows the same structure — so readers always know where to look.",
        bullets: ["Reusable finance templates", "Consistent structure period over period", "Team-wide template library"],
        visual: "workflow",
      },
      {
        title: "Present with confidence",
        description:
          "Deck-ready output with exhibits that match the analysis. Last-minute board changes stop being a fire drill.",
        bullets: ["Deck and document formats", "Exhibit numbering handled", "Export to PDF or slides"],
        visual: "chart",
      },
    ],
    capabilities: [
      { title: "Board packs", description: "Executive summary, exhibits, and appendices in one pass." },
      { title: "Variance memos", description: "Driver commentary with cited exhibits." },
      { title: "Investment memos", description: "Structured memos from research and models." },
      { title: "Investor updates", description: "Consistent monthly and quarterly formats." },
    ],
    useCases: [
      { title: "Board reporting", description: "The monthly pack, assembled from live analysis." },
      { title: "Management reporting", description: "Department-level reporting without the copy-paste." },
      { title: "Client deliverables", description: "Advisory outputs in your firm's format." },
    ],
    faq: [
      { q: "Can I edit generated reports?", a: "Yes — every report is editable before export. Fintra drafts; you keep editorial control." },
      { q: "Do reports stay updated when numbers change?", a: "You can refresh a report from its source analysis, so updates are deliberate and reviewable." },
    ],
  },
  agents: {
    slug: "agents",
    eyebrow: "Product · Finance agents",
    title: "Recurring finance tasks that run themselves.",
    description:
      "Define the task once — variance memos, forecast refreshes, close checklists — and Fintra's agents run it every period, with output ready for your review.",
    cta: { label: "Set up your first agent", href: "/signup" },
    rows: [
      {
        title: "Agents with defined outputs",
        description:
          "Each agent produces a concrete deliverable: a memo, an updated forecast, an exhibit pack. Not vague summaries — reviewable work product.",
        bullets: ["Variance Agent → memo + exhibits", "Forecast Agent → updated model + assumptions", "Close Agent → checklist + documentation"],
        visual: "agent",
      },
      {
        title: "You stay in control",
        description:
          "Agents draft; you approve. Nothing is sent or published without review, and every run is logged with its inputs and outputs.",
        bullets: ["Draft-then-approve workflow", "Full run history", "One-click refine and rerun"],
        visual: "workflow",
      },
      {
        title: "Consistent period over period",
        description:
          "Because agents follow your definition, December's memo looks like October's — comparability without manual effort.",
        bullets: ["Same structure every period", "Prior-period comparisons built in", "Institutional memory that persists"],
        visual: "report",
      },
    ],
    capabilities: [
      { title: "Variance Agent", description: "Actuals vs. budget vs. prior, with drafted commentary." },
      { title: "Forecast Agent", description: "Rolling forecast refresh with tracked assumptions." },
      { title: "Close Agent", description: "Checklist progression and documentation organization." },
      { title: "Custom agents", description: "Define your own recurring finance deliverable." },
    ],
    useCases: [
      { title: "Monthly reporting", description: "Memo, exhibits, and summary drafted before you're in the office." },
      { title: "Forecast cycles", description: "Refreshes that keep assumptions consistent." },
      { title: "Close support", description: "Documentation organized as the close progresses." },
    ],
    faq: [
      { q: "Do agents act without approval?", a: "No. Agents produce drafts for your review. Outbound actions would always require explicit approval." },
      { q: "How often can agents run?", a: "Free includes 3 agent runs per day; Pro and Max include unlimited runs." },
    ],
  },
  workflows: {
    slug: "workflows",
    eyebrow: "Product · Automated workflows",
    title: "Pipelines for close, forecast, and reporting.",
    description:
      "Chain analyses, reports, and agents into workflows that mirror your finance calendar — and let the routine work run on rails.",
    cta: { label: "Automate your calendar", href: "/signup" },
    rows: [
      {
        title: "Model your finance calendar",
        description:
          "Close on day 3, variance memo on day 4, board pack on day 10. Workflows encode the sequence — and run it on schedule.",
        bullets: ["Scheduled triggers", "Step-by-step pipelines", "Hand-offs between steps"],
        visual: "workflow",
      },
      {
        title: "Reviews at the right moments",
        description:
          "Workflows pause for human review where you want it. Approve, adjust, and continue — automation with judgment.",
        bullets: ["Approval gates", "Reviewer comments", "Alerts when inputs are late"],
        visual: "agent",
      },
      {
        title: "Visibility into every run",
        description:
          "Each run is logged: what ran, when, on what inputs, producing what outputs. Audit-friendly by design.",
        bullets: ["Run history and logs", "Input/output snapshots", "Failed-step alerts and retries"],
        visual: "chart",
      },
    ],
    capabilities: [
      { title: "Close workflow", description: "Checklist, reconciliations, and documentation in sequence." },
      { title: "Forecast workflow", description: "Data refresh, model update, and summary generation." },
      { title: "Board-pack workflow", description: "Exhibits, summary, and deck assembly each period." },
      { title: "Custom workflows", description: "Compose steps from any Fintra capability." },
    ],
    useCases: [
      { title: "Month-end close", description: "A calm close with the routine work automated." },
      { title: "Quarterly board cycle", description: "The pack builds itself from live numbers." },
      { title: "Annual planning", description: "Templates and analyses ready before planning starts." },
    ],
    faq: [
      { q: "Do workflows replace our ERP?", a: "No — Fintra complements your systems. Workflows orchestrate analysis and reporting work, not transaction processing." },
      { q: "What happens if a step fails?", a: "The run pauses, you're alerted, and you can retry or adjust. Nothing continues silently on bad inputs." },
    ],
  },
  "model-routing": {
    slug: "model-routing",
    eyebrow: "Product · Model routing",
    title: "The right model for every task, automatically.",
    description:
      "Fintra routes each task — extraction, reasoning, synthesis, numeric checking — to the model that handles it best. You see the result, and the routing decision.",
    cta: { label: "See routing in action", href: "/signup" },
    rows: [
      {
        title: "Routing by task profile",
        description:
          "Every task has a shape: token count, reasoning depth, latency needs. Fintra profiles it and picks the model accordingly.",
        bullets: ["Long documents → long-context models", "Precision checks → high-accuracy models", "Bulk extraction → fast, efficient models"],
        visual: "routing",
      },
      {
        title: "Transparency, not magic",
        description:
          "Routing decisions are visible: which model ran, and why. Override any time — set a fixed model for a project or task type.",
        bullets: ["Visible model per step", "Manual overrides respected", "Routing notes in run history"],
        visual: "models",
      },
      {
        title: "Cost-aware by default",
        description:
          "Premium models for work that needs them; efficient models for volume work. Quality where it matters, cost control everywhere else.",
        bullets: ["Task-cost estimation", "Efficient defaults for routine work", "Spend visibility for teams"],
        visual: "chart",
      },
    ],
    capabilities: [
      { title: "Automatic routing", description: "Default behavior — no configuration required." },
      { title: "Project-level overrides", description: "Pin a model for specific projects or task types." },
      { title: "Routing transparency", description: "See which model ran and the reasoning." },
      { title: "Cost controls", description: "Efficient routing profiles for high-volume work." },
    ],
    useCases: [
      { title: "Mixed workloads", description: "Extraction, analysis, and drafting in one team." },
      { title: "Cost-sensitive teams", description: "Predictable spend without model micromanagement." },
      { title: "Quality-critical work", description: "Pin your best reasoning model to the work that matters." },
    ],
    faq: [
      { q: "Can I always choose the model myself?", a: "Yes — routing is the default, not a constraint. Pick any model manually whenever you prefer." },
      { q: "Does routing cost extra?", a: "Routing is included. Advanced routing profiles are on Max and Enterprise." },
    ],
  },
};

const SLUGS = Object.keys(FEATURES);

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = FEATURES[slug];
  if (!feature) return {};
  return pageMeta({
    title: feature.title,
    description: feature.description,
    path: `/product/${feature.slug}`,
  });
}

export default async function ProductFeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = FEATURES[slug];
  if (!feature) notFound();

  return (
    <PageShell>
      <PageHero
        eyebrow={feature.eyebrow}
        title={feature.title}
        description={feature.description}
        actions={
          <>
            <a href={feature.cta.href} className="inline-flex h-11 items-center rounded-full bg-copper px-6 text-[15px] font-medium text-white hover:bg-copper-strong">
              {feature.cta.label}
            </a>
            <a href="/contact" className="inline-flex h-11 items-center rounded-full border border-line-strong px-6 text-[15px] font-medium text-ink hover:bg-paper-deep">
              Talk to sales
            </a>
          </>
        }
      />

      {/* Jump links */}
      <nav aria-label="Other product capabilities" className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-5 py-3 sm:px-8">
          {SLUGS.map((s) => (
            <Link
              key={s}
              href={`/product/${s}`}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                s === slug
                  ? "bg-charcoal text-paper"
                  : "text-ink-mute hover:bg-paper-deep hover:text-ink"
              }`}
            >
              {FEATURES[s].eyebrow.split("· ")[1]}
            </Link>
          ))}
        </div>
      </nav>

      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl space-y-24 px-5 py-20 sm:px-8 lg:py-24">
          {feature.rows.map((row, i) => (
            <Reveal key={row.title}>
              <FeatureRow
                flip={i % 2 === 1}
                title={row.title}
                description={row.description}
                bullets={row.bullets}
                visual={<ProductVisual kind={row.visual} />}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow="Capabilities" title="What's inside." />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {feature.capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.04}>
                <div className="h-full rounded-[var(--radius-card)] border border-line bg-paper p-6">
                  <h3 className="text-[16px] font-semibold text-ink">{c.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-mute">{c.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow="Use cases" title="Where this shines." />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {feature.useCases.map((u, i) => (
              <Reveal key={u.title} delay={i * 0.05}>
                <div className="border-t-2 border-copper/30 pt-5">
                  <h3 className="text-[16.5px] font-semibold text-ink">{u.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-mute">{u.description}</p>
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
            {feature.faq.map((f) => (
              <Disclosure key={f.q} title={f.q}>
                {f.a}
              </Disclosure>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={feature.cta.label + " — free to start."}
        description="Set up takes minutes. Upgrade when the work demands it."
        secondary={{ label: "View pricing", href: "/pricing" }}
      />
    </PageShell>
  );
}

/** Visual switcher for product rows — each kind gets an original composition. */
function ProductVisual({ kind }: { kind: string }) {
  switch (kind) {
    case "chat":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="space-y-3">
            {[
              ["You", "What drove the margin change in Q3?"],
              ["Fintra", "COGS per unit rose 4.1% from supplier mix; mid-tier discounting added 60bps of pressure. Sources: Q3 P&L, pricing sheet v3."],
            ].map(([who, msg]) => (
              <div key={who} className={`rounded-xl px-4 py-3 text-[13.5px] leading-relaxed ${who === "You" ? "bg-paper text-ink-soft" : "bg-copper-soft text-ink"}`}>
                <p className="mb-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">{who}</p>
                {msg}
              </div>
            ))}
          </div>
        </div>
      );
    case "models":
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {["GPT", "Claude", "Gemini", "DeepSeek", "Qwen", "+ more"].map((m) => (
            <div key={m} className="grid h-20 place-items-center rounded-[var(--radius-card)] border border-line bg-surface text-[14px] font-medium text-ink">
              {m}
            </div>
          ))}
        </div>
      );
    case "chart":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">Operating margin</p>
            <span className="font-mono text-[11px] text-sage">24.8%</span>
          </div>
          <div className="mt-3">
            <AreaChart points={[19.2, 20.1, 20.8, 21.9, 22.4, 23.5, 24.1, 24.8]} height={110} />
          </div>
        </div>
      );
    case "report":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <p className="font-mono text-[11px] text-ink-faint">Q3-Board-Summary.pdf</p>
          <div className="mt-3 space-y-2.5">
            {["Executive summary", "Revenue & margin exhibits", "Variance commentary", "Outlook & asks"].map((s, i) => (
              <div key={s} className="flex items-center justify-between rounded-lg border border-line px-3.5 py-2.5 text-[13px] text-ink-soft">
                <span>{i + 1}. {s}</span>
                <span className="font-mono text-[10.5px] text-sage">ready</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "agent":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">Variance Agent</p>
            <span className="rounded-full bg-sage-soft px-2.5 py-0.5 font-mono text-[10.5px] text-sage">monthly</span>
          </div>
          <div className="mt-3 space-y-2 font-mono text-[11.5px]">
            {[
              ["input", "Q3 actuals, budget, prior period"],
              ["step 1", "decompose variance by driver"],
              ["step 2", "draft commentary + exhibits"],
              ["output", "variance memo · ready for review"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3 rounded-lg bg-paper px-3 py-2">
                <span className="w-14 shrink-0 text-ink-faint">{k}</span>
                <span className="text-ink-soft">{v}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "workflow":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <p className="text-[13px] font-medium text-ink">Close workflow</p>
          <div className="mt-3 space-y-0">
            {["Data refresh", "Reconciliation checks", "Variance analysis", "Report draft", "Your review"].map((step, i, arr) => (
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
    case "routing":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <p className="font-mono text-[11px] text-ink-faint">routing decisions</p>
          <div className="mt-3 space-y-2">
            {[
              ["Invoice extraction ×400", "GPT"],
              ["Filings synthesis", "Gemini"],
              ["Variance commentary", "Claude"],
              ["Numeric checks", "Qwen"],
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
