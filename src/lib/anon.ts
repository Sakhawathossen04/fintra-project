import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";

/**
 * Anonymous workspace identity — no login required.
 *
 * The `dl_anon` httpOnly cookie identifies a browser's workspace. It is set
 * by middleware on first visit to /agent (or its APIs) and lasts 180 days.
 * Users can optionally sign in on the marketing site; the workspace itself
 * never requires it.
 */

export const ANON_COOKIE = "dl_anon";
export const ANON_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export function newAnonId(): string {
  return randomBytes(16).toString("hex");
}

/** Reads the anon id for the current request (server components + routes). */
export async function getAnonId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ANON_COOKIE)?.value ?? null;
}
