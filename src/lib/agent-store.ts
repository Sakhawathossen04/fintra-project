/**
 * Workspace thread storage — anonymous, cookie-scoped. No login required.
 *
 * Threads live in `.data/agent-threads/<userId>.json` (file adapter) or
 * MongoDB when DATABASE_URL is set. The user id comes from an httpOnly
 * cookie set on first workspace visit, so the workspace works signed-out.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { EdaReport } from "./eda/analyze";

export interface DatasetRef {
  id: string;
  name: string;
  sizeBytes: number;
  uploadedAt: string;
  /** Full EDA report (figures + insights) produced at upload time. */
  eda: EdaReport;
  /** Raw text (truncated) kept for follow-up questions. */
  rawPreview: string;
}

export interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: string;
  model?: string;
  effort?: "quick" | "deep";
  datasetId?: string;
  /** Dataset summary auto-attached when the turn was an analysis run. */
  edaDigest?: string;
}

export interface Thread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  datasets: DatasetRef[];
  turns: ChatTurn[];
  analysisIds: string[];
  reportIds: string[];
}

export interface UserWorkspace {
  userId: string;
  threads: Thread[];
  savedAnalyses: SavedAnalysis[];
  savedReports: SavedReport[];
}

export interface SavedAnalysis {
  id: string;
  threadId: string;
  title: string;
  datasetName: string;
  createdAt: string;
  analysis: EdaReport;
  commentary?: string;
}

export interface SavedReport {
  id: string;
  threadId: string;
  title: string;
  createdAt: string;
  markdown: string;
  sections: string[];
}

/* ─────────────────────────── Adapters ─────────────────────────── */

const DATA_DIR = path.join(process.cwd(), ".data", "agent-threads");

function useMongo(): boolean {
  return Boolean(process.env.DATABASE_URL) && process.env.AGENT_STORAGE !== "file";
}

async function fileRead(userId: string): Promise<UserWorkspace | null> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${sanitize(userId)}.json`), "utf8");
    return JSON.parse(raw) as UserWorkspace;
  } catch {
    return null;
  }
}

async function fileWrite(userId: string, ws: UserWorkspace): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, `${sanitize(userId)}.json`), JSON.stringify(ws), "utf8");
}

function sanitize(userId: string): string {
  return userId.replace(/[^a-zA-Z0-9_-]/g, "");
}

type AgentDoc = { userId: string; ws: UserWorkspace };

let mongoCol: Promise<import("mongodb").Collection<AgentDoc>> | null = null;

function mongoCollection(): Promise<import("mongodb").Collection<AgentDoc>> {
  if (!mongoCol) {
    mongoCol = import("mongodb").then(({ MongoClient }) =>
      new MongoClient(process.env.DATABASE_URL!, { maxPoolSize: 5, serverSelectionTimeoutMS: 8000 })
        .connect()
        .then((c) => c.db("datalens").collection<AgentDoc>("agent_workspaces"))
    );
  }
  return mongoCol;
}

async function mongoRead(userId: string): Promise<UserWorkspace | null> {
  const col = await mongoCollection();
  const doc = await col.findOne({ userId });
  return doc?.ws ?? null;
}

async function mongoWrite(userId: string, ws: UserWorkspace): Promise<void> {
  const col = await mongoCollection();
  await col.updateOne({ userId }, { $set: { ws } }, { upsert: true });
}

/* ─────────────────────────── Public API ─────────────────────────── */

export async function loadWorkspace(userId: string): Promise<UserWorkspace> {
  const ws = useMongo() ? await mongoRead(userId).catch(() => null) : await fileRead(userId);
  if (ws) return ws;
  return { userId, threads: [], savedAnalyses: [], savedReports: [] };
}

export async function saveWorkspace(userId: string, ws: UserWorkspace): Promise<void> {
  // Cap stored sizes: keep the most recent 40 threads, trim raw previews.
  ws.threads = ws.threads.slice(0, 40);
  for (const t of ws.threads) {
    for (const d of t.datasets) {
      if (d.rawPreview.length > 120_000) d.rawPreview = d.rawPreview.slice(0, 120_000);
    }
  }
  if (useMongo()) await mongoWrite(userId, ws).catch(() => {});
  else await fileWrite(userId, ws);
}

export function newId(): string {
  return randomBytes(9).toString("hex");
}

/** Ensure a thread exists; returns [workspace, thread]. */
export async function ensureThread(userId: string, threadId?: string): Promise<{ ws: UserWorkspace; thread: Thread }> {
  const ws = await loadWorkspace(userId);
  let thread = threadId ? ws.threads.find((t) => t.id === threadId) : undefined;
  if (!thread) {
    thread = {
      id: newId(),
      title: "New conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      datasets: [],
      turns: [],
      analysisIds: [],
      reportIds: [],
    };
    ws.threads.unshift(thread);
  }
  return { ws, thread };
}

/** Derive a short thread title from the first user message. */
export function titleFromMessage(msg: string): string {
  const clean = msg.replace(/\s+/g, " ").trim();
  if (clean.length <= 42) return clean || "New conversation";
  return clean.slice(0, 42).trimEnd() + "…";
}
