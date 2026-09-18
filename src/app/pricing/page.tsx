import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/marketing/PageShell";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading, Eyebrow, Disclosure } from "@/components/ui/Brand";
import { PlanCards, ComparisonTable } from "@/components/pricing/PricingClient";
import { getAuthAccount } from "@/lib/auth";

export const metadata: Metadata = pageMetaSafe();

function pageMetaSafe() {
  // Imported lazily to keep this file readable; matches lib/site pageMeta shape.
  return {
    title: "Pricing",
    description:
      "DataLens plans: start free, upgrade to Pro or Max as your data work scales, or talk to us about Enterprise.",
    openGraph: {
      title: "Pricing | DataLens",
      description:
        "Start free, upgrade to Pro or Max as your data work scales, or talk to us about Enterprise.",
    },
  };
}

const FAQS = [
  {
    q: "What's included in the Free plan?",
    a: "The Free plan includes the DataLens workspace with standard AI models, data analysis chat, basic report generation, and three agent runs per day — enough to try DataLens on real work.",
  },
  {
    q: "What's the difference between Pro and Max?",
    a: "Pro is built for individual data professionals: premium models, unlimited agent runs, reports, templates, and workflows. Max raises usage limits substantially and adds advanced model routing and multi-agent workflows for teams that live in DataLens all day.",
  },
  {
    q: "How does annual billing work?",
    a: "Annual billing applies a discount (shown on each plan) and is billed once up front. You can switch between monthly and annual from Settings → Billing, with unused time credited.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Yes. Upgrades take effect immediately; downgrades apply at the end of the billing period. You can manage everything from Settings → Billing, and cancel whenever you like — your workspace stays available on Free.",
  },
  {
    q: "How does Enterprise work?",
    a: "Enterprise adds SSO/SAML, centralized billing, audit logs, and custom data retention, with pricing based on your organization. Contact sales and we'll scope it with you.",
  },
];

export default async function PricingPage() {
  const account = await getAuthAccount();

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 lg:pt-20">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Pricing"
            title="Plans for every stage of data work."
            description="Start free and upgrade when the work demands it. No credit card required to begin."
          />
        </Reveal>
        <Reveal delay={0.1} className="mt-12">
          <PlanCards authed={Boolean(account)} />
        </Reveal>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <Reveal>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink">
              Compare features across plans
            </h2>
          </Reveal>
          <ComparisonTable />
        </div>
      </section>

      {/* Enterprise band */}
      <section className="border-t border-line bg-charcoal">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:px-8 lg:flex-row lg:items-center">
          <Reveal>
            <div>
              <Eyebrow dark>Enterprise</Eyebrow>
              <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-paper">
                Security, controls, and support for large organizations.
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-paper/60">
                SSO/SAML, centralized billing, audit logs, custom data retention, and a team
                that helps you roll DataLens out across Data analysis.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-full bg-paper px-6 text-[15px] font-medium text-charcoal transition-colors hover:bg-white"
            >
              Contact sales
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <Reveal>
            <SectionHeading align="center" eyebrow="FAQ" title="Pricing questions, answered." />
          </Reveal>
          <div className="mt-10">
            {FAQS.map((f) => (
              <Disclosure key={f.q} title={f.q}>
                {f.a}
              </Disclosure>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
