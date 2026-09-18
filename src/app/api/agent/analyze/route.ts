import { NextRequest } from "next/server";
import { requireAnon, anonJson } from "../_helpers";
import { ensureThread, saveWorkspace, newId } from "@/lib/agent-store";
import { parseDataset } from "@/lib/eda/parse";
import { runEda } from "@/lib/eda/analyze";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/agent/analyze
 * body: { threadId, datasetId?, csvText?, name? }
 *
 * Two uses:
 * 1. Re-run the EDA for an existing uploaded dataset.
 * 2. Analyze raw CSV/JSON pasted as text (paste- or programmatic-friendly).
 */
export async function POST(req: NextRequest) {
  const ctx = requireAnon(req);
  const body = (await req.json().catch(() => ({}))) as {
    threadId?: string;
    datasetId?: string;
    csvText?: string;
    name?: string;
  };

  const { ws, thread } = await ensureThread(ctx.userId, body.threadId);

  // Case 2: raw text analysis
  if (body.csvText) {
    const text = body.csvText.slice(0, 1_500_000);
    const ds = parseDataset(text, body.name ?? "pasted-dataset");
    if (ds.columns.length === 0 || ds.rowCount === 0) {
      return anonJson(ctx, { error: ds.warnings[0] ?? "Could not detect tabular data." }, { status: 422 });
    }
    const eda = runEda(ds);
    const datasetId = newId();
    thread.datasets.push({
      id: datasetId,
      name: body.name ?? "pasted-dataset.csv",
      sizeBytes: text.length,
      uploadedAt: new Date().toISOString(),
      eda,
      rawPreview: text.slice(0, 120_000),
    });
    thread.updatedAt = new Date().toISOString();
    if (thread.title === "New conversation" && body.name) {
      thread.title = `Analysis: ${body.name}`.slice(0, 48);
    }
    await saveWorkspace(ctx.userId, ws);
    return anonJson(ctx, { threadId: thread.id, datasetId, eda });
  }

  // Case 1: re-run existing
  const dataset = body.datasetId
    ? thread.datasets.find((d) => d.id === body.datasetId)
    : thread.datasets[thread.datasets.length - 1];
  if (!dataset) return anonJson(ctx, { error: "No dataset found in this thread." }, { status: 404 });

  const ds = parseDataset(dataset.rawPreview, dataset.name.replace(/\.[^.]+$/, ""));
  const eda = runEda(ds);
  dataset.eda = eda;
  thread.updatedAt = new Date().toISOString();
  await saveWorkspace(ctx.userId, ws);

  return anonJson(ctx, { threadId: thread.id, datasetId: dataset.id, eda });
}
