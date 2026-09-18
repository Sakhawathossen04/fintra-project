/**
 * OpenRouter model catalog + "Auto (Smart Router)" logic.
 *
 * The API key is intentionally left blank: set OPENROUTER_API_KEY in
 * `.env.local` (or the deployment env) and everything lights up.
 */

export interface CatalogModel {
  id: string; // OpenRouter model id, e.g. "openai/gpt-4o-mini"
  name: string;
  provider: string;
  free: boolean;
  reasoning: boolean;
  contextK: number; // context window in thousands of tokens
  tags: ("reasoning" | "balanced" | "fast" | "specialist")[];
  blurb: string;
}

/** A catalog of widely-available OpenRouter models (free + frontier). */
export const MODEL_CATALOG: CatalogModel[] = [
  { id: "auto", name: "Auto (Smart Router)", provider: "Built-in", free: true, reasoning: false, contextK: 200, tags: ["balanced"], blurb: "Complexity-based heuristic router with automatic rate-limit and credit-failover across free & frontier tiers." },
  { id: "openrouter/auto", name: "Free Models Router", provider: "OpenRouter", free: true, reasoning: false, contextK: 200, tags: ["fast"], blurb: "Dynamic load-balanced router selecting available free models on OpenRouter with zero token cost." },

  { id: "deepseek/deepseek-chat-v3.1:free", name: "DeepSeek V3.1", provider: "DeepSeek", free: true, reasoning: true, contextK: 164, tags: ["reasoning", "specialist"], blurb: "Strong general reasoning and math — excellent for statistical interpretation and EDA narration." },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1", provider: "DeepSeek", free: true, reasoning: true, contextK: 164, tags: ["reasoning"], blurb: "Dedicated reasoning model with visible chain-of-thought for complex multi-step analysis." },
  { id: "qwen/qwen3-coder:free", name: "Qwen3 Coder", provider: "Qwen", free: true, reasoning: false, contextK: 262, tags: ["fast", "specialist"], blurb: "Code-specialized model — ideal for translating analysis into pandas/SQL-style snippets." },
  { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5 72B", provider: "Qwen", free: true, reasoning: false, contextK: 33, tags: ["balanced"], blurb: "Reliable general-purpose instruct model with solid numeric sense." },
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B", provider: "Meta", free: true, reasoning: false, contextK: 131, tags: ["balanced"], blurb: "Dependable open-weights workhorse with long context and good instruction following." },
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash", provider: "Google", free: true, reasoning: false, contextK: 1000, tags: ["fast"], blurb: "Ultra-fast with a 1M-token window — great for whole-file context." },
  { id: "mistralai/mistral-small-3.2-24b-instruct:free", name: "Mistral Small 3.2", provider: "Mistral", free: true, reasoning: false, contextK: 97, tags: ["fast"], blurb: "Snappy European model, efficient for routine summaries and transformations." },
  { id: "microsoft/wizardlm-2-8x22b:free", name: "WizardLM 2 8x22B", provider: "Microsoft", free: true, reasoning: false, contextK: 64, tags: ["balanced"], blurb: "Mixture-of-experts model with strong analytical writing." },
  { id: "nousresearch/hermes-3-llama-3.1-405b:free", name: "Hermes 3 405B", provider: "Nous", free: true, reasoning: true, contextK: 131, tags: ["reasoning"], blurb: "Large open model with careful, structured reasoning." },
  { id: "moonshotai/kimi-k2:free", name: "Kimi K2", provider: "Moonshot", free: true, reasoning: false, contextK: 200, tags: ["balanced"], blurb: "Agentic long-context model suited to tool-style workflows." },

  { id: "openai/gpt-4o-mini", name: "GPT-4o mini", provider: "OpenAI", free: false, reasoning: false, contextK: 128, tags: ["fast", "balanced"], blurb: "Fast, inexpensive frontier-quality model — the default quality baseline." },
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI", free: false, reasoning: false, contextK: 128, tags: ["balanced"], blurb: "OpenAI's flagship omni model; strong all-round analysis." },
  { id: "openai/o3-mini", name: "o3-mini", provider: "OpenAI", free: false, reasoning: true, contextK: 200, tags: ["reasoning"], blurb: "Compact reasoning model for math and multi-step logic." },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", free: false, reasoning: false, contextK: 200, tags: ["balanced", "specialist"], blurb: "Careful long-form reasoning and excellent structured drafting." },
  { id: "anthropic/claude-3.7-sonnet", name: "Claude 3.7 Sonnet", provider: "Anthropic", free: false, reasoning: true, contextK: 200, tags: ["reasoning"], blurb: "Anthropic's extended-thinking model for nuanced analysis." },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", free: false, reasoning: true, contextK: 1000, tags: ["reasoning"], blurb: "Million-token context with strong reasoning for whole-dataset narratives." },
  { id: "x-ai/grok-3-mini", name: "Grok 3 mini", provider: "xAI", free: false, reasoning: false, contextK: 131, tags: ["fast"], blurb: "Quick frontier answers with a personality." },
];

export const FREE_MODEL_COUNT = MODEL_CATALOG.filter((m) => m.free).length;

export function findModel(id: string): CatalogModel | undefined {
  return MODEL_CATALOG.find((m) => m.id === id);
}

/* ────────────────────── Auto smart-router ────────────────────── */

export type EffortMode = "quick" | "deep";

/** Ranks candidate models for the task, cheapest-sufficient first. */
export function routeTask(prompt: string, effort: EffortMode, hasDataset: boolean): CatalogModel {
  const text = prompt.toLowerCase();
  const words = prompt.trim().split(/\s+/).length;

  const heavySignals =
    /\b(why|explain|root cause|correlat|regress|forecast|predict|segment|cohort|significan|causal|anomal|trend|decompos|statistical|hypothes|variance driver|model)\b/.test(
      text
    );
  const lightSignals =
    /\b(list|count|how many|sum|average|mean|top \d|quick|preview|describe|shape|columns|schema|head|sample|summary only)\b/.test(
      text
    );

  const deep = effort === "deep" || heavySignals || words > 40;

  if (deep) {
    // Deep: strongest free reasoning model first, then paid frontier.
    return (
      findModel("deepseek/deepseek-r1:free") ??
      findModel("deepseek/deepseek-chat-v3.1:free") ??
      findModel("anthropic/claude-3.7-sonnet")!
    );
  }
  if (lightSignals && !hasDataset) {
    return findModel("google/gemini-2.0-flash-exp:free") ?? findModel("openai/gpt-4o-mini")!;
  }
  // Default balanced: DeepSeek V3.1 free, fall back to GPT-4o mini.
  return findModel("deepseek/deepseek-chat-v3.1:free") ?? findModel("openai/gpt-4o-mini")!;
}

/** Ordered failover list for the router: router → alternates → paid. */
export function failoverChain(primary: CatalogModel): CatalogModel[] {
  const chain: CatalogModel[] = [primary];
  const push = (id: string) => {
    const m = findModel(id);
    if (m && !chain.some((c) => c.id === m.id)) chain.push(m);
  };
  if (primary.free) {
    push("deepseek/deepseek-chat-v3.1:free");
    push("meta-llama/llama-3.3-70b-instruct:free");
    push("google/gemini-2.0-flash-exp:free");
  }
  push("openai/gpt-4o-mini");
  return chain;
}

/* ────────────────────── OpenRouter chat client ────────────────────── */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamResult {
  ok: boolean;
  status?: number;
  error?: string;
  stream?: ReadableStream<Uint8Array>;
  modelUsed?: string;
}

/**
 * Calls OpenRouter chat completions with SSE streaming. Tries each model in
 * the failover chain in order (handles 402 credit / 429 rate-limit / 5xx).
 */
export async function openRouterStream(opts: {
  apiKey: string;
  models: string[];
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}): Promise<StreamResult> {
  let lastError = "No models attempted";

  for (const model of opts.models) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
          "X-Title": "DataLens AI",
        },
        body: JSON.stringify({
          model,
          messages: opts.messages,
          temperature: opts.temperature ?? 0.3,
          max_tokens: opts.maxTokens ?? 2048,
          stream: true,
        }),
        signal: opts.signal,
      });

      if (res.ok && res.body) {
        return { ok: true, stream: res.body, modelUsed: model };
      }

      let detail = "";
      try {
        const j = (await res.json()) as { error?: { message?: string } };
        detail = j.error?.message ?? "";
      } catch {
        detail = await res.text().catch(() => "");
      }
      lastError = `${res.status}: ${detail || res.statusText}`;

      // Failover on rate limits, credits, and server errors — not on auth.
      if (res.status === 402 || res.status === 429 || res.status >= 500) continue;
      if (res.status === 401 || res.status === 403) {
        return { ok: false, status: res.status, error: `OpenRouter rejected the API key (${res.status}). ${detail}` };
      }
      if (res.status === 404) continue; // model id gone — try next
      return { ok: false, status: res.status, error: lastError };
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }
  return { ok: false, error: lastError };
}

/** Parses an OpenRouter SSE body into text deltas. */
export function sseDeltas(
  body: ReadableStream<Uint8Array>,
  onDelta: (text: string) => void,
  onDone?: (finishReason: string | null) => void
): Promise<void> {
  return new Promise((resolve) => {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    const pump = (): Promise<void> =>
      reader.read().then(({ done, value }) => {
        if (done) {
          onDone?.(null);
          resolve();
          return;
        }
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n");
        buf = parts.pop() ?? "";
        for (const line of parts) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const payload = t.slice(5).trim();
          if (payload === "[DONE]") {
            onDone?.("stop");
            resolve();
            return;
          }
          try {
            const j = JSON.parse(payload) as {
              choices?: { delta?: { content?: string }; finish_reason?: string }[];
            };
            const delta = j.choices?.[0]?.delta?.content;
            if (delta) onDelta(delta);
          } catch {
            /* partial frame — ignore */
          }
        }
        return pump();
      });
    return pump();
  });
}
