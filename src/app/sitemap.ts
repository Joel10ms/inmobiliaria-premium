import type { MetadataRoute } from "next";
import { siteConfig }         from "@/config/site";
import { getAllPropertySlugs } from "@/lib/queries/properties";
import { getAllAgentSlugs }    from "@/lib/queries/agents";

export const dynamic = "force-dynamic"; // always revalidate so new listings appear promptly
export const revalidate = 3600;         // cache for 1 hour in production

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now     = new Date();

  // ─── Static routes ──────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                  lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${baseUrl}/propiedades`, lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${baseUrl}/agentes`,     lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${baseUrl}/nosotros`,    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contacto`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // ─── Dynamic property routes ─────────────────────────────────────
  const [propertySlugs, agentSlugs] = await Promise.all([
    getAllPropertySlugs(),
    getAllAgentSlugs(),
  ]);

  const propertyRoutes: MetadataRoute.Sitemap = propertySlugs.map(({ slug, updatedAt }) => ({
    url:             `${baseUrl}/propiedades/${slug}`,
    lastModified:    updatedAt,
    changeFrequency: "weekly",
    priority:        0.8,
  }));

  const agentRoutes: MetadataRoute.Sitemap = agentSlugs.map(({ slug, updatedAt }) => ({
    url:             `${baseUrl}/agentes/${slug}`,
    lastModified:    updatedAt,
    changeFrequency: "monthly",
    priority:        0.6,
  }));

  return [...staticRoutes, ...propertyRoutes, ...agentRoutes];
}
