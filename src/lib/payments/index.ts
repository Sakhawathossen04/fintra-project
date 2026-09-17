import type { PlanId } from "../storage";

/**
 * Payment integration boundary.
 *
 * Checkout runs in clearly-labeled DEMO mode until a payment provider is
 * configured. No payment is processed and no card data is collected; the
 * "Pay" step exists only to demonstrate the full journey (plan → checkout →
 * success/cancel → billing records → workspace).
 *
 * To enable live Stripe Checkout:
 *   1. Set STRIPE_SECRET_KEY / NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 *   2. Implement src/lib/payments/stripe.ts (create a Checkout Session via
 *      the Stripe REST API) and route the API handler below to it.
 *   3. Add a webhook endpoint to confirm payment before granting plan access.
 */
export type PaymentMode = "demo" | "live";

export function paymentMode(): PaymentMode {
  return process.env.STRIPE_SECRET_KEY ? "live" : "demo";
}

export function isDemoMode(): boolean {
  return paymentMode() === "demo";
}

/** Creates a payment intent/session descriptor for the given plan. */
export function createCheckoutDescriptor(plan: PlanId, interval: "monthly" | "annual") {
  return {
    mode: paymentMode(),
    plan,
    interval,
    createdAt: new Date().toISOString(),
  };
}
