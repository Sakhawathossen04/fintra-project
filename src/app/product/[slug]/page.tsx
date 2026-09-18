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
    | "eda"
    | "charts"
    | "chat"
    | "reports"
    | "models"
    | "model-routing";
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
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
    title: "The workspace where data analysis comes together.",
    description:
      "Chat, datasets, figures, and history — organized around how analysis actually happens, with no login required and the model of your choice one click away.",
    cta: { label: "Open the workspace", href: "/agent" },
    rows: [
      {
        title: "Threads keep analyses separated",
        description:
          "Each dataset, question, and deliverable lives in its own thread with its own files and figures. Switching context doesn't mean losing it.",
        bullets: ["Per-thread datasets and history", "Everything saved automatically", "Pick up any thread where you left it"],
        visual: "chat",
      },
      {
        title: "Files that are ready to analyze",
        description:
          "Drop a CSV, TSV, or JSON file and DataLens reads the structure — delimiters, types, missing values — so answers reflect the real numbers.",
        bullets: ["CSV, TSV, and JSON support", "Types inferred automatically", "Drag-and-drop or paste raw data"],
        visual: "report",
      },
      {
        title: "History you can audit",
        description:
          "Every conversation and figure is preserved with its model and timestamp — so you can always answer 'where did this number come from?'",
        bullets: ["Full thread history", "Model provenance per answer", "Export anything, anytime"],
        visual: "chart",
      },
    ],
    capabilities: [
      { title: "Multi-model chat", description: "Switch models per message or let the smart router decide." },
      { title: "Dataset library", description: "Keep every uploaded file attached to the right thread." },
      { title: "Quick / Deep modes", description: "Fast answers for lookups; comprehensive EDA for the real work." },
      { title: "Search across history", description: "Find last week's analysis in seconds." },
    ],
    useCases: [
      { title: "One-off questions", description: "Open the workspace, drop a file, ask — no setup." },
      { title: "Ongoing projects", description: "Keep a dataset and its full analysis history in one thread." },
      { title: "Team handoffs", description: "Export the analysis and report so anyone can pick it up." },
    ],
    faq: [
      { q: "Is the workspace just a chat interface?", a: "No — chat is the starting point. The Analysis tab renders the full EDA, Reports turns it into deliverables, and History keeps everything findable." },
      { q: "Do I need an account?", a: "No. The workspace is open. Threads are kept private to your browser — sign in on the marketing site only if you want billing and settings." },
    ],
  },
  eda: {
    slug: "eda",
    eyebrow: "Product · Automatic EDA",
    title: "A complete exploratory analysis, on arrival.",
    description:
      "The moment a file lands, the EDA engine profiles every column: statistics, distributions, missing values, duplicates, outliers, and quality scores — computed, not hallucinated.",
    cta: { label: "Run your first EDA", href: "/agent" },
    rows: [
      {
        title: "Every column, profiled",
        description:
          "Numeric columns get mean, median, σ, quartiles, skew, kurtosis, and IQR outliers. Categoricals get frequencies and concentration. Dates get ranges and periods.",
        bullets: ["Full numeric summaries", "Frequency tables with shares", "Mode, skew, and kurtosis included"],
        visual: "chart",
      },
      {
        title: "Quality scored, issues surfaced",
        description:
          "A 0-100 quality score combines completeness and uniqueness. Missing cells, duplicate rows, and constant columns are flagged with concrete fixes.",
        bullets: ["Missing values per column", "Duplicate row detection", "Constant-column warnings"],
        visual: "report",
      },
      {
        title: "Findings, written down",
        description:
          "The engine writes what it found — heavy skew, outlier clusters, single-value columns — so the AI narrates real patterns instead of generic filler.",
        bullets: ["Skew and outlier alerts", "Segment gaps quantified", "Every claim traced to a stat"],
        visual: "agent",
      },
    ],
    capabilities: [
      { title: "Type inference", description: "Numbers, dates, booleans, and categories detected from messy values — currency, commas, parentheses handled." },
      { title: "IQR outlier detection", description: "Tukey fences with z-scores, flagged for review." },
      { title: "Quality score", description: "One number for completeness and uniqueness, with the math shown." },
      { title: "JSON & CSV native", description: "Row- and column-oriented JSON both work, with lenient parsing." },
    ],
    useCases: [
      { title: "New dataset triage", description: "Know what you're dealing with before any modeling." },
      { title: "Data quality audits", description: "Quantify missingness and duplicates for stakeholders." },
      { title: "Reproducible profiling", description: "Re-run the EDA after every data refresh." },
    ],
    faq: [
      { q: "Does the EDA use the AI model?", a: "No. Parsing and statistics are deterministic TypeScript — same file, same numbers, every time. The AI's job is explaining those numbers." },
      { q: "How large can my file be?", a: "Up to 6 MB on the free tier — comfortably tens of thousands of rows. Pro raises the ceiling." },
    ],
  },
  charts: {
    slug: "charts",
    eyebrow: "Product · Charts & figures",
    title: "Every pattern, drawn automatically.",
    description:
      "Distributions, trend lines, scatter fits, box plots, heatmaps, and composition charts — generated from your data without a single plotting library call.",
    cta: { label: "See it on your data", href: "/agent" },
    rows: [
      {
        title: "Figures picked for the data",
        description:
          "Numeric columns get histograms and box plots; categoricals get composition charts; paired numerics get scatter fits; dates get trend lines with regression overlays.",
        bullets: ["Histograms with outlier context", "Regression lines with R²", "Row-normalized heatmaps"],
        visual: "chart",
      },
      {
        title: "Rendered crisp, exported clean",
        description:
          "Figures are vector-sharp inline SVG — readable at any size, printable in reports, and exportable alongside the analysis JSON.",
        bullets: ["SVG — sharp at any scale", "Consistent, theme-matched styling", "Export with the full analysis"],
        visual: "report",
      },
      {
        title: "Correlation at a glance",
        description:
          "The correlation matrix colors every pairwise relationship, and the strongest pairs are pulled out as scatter plots with fitted trend lines.",
        bullets: ["Full pairwise matrix", "Top pairs highlighted", "Pearson r and R² labeled"],
        visual: "chart",
      },
    ],
    capabilities: [
      { title: "Distributions", description: "Histograms sized to the data with skew and outlier annotations." },
      { title: "Trends", description: "Time series with linear-regression overlay when a date column exists." },
      { title: "Segments", description: "Group means by category — the gaps made visible." },
      { title: "Compositions", description: "Donut charts and ranked bars for categorical mix." },
    ],
    useCases: [
      { title: "Stakeholder decks", description: "Figures clean enough to paste straight into slides." },
      { title: "Pattern discovery", description: "See relationships you didn't know to ask about." },
      { title: "Teaching & reviews", description: "Standard EDA visuals every analyst recognizes." },
    ],
    faq: [
      { q: "Can I customize the figures?", a: "Figures are chosen automatically to cover the standard EDA canon. Customize downstream by exporting the analysis JSON and data." },
      { q: "Do figures update when I add data?", a: "Re-run the analysis on the updated file and every figure regenerates from the new numbers." },
    ],
  },
  chat: {
    slug: "chat",
    eyebrow: "Product · Chat with data",
    title: "Ask anything. Get answers with real numbers.",
    description:
      "Questions in plain language, answers grounded in the verified statistics of your dataset — with the AI unable to invent figures that contradict your file.",
    cta: { label: "Ask your first question", href: "/agent" },
    rows: [
      {
        title: "Grounded in your file",
        description:
          "Your dataset's full statistics ride along with every question. The model explains, compares, and interprets — always citing the computed numbers.",
        bullets: ["Verified stats in every answer", "No invented figures", "Follow-ups keep full context"],
        visual: "chat",
      },
      {
        title: "Quick or Deep — your call",
        description:
          "The Quick mode gives you the key findings in under 250 words. Deep mode runs a comprehensive EDA narrative with segments, caveats, and next steps.",
        bullets: ["One-click mode toggle", "Deep runs full EDA narration", "Router picks the right model either way"],
        visual: "routing",
      },
      {
        title: "Save the good ones",
        description:
          "Any answer can be copied, exported with the transcript, or turned into part of a report — analysis that survives the conversation.",
        bullets: ["Copy any answer", "Export full transcripts", "Answers feed the report builder"],
        visual: "report",
      },
    ],
    capabilities: [
      { title: "Dataset-aware answers", description: "Statistics injected as ground truth for the model." },
      { title: "Streaming responses", description: "Watch the analysis build in real time." },
      { title: "Multi-turn context", description: "Follow-up questions remember the thread." },
      { title: "Fallback reliability", description: "If a model fails, the router tries the next automatically." },
    ],
    useCases: [
      { title: "\"What's driving this?\"", description: "Segment comparisons and correlations, explained." },
      { title: "\"Is this data clean?\"", description: "Quality findings summarized with fixes." },
      { title: "\"Write this up\"", description: "Narratives that flow into the report builder." },
    ],
    faq: [
      { q: "Can the model hallucinate statistics?", a: "The prompt constrains the model to the verified statistics; it explains rather than computes. Figures shown are always engine-computed." },
      { q: "What if I don't have a dataset?", a: "Chat still works for methodology questions — and the AI will prompt you to attach a file when numbers are needed." },
    ],
  },
  reports: {
    slug: "reports",
    eyebrow: "Product · Report builder",
    title: "From analysis to deliverable, in one click.",
    description:
      "Turn any analysis into a structured report — executive summary, findings, relationships, caveats, next steps — and export it as Markdown.",
    cta: { label: "Generate a report", href: "/agent" },
    rows: [
      {
        title: "Sections you control",
        description:
          "Toggle the sections you need — executive summary, data overview, quality, key findings, relationships, risks, next steps — and generate.",
        bullets: ["Pick your sections", "Consistent structure every time", "Numbers stay consistent with the EDA"],
        visual: "report",
      },
      {
        title: "Synthesized from verified stats",
        description:
          "Reports are written from the engine's statistics — the same figures shown in Analysis — so the narrative and the evidence never diverge.",
        bullets: ["Generated from computed stats", "No invented numbers", "Deterministic fallback without AI"],
        visual: "workflow",
      },
      {
        title: "Export anywhere",
        description:
          "Download the report as Markdown, the statistics as CSV, the analysis as JSON — ready for docs, wikis, or whatever your team reads.",
        bullets: [".md reports", ".csv summary stats", ".json full analysis"],
        visual: "chart",
      },
    ],
    capabilities: [
      { title: "Section picker", description: "Choose exactly the sections your deliverable needs." },
      { title: "Markdown output", description: "Clean GitHub-flavored markdown, ready to paste." },
      { title: "Saved library", description: "Reports persist with the thread for later export." },
      { title: "AI or deterministic", description: "With an API key the LLM writes; without it, the engine still produces a full report." },
    ],
    useCases: [
      { title: "Weekly reporting", description: "Fresh data in, consistent report out." },
      { title: "Stakeholder updates", description: "Executive summary plus evidence, every time." },
      { title: "Documentation", description: "Attach the analysis record to your project docs." },
    ],
    faq: [
      { q: "Can I edit generated reports?", a: "Yes — reports are Markdown. Download and edit anywhere, or regenerate with different sections." },
      { q: "Does a report need an API key?", a: "No. Without a key, the deterministic engine writes the report from verified stats. With a key, the LLM adds narrative depth." },
    ],
  },
  models: {
    slug: "models",
    eyebrow: "Product · Multi-model AI",
    title: "Every leading model. One workspace.",
    description:
      "DeepSeek, Llama, Gemini, Qwen, GPT, and Claude — via OpenRouter. Free models included by default; pick per task or let the router decide.",
    cta: { label: "Try the models", href: "/agent" },
    rows: [
      {
        title: "Free by default",
        description:
          "A curated set of capable free models — DeepSeek V3.1, Llama 3.3, Gemini Flash, Qwen, Mistral — handles most analysis work at zero cost.",
        bullets: ["10+ free models", "No key needed for EDA figures", "Free tier is genuinely useful"],
        visual: "models",
      },
      {
        title: "Frontier when it matters",
        description:
          "Add an OpenRouter key to unlock GPT-4o, Claude, Gemini Pro, and reasoning models — same workspace, same grounding, stronger narration.",
        bullets: ["Bring your own key", "Paid models clearly labeled", "Key stays server-side"],
        visual: "chat",
      },
      {
        title: "Consistent context across models",
        description:
          "Your dataset stats, thread history, and mode carry across models — switching never means re-explaining the work.",
        bullets: ["Shared dataset grounding", "Full thread history travels", "No copy-paste between tools"],
        visual: "routing",
      },
    ],
    capabilities: [
      { title: "Reasoning models", description: "DeepSeek R1 and o3-mini for multi-step statistical thinking." },
      { title: "Fast models", description: "Gemini Flash and Mistral for quick lookups." },
      { title: "Long context", description: "Up to 1M-token windows for wide datasets." },
      { title: "Code models", description: "Qwen Coder for pandas and SQL translations." },
    ],
    useCases: [
      { title: "Cost-conscious teams", description: "Free models for volume, frontier for finals." },
      { title: "Model comparison", description: "Ask the same question across models." },
      { title: "Right tool per task", description: "Speed for lookups, reasoning for analysis." },
    ],
    faq: [
      { q: "Do I need an OpenRouter key?", a: "Not for the EDA engine, figures, or deterministic reports. A key adds AI narration; free models work with a free OpenRouter key." },
      { q: "Where does my key live?", a: "Server-side only — set OPENROUTER_API_KEY in your environment and it never reaches the browser." },
    ],
  },
  "model-routing": {
    slug: "model-routing",
    eyebrow: "Product · Smart routing",
    title: "The right model for every question, automatically.",
    description:
      "Auto mode profiles each question — length, complexity, dataset presence — and routes to the best model, with automatic failover when a model is busy.",
    cta: { label: "See routing in action", href: "/agent" },
    rows: [
      {
        title: "Routing by task shape",
        description:
          "Short factual queries go to fast models. Words like 'explain', 'correlate', or 'forecast' — or Deep mode — escalate to reasoning models.",
        bullets: ["Complexity heuristics", "Effort mode respected", "Dataset-aware escalation"],
        visual: "routing",
      },
      {
        title: "Failover built in",
        description:
          "Rate limits, credit errors, and outages trigger automatic retry on the next model in the chain — your analysis doesn't stall because one endpoint hiccuped.",
        bullets: ["Ordered fallback chain", "429/402/5xx handled", "Auth errors surfaced clearly"],
        visual: "workflow",
      },
      {
        title: "Transparent decisions",
        description:
          "You see which model answered and what the chain was — routing is a tool, not a black box.",
        bullets: ["Model shown per answer", "Chain visible in the picker", "Manual pinning respected"],
        visual: "models",
      },
    ],
    capabilities: [
      { title: "Auto (Smart Router)", description: "The default — no configuration needed." },
      { title: "Free Models Router", description: "Load-balances across available free models." },
      { title: "Manual override", description: "Pin any model for the thread when you prefer." },
      { title: "Cost awareness", description: "Free-first routing keeps token spend near zero." },
    ],
    useCases: [
      { title: "Mixed workloads", description: "Lookups and deep dives in one thread." },
      { title: "High reliability", description: "Analysis that survives provider hiccups." },
      { title: "Zero-budget projects", description: "Free routing with frontier fallback optional." },
    ],
    faq: [
      { q: "Can I always choose the model myself?", a: "Yes — Auto is the default, not a constraint. Pick any model from the catalog and it's used directly." },
      { q: "Does routing cost extra?", a: "No. Routing is built in. Model costs follow your OpenRouter plan — free models cost nothing." },
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
              Talk to us
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
        title="Open the workspace — it's free."
        description="No signup. Upload a dataset and read the analysis in minutes."
        primary={{ label: "Open workspace", href: "/agent" }}
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
              ["You", "Which segment has the highest average order value?"],
              ["DataLens", "South: $96.40 avg — 22% above North ($79.10). Driven by Widget B mix (61% of South volume). Figures: group means by region, n=12,480."],
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
          {["DeepSeek", "Llama", "Gemini", "Qwen", "GPT", "Claude"].map((m) => (
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
            <p className="text-[13px] font-medium text-ink">revenue distribution</p>
            <span className="font-mono text-[11px] text-sage">σ 214.6</span>
          </div>
          <div className="mt-3">
            <AreaChart points={[8, 14, 22, 34, 41, 38, 30, 24, 16, 11, 7, 4]} height={110} />
          </div>
        </div>
      );
    case "report":
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <p className="font-mono text-[11px] text-ink-faint">analysis-report.md</p>
          <div className="mt-3 space-y-2.5">
            {["Executive summary", "Data overview", "Key findings", "Next steps"].map((s, i) => (
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
            <p className="text-[13px] font-medium text-ink">EDA engine</p>
            <span className="rounded-full bg-sage-soft px-2.5 py-0.5 font-mono text-[10.5px] text-sage">automatic</span>
          </div>
          <div className="mt-3 space-y-2 font-mono text-[11.5px]">
            {[
              ["input", "sales-2024.csv · 12,480 rows"],
              ["step 1", "type inference + parse"],
              ["step 2", "stats, outliers, correlations"],
              ["output", "14 figures · 6 findings"],
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
          <p className="text-[13px] font-medium text-ink">Analysis pipeline</p>
          <div className="mt-3 space-y-0">
            {["Parse & type inference", "Quality scoring", "Figures generated", "AI narration", "Your export"].map((step, i, arr) => (
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
              ["\"how many rows?\"", "Gemini Flash"],
              ["\"explain correlation\"", "DeepSeek R1"],
              ["\"write the report\"", "Claude"],
              ["\"pandas snippet\"", "Qwen Coder"],
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
