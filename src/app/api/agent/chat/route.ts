import { NextRequest } from "next/server";
import { requireAnon, anonJson, sseResponse } from "../_helpers";
import { ensureThread, saveWorkspace, newId, titleFromMessage } from "@/lib/agent-store";
import {
  MODEL_CATALOG,
  routeTask,
  failoverChain,
  openRouterStream,
  sseDeltas,
  findModel,
  type ChatMessage,
} from "@/lib/ai/openrouter";
import { fmt } from "@/lib/eda/analyze";
import type { EdaReport } from "@/lib/eda/analyze";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * POST /api/agent/chat
 * body: { threadId?, message, modelId?, effort: "quick"|"deep", datasetId?, mode?: "analysis" }
 *
 * Streams the assistant reply as SSE. When a dataset is attached (or the
 * newest one on the thread is referenced), the verified EDA statistics are
 * injected as grounding context so the model narrates real numbers only.
 */
export async function POST(req: NextRequest) {
  const ctx = requireAnon(req);
  const body = (await req.json().catch(() => ({}))) as {
    threadId?: string;
    message?: string;
    modelId?: string;
    effort?: "quick" | "deep";
    datasetId?: string;
    runAnalysis?: boolean;
  };

  const message = (body.message ?? "").trim();
  if (!message) {
    return anonJson(ctx, { error: "Empty message." }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY ?? "";
  const { ws, thread } = await ensureThread(ctx.userId, body.threadId);
  const dataset =
    (body.datasetId ? thread.datasets.find((d) => d.id === body.datasetId) : undefined) ??
    thread.datasets[thread.datasets.length - 1];

  const effort: "quick" | "deep" = body.effort === "deep" ? "deep" : "quick";
  const requested = body.modelId && body.modelId !== "auto" ? findModel(body.modelId) : undefined;

  // Choose the model chain: explicit pick → smart router.
  const primary = requested ?? routeTask(message, effort, Boolean(dataset));
  const chain = requested ? [requested, ...failoverChain(primary).filter((m) => m.id !== requested.id)] : failoverChain(primary);

  // ── Build grounded messages ──────────────────────────────────────────
  const turns = thread.turns.slice(-12);
  const history: ChatMessage[] = turns.map((t) => ({
    role: t.role,
    content: t.content.slice(0, 4000),
  }));

  const system = buildSystemPrompt(effort, dataset?.eda, Boolean(body.runAnalysis));

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    ...history,
    {
      role: "user",
      content: dataset
        ? `${message}\n\n[A dataset "${dataset.name}" is attached. Verified EDA statistics were provided in the system context — use those exact numbers.]`
        : message,
    },
  ];

  // ── Persist the user turn before streaming ──────────────────────────
  const userTurn = {
    id: newId(),
    role: "user" as const,
    content: message,
    at: new Date().toISOString(),
    effort,
    datasetId: dataset?.id,
  };
  thread.turns.push(userTurn);
  if (thread.title === "New conversation" || thread.title.startsWith("Analysis: ")) {
    thread.title = titleFromMessage(message);
  }
  thread.updatedAt = new Date().toISOString();

  const encoder = new TextEncoder();
  let full = "";
  let modelUsed = "";
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          /* client gone */
        }
      };

      send("meta", {
        threadId: thread.id,
        modelChain: chain.map((m) => m.name),
        routedModel: primary.name,
        effort,
        grounded: Boolean(dataset),
      });

      if (!apiKey) {
        send("error", {
          message:
            "OPENROUTER_API_KEY is not configured on the server. Add it to .env.local (or your host's environment) to enable AI narration — data parsing and EDA still run fully offline.",
          code: "NO_API_KEY",
        });
        saveWorkspace(ctx.userId, ws).catch(() => {});
        controller.close();
        closed = true;
        return;
      }

      try {
        const result = await openRouterStream({
          apiKey,
          models: chain.map((m) => m.id),
          messages,
          temperature: effort === "deep" ? 0.25 : 0.35,
          maxTokens: effort === "deep" ? 3000 : 1600,
        });

        if (!result.ok || !result.stream) {
          send("error", { message: result.error ?? "The model gateway failed. Try again or pick another model.", code: "UPSTREAM" });
          thread.turns.push({
            id: newId(),
            role: "assistant",
            content: `⚠️ ${result.error ?? "Model request failed."}`,
            at: new Date().toISOString(),
          });
          await saveWorkspace(ctx.userId, ws);
          controller.close();
          closed = true;
          return;
        }

        modelUsed = result.modelUsed ?? chain[0].name;
        send("model", { model: modelUsed });

        await sseDeltas(result.stream, (delta) => {
          full += delta;
          send("delta", { text: delta });
        });

        // ── Persist assistant turn ──
        thread.turns.push({
          id: newId(),
          role: "assistant",
          content: full,
          at: new Date().toISOString(),
          model: modelUsed,
          effort,
          datasetId: dataset?.id,
        });
        await saveWorkspace(ctx.userId, ws);
        send("done", { threadId: thread.id, model: modelUsed });
      } catch (e) {
        send("error", { message: e instanceof Error ? e.message : "Streaming failed." });
      } finally {
        if (!closed) {
          try {
            controller.close();
          } catch {
            /* already closed */
          }
          closed = true;
        }
      }
    },
  });

  return sseResponse(stream, ctx);
}

/* ────────────────────────── Prompt building ────────────────────────── */

function buildSystemPrompt(effort: "quick" | "deep", eda: EdaReport | undefined, runAnalysis: boolean): string {
  const base = [
    "You are DataLens AI, an expert data analyst embedded in a professional analysis workspace.",
    "You turn datasets into insight: distributions, relationships, trends, segments, anomalies, and data-quality issues.",
    "Rules:",
    "1. When dataset statistics are provided, treat them as verified ground truth. Never invent numbers; compute nothing that contradicts them.",
    "2. Write for an analyst: crisp, structured, skimmable. Use short paragraphs and markdown bullets.",
    "3. Reference concrete figures (mean, median, spread, correlations, segment gaps) and say what they mean for the user.",
    "4. Flag caveats (small samples, skew, outliers, missing data) briefly where they matter.",
    "5. End with a short 'Recommended next steps' section of 2-4 bullets.",
    effort === "deep"
      ? "Mode: DEEP — go comprehensive: full EDA narrative, statistical reasoning, segment comparisons, and limitations."
      : "Mode: QUICK — concise: the key findings in under 250 words, then next steps.",
  ].join("\n");

  if (!eda) {
    return (
      base +
      "\n\nNo dataset is attached yet. If the user's question needs data, tell them to upload a CSV/JSON using the attach button and briefly outline what you will analyze."
    );
  }

  const lines: string[] = [base, "", "VERIFIED DATASET STATISTICS (ground truth — cite these exact numbers):"];
  lines.push(`DATASET: ${eda.datasetName} — ${eda.rowCount} rows × ${eda.columnCount} columns (${eda.format.toUpperCase()})`);
  lines.push(`SCHEMA: ${eda.schemaLine}`);
  lines.push(`QUALITY: score ${eda.quality.score}/100, ${eda.quality.missingCells} missing cells, ${eda.quality.duplicateRows} duplicate rows`);
  lines.push("");
  lines.push("COLUMN STATISTICS:");
  for (const o of eda.overviews) {
    if (o.kind === "numeric") {
      const d = o.data;
      lines.push(`- ${d.name} [numeric]: n=${d.count}, missing=${d.missing}, mean=${fmt(d.mean)}, median=${fmt(d.median)}, std=${fmt(d.std)}, min=${fmt(d.min)}, q1=${fmt(d.q1)}, q3=${fmt(d.q3)}, max=${fmt(d.max)}, outliers=${d.outliers}, skew=${d.skewness.toFixed(2)}`);
    } else {
      const d = o.data;
      const tops = d.top.slice(0, 5).map((t) => `${t.value}(${Math.round(t.pct * 100)}%)`).join(", ");
      lines.push(`- ${d.name} [${o.kind}]: n=${d.count}, missing=${d.missing}, unique=${d.unique}, top: ${tops}`);
    }
  }
  if (eda.insights.length > 0) {
    lines.push("");
    lines.push("PRE-COMPUTED FINDINGS (verify and explain these):");
    for (const i of eda.insights) lines.push(`- [${i.tag}] ${i.title}: ${i.detail}`);
  }
  if (runAnalysis) {
    lines.push("");
    lines.push(
      "TASK: Produce a complete exploratory data analysis (EDA) narrative: overview, data quality, univariate highlights, relationships, segments/trends, anomalies, and recommended next steps. Figures for every detected pattern are already rendered beside your answer — walk the reader through them."
    );
  }
  return lines.join("\n");
}
