import Link from "next/link";
import { Logo } from "@/components/ui/Brand";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <div className="px-5 pt-6 sm:px-8">
        <Logo />
      </div>
      <main id="main" className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="max-w-md text-center">
          <p className="font-mono text-[13px] tracking-widest text-copper-strong">404</p>
          <h1 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-tight text-ink">
            This page doesn't exist.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-mute">
            The link may be outdated or mistyped. Here's where most people are headed:
          </p>
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
            <Link
              href="/"
              className="flex h-11 items-center justify-center rounded-full bg-copper text-[14.5px] font-medium text-white hover:bg-copper-strong"
            >
              Home
            </Link>
            <Link
              href="/product"
              className="flex h-11 items-center justify-center rounded-full border border-line-strong text-[14.5px] font-medium text-ink hover:bg-paper-deep"
            >
              Product
            </Link>
            <Link
              href="/pricing"
              className="flex h-11 items-center justify-center rounded-full border border-line-strong text-[14.5px] font-medium text-ink hover:bg-paper-deep"
            >
              Pricing
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_WORKSPACE_URL ?? "https://final-product-one.vercel.app"}
              className="flex h-11 items-center justify-center rounded-full border border-line-strong text-[14.5px] font-medium text-ink hover:bg-paper-deep"
            >
              Workspace
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
