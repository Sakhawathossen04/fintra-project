import Link from "next/link";
import type { ReactNode } from "react";
import type { Route } from "next";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "outlineLight";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-full select-none disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-copper text-white hover:bg-copper-strong active:scale-[0.98] shadow-sm",
  secondary:
    "bg-surface text-ink border border-line-strong hover:border-ink-faint hover:bg-paper-deep active:scale-[0.98]",
  ghost: "text-ink-soft hover:text-ink hover:bg-paper-deep",
  dark: "bg-charcoal text-paper hover:bg-black active:scale-[0.98]",
  outlineLight: "border border-paper/30 text-paper hover:bg-paper/10",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ariaLabel,
}: BaseProps & { href: Route | URL } & { ariaLabel?: string }) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Button({
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled,
  children,
  ariaLabel,
}: BaseProps & {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
