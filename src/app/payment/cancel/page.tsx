import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Brand";

export const metadata: Metadata = {
  title: "Payment canceled",
  robots: { index: false },
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-dvh bg-paper px-5 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto w-fit">
          <Logo />
        </div>
        <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-surface p-8 shadow-[var(--shadow-card)]">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-paper-deep">
            <svg viewBox="0 0 24 24" className="size-7 text-ink-mute" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">Checkout canceled</h1>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-mute">
            No charge was made. Your plan hasn't changed — you can pick up where you left off
            whenever you're ready.
          </p>
          <div className="mt-7 space-y-2.5">
            <Link
              href="/pricing"
              className="flex h-11 w-full items-center justify-center rounded-full bg-copper text-[15px] font-medium text-white hover:bg-copper-strong"
            >
              Back to pricing
            </Link>
            <Link
              href="/workspace"
              className="flex h-11 w-full items-center justify-center rounded-full border border-line-strong text-[15px] font-medium text-ink hover:bg-paper-deep"
            >
              Continue on Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
