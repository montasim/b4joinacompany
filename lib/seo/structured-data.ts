import { seoConfig } from "@/config/seo";
import { absoluteUrl } from "@/lib/seo/metadata";

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.site.siteName,
    url: seoConfig.site.siteUrl,
    description: seoConfig.site.description,
    inLanguage: "en",
  };
}

export function buildWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seoConfig.site.siteName,
    url: seoConfig.site.siteUrl,
    description: seoConfig.site.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires a modern web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
    },
  };
}

export function buildCompanyPageSchema({
  companyName,
  description,
  slug,
}: {
  companyName: string;
  description: string;
  slug: string;
}) {
  const pageUrl = absoluteUrl(`/company/${slug}`);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${companyName} company research`,
      description,
      url: pageUrl,
      isPartOf: {
        "@type": "WebSite",
        name: seoConfig.site.siteName,
        url: seoConfig.site.siteUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Company research",
          item: seoConfig.site.siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: companyName,
          item: pageUrl,
        },
      ],
    },
  ];
}
