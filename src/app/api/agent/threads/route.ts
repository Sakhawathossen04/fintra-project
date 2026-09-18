import { NextRequest } from "next/server";
import { requireAnon, anonJson } from "../_helpers";
import { loadWorkspace, saveWorkspace, ensureThread } from "@/lib/agent-store";

export const runtime = "nodejs";

/** GET /api/agent/threads — list threads + saved items (lightweight). */
export async function GET(req: NextRequest) {
  const ctx = requireAnon(req);
  const threadId = req.nextUrl.searchParams.get("id");

  if (threadId) {
    const { thread } = await ensureThread(ctx.userId, threadId);
    // Full thread includes turns and dataset EDAs.
    return anonJson(ctx, { thread });
  }

  const ws = await loadWorkspace(ctx.userId);
  return anonJson(ctx, {
    threads: ws.threads.map((t) => ({
      id: t.id,
      title: t.title,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      turns: t.turns.length,
      datasets: t.datasets.map((d) => d.name),
      hasAnalysis: t.datasets.length > 0,
    })),
    analyses: ws.savedAnalyses.map((a) => ({
      id: a.id,
      title: a.title,
      datasetName: a.datasetName,
      threadId: a.threadId,
      createdAt: a.createdAt,
    })),
    reports: ws.savedReports.map((r) => ({
      id: r.id,
      title: r.title,
      threadId: r.threadId,
      createdAt: r.createdAt,
    })),
  });
}

/** DELETE /api/agent/threads?id=<threadId> — remove a thread. */
export async function DELETE(req: NextRequest) {
  const ctx = requireAnon(req);
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return anonJson(ctx, { error: "Missing id." }, { status: 400 });

  const ws = await loadWorkspace(ctx.userId);
  const before = ws.threads.length;
  ws.threads = ws.threads.filter((t) => t.id !== id);
  ws.savedAnalyses = ws.savedAnalyses.filter((a) => a.threadId !== id);
  ws.savedReports = ws.savedReports.filter((r) => r.threadId !== id);
  if (ws.threads.length === before) {
    return anonJson(ctx, { error: "Thread not found." }, { status: 404 });
  }
  await saveWorkspace(ctx.userId, ws);
  return anonJson(ctx, { ok: true });
}

/** POST /api/agent/threads — create a new empty thread. */
export async function POST(req: NextRequest) {
  const ctx = requireAnon(req);
  const { ws, thread } = await ensureThread(ctx.userId, undefined);
  await saveWorkspace(ctx.userId, ws);
  return anonJson(ctx, { threadId: thread.id, title: thread.title });
}
