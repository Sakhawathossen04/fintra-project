import type { Metadata } from "next";
import Workspace from "@/components/agent/Workspace";
import { getAnonId } from "@/lib/anon";
import { loadWorkspace } from "@/lib/agent-store";
import type { ThreadSummary } from "@/components/agent/types";

export const metadata: Metadata = {
  title: "Agent Workspace",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/**
 * The agent workspace — directly accessible, no login. Identity is a
 * browser cookie issued by middleware on first visit.
 */
export default async function AgentPage() {
  const anonId = await getAnonId();

  let initialThreads: ThreadSummary[] = [];
  if (anonId) {
    const ws = await loadWorkspace(anonId);
    initialThreads = ws.threads.map((t) => ({
      id: t.id,
      title: t.title,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      turns: t.turns.length,
      datasets: t.datasets.map((d) => d.name),
      hasAnalysis: t.datasets.length > 0,
    }));
  }

  return <Workspace initialThreads={initialThreads} />;
}
