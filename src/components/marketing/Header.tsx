"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { NAV } from "@/lib/site";
import { Logo } from "@/components/ui/Brand";

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export default function Header({ authed }: { authed: boolean }) {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  useEffect(() => {
    setOpen(null);
    setMobileSection(null);
    if (mobileOpen) {
      // Close the drawer after navigation has a tick to begin
      const t = setTimeout(() => setMobileOpen(false), 50);
      return () => clearTimeout(t);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open || mobileOpen
          ? "border-line bg-paper/90 backdrop-blur-md"
          : "border-transparent bg-paper"
      }`}
      onMouseLeave={() => setOpen(null)}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-1">
          <Logo />
          <nav aria-label="Primary" className="ml-6 hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {NAV.map((group) => {
                const hasMenu = Boolean(group.columns);
                const active =
                  pathname === group.href || pathname.startsWith(group.href + "/");
                return (
                  <li
                    key={group.label}
                    className="relative"
                    onMouseEnter={() => hasMenu && setOpen(group.label)}
                  >
                    {hasMenu ? (
                      <button
                        type="button"
                        aria-expanded={open === group.label}
                        onClick={() => setOpen(open === group.label ? null : group.label)}
                        className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors ${
                          open === group.label
                            ? "bg-paper-deep text-ink"
                            : "text-ink-soft hover:bg-paper-deep hover:text-ink"
                        }`}
                      >
                        {group.label}
                        <ChevronDown
                          aria-hidden
                          className={`size-3.5 transition-transform duration-200 ${
                            open === group.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={group.href!}
                        className={`block rounded-full px-3.5 py-2 text-sm transition-colors ${
                          active
                            ? "font-medium text-ink"
                            : "text-ink-soft hover:bg-paper-deep hover:text-ink"
                        }`}
                      >
                        {group.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {authed ? (
            <>
              <a
                href={process.env.NEXT_PUBLIC_WORKSPACE_URL ?? "/workspace"}
                className="hidden h-9 items-center gap-1.5 rounded-full px-4 text-sm text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink sm:inline-flex"
              >
                Open workspace
                <ArrowRight aria-hidden className="size-3.5" />
              </a>
              <Link
                href="/settings"
                className="hidden h-9 items-center rounded-full border border-line-strong px-4 text-sm text-ink transition-colors hover:bg-paper-deep sm:inline-flex"
              >
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden h-9 items-center rounded-full px-4 text-sm text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink sm:inline-flex"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center rounded-full bg-charcoal px-4 text-sm font-medium text-paper transition-colors hover:bg-black"
              >
                Start free
              </Link>
            </>
          )}
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            className="inline-grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-paper-deep lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {NAV.map((group) =>
        group.columns && open === group.label ? (
          <div
            key={group.label}
            className="absolute inset-x-0 top-full hidden border-b border-line bg-paper/95 backdrop-blur-md shadow-[var(--shadow-pop)] lg:block"
            onMouseEnter={() => setOpen(group.label)}
          >
            <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">
              <div className="col-span-9 grid grid-cols-2 gap-8">
                {group.columns.map((col) => (
                  <div key={col.heading}>
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                      {col.heading}
                    </p>
                    <ul className="space-y-1">
                      {col.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="group block rounded-lg px-3 py-2.5 transition-colors hover:bg-paper-deep"
                          >
                            <span className="block text-sm font-medium text-ink">{item.label}</span>
                            {item.desc && (
                              <span className="mt-0.5 block text-[13px] text-ink-mute">{item.desc}</span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {group.footer && (
                <div className="col-span-3 border-l border-line pl-8">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                    Quick links
                  </p>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href={group.footer.href}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-copper-strong transition-colors hover:bg-copper-soft"
                      >
                        {group.footer.label}
                        <ArrowRight aria-hidden className="size-4" />
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : null
      )}

      {mobileOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-paper lg:hidden">
          <nav aria-label="Mobile" className="px-5 pb-24 pt-4">
            <ul className="divide-y divide-line">
              {NAV.map((group) => (
                <li key={group.label}>
                  {group.columns ? (
                    <div>
                      <button
                        type="button"
                        aria-expanded={mobileSection === group.label}
                        onClick={() =>
                          setMobileSection(mobileSection === group.label ? null : group.label)
                        }
                        className="flex w-full items-center justify-between py-4 text-[15px] font-medium text-ink"
                      >
                        {group.label}
                        <ChevronDown
                          aria-hidden
                          className={`size-4 text-ink-faint transition-transform ${
                            mobileSection === group.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileSection === group.label && (
                        <div className="pb-4">
                          {group.columns.map((col) => (
                            <div key={col.heading} className="mb-3">
                              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                                {col.heading}
                              </p>
                              <ul className="space-y-0.5">
                                {col.items.map((item) => (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      className="block rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-paper-deep hover:text-ink"
                                    >
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          {group.footer && (
                            <Link
                              href={group.footer.href}
                              className="mt-1 block px-3 py-2 text-sm font-medium text-copper-strong"
                            >
                              {group.footer.label}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={group.href!}
                      className="block py-4 text-[15px] font-medium text-ink"
                    >
                      {group.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="block py-4 text-[15px] font-medium text-ink"
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="mt-6 flex flex-col gap-2.5">
              {authed ? (
                <>
                  <a
                    href={process.env.NEXT_PUBLIC_WORKSPACE_URL ?? "/workspace"}
                    className="flex h-11 items-center justify-center rounded-full bg-charcoal text-sm font-medium text-paper"
                  >
                    Open workspace
                  </a>
                  <Link
                    href="/settings"
                    className="flex h-11 items-center justify-center rounded-full border border-line-strong text-sm font-medium text-ink"
                  >
                    Settings
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex h-11 items-center justify-center rounded-full border border-line-strong text-sm font-medium text-ink"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="flex h-11 items-center justify-center rounded-full bg-charcoal text-sm font-medium text-paper"
                  >
                    Start free
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
