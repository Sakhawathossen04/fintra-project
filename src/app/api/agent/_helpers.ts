import { NextRequest, NextResponse } from "next/server";
import { ANON_COOKIE, ANON_MAX_AGE, newAnonId } from "@/lib/anon";

/**
 * Shared helpers for the agent API routes.
 */

export interface AnonContext {
  userId: string;
  /** True when the cookie was just created and must be attached to the response. */
  fresh: boolean;
}

/** Reads (or creates) the anonymous workspace id for this request. */
export function requireAnon(req: NextRequest): AnonContext {
  const existing = req.cookies.get(ANON_COOKIE)?.value;
  if (existing) return { userId: existing, fresh: false };
  return { userId: newAnonId(), fresh: true };
}

/** Wraps JSON responses, attaching the anon cookie when newly issued. */
export function anonJson(ctx: AnonContext, body: unknown, init?: ResponseInit): NextResponse {
  const res = NextResponse.json(body, init);
  if (ctx.fresh) {
    res.cookies.set(ANON_COOKIE, ctx.userId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: ANON_MAX_AGE,
    });
  }
  return res;
}

/** Server-sent events response with proper streaming headers. */
export function sseResponse(stream: ReadableStream<Uint8Array>, ctx: AnonContext): NextResponse {
  const res = new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
  if (ctx.fresh) {
    res.cookies.set(ANON_COOKIE, ctx.userId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: ANON_MAX_AGE,
    });
  }
  return res;
}

export const MAX_UPLOAD_BYTES = 6 * 1024 * 1024; // 6 MB
