import { NextRequest, NextResponse } from "next/server";
import { getAuthAccount } from "@/lib/auth";
import { updateAccountPlan } from "@/lib/storage";
import { isDemoMode } from "@/lib/payments";

export async function POST(req: NextRequest) {
  const account = await getAuthAccount();
  if (!account) {
    return NextResponse.redirect(new URL("/login?redirect=/billing", req.url), { status: 303 });
  }
  await updateAccountPlan(account.id, "free", "monthly", 0, isDemoMode() ? "demo" : "paid");
  return NextResponse.redirect(new URL("/billing", req.url), { status: 303 });
}
