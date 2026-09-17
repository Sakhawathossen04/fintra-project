import type { ReactNode } from "react";

/** A calm window frame for product visuals — no fake browser chrome overload. */
export default function Window({
  title,
  children,
  dark = false,
  className = "",
}: {
  title: string;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-card)] border shadow-[var(--shadow-card)] ${
        dark ? "border-white/10 bg-charcoal-soft" : "border-line bg-surface"
      } ${className}`}
    >
      <div
        className={`flex items-center gap-2 border-b px-4 py-2.5 ${
          dark ? "border-white/10" : "border-line"
        }`}
      >
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
        </span>
        <span
          className={`ml-2 font-mono text-[11px] ${
            dark ? "text-paper/40" : "text-ink-faint"
          }`}
        >
          {title}
        </span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
