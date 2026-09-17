import type { Metadata } from "next";
import Link from "next/link";
import { getAuthAccount } from "@/lib/auth";
import { PLANS } from "@/lib/plans";
import { Logo } from "@/components/ui/Brand";

export const metadata: Metadata = {
  title: "Payment successful",
  robots: { index: false },
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; demo?: string }>;
}) {
  const account = await getAuthAccount();
  const sp = await searchParams;
  const planId = (sp.plan ?? "pro") as keyof typeof PLANS;
  const plan = PLANS[planId] ?? PLANS.pro;
  const WS_URL = process.env.NEXT_PUBLIC_WORKSPACE_URL ?? "https://final-product-one.vercel.app";

  return (
    <div className="min-h-dvh bg-paper px-5 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto w-fit">
          <Logo />
        </div>

        <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-card)]">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-sage-soft">
            <svg viewBox="0 0 24 24" className="size-7 text-sage" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
            You're on {plan.name}
          </h1>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-mute">
            {sp.demo
              ? "Your plan was updated in demo mode — no payment was processed. When live payments are connected, this page confirms a real subscription."
              : "Your subscription is active. Welcome aboard."}
          </p>

          <div className="mt-6 rounded-xl border border-line bg-paper px-4 py-3.5 text-left">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-ink-mute">Plan</span>
              <span className="font-medium text-ink">Fintra {plan.name}</span>
            </div>
            {account && (
              <div className="mt-2 flex items-center justify-between text-[13px]">
                <span className="text-ink-mute">Account</span>
                <span className="truncate font-medium text-ink">{account.email}</span>
              </div>
            )}
          </div>

          <div className="mt-7 space-y-2.5">
            <a
              href={WS_URL}
              className="flex h-11 w-full items-center justify-center rounded-full bg-copper text-[15px] font-medium text-white hover:bg-copper-strong"
            >
              Continue to workspace →
            </a>
            <Link
              href="/billing"
              className="flex h-11 w-full items-center justify-center rounded-full border border-line-strong text-[15px] font-medium text-ink hover:bg-paper-deep"
            >
              Manage billing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
