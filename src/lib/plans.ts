import type { PlanId } from "./storage";

export type { PlanId };

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthly: number; // per month, billed monthly
  annualMonthly: number; // per month, billed annually
  features: string[];
  highlighted?: boolean;
}

/**
 * FINTRA pricing configuration.
 *
 * Editable configuration values — not final production pricing. Update here
 * without touching any component.
 */
export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "For trying DataLens on real data",
    monthly: 0,
    annualMonthly: 0,
    features: [
      "Full workspace — no account needed",
      "Automatic EDA & charts",
      "CSV & JSON uploads",
      "Free AI models included",
      "Save & export analysis",
      "Community support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "For analysts who live in data",
    monthly: 19,
    annualMonthly: 16,
    features: [
      "Everything in Free",
      "Premium AI models (GPT, Claude, Gemini)",
      "Unlimited report generation",
      "Larger upload limits",
      "Priority model access",
      "Priority support",
    ],
    highlighted: true,
  },
  max: {
    id: "max",
    name: "Max",
    tagline: "For teams that analyze together",
    monthly: 49,
    annualMonthly: 41,
    features: [
      "Everything in Pro",
      "Highest usage limits",
      "Advanced smart routing",
      "Shared workspaces",
      "Early access to new features",
      "Priority access at peak times",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For organizations at scale",
    monthly: -1, // custom pricing
    annualMonthly: -1,
    features: [
      "Everything in Max",
      "SSO / SAML",
      "Centralized billing & admin",
      "Audit logs",
      "Custom data retention",
      "Dedicated support & onboarding",
    ],
  },
};

export const PLAN_ORDER: PlanId[] = ["free", "pro", "max", "enterprise"];

export function priceFor(plan: PlanId, interval: "monthly" | "annual"): number {
  const p = PLANS[plan];
  return interval === "annual" ? p.annualMonthly : p.monthly;
}

export function planFeatureTable(): {
  category: string;
  rows: { label: string; free: string; pro: string; max: string; enterprise: string }[];
}[] {
  const y = "Yes";
  const n = "No";
  return [
    {
      category: "Workspace",
      rows: [
        { label: "Analysis workspace on web", free: y, pro: y, max: y, enterprise: y },
        { label: "Chat with your data", free: y, pro: y, max: y, enterprise: y },
        { label: "Automatic EDA & charts", free: y, pro: y, max: y, enterprise: y },
        { label: "Upload size limit", free: "6 MB", pro: "25 MB", max: "100 MB", enterprise: "Custom" },
        { label: "History & saved analyses", free: "7 days", pro: y, max: y, enterprise: y },
      ],
    },
    {
      category: "AI & reports",
      rows: [
        { label: "Free AI models", free: y, pro: y, max: y, enterprise: y },
        { label: "Premium AI models", free: n, pro: y, max: y, enterprise: y },
        { label: "Smart routing", free: "Basic", pro: "Standard", max: y, enterprise: y },
        { label: "Report generation", free: "3 / day", pro: "Unlimited", max: "Unlimited", enterprise: "Unlimited" },
        { label: "API access", free: n, pro: y, max: y, enterprise: y },
      ],
    },
    {
      category: "Security & admin",
      rows: [
        { label: "No-login workspace", free: y, pro: y, max: y, enterprise: y },
        { label: "SSO / SAML", free: n, pro: n, max: n, enterprise: y },
        { label: "Centralized billing", free: n, pro: n, max: n, enterprise: y },
        { label: "Audit logs", free: n, pro: n, max: n, enterprise: y },
        { label: "Custom data retention", free: n, pro: n, max: n, enterprise: y },
      ],
    },
  ];
}
