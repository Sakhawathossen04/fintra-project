"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PLANS, priceFor } from "@/lib/plans";
import type { PlanId } from "@/lib/storage";

type Stage = "review" | "pay" | "processing";

export default function CheckoutClient({
  plan: planId,
  currentPlan,
}: {
  plan: PlanId;
  currentPlan: PlanId;
}) {
  const router = useRouter();
  const plan = PLANS[planId];
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  const [stage, setStage] = useState<Stage>("review");
  const [error, setError] = useState<string | null>(null);

  const price = priceFor(planId, interval);
  const annualTotal = planId !== "free" ? priceFor(planId, "annual") * 12 : 0;

  async function confirm() {
    setStage("processing");
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, interval }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Checkout failed. Please try again.");
        setStage("pay");
        return;
      }
      router.push(
        `/payment/success?plan=${planId}${data.mode === "demo" ? "&demo=1" : ""}`
      );
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setStage("pay");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Main column */}
      <div>
        {stage === "review" && (
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink">Order summary</h2>

            <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-line bg-paper p-5">
              <div>
                <p className="text-[15px] font-semibold text-ink">Fintra {plan.name}</p>
                <p className="mt-0.5 text-[13px] text-ink-mute">{plan.tagline}</p>
              </div>
              <p className="whitespace-nowrap text-[15px] font-semibold text-ink">
                {planId === "free" ? "$0" : `$${price}`}
                <span className="text-[13px] font-normal text-ink-faint"> / mo</span>
              </p>
            </div>

            {planId !== "free" && (
              <fieldset className="mt-6">
                <legend className="mb-2.5 text-[13px] font-medium text-ink-soft">Billing interval</legend>
                <div className="grid grid-cols-2 gap-2.5">
                  {(["monthly", "annual"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInterval(opt)}
                      aria-pressed={interval === opt}
                      className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                        interval === opt
                          ? "border-copper bg-copper-soft"
                          : "border-line-strong hover:border-ink-faint"
                      }`}
                    >
                      <span className="block text-[14px] font-medium text-ink capitalize">{opt}</span>
                      <span className="mt-0.5 block text-[12px] text-ink-mute">
                        {opt === "annual" ? `Save $${(plan.monthly - plan.annualMonthly) * 12}/yr` : "Pay as you go"}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {planId !== "free" && (
              <dl className="mt-6 space-y-2 border-t border-line pt-5 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-ink-mute">
                    {interval === "annual" ? `Annual (${price}/mo × 12)` : "Monthly subtotal"}
                  </dt>
                  <dd className="font-medium text-ink">${interval === "annual" ? annualTotal : price}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-mute">Tax</dt>
                  <dd className="text-ink-faint">Calculated at payment</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2.5 text-[15px]">
                  <dt className="font-semibold text-ink">Total due today</dt>
                  <dd className="font-semibold text-ink">
                    ${interval === "annual" ? annualTotal : price}
                  </dd>
                </div>
              </dl>
            )}

            <div className="mt-7">
              <Button size="lg" className="w-full" onClick={() => setStage("pay")}>
                {planId === "free" ? "Confirm Free plan" : "Continue to payment"}
              </Button>
            </div>
            <p className="mt-3.5 text-center text-[12px] leading-relaxed text-ink-faint">
              Cancel anytime from Settings → Billing.
            </p>
          </div>
        )}

        {stage === "pay" && (
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink">Payment</h2>

            {/* Integration boundary notice — honest about demo mode */}
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
              <p className="text-[13px] font-semibold text-amber-800">Demo checkout</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-amber-800/80">
                A payment provider isn't connected yet, so no charge will be made and no
                card details are collected. This step demonstrates the full subscription
                journey; the Stripe integration point is prepared in
                <span className="font-mono"> src/lib/payments/</span>.
              </p>
            </div>

            <div className="mt-6 space-y-4 opacity-90">
              <div>
                <label htmlFor="cc" className="mb-1.5 block text-[13px] font-medium text-ink-soft">
                  Card information
                </label>
                <input
                  id="cc"
                  disabled
                  placeholder="1234 1234 1234 1234"
                  className="h-11 w-full rounded-[10px] border border-line-strong bg-paper px-3.5 font-mono text-[14px] text-ink placeholder:text-ink-faint"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="exp" className="mb-1.5 block text-[13px] font-medium text-ink-soft">
                    Expiry
                  </label>
                  <input
                    id="exp"
                    disabled
                    placeholder="MM / YY"
                    className="h-11 w-full rounded-[10px] border border-line-strong bg-paper px-3.5 font-mono text-[14px] text-ink placeholder:text-ink-faint"
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="mb-1.5 block text-[13px] font-medium text-ink-soft">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    disabled
                    placeholder="CVC"
                    className="h-11 w-full rounded-[10px] border border-line-strong bg-paper px-3.5 font-mono text-[14px] text-ink placeholder:text-ink-faint"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-700">
                {error}
              </p>
            )}

            <div className="mt-7 flex gap-2.5">
              <Button variant="secondary" onClick={() => setStage("review")}>
                Back
              </Button>
              <Button className="flex-1" onClick={confirm}>
                {planId === "free" ? "Confirm plan" : `Pay $${interval === "annual" ? annualTotal : price}`}
              </Button>
            </div>
          </div>
        )}

        {stage === "processing" && (
          <div className="grid place-items-center rounded-[var(--radius-card)] border border-line bg-surface p-16">
            <div className="text-center">
              <div className="mx-auto size-10 animate-spin rounded-full border-2 border-line border-t-copper" aria-hidden />
              <p className="mt-5 text-[15px] font-medium text-ink">Processing your plan…</p>
              <p className="mt-1 text-[13px] text-ink-mute">This takes just a moment.</p>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside>
        <div className="rounded-[var(--radius-card)] border border-line bg-paper p-6 lg:sticky lg:top-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            What's included
          </p>
          <p className="mt-2 text-[15px] font-semibold text-ink">Fintra {plan.name}</p>
          <ul className="mt-4 space-y-2.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-ink-soft">
                <svg viewBox="0 0 24 24" className="mt-[3px] size-3.5 shrink-0 text-sage" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
