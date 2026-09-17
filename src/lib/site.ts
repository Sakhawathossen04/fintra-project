import type { Metadata } from "next";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { isDemoMode } from "@/lib/payments";

/**
 * Shared metadata helper — every public page composes its SEO metadata here.
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fintra.example.com";
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: `${siteUrl}${opts.path}` },
    openGraph: {
      title: `${opts.title} | Fintra`,
      description: opts.description,
      url: `${siteUrl}${opts.path}`,
      siteName: "Fintra",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${opts.title} | Fintra`,
      description: opts.description,
    },
  };
}

/* ── Navigation information architecture ── */

export interface NavChild {
  label: string;
  href: string;
  desc?: string;
}
export interface NavGroup {
  label: string;
  href?: string;
  columns?: { heading: string; items: NavChild[] }[];
  footer?: NavChild;
}

export const NAV: NavGroup[] = [
  {
    label: "Product",
    href: "/product",
    columns: [
      {
        heading: "Platform",
        items: [
          { label: "Finance AI workspace", href: "/product/workspace", desc: "One place for finance work" },
          { label: "Multi-model AI", href: "/product/models", desc: "Choose the right model per task" },
          { label: "Model routing", href: "/product/model-routing", desc: "Route work automatically" },
        ],
      },
      {
        heading: "Capabilities",
        items: [
          { label: "Financial analysis", href: "/product/analysis", desc: "Answers with real numbers" },
          { label: "Report builder", href: "/product/reports", desc: "Decks and docs from your data" },
          { label: "Finance agents", href: "/product/agents", desc: "Recurring finance tasks" },
          { label: "Workflows", href: "/product/workflows", desc: "Close, forecast, report" },
        ],
      },
    ],
    footer: { label: "Explore the full platform →", href: "/product" },
  },
  {
    label: "Solutions",
    href: "/solutions",
    columns: [
      {
        heading: "By team",
        items: [
          { label: "FP&A", href: "/solutions/fpa", desc: "Budgets, forecasts, variance" },
          { label: "Accounting", href: "/solutions/accounting", desc: "Close, reconcile, document" },
          { label: "Audit", href: "/solutions/audit", desc: "Evidence and consistency" },
        ],
      },
      {
        heading: "By role",
        items: [
          { label: "CFO teams", href: "/solutions/cfo", desc: "Board-ready reporting" },
          { label: "Investment analysis", href: "/solutions/investment", desc: "Research and memos" },
          { label: "Financial advisory", href: "/solutions/advisory", desc: "Client deliverables" },
        ],
      },
    ],
    footer: { label: "See all solutions →", href: "/solutions" },
  },
  {
    label: "Developers",
    href: "/developers",
    columns: [
      {
        heading: "Build",
        items: [
          { label: "Fintra API", href: "/developers/api", desc: "Programmatic access" },
          { label: "Documentation", href: "/developers/docs", desc: "Guides and reference" },
          { label: "Integrations", href: "/developers/integrations", desc: "Connect your stack" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    columns: [
      {
        heading: "Learn",
        items: [
          { label: "Guides", href: "/resources/guides", desc: "Finance AI playbooks" },
          { label: "Templates", href: "/resources/templates", desc: "Start from a proven format" },
          { label: "Security", href: "/resources/security", desc: "How Fintra protects data" },
          { label: "Help center", href: "/resources/help", desc: "Answers and support" },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Enterprise", href: "/enterprise" },
];

export const FOOTER_COLS: { heading: string; links: NavChild[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "Workspace", href: "/product/workspace" },
      { label: "Multi-model AI", href: "/product/models" },
      { label: "Analysis", href: "/product/analysis" },
      { label: "Reports", href: "/product/reports" },
      { label: "Agents", href: "/product/agents" },
      { label: "Workflows", href: "/product/workflows" },
      { label: "Model routing", href: "/product/model-routing" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "FP&A", href: "/solutions/fpa" },
      { label: "Accounting", href: "/solutions/accounting" },
      { label: "Audit", href: "/solutions/audit" },
      { label: "CFO teams", href: "/solutions/cfo" },
      { label: "Investment analysis", href: "/solutions/investment" },
      { label: "Financial advisory", href: "/solutions/advisory" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Overview", href: "/developers" },
      { label: "Fintra API", href: "/developers/api" },
      { label: "Documentation", href: "/developers/docs" },
      { label: "Integrations", href: "/developers/integrations" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Guides", href: "/resources/guides" },
      { label: "Templates", href: "/resources/templates" },
      { label: "Security", href: "/resources/security" },
      { label: "Help center", href: "/resources/help" },
      { label: "Pricing", href: "/pricing" },
      { label: "Enterprise", href: "/enterprise" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/signup" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export const DEMO_MODE_NOTE = isDemoMode();
export { PLANS, PLAN_ORDER };
