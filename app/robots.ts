import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/answer",
        "/api/",
        "/auth/",
        "/context",
        "/export",
        "/history",
        "/notifications",
        "/saved"
      ]
    },
    sitemap: "https://b4joinacompany.netlify.app/sitemap.xml"
  };
}
