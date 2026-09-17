import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Brand";
import { ButtonLink } from "@/components/ui/Button";

export { pageMeta } from "./site";

/** Consistent hero block for interior marketing pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-14 sm:px-8 lg:pb-16 lg:pt-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-[clamp(2.1rem,4.5vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.025em] text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-mute">{description}</p>
        )}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}

/** Dark CTA band used at the bottom of marketing pages. */
export function CtaBand({
  title,
  description,
  primary = { label: "Start using Fintra", href: "/signup" },
  secondary,
}: {
  title: string;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="border-t border-line bg-charcoal">
      <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 lg:py-20">
        <h2 className="mx-auto max-w-2xl text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-paper">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-paper/60">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={primary.href as never} size="lg">
            {primary.label}
          </ButtonLink>
          {secondary && (
            <ButtonLink href={secondary.href as never} variant="outlineLight" size="lg">
              {secondary.label}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}

/** Editorial two-column feature row. */
export function FeatureRow({
  title,
  description,
  bullets,
  visual,
  flip = false,
}: {
  title: string;
  description: string;
  bullets?: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
      <div className={flip ? "lg:order-2" : ""}>
        <h3 className="text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold leading-snug tracking-[-0.015em] text-ink">
          {title}
        </h3>
        <p className="mt-4 text-[15.5px] leading-relaxed text-ink-mute">{description}</p>
        {bullets && (
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[14.5px] text-ink-soft">
                <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-copper" />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={flip ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}

/** Compact capability card grid item. */
export function CapabilityCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href?: string;
}) {
  const inner = (
    <>
      <h3 className="text-[16.5px] font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-mute">{description}</p>
      {href && (
        <p className="mt-3 text-[13px] font-medium text-copper-strong">Learn more →</p>
      )}
    </>
  );
  const cls =
    "block h-full rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-all duration-200 hover:border-line-strong hover:shadow-[var(--shadow-card)]";
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
