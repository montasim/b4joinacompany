import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://b4joinacompany.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["/", "/method", "/extension", "/support"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.6
  }));
  return staticRoutes;
}
