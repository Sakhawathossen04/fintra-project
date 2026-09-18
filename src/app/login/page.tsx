import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/AuthForm";
import { getAuthAccount } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your DataLens workspace.",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const account = await getAuthAccount();
  const params = await searchParams;

  // Authenticated users arriving at /login go straight to the workspace.
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
        <h1 className="text-[22px] font-semibold tracking-tight text-ink">Welcome back</h1>
        <p className="mt-1.5 text-[14px] text-ink-mute">Log in to continue to your workspace.</p>

        <div className="mt-6 rounded-xl border border-line bg-paper px-4 py-3">
          <p className="text-[13px] text-ink-mute">
            <span className="font-medium text-ink">Single sign-on:</span> available on{" "}
            <Link href="/pricing" className="text-copper-strong hover:underline">
              Enterprise
            </Link>
            . Sign in below with your email to continue.
          </p>
        </div>

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </AuthLayout>
  );
}
