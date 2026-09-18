import { NextRequest } from "next/server";
import { requireAnon, anonJson } from "../_helpers";
import { loadWorkspace } from "@/lib/agent-store";
import { fmt } from "@/lib/eda/analyze";
import type { EdaReport } from "@/lib/eda/analyze";

export const runtime = "nodejs";

/**
 * GET /api/agent/export?kind=analysis|transcript|report|stats-csv&threadId=&id=
 *
 * Returns downloadable files (analysis JSON, markdown report, chat transcript,
 * or a summary-statistics CSV). All client-side accessible, no login.
 */
export async function GET(req: NextRequest) {
  const ctx = requireAnon(req);
  const sp = req.nextUrl.searchParams;
  const kind = sp.get("kind") ?? "analysis";
  const threadId = sp.get("threadId");
  const id = sp.get("id");
  const ws = await loadWorkspace(ctx.userId);

  const thread = ws.threads.find((t) => t.id === threadId);
  if (!thread) return anonJson(ctx, { error: "Thread not found." }, { status: 404 });

  if (kind === "transcript") {
    const md = threadToMarkdown(thread.title, thread.turns.map((t) => ({
      role: t.role,
      content: t.content,
      model: t.model,
      at: t.at,
    })));
    return file(ctx, md, `transcript-${thread.id}.md`, "text/markdown; charset=utf-8");
  }

  if (kind === "report") {
    const report = ws.savedReports.find((r) => r.id === id) ?? ws.savedReports.find((r) => r.threadId === threadId);
    if (!report) return anonJson(ctx, { error: "Report not found." }, { status: 404 });
    return file(ctx, report.markdown, `report-${report.id}.md`, "text/markdown; charset=utf-8");
  }

  if (kind === "stats-csv") {
    const dataset = thread.datasets[thread.datasets.length - 1];
    if (!dataset) return anonJson(ctx, { error: "No dataset in thread." }, { status: 400 });
    return file(ctx, statsCsv(dataset.eda), `summary-stats-${sanitize(dataset.name)}.csv`, "text/csv; charset=utf-8");
  }

  // default: full EDA JSON
  const dataset = id
    ? thread.datasets.find((d) => d.id === id)
    : thread.datasets[thread.datasets.length - 1];
  if (!dataset) return anonJson(ctx, { error: "No dataset in thread." }, { status: 400 });
  const payload = {
    dataset: { name: dataset.name, uploadedAt: dataset.uploadedAt, rows: dataset.eda.rowCount, columns: dataset.eda.columnCount },
    analysis: dataset.eda,
  };
  return file(ctx, JSON.stringify(payload, null, 2), `analysis-${sanitize(dataset.name)}.json`, "application/json");
}

/* ─────────────────────────── helpers ─────────────────────────── */

function file(ctx: ReturnType<typeof requireAnon>, body: string, name: string, mime: string) {
  const res = anonJson(ctx, {}) as unknown as Response;
  return new Response(body, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 40) || "dataset";
}

function statsCsv(eda: EdaReport): string {
  const rows: string[] = ["column,type,count,missing,mean,median,std,min,q1,q3,max,unique,outliers"];
  for (const o of eda.overviews) {
    if (o.kind === "numeric") {
      const d = o.data;
      rows.push(
        [d.name, "numeric", d.count, d.missing, d.mean.toFixed(4), d.median.toFixed(4), d.std.toFixed(4), d.min, d.q1, d.q3, d.max, "", d.outliers]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      );
    } else {
      const d = o.data;
      rows.push(
        [d.name, o.kind, d.count, d.missing, "", "", "", "", "", "", "", d.unique, ""]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      );
    }
  }
  return rows.join("\n");
}

function threadToMarkdown(title: string, turns: { role: string; content: string; model?: string; at: string }[]): string {
  const out: string[] = [`# ${title}`, ""];
  for (const t of turns) {
    out.push(t.role === "user" ? "## Question" : "## DataLens AI" + (t.model ? ` (${t.model})` : ""));
    out.push("", t.content, "");
  }
  return out.join("\n");
}

// keep fmt referenced for future CSV extensions
void fmt;
