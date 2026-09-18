import Link from "next/link";
import { ChevronDown } from "lucide-react";

/** DataLens wordmark + lens mark (original). */
export function Logo({ dark = false, size = "md" }: { dark?: boolean; size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "text-[22px]" : size === "sm" ? "text-[17px]" : "text-[19px]";
  return (
    <Link
      href="/"
      aria-label="DataLens home"
      className={`inline-flex items-center gap-2 ${dark ? "text-paper" : "text-ink"}`}
    >
      <span
        aria-hidden
        className={`grid place-items-center rounded-[7px] size-[26px] ${
          dark ? "bg-paper text-charcoal" : "bg-charcoal text-paper"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-[15px]" fill="none">
          <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="2.2" />
          <path d="m15 15 5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M8.2 10.5h4.6M10.5 8.2v4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className={`font-semibold tracking-tight ${dims}`}>DataLens</span>
    </Link>
  );
}

/** Small copper dot used as an accent in sections. */
export function AccentDot() {
  return <span aria-hidden className="inline-block size-1.5 rounded-full bg-copper" />;
}

export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
        dark ? "text-copper" : "text-copper-strong"
      }`}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <div className="mb-4">
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2
        className={`text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.02em] ${
          dark ? "text-paper" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[17px] leading-relaxed ${
            dark ? "text-paper/60" : "text-ink-mute"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-line py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="pt-3 text-[15px] leading-relaxed text-ink-mute">{children}</div>
    </details>
  );
}
