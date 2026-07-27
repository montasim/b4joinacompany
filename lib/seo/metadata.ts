import type { Metadata } from "next";

import { seoConfig } from "@/config/seo";

const previewPath = "/opengraph-image";

export function absoluteUrl(path: string) {
  return new URL(path, `${seoConfig.site.siteUrl}/`).toString();
}

function brandedTitle(title: string) {
  return `${title} | ${seoConfig.site.siteName}`;
}

function buildOpenGraph(title: string, description: string, path: string) {
  const fullTitle = brandedTitle(title);

  return {
    title: fullTitle,
    description,
    url: absoluteUrl(path),
    siteName: seoConfig.site.siteName,
    locale: seoConfig.site.locale,
    type: "website" as const,
    images: [
      {
        url: absoluteUrl(previewPath),
        width: 1200,
        height: 630,
        alt: "b4joinacompany — Research a company before you join",
      },
    ],
  };
}

function buildTwitter(title: string, description: string) {
  return {
    card: "summary_large_image" as const,
    title: brandedTitle(title),
    description,
    images: [absoluteUrl(previewPath)],
  };
}

export function generateRootMetadata(): Metadata {
  return {
    title: {
      template: `%s | ${seoConfig.site.siteName}`,
      default: seoConfig.site.titleDefault,
    },
    description: seoConfig.site.description,
    metadataBase: new URL(seoConfig.site.siteUrl),
    applicationName: seoConfig.site.siteName,
    authors: [{ name: "b4joinacompany" }],
    creator: "b4joinacompany",
    publisher: "b4joinacompany",
    category: "career research",
    keywords: seoConfig.site.keywords,
    alternates: { canonical: "/" },
    openGraph: {
      ...buildOpenGraph(
        "Research a company before you join",
        seoConfig.site.description,
        "/",
      ),
      title: seoConfig.site.titleDefault,
    },
    twitter: {
      ...buildTwitter(
        "Research a company before you join",
        seoConfig.site.description,
      ),
      title: seoConfig.site.titleDefault,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generatePageMetadata(slug: string): Metadata {
  const page = seoConfig.pages[slug];
  if (!page) return {};

  return {
    title: slug === "home" ? { absolute: brandedTitle(page.title) } : page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: absoluteUrl(page.path) },
    openGraph: buildOpenGraph(page.title, page.description, page.path),
    twitter: buildTwitter(page.title, page.description),
  };
}

export function generateDynamicPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    keywords: [...seoConfig.site.keywords, ...keywords],
    alternates: { canonical: absoluteUrl(path) },
    openGraph: buildOpenGraph(title, description, path),
    twitter: buildTwitter(title, description),
  };
}
