import { cookies } from "next/headers";
import { getSessionAccount, type Account } from "./storage";

export const SESSION_COOKIE = "fintra_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Returns the signed-in account for the current request, or null. */
export async function getAuthAccount(): Promise<Account | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getSessionAccount(token);
}
