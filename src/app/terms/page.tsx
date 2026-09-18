import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import { PageHero } from "@/lib/marketing";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Terms of Service",
  description: "DataLens Terms of Service.",
  path: "/terms",
});

const SECTIONS: { h: string; ps: string[] }[] = [
  {
    h: "1. Acceptance",
    ps: [
      "By creating a DataLens account or using the service, you agree to these Terms. If you use DataLens on behalf of an organization, you represent that you have authority to bind that organization.",
    ],
  },
  {
    h: "2. The service",
    ps: [
      "DataLens provides a AI analysis workspace including multi-model AI chat, data analysis, report generation, agents, and workflows. Features evolve; material reductions to paid functionality will be communicated in advance.",
      "AI outputs are drafts for your review. DataLens is decision support, not professional advice; you remain responsible for how outputs are used in your work.",
    ],
  },
  {
    h: "3. Accounts",
    ps: [
      "You are responsible for the accuracy of your registration information, for safeguarding your credentials, and for activity under your account. Notify us promptly of unauthorized use.",
    ],
  },
  {
    h: "4. Acceptable use",
    ps: [
      "Do not use DataLens to violate laws or others' rights, to process data you lack permission to process, or to attempt to disrupt or reverse-engineer the service.",
    ],
  },
  {
    h: "5. Plans and payment",
    ps: [
      "Free, Pro, and Max plans are described on the pricing page. Paid plans renew per the selected billing interval until canceled. Where checkout is presented in demo mode, no payment is processed and no charge is made.",
      "Prices exclude applicable taxes. Enterprise terms are set in a separate agreement.",
    ],
  },
  {
    h: "6. Data",
    ps: [
      "Your workspace content belongs to you. We process it only to provide the service, as described in the Privacy Policy. You can export your content; on account deletion, it is removed from active systems.",
    ],
  },
  {
    h: "7. Disclaimers and liability",
    ps: [
      "The service is provided 'as is' except as expressly stated. To the maximum extent permitted by law, DataLens's aggregate liability is limited to amounts paid in the 12 months preceding the claim.",
    ],
  },
  {
    h: "8. Changes and contact",
    ps: [
      "We may update these Terms with notice for material changes. Questions: hello@datalens.example.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service."
        description="The agreement between you and DataLens. Written to be read."
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
          {SECTIONS.map((s) => (
            <div key={s.h} className="mb-10">
              <h2 className="text-[19px] font-semibold tracking-tight text-ink">{s.h}</h2>
              {s.ps.map((p, i) => (
                <p key={i} className="mt-3 text-[14.5px] leading-relaxed text-ink-mute">
                  {p}
                </p>
              ))}
            </div>
          ))}
          <p className="text-[13px] text-ink-faint">Last updated: September 2026</p>
        </div>
      </section>
    </PageShell>
  );
}
