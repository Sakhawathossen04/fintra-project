import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthAccount } from "@/lib/auth";
import { Logo } from "@/components/ui/Brand";
import { PLANS } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false },
};

const WS_URL = process.env.NEXT_PUBLIC_WORKSPACE_URL ?? "https://final-product-one.vercel.app";

export default async function WorkspacePage() {
  const account = await getAuthAccount();
  if (!account) redirect("/login?redirect=/workspace");

  const plan = PLANS[account.plan];

  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-5">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto w-fit">
          <Logo size="lg" />
        </div>

        <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-surface p-7 shadow-[var(--shadow-card)]">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-copper-soft">
            <svg viewBox="0 0 24 24" className="size-6 text-copper-strong" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            You're signed in{account.name ? `, ${account.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-mute">
            Your Fintra workspace runs in the product app. Continue to open it —
            you'll stay signed in to this website for billing and settings.
          </p>

          <div className="mt-5 rounded-xl border border-line bg-paper px-4 py-3 text-left">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-ink-mute">Plan</span>
              <span className="font-medium text-ink">{plan.name}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[13px]">
              <span className="text-ink-mute">Account</span>
              <span className="truncate font-medium text-ink">{account.email}</span>
            </div>
          </div>

          <div className="mt-6 space-y-2.5">
            <a
              href={WS_URL}
              className="flex h-11 w-full items-center justify-center rounded-full bg-copper text-[15px] font-medium text-white transition-colors hover:bg-copper-strong"
            >
              Continue to workspace →
            </a>
            <a
              href={`${WS_URL}?auth=fintra&email=${encodeURIComponent(account.email)}&plan=${account.plan}`}
              className="flex h-11 w-full items-center justify-center rounded-full border border-line-strong text-[15px] font-medium text-ink transition-colors hover:bg-paper-deep"
            >
              Open with account context
            </a>
          </div>

          <p className="mt-5 text-[12px] leading-relaxed text-ink-faint">
            The workspace is the existing Fintra product at {new URL(WS_URL).host}.
            This handoff preserves it unchanged.
          </p>
        </div>
      </div>
    </div>
  );
}
