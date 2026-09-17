import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Brand";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <div className="px-5 pt-6 sm:px-8">
        <Logo size="md" />
      </div>
      <main id="main" className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </main>
      <div className="px-5 pb-6 text-center text-[12.5px] text-ink-faint sm:px-8">
        <Link href="/" className="hover:text-ink-mute">
          fintra.com →
        </Link>
      </div>
    </div>
  );
}
