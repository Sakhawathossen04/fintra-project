import { NextRequest, NextResponse } from "next/server";
import { getAuthAccount } from "@/lib/auth";
import { updateAccountPlan } from "@/lib/storage";
import { PLANS } from "@/lib/plans";
import { isDemoMode } from "@/lib/payments";

/**
 * Checkout endpoint.
 *
 * DEMO MODE (default): records a clearly-marked demo billing entry and grants
 * the plan immediately. No payment is processed.
 *
 * LIVE MODE (STRIPE_SECRET_KEY set): this is the integration boundary where a
 * Stripe Checkout Session would be created and the plan granted only after the
 * payment webhook confirms. See src/lib/payments/index.ts.
 */
export async function POST(req: NextRequest) {
  const account = await getAuthAccount();
  if (!account) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const plan = String(body?.plan ?? "");
  const interval = body?.interval === "annual" ? "annual" : "monthly";

  if (!PLANS[plan as keyof typeof PLANS] || plan === "enterprise") {
    return NextResponse.json(
      { error: "Choose Free, Pro, or Max — or contact sales for Enterprise." },
      { status: 400 }
    );
  }

  const planObj = PLANS[plan as keyof typeof PLANS];
  const amountCents = Math.round((interval === "annual" ? planObj.annualMonthly : planObj.monthly) * 100);

  const updated = await updateAccountPlan(
    account.id,
    plan as keyof typeof PLANS,
    interval,
    amountCents,
    isDemoMode() ? "demo" : "paid"
  );

  if (!updated) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, plan, interval, mode: isDemoMode() ? "demo" : "live" });
}
