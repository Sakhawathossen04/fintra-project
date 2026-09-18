import { NextRequest } from "next/server";
import { requireAnon, anonJson, MAX_UPLOAD_BYTES } from "../_helpers";
import { parseDataset } from "@/lib/eda/parse";
import { runEda } from "@/lib/eda/analyze";
import { ensureThread, saveWorkspace, newId } from "@/lib/agent-store";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/agent/upload
 * multipart/form-data: file=<csv|json|txt>, threadId?
 *
 * Parses the dataset, runs the full EDA, stores it on the thread, and
 * returns the analysis for the UI to render. No login required.
 */
export async function POST(req: NextRequest) {
  const ctx = requireAnon(req);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return anonJson(ctx, { error: "Expected multipart form-data with a `file` field." }, { status: 400 });
  }

  const file = form.get("file");
  const threadId = (form.get("threadId") as string | null) ?? undefined;

  if (!(file instanceof File)) {
    return anonJson(ctx, { error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return anonJson(
      ctx,
      { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). The limit is 6 MB.` },
      { status: 413 }
    );
  }
  const lower = file.name.toLowerCase();
  if (!/\.(csv|tsv|txt|json|ndjson|jsonl)$/.test(lower)) {
    return anonJson(ctx, { error: "Unsupported file type. Upload CSV, TSV, TXT, or JSON." }, { status: 415 });
  }

  const text = await file.text();
  const dataset = parseDataset(text, file.name.replace(/\.[^.]+$/, ""));

  if (dataset.columns.length === 0 || dataset.rowCount === 0) {
    const warning = dataset.warnings[0] ?? "Could not detect tabular data in this file.";
    return anonJson(ctx, { error: warning }, { status: 422 });
  }

  const eda = runEda(dataset);

  const { ws, thread } = await ensureThread(ctx.userId, threadId);
  const datasetId = newId();
  thread.datasets.push({
    id: datasetId,
    name: file.name,
    sizeBytes: file.size,
    uploadedAt: new Date().toISOString(),
    eda,
    rawPreview: text.slice(0, 150_000),
  });
  thread.updatedAt = new Date().toISOString();
  if (thread.title === "New conversation") {
    thread.title = `Analysis: ${file.name.replace(/\.[^.]+$/, "")}`.slice(0, 48);
  }
  await saveWorkspace(ctx.userId, ws);

  return anonJson(ctx, {
    threadId: thread.id,
    datasetId,
    dataset: { name: file.name, rows: eda.rowCount, columns: eda.columnCount, sizeBytes: file.size },
    eda,
  });
}
