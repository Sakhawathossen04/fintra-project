import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthAccount } from "@/lib/auth";
import { PLANS, priceFor } from "@/lib/plans";
import { getBillingRecords } from "@/lib/storage";
import { isDemoMode } from "@/lib/payments";
import PageShell from "@/components/marketing/PageShell";
import { Eyebrow } from "@/components/ui/Brand";

export const metadata: Metadata = {
  title: "Billing",
  robots: { index: false },
};

export default async function BillingPage() {
  const account = await getAuthAccount();
  if (!account) redirect("/login?redirect=/billing");

  const records = await getBillingRecords(account.id);
  const plan = PLANS[account.plan];

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <Eyebrow>Billing</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          Plans & billing
        </h1>
        <p className="mt-2 text-[15px] text-ink-mute">
          Manage your subscription and review billing history.
        </p>

        {isDemoMode() && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-[13px] text-amber-800">
              <span className="font-semibold">Demo billing:</span> no payment provider is
              connected, so plan changes are recorded in demo mode without charges.
            </p>
          </div>
        )}

        {/* Current plan */}
        <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                Current plan
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                DataLens {plan.name}
              </p>
              <p className="mt-1 text-[14px] text-ink-mute">
                {plan.tagline}
                {account.plan !== "free" && account.plan !== "enterprise" && (
                  <> · billed {account.billingInterval}</>
                )}
              </p>
            </div>
            {account.plan === "free" && (
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center rounded-full bg-copper px-5 text-sm font-medium text-white hover:bg-copper-strong"
              >
                Upgrade
              </Link>
            )}
          </div>

          <ul className="mt-5 grid gap-2 border-t border-line pt-5 sm:grid-cols-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13.5px] text-ink-soft">
                <svg viewBox="0 0 24 24" className="mt-[3px] size-3.5 shrink-0 text-sage" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Other plans */}
        <h2 className="mt-10 text-lg font-semibold text-ink">Switch plan</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {(["free", "pro", "max"] as const)
            .filter((id) => id !== account.plan)
            .map((id) => {
              const p = PLANS[id];
              return (
                <div key={id} className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                  <p className="text-[14.5px] font-semibold text-ink">{p.name}</p>
                  <p className="mt-1 text-[13px] text-ink-mute">
                    {p.monthly === 0 ? "Free" : `$${priceFor(id, "monthly")}/mo`}
                  </p>
                  <Link
                    href={id === "free" ? "/api/billing/downgrade" : `/checkout?plan=${id}`}
                    className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-full border border-line-strong text-[13.5px] font-medium text-ink hover:bg-paper-deep"
                  >
                    {id === "free" ? "Switch to Free" : `Choose ${p.name}`}
                  </Link>
                </div>
              );
            })}
        </div>

        {/* Billing history */}
        <h2 className="mt-10 text-lg font-semibold text-ink">Billing history</h2>
        {records.length === 0 ? (
          <p className="mt-3 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface px-5 py-8 text-center text-[14px] text-ink-mute">
            No billing events yet.
          </p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-faint">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 text-ink-soft">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 font-medium text-ink">DataLens {PLANS[r.plan].name}</td>
                    <td className="px-5 py-3 text-ink-soft">${(r.amountCents / 100).toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-medium ${
                          r.status === "demo" ? "bg-amber-50 text-amber-700" : "bg-sage-soft text-sage"
                        }`}
                      >
                        {r.status === "demo" ? "demo" : "paid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-6">
          <Link href="/workspace" className="text-[14px] font-medium text-copper-strong hover:underline">
            Back to workspace →
          </Link>
          <form action="/api/workspace-logout" method="post" className="ml-auto">
            <button type="submit" className="text-[14px] text-ink-mute hover:text-ink">
              Log out
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
