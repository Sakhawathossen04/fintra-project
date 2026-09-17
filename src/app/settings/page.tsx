import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthAccount } from "@/lib/auth";
import { PLANS } from "@/lib/plans";
import PageShell from "@/components/marketing/PageShell";
import { Eyebrow } from "@/components/ui/Brand";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false },
};

export default async function SettingsPage() {
  const account = await getAuthAccount();
  if (!account) redirect("/login?redirect=/settings");

  const plan = PLANS[account.plan];
  const initials = account.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <Eyebrow>Settings</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Account settings</h1>
        <p className="mt-2 text-[15px] text-ink-mute">
          Your profile, plan, and account controls.
        </p>

        <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-7">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-full bg-charcoal text-[17px] font-semibold text-paper">
              {initials || "F"}
            </div>
            <div>
              <p className="text-lg font-semibold text-ink">{account.name}</p>
              <p className="text-[14px] text-ink-mute">{account.email}</p>
            </div>
          </div>

          <dl className="mt-7 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-faint">Plan</dt>
              <dd className="mt-1 flex items-center gap-2 text-[15px] font-medium text-ink">
                Fintra {plan.name}
                <Link href="/billing" className="text-[13px] font-medium text-copper-strong hover:underline">
                  Manage
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-ink-faint">Member since</dt>
              <dd className="mt-1 text-[15px] font-medium text-ink">
                {new Date(account.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-7">
          <h2 className="text-[15px] font-semibold text-ink">Workspace</h2>
          <p className="mt-1.5 text-[14px] text-ink-mute">
            Jump back into the product or manage how this website behaves for your account.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={process.env.NEXT_PUBLIC_WORKSPACE_URL ?? "https://final-product-one.vercel.app"}
              className="inline-flex h-10 items-center rounded-full bg-charcoal px-5 text-sm font-medium text-paper hover:bg-black"
            >
              Open workspace →
            </a>
            <Link
              href="/billing"
              className="inline-flex h-10 items-center rounded-full border border-line-strong px-5 text-sm font-medium text-ink hover:bg-paper-deep"
            >
              Billing
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-7">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Log out</h2>
            <p className="mt-1 text-[13.5px] text-ink-mute">End this session on this device.</p>
          </div>
          <form action="/api/workspace-logout" method="post">
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-full border border-line-strong px-5 text-sm font-medium text-ink transition-colors hover:bg-paper-deep"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
