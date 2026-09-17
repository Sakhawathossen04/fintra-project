import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthAccount } from "@/lib/auth";
import { PLANS } from "@/lib/plans";
import type { PlanId } from "@/lib/storage";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { Logo } from "@/components/ui/Brand";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const account = await getAuthAccount();
  if (!account) {
    const sp = await searchParams;
    redirect(`/login?redirect=/checkout?plan=${sp.plan ?? "pro"}`);
  }

  const sp = await searchParams;
  const raw = sp.plan ?? "pro";
  const plan = (["free", "pro", "max"] as const).includes(raw as "free" | "pro" | "max")
    ? (raw as "free" | "pro" | "max")
    : null;

  if (!plan) {
    return (
      <div className="min-h-dvh bg-paper px-5 py-16">
        <div className="mx-auto max-w-md text-center">
          <Logo />
          <h1 className="mt-8 text-xl font-semibold text-ink">Choose a plan first</h1>
          <p className="mt-2 text-[14.5px] text-ink-mute">
            Enterprise is customized with our team — contact sales or pick a self-serve plan.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center rounded-full bg-copper px-5 text-sm font-medium text-white"
            >
              View pricing
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center rounded-full border border-line-strong px-5 text-sm font-medium text-ink"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <Link href="/pricing" className="text-[13.5px] text-ink-mute hover:text-ink">
            ← Change plan
          </Link>
        </div>

        {/* Progress steps */}
        <ol className="mb-8 flex items-center gap-2 text-[12.5px] font-medium">
          {["Plan", "Payment", "Workspace"].map((s, i) => {
            const stepNum = i + 1;
            const current = ["Plan", "Payment", "Workspace"][0];
            const state = i === 1 ? "current" : i === 0 ? "done" : "todo";
            void current;
            return (
              <li key={s} className="flex items-center gap-2">
                <span
                  className={`grid size-5 place-items-center rounded-full font-mono text-[10.5px] ${
                    state === "done"
                      ? "bg-sage text-white"
                      : state === "current"
                        ? "bg-copper text-white"
                        : "border border-line-strong text-ink-faint"
                  }`}
                >
                  {state === "done" ? "✓" : stepNum}
                </span>
                <span className={state === "current" ? "text-ink" : "text-ink-faint"}>{s}</span>
                {i < 2 && <span aria-hidden className="mx-1 h-px w-6 bg-line-strong" />}
              </li>
            );
          })}
        </ol>

        <h1 className="text-2xl font-semibold tracking-tight text-ink">Checkout</h1>
        <p className="mt-1.5 text-[14.5px] text-ink-mute">
          Signed in as {account!.email}
        </p>

        <div className="mt-8">
          <CheckoutClient plan={plan} currentPlan={account!.plan} />
        </div>
      </div>
    </div>
  );
}
