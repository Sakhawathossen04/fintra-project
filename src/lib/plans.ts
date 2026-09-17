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
    tagline: "For trying Fintra on real work",
    monthly: 0,
    annualMonthly: 0,
    features: [
      "Workspace access on web",
      "Standard AI models",
      "Financial analysis chat",
      "Basic report generation",
      "3 agent runs per day",
      "Community support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "For finance professionals",
    monthly: 29,
    annualMonthly: 24,
    features: [
      "Everything in Free",
      "Premium AI models",
      "Unlimited agent runs",
      "Report & deck builder",
      "Reusable finance templates",
      "Automated workflows",
      "Priority support",
    ],
    highlighted: true,
  },
  max: {
    id: "max",
    name: "Max",
    tagline: "For teams that live in Fintra",
    monthly: 99,
    annualMonthly: 83,
    features: [
      "Everything in Pro",
      "Highest usage limits",
      "Advanced model routing",
      "Multi-agent workflows",
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
        { label: "Finance AI workspace on web", free: y, pro: y, max: y, enterprise: y },
        { label: "Financial analysis chat", free: y, pro: y, max: y, enterprise: y },
        { label: "Report & deck builder", free: "Basic", pro: y, max: y, enterprise: y },
        { label: "Projects & files", free: "Limited", pro: y, max: y, enterprise: y },
        { label: "History & templates", free: "7 days", pro: y, max: y, enterprise: y },
      ],
    },
    {
      category: "AI & agents",
      rows: [
        { label: "Standard AI models", free: y, pro: y, max: y, enterprise: y },
        { label: "Premium AI models", free: n, pro: y, max: y, enterprise: y },
        { label: "Agent runs", free: "3 / day", pro: "Unlimited", max: "Unlimited", enterprise: "Unlimited" },
        { label: "Automated workflows", free: n, pro: y, max: y, enterprise: y },
        { label: "Advanced model routing", free: n, pro: "Standard", max: y, enterprise: y },
      ],
    },
    {
      category: "Security & admin",
      rows: [
        { label: "Two-factor authentication", free: n, pro: y, max: y, enterprise: y },
        { label: "SSO / SAML", free: n, pro: n, max: n, enterprise: y },
        { label: "Centralized billing", free: n, pro: n, max: n, enterprise: y },
        { label: "Audit logs", free: n, pro: n, max: n, enterprise: y },
        { label: "Custom data retention", free: n, pro: n, max: n, enterprise: y },
      ],
    },
  ];
}
