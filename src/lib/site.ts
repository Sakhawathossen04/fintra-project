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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://datalens.example.com";
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: `${siteUrl}${opts.path}` },
    openGraph: {
      title: `${opts.title} | DataLens`,
      description: opts.description,
      url: `${siteUrl}${opts.path}`,
      siteName: "DataLens",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${opts.title} | DataLens`,
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
          { label: "Analysis workspace", href: "/product/workspace", desc: "One place for data work" },
          { label: "Automatic EDA", href: "/product/eda", desc: "Full profile in one click" },
          { label: "Charts & figures", href: "/product/charts", desc: "Publication-ready visuals" },
        ],
      },
      {
        heading: "Capabilities",
        items: [
          { label: "Chat with your data", href: "/product/chat", desc: "Ask questions, get verified answers" },
          { label: "Report builder", href: "/product/reports", desc: "Structured reports from analysis" },
          { label: "Multi-model AI", href: "/product/models", desc: "The right model per question" },
          { label: "Smart routing", href: "/product/model-routing", desc: "Route work automatically" },
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
          { label: "Marketing", href: "/solutions/marketing", desc: "Campaign and channel analysis" },
          { label: "Operations", href: "/solutions/operations", desc: "Process and supply data" },
          { label: "Product & growth", href: "/solutions/product", desc: "Usage, funnels, retention" },
        ],
      },
      {
        heading: "By role",
        items: [
          { label: "Data analysts", href: "/solutions/analysts", desc: "Notebook-speed EDA, no code" },
          { label: "Researchers", href: "/solutions/research", desc: "Survey and experiment data" },
          { label: "Executives", href: "/solutions/executives", desc: "Answers without the dashboard" },
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
          { label: "DataLens API", href: "/developers/api", desc: "Programmatic analysis" },
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
          { label: "Guides", href: "/resources/guides", desc: "Data analysis playbooks" },
          { label: "Templates", href: "/resources/templates", desc: "Start from a proven format" },
          { label: "Security", href: "/resources/security", desc: "How DataLens protects data" },
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
      { label: "Automatic EDA", href: "/product/eda" },
      { label: "Charts & figures", href: "/product/charts" },
      { label: "Chat with data", href: "/product/chat" },
      { label: "Reports", href: "/product/reports" },
      { label: "Multi-model AI", href: "/product/models" },
      { label: "Smart routing", href: "/product/model-routing" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "Marketing", href: "/solutions/marketing" },
      { label: "Operations", href: "/solutions/operations" },
      { label: "Product & growth", href: "/solutions/product" },
      { label: "Data analysts", href: "/solutions/analysts" },
      { label: "Researchers", href: "/solutions/research" },
      { label: "Executives", href: "/solutions/executives" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Overview", href: "/developers" },
      { label: "DataLens API", href: "/developers/api" },
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
      { label: "Open workspace", href: "/agent" },
      { label: "Log in", href: "/login" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export const DEMO_MODE_NOTE = isDemoMode();
export { PLANS, PLAN_ORDER };
