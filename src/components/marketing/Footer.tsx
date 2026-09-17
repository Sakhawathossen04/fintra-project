import Link from "next/link";
import { FOOTER_COLS } from "@/lib/site";
import { Logo } from "@/components/ui/Brand";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-[24ch] text-[13px] leading-relaxed text-ink-mute">
              Finance AI workspace for teams that work with numbers.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13.5px] text-ink-soft transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-[13px] text-ink-faint">
            © {year} Fintra Labs. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/terms" className="text-[13px] text-ink-soft hover:text-ink">
              Terms
            </Link>
            <Link href="/privacy" className="text-[13px] text-ink-soft hover:text-ink">
              Privacy
            </Link>
            <a href="mailto:hello@fintra.example.com" className="text-[13px] text-ink-soft hover:text-ink">
              hello@fintra.example.com
            </a>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Fintra on GitHub" className="text-ink-faint transition-colors hover:text-ink">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M12 .5C5.7.5.7 5.5.7 11.8c0 5 3.2 9.2 7.7 10.7.6.1.8-.3.8-.6v-2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.3-5.1-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C16.4 4.7 17.4 5 17.4 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.6 5.4-5.1 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.3 5.5 18.3.5 12 .5z"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Fintra on X" className="text-ink-faint transition-colors hover:text-ink">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M17.9 2H21l-6.8 7.8L22.5 22h-6.3l-5-6.5L5.6 22H2.5l7.3-8.4L1.5 2h6.4l4.5 6 5.5-6z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" aria-label="Fintra on LinkedIn" rel="noreferrer" className="text-ink-faint transition-colors hover:text-ink">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.3A1.8 1.8 0 1 1 8.3 6.5a1.8 1.8 0 0 1-1.8 1.8zM19 19h-3v-4.7c0-1.1 0-2.6-1.6-2.6s-1.8 1.2-1.8 2.5V19h-3v-9h2.9v1.2a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.6 2 3.6 4.7z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
