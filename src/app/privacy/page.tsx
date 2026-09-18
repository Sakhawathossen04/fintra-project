import type { Metadata } from "next";
import PageShell from "@/components/marketing/PageShell";
import { PageHero } from "@/lib/marketing";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description: "How DataLens collects, uses, and protects personal data.",
  path: "/privacy",
});

const SECTIONS: { h: string; ps: string[] }[] = [
  {
    h: "What we collect",
    ps: [
      "Account data: your name, email address, and hashed password.",
      "Workspace content: the files, conversations, and outputs you create in DataLens.",
      "Billing records: plan selections and billing events for your account.",
      "Contact submissions: what you send us through the contact form.",
    ],
  },
  {
    h: "How we use it",
    ps: [
      "To operate the service: authenticate you, store your workspace, and process billing.",
      "To communicate with you about your account and, only with a basis to do so, about DataLens.",
      "We do not sell personal data. We do not use your workspace content to train AI models.",
    ],
  },
  {
    h: "AI model providers",
    ps: [
      "Requests you send may be processed by AI model providers (such as GPT, Claude, Gemini, DeepSeek, and Qwen) to generate responses. Provider handling is documented on the Security page.",
    ],
  },
  {
    h: "Cookies",
    ps: [
      "We use a single essential cookie for your sign-in session. We do not use advertising or third-party tracking cookies.",
    ],
  },
  {
    h: "Retention and deletion",
    ps: [
      "Workspace content persists while your account is active. You can export your content at any time; deleting your account removes content from active systems.",
      "Billing records are retained as required for record-keeping.",
    ],
  },
  {
    h: "Your rights and contact",
    ps: [
      "Depending on your jurisdiction, you may have rights to access, correct, export, or delete your personal data. To exercise them or ask anything about this policy: hello@datalens.example.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy."
        description="What we collect, how we use it, and what we never do."
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
