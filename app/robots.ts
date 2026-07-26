import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/api/", "/auth/", "/saved", "/history", "/export"] },
    sitemap: "https://b4joinacompany.netlify.app/sitemap.xml"
  };
}
