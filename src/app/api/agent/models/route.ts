import { NextRequest } from "next/server";
import { requireAnon, anonJson } from "../_helpers";
import { MODEL_CATALOG, FREE_MODEL_COUNT } from "@/lib/ai/openrouter";

export const runtime = "nodejs";

/** GET /api/agent/models — model catalog + API-key status for the picker. */
export async function GET(req: NextRequest) {
  const ctx = requireAnon(req);
  return anonJson(ctx, {
    models: MODEL_CATALOG,
    freeCount: FREE_MODEL_COUNT,
    total: MODEL_CATALOG.length,
    gateway: "OpenRouter",
    keyConfigured: Boolean(process.env.OPENROUTER_API_KEY),
  });
}
