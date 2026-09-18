import type { Metadata } from "next";
import { getAuthAccount } from "@/lib/auth";
import { Logo } from "@/components/ui/Brand";
import { PLANS } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false },
};

/**
 * Signed-in users land here and continue into the built-in workspace.
 * The workspace itself never requires an account — this page exists for
 * account-context continuity (plan display, billing links).
 */
export default async function WorkspacePage() {
  const account = await getAuthAccount();

  if (account) {
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
              Continue into your DataLens workspace — you'll stay signed in to this
              website for billing and settings.
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

            <a
              href="/agent"
              className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-copper text-[15px] font-medium text-white transition-colors hover:bg-copper-strong"
            >
              Continue to workspace →
            </a>
            <a
              href="/settings"
              className="mt-2.5 flex h-11 w-full items-center justify-center rounded-full border border-line-strong text-[15px] font-medium text-ink transition-colors hover:bg-paper-deep"
            >
              Account settings
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Signed-out visitors go straight in — the workspace needs no login.
  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-5">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto w-fit">
          <Logo size="lg" />
        </div>
        <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-surface p-7 shadow-[var(--shadow-card)]">
          <h1 className="text-xl font-semibold tracking-tight text-ink">DataLens workspace</h1>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-mute">
            No account needed. Open the workspace and start analyzing — your threads
            stay private to this browser.
          </p>
          <a
            href="/agent"
            className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-copper text-[15px] font-medium text-white transition-colors hover:bg-copper-strong"
          >
            Open workspace →
          </a>
          <p className="mt-4 text-[12px] text-ink-faint">
            Optional:{" "}
            <a href="/login" className="underline hover:text-ink-mute">
              log in
            </a>{" "}
            for billing and settings.
          </p>
        </div>
      </div>
    </div>
  );
}
