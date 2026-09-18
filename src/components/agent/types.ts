import type { EdaReport } from "@/lib/eda/analyze";

export type View = "chat" | "analysis" | "reports" | "history";

export interface Turn {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: string;
  model?: string;
  effort?: "quick" | "deep";
  datasetId?: string;
}

export interface DatasetRef {
  id: string;
  name: string;
  sizeBytes: number;
  uploadedAt: string;
  eda: EdaReport;
  rawPreview: string;
}

export interface Thread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  datasets: DatasetRef[];
  turns: Turn[];
  analysisIds: string[];
  reportIds: string[];
}

export interface ThreadSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  turns: number;
  datasets: string[];
  hasAnalysis: boolean;
}

export interface CatalogModel {
  id: string;
  name: string;
  provider: string;
  free: boolean;
  reasoning: boolean;
  contextK: number;
  tags: string[];
  blurb: string;
}

export interface ModelsInfo {
  models: CatalogModel[];
  freeCount: number;
  total: number;
  gateway: string;
  keyConfigured: boolean;
}

export interface SavedItem {
  id: string;
  title: string;
  threadId: string;
  createdAt: string;
  datasetName?: string;
}
