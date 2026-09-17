import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fintra.example.com";

const ROUTES = [
  "",
  "/product",
  "/product/workspace",
  "/product/models",
  "/product/analysis",
  "/product/reports",
  "/product/agents",
  "/product/workflows",
  "/product/model-routing",
  "/solutions",
  "/solutions/fpa",
  "/solutions/accounting",
  "/solutions/audit",
  "/solutions/cfo",
  "/solutions/investment",
  "/solutions/advisory",
  "/developers",
  "/developers/api",
  "/developers/docs",
  "/developers/integrations",
  "/resources",
  "/resources/guides",
  "/resources/templates",
  "/resources/security",
  "/resources/help",
  "/pricing",
  "/enterprise",
  "/contact",
  "/terms",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : route.split("/").length === 2 ? 0.8 : 0.6,
  }));
}
