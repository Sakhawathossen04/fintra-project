import { NextRequest } from "next/server";
import { requireAnon, anonJson } from "../_helpers";
import { loadWorkspace, saveWorkspace, newId, type SavedAnalysis } from "@/lib/agent-store";

export const runtime = "nodejs";

/**
 * POST /api/agent/save
 * body: { threadId, kind: "analysis"|"answer", title?, datasetId?, answerId?, commentary? }
 *
 * Pins the latest EDA (kind=analysis) or a specific chat answer to the
 * workspace library so it survives thread deletion.
 */
export async function POST(req: NextRequest) {
  const ctx = requireAnon(req);
  const body = (await req.json().catch(() => ({}))) as {
    threadId?: string;
    kind?: "analysis" | "answer";
    title?: string;
    datasetId?: string;
    answerId?: string;
    commentary?: string;
  };

  const ws = await loadWorkspace(ctx.userId);
  const thread = ws.threads.find((t) => t.id === body.threadId);
  if (!thread) return anonJson(ctx, { error: "Thread not found." }, { status: 404 });

  if (body.kind === "answer") {
    const turn = thread.turns.find((t) => t.id === body.answerId);
    if (!turn) return anonJson(ctx, { error: "Answer not found." }, { status: 404 });
    ws.savedAnalyses.unshift({
      id: newId(),
      threadId: thread.id,
      title: (body.title ?? turn.content.slice(0, 60)).slice(0, 70),
      datasetName: thread.datasets.find((d) => d.id === turn.datasetId)?.name ?? "—",
      createdAt: new Date().toISOString(),
      analysis: thread.datasets[0]?.eda ?? (null as never),
      commentary: turn.content,
    });
    await saveWorkspace(ctx.userId, ws);
    return anonJson(ctx, { ok: true, kind: "answer" });
  }

  const dataset = body.datasetId
    ? thread.datasets.find((d) => d.id === body.datasetId)
    : thread.datasets[thread.datasets.length - 1];
  if (!dataset) return anonJson(ctx, { error: "No dataset to save." }, { status: 400 });

  const item: SavedAnalysis = {
    id: newId(),
    threadId: thread.id,
    title: (body.title ?? `EDA — ${dataset.name}`).slice(0, 70),
    datasetName: dataset.name,
    createdAt: new Date().toISOString(),
    analysis: dataset.eda,
    commentary: body.commentary,
  };
  ws.savedAnalyses.unshift(item);
  thread.analysisIds.unshift(item.id);
  await saveWorkspace(ctx.userId, ws);
  return anonJson(ctx, { ok: true, id: item.id });
}

/** GET /api/agent/save?id=<savedId> — fetch a saved analysis. */
export async function GET(req: NextRequest) {
  const ctx = requireAnon(req);
  const id = req.nextUrl.searchParams.get("id");
  const ws = await loadWorkspace(ctx.userId);
  const item = ws.savedAnalyses.find((a) => a.id === id);
  if (!item) return anonJson(ctx, { error: "Not found." }, { status: 404 });
  return anonJson(ctx, { analysis: item });
}
