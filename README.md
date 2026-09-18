# DataLens — AI Data Analysis Workspace

The complete public website and workspace for **DataLens**: a data-analysis
platform where users upload CSV/JSON datasets and get a full automatic EDA
(exploratory data analysis) — statistics, figures, AI-narrated findings, and
exportable reports — with **no login required**.

Built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion**.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Type checking: `npm run typecheck`

## The workspace (`/agent`) — no login needed

Open `/agent` and start working immediately. Identity is an anonymous
httpOnly cookie (`dl_anon`) issued on first visit — threads, datasets, and
saved reports persist per browser with zero signup.

- **Chat** — ask questions in plain language; answers stream via SSE and are
  grounded in the verified statistics of the attached dataset.
- **Upload** — drag & drop or attach CSV / TSV / JSON (or paste raw data).
  Parsing, type inference, and the full EDA run instantly.
- **Analysis** — the EDA tab: quality scorecard, auto-generated figures
  (histograms, box plots, scatter fits, correlation matrix, heatmaps, trend
  lines, composition charts), detected patterns, and column statistics.
- **Reports** — one-click structured report generation (Markdown), with a
  deterministic fallback that works without any API key.
- **History** — every thread, reopenable and deletable.
- **Export** — analysis JSON, summary-statistics CSV, Markdown reports and
  transcripts.

## AI models via OpenRouter

The backend routes across leading models (DeepSeek, Llama, Gemini, Qwen,
GPT, Claude, Mistral, …) through **OpenRouter**.

**The API key slot is intentionally empty.** To enable AI narration:

1. Get a key at [openrouter.ai/keys](https://openrouter.ai/keys) (free keys work with free models)
2. Set it in `.env.local`:

```
OPENROUTER_API_KEY=sk-or-v1-...
```

Without a key, everything except live LLM narration still works: the EDA
engine, all figures, quality scoring, and the deterministic report generator.

**Auto (Smart Router)**: the default route profiles each question (length,
complexity signals, dataset presence, Quick/Deep effort) and picks the model —
with an automatic failover chain for rate limits (429), credit errors (402),
and upstream 5xx. Users can pin any model from the catalog picker.

## The EDA engine (deterministic, no Python)

`src/lib/eda/` — pure TypeScript, no dependencies:

- `parse.ts` — CSV/TSV/JSON parsing with delimiter detection, quoted fields,
  currency/percent/parenthesis-aware numeric parsing, and type inference.
- `stats.ts` — quantiles, mean/std/skew/kurtosis, Pearson & Spearman
  correlation, linear regression, group aggregates, cross-tabs, histograms,
  IQR outlier detection.
- `analyze.ts` — the orchestrator: produces quality scores, insights, and
  figure specs (`FigureSpec[]`) rendered client-side as inline SVG
  (`src/components/agent/Figure.tsx`).

The LLM never computes user-facing statistics — it narrates the engine's
verified numbers (enforced via the system prompt and grounding context).

## Architecture

```
src/
  app/
    agent/                 # The workspace (dark shell, no marketing chrome)
    api/agent/
      upload/  chat/  analyze/  report/
      threads/ save/  models/  export/
    ...                    # Marketing site (product, solutions, pricing, ...)
  components/agent/        # Workspace UI (Workspace, panels, figures, markdown)
  lib/
    eda/                   # Deterministic EDA engine
    ai/openrouter.ts       # Model catalog, smart router, streaming client
    agent-store.ts         # Thread persistence (file or MongoDB adapters)
    anon.ts                # Anonymous cookie identity
```

## Storage adapters

Workspace threads persist per anonymous browser id through
`src/lib/agent-store.ts`:

1. **File** (default) — JSON in `.data/agent-threads/`
2. **MongoDB** — active when `DATABASE_URL` is set (Atlas/serverless-ready)

Accounts/sessions/billing (marketing-site auth, still optional) use
`src/lib/storage.ts` with the same two adapters.

## Routes

```
Workspace    /agent  (open — no login)
Marketing    /  /product (+7 pages)  /solutions (+6)  /developers (+3)
             /resources (+4)  /pricing  /enterprise  /contact  /terms  /privacy
Auth (opt.)  /login  /signup   (billing-related routes only)
API          /api/agent/*  /api/auth/*  /api/billing/*  /api/contact
```

`src/middleware.ts` issues the anonymous workspace cookie on `/agent` and its
APIs and guards only billing-related routes (`/settings`, `/billing`,
`/checkout`).

## Deployment (Vercel)

```bash
vercel            # preview
vercel --prod     # production
```

Environment variables (Project → Settings → Environment Variables):

- `OPENROUTER_API_KEY` — enables AI narration (works empty for EDA-only)
- `NEXT_PUBLIC_SITE_URL=https://<your-domain>`
- `DATABASE_URL=<mongo-uri>` (recommended in production)

`vercel.json` extends function timeouts for the streaming chat/report APIs
(120s) — adjust to your plan's limits.

## QA checklist

- `/agent` loads signed-out; anonymous cookie issued by middleware
- CSV + JSON uploads parse, EDA renders (figures + findings + columns)
- Chat streams; model router fails over; keyless mode shows a clear notice
- Report generation works with and without an API key
- Exports: analysis JSON, stats CSV, report .md, transcript .md
- All marketing routes rebranded to DataLens; CTAs point to /agent
- `tsc --noEmit` and `next build` clean
