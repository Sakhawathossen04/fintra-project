import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/AuthForm";
import { getAuthAccount } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create your DataLens account and start working with numbers.",
  robots: { index: false },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const account = await getAuthAccount();
  const params = await searchParams;

  if (account) {
    const target =
      params.redirect && params.redirect.startsWith("/") && !params.redirect.startsWith("//")
        ? params.redirect
        : "/workspace";
    redirect(target);
  }

  return (
    <AuthLayout>
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-7 shadow-[var(--shadow-card)] sm:p-8">
        <h1 className="text-[22px] font-semibold tracking-tight text-ink">Create your account</h1>
        <p className="mt-1.5 text-[14px] text-ink-mute">
          Start free — no credit card required.
        </p>

        <ul className="mt-6 space-y-2 rounded-xl border border-line bg-paper px-4 py-3.5">
          {[
            "Workspace access with standard AI models",
            "3 agent runs per day",
            "Upgrade to Pro or Max anytime",
          ].map((li) => (
            <li key={li} className="flex items-start gap-2 text-[13px] text-ink-soft">
              <span aria-hidden className="mt-[6px] size-1.5 shrink-0 rounded-full bg-copper" />
              {li}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <SignupForm />
        </div>
      </div>
    </AuthLayout>
  );
}
