import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/seo";
import { getIndexableCompanies } from "@/lib/research";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = Object.values(seoConfig.pages).map((page) => ({
    url: `${seoConfig.site.siteUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency ?? ("monthly" as const),
    priority: page.priority ?? 0.5,
  }));
  const companies = await getIndexableCompanies();
  const companyRoutes = companies.map((company) => ({
    url: `${seoConfig.site.siteUrl}/company/${company.slug}`,
    lastModified: company.snapshotDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...companyRoutes];
}
