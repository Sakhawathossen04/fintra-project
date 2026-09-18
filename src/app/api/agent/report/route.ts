import { NextRequest } from "next/server";
import { requireAnon, anonJson, sseResponse } from "../_helpers";
import { ensureThread, saveWorkspace, newId, type SavedReport } from "@/lib/agent-store";
import { openRouterStream, sseDeltas, failoverChain, routeTask, findModel } from "@/lib/ai/openrouter";
import { fmt } from "@/lib/eda/analyze";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * POST /api/agent/report
 * body: { threadId, datasetId?, sections?: string[], modelId?, effort? }
 *
 * Streams (SSE) a structured markdown report synthesizing the thread's
 * latest EDA. Falls back to a deterministic report when no API key is set.
 */
export async function POST(req: NextRequest) {
  const ctx = requireAnon(req);
  const body = (await req.json().catch(() => ({}))) as {
    threadId?: string;
    datasetId?: string;
    sections?: string[];
    modelId?: string;
    effort?: "quick" | "deep";
  };

  const { ws, thread } = await ensureThread(ctx.userId, body.threadId);
  const dataset =
    (body.datasetId ? thread.datasets.find((d) => d.id === body.datasetId) : undefined) ??
    thread.datasets[thread.datasets.length - 1];

  if (!dataset) {
    return anonJson(ctx, { error: "No dataset in this thread yet — upload a CSV/JSON first." }, { status: 400 });
  }

  const eda = dataset.eda;
  const sections =
    body.sections && body.sections.length > 0
      ? body.sections
      : ["Executive Summary", "Data Overview", "Data Quality", "Key Findings", "Relationships & Segments", "Risks & Caveats", "Recommended Next Steps"];

  const apiKey = process.env.OPENROUTER_API_KEY ?? "";
  const effort = body.effort === "quick" ? "quick" : "deep";
  const primary = routeTask("comprehensive analysis report", effort, true);
  const chain = body.modelId && findModel(body.modelId) ? [findModel(body.modelId)!] : failoverChain(primary);

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
        dataset: { name: dataset.name, rows: eda.rowCount, columns: eda.columnCount },
        sections,
        chain: chain.map((m) => m.name),
      });

      if (!apiKey) {
        // Deterministic fallback report — real numbers, no LLM.
        full = deterministicReport(eda, sections, dataset.name);
        send("model", { model: "DataLens deterministic engine (no API key)" });
        for (const chunk of chunksOf(full, 220)) send("delta", { text: chunk });
        await persistReport(ctx.userId, ws, thread, full, sections);
        send("done", { saved: true });
        controller.close();
        closed = true;
        return;
      }

      try {
        const system = [
          "You are DataLens AI's report generator. You write board-ready analysis reports in GitHub-flavored markdown.",
          "Use ONLY the verified statistics provided. Structure the report under these exact section headings:",
          sections.map((s, i) => `${i + 1}. ${s}`).join(", "),
          "Each section: 2-5 tight paragraphs or bullets, citing concrete figures (means, medians, correlations, segment gaps, quality scores).",
          "Do not use code fences or tables wider than 4 columns. Start directly with the first heading.",
        ].join("\n");

        const stats = contextFor(eda, dataset.name);
        const result = await openRouterStream({
          apiKey,
          models: chain.map((m) => m.id),
          messages: [
            { role: "system", content: system },
            { role: "user", content: `Write the analysis report for this dataset.\n\n${stats}` },
          ],
          temperature: 0.3,
          maxTokens: effort === "deep" ? 3500 : 1800,
        });

        if (!result.ok || !result.stream) {
          full = deterministicReport(eda, sections, dataset.name);
          send("model", { model: "DataLens deterministic engine (upstream failed)" });
          send("notice", { message: result.error ?? "Upstream failed — generated a deterministic report from verified stats instead." });
          for (const chunk of chunksOf(full, 220)) send("delta", { text: chunk });
        } else {
          modelUsed = result.modelUsed ?? chain[0].name;
          send("model", { model: modelUsed });
          await sseDeltas(result.stream, (delta) => {
            full += delta;
            send("delta", { text: delta });
          });
        }

        await persistReport(ctx.userId, ws, thread, full, sections);
        send("done", { saved: true, model: modelUsed });
      } catch (e) {
        send("error", { message: e instanceof Error ? e.message : "Report generation failed." });
      } finally {
        if (!closed) {
          try {
            controller.close();
          } catch {
            /* noop */
          }
          closed = true;
        }
      }
    },
  });

  return sseResponse(stream, ctx);
}

async function persistReport(
  userId: string,
  ws: Awaited<ReturnType<typeof ensureThread>>["ws"],
  thread: Awaited<ReturnType<typeof ensureThread>>["thread"],
  markdown: string,
  sections: string[]
): Promise<void> {
  const report: SavedReport = {
    id: newId(),
    threadId: thread.id,
    title: `Report — ${thread.title}`.slice(0, 70),
    createdAt: new Date().toISOString(),
    markdown,
    sections,
  };
  ws.savedReports.unshift(report);
  thread.reportIds.unshift(report.id);
  thread.updatedAt = new Date().toISOString();
  await saveWorkspace(userId, ws);
}

/* ────────────────────────── Deterministic fallback ────────────────────────── */

function contextFor(eda: ReturnType<typeof import("@/lib/eda/analyze").runEda>, name: string): string {
  const lines: string[] = [];
  lines.push(`DATASET: ${name} — ${eda.rowCount} rows × ${eda.columnCount} columns (${eda.format.toUpperCase()})`);
  lines.push(`SCHEMA: ${eda.schemaLine}`);
  lines.push(`QUALITY: ${eda.quality.score}/100, ${eda.quality.missingCells} missing cells, ${eda.quality.duplicateRows} duplicate rows`);
  for (const o of eda.overviews) {
    if (o.kind === "numeric") {
      const d = o.data;
      lines.push(`- ${d.name}: mean=${fmt(d.mean)}, median=${fmt(d.median)}, std=${fmt(d.std)}, min=${fmt(d.min)}, max=${fmt(d.max)}, missing=${d.missing}, outliers=${d.outliers}`);
    } else {
      const d = o.data;
      lines.push(`- ${d.name} [${o.kind}]: unique=${d.unique}, top: ${d.top.slice(0, 4).map((t) => `${t.value}(${Math.round(t.pct * 100)}%)`).join(", ")}`);
    }
  }
  for (const i of eda.insights) lines.push(`FINDING [${i.tag}]: ${i.title} — ${i.detail}`);
  return lines.join("\n");
}

function deterministicReport(
  eda: ReturnType<typeof import("@/lib/eda/analyze").runEda>,
  sections: string[],
  name: string
): string {
  const out: string[] = [];
  const numCols = eda.overviews.filter((o) => o.kind === "numeric");
  const catCols = eda.overviews.filter((o) => o.kind !== "numeric");

  for (const section of sections) {
    out.push(`## ${section}`);
    if (/executive summary/i.test(section)) {
      out.push(
        `**${name}** contains **${eda.rowCount.toLocaleString()} rows × ${eda.columnCount} columns** (${eda.format.toUpperCase()}) with a data-quality score of **${eda.quality.score}/100**. ` +
          `${numCols.length} numeric and ${catCols.length} categorical variables were profiled automatically; ${eda.insights.length} notable pattern${eda.insights.length === 1 ? "" : "s"} ${eda.insights.length === 1 ? "was" : "were"} detected.`
      );
    } else if (/data overview/i.test(section)) {
      out.push(`Schema: ${eda.schemaLine}.`);
      for (const o of eda.overviews.slice(0, 10)) {
        if (o.kind === "numeric") {
          const d = o.data;
          out.push(`- **${d.name}** — mean ${fmt(d.mean)}, median ${fmt(d.median)}, σ ${fmt(d.std)}, range [${fmt(d.min)}, ${fmt(d.max)}]`);
        } else {
          const d = o.data;
          out.push(`- **${d.name}** — ${d.unique} unique values; top: ${d.top.slice(0, 3).map((t) => `${t.value} (${Math.round(t.pct * 100)}%)`).join(", ")}`);
        }
      }
    } else if (/quality/i.test(section)) {
      out.push(
        `Quality score **${eda.quality.score}/100** — ${eda.quality.missingCells.toLocaleString()} missing cells of ${eda.quality.totalCells.toLocaleString()}, ${eda.quality.duplicateRows} duplicate row${eda.quality.duplicateRows === 1 ? "" : "s"}.`
      );
      for (const issue of eda.quality.issues) out.push(`- ${issue.title}: ${issue.detail}`);
      if (eda.quality.issues.length === 0) out.push("- No blocking issues detected: no missing values, no duplicates.");
    } else if (/finding/i.test(section)) {
      for (const i of eda.insights) out.push(`- **${i.title}** — ${i.detail}`);
      if (eda.insights.length === 0) out.push("- No strong patterns detected in the automatic pass; the distributions are broadly uniform.");
    } else if (/relationship|segment/i.test(section)) {
      const corrs = eda.figures.filter((f) => f.kind === "scatter");
      if (corrs.length > 0) {
        for (const f of corrs) out.push(`- ${f.title}: ${f.subtitle}`);
      } else {
        out.push("- Fewer than two numeric columns — correlation analysis is not applicable.");
      }
      const groups = eda.figures.filter((f) => f.kind === "bar" && /by /.test(f.title));
      for (const g of groups) out.push(`- Segment view: ${g.title} (${g.subtitle ?? ""}).`);
    } else if (/risk|caveat/i.test(section)) {
      const skewed = numCols.filter((o) => o.kind === "numeric" && Math.abs(o.data.skewness) > 1);
      if (skewed.length > 0) out.push(`- Skewed variables (${skewed.map((s) => s.data.name).join(", ")}): prefer medians over means.`);
      const outlierCols = numCols.filter((o) => o.kind === "numeric" && o.data.outliers > 0);
      if (outlierCols.length > 0) out.push(`- Outliers present in ${outlierCols.map((s) => s.data.name).join(", ")} — verify before modeling.`);
      if (eda.quality.missingCells > 0) out.push(`- ${eda.quality.missingCells} missing cells — document the imputation strategy.`);
      if (out.length === 1) out.push("- No material risks flagged by the automatic pass.");
    } else if (/next steps/i.test(section)) {
      out.push("- Clean: resolve missing values and duplicates flagged in Data Quality.");
      out.push("- Go deeper: test the flagged correlations for causality with targeted splits.");
      out.push("- Segment: compare the strongest group differences with statistical tests.");
      out.push("- Monitor: re-run this analysis after each data refresh to track drift.");
    } else {
      out.push("—");
    }
    out.push("");
  }
  return out.join("\n");
}

function chunksOf(s: string, n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < s.length; i += n) out.push(s.slice(i, i + n));
  return out;
}
