import type { SEOConfig } from "@/lib/seo/types";

const productionSiteUrl = "https://b4joinacompany.netlify.app";
const configuredSiteUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

function publicSiteUrl(value: string | undefined) {
  if (!value) return productionSiteUrl;

  try {
    const url = new URL(value);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return productionSiteUrl;
    }
    return value.replace(/\/+$/, "");
  } catch {
    return productionSiteUrl;
  }
}

export const siteUrl = publicSiteUrl(configuredSiteUrl);

export const seoConfig: SEOConfig = {
  site: {
    siteName: "b4joinacompany",
    siteUrl,
    titleDefault:
      "Research a company before you join | b4joinacompany",
    description:
      "Research companies in Bangladesh using source-linked workplace stories, community-submitted salary ranges, work-setup evidence, and questions to verify.",
    locale: "en_BD",
    keywords: [
      "company research Bangladesh",
      "Bangladesh company reviews",
      "salary Bangladesh",
      "workplace stories",
      "interview questions",
      "job offer research",
      "work culture Bangladesh",
      "b4joinacompany",
    ],
  },
  pages: {
    home: {
      title: "Research companies before you apply, interview, or join",
      description:
        "Search companies in Bangladesh and review source-linked workplace stories, submitted salary context, work setup, and questions to ask before joining.",
      keywords: [
        "research company before joining",
        "company reviews Bangladesh",
        "salary information Bangladesh",
        "work culture Bangladesh",
        "interview preparation Bangladesh",
      ],
      path: "/",
      priority: 1,
      changeFrequency: "weekly",
    },
    compare: {
      title: "Compare companies using workplace and salary evidence",
      description:
        "Compare two companies side by side using the same workplace-story, salary, work-setup, and evidence-gap categories—without a synthetic score.",
      keywords: [
        "compare companies Bangladesh",
        "company salary comparison",
        "work culture comparison",
        "job offer comparison",
      ],
      path: "/compare",
      priority: 0.8,
      changeFrequency: "weekly",
    },
    method: {
      title: "How company evidence and sources are handled",
      description:
        "See how b4joinacompany preserves source links, separates reported and submitted evidence, limits AI answers, and keeps uncertainty visible.",
      keywords: [
        "company review methodology",
        "workplace evidence sources",
        "salary data methodology",
        "responsible AI job research",
      ],
      path: "/method",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    extension: {
      title: "Browser extension for evidence-based company research",
      description:
        "Turn a Deshi Mula company or workplace-story page into a source-linked brief with culture, salary, work setup, and questions to verify.",
      keywords: [
        "company research browser extension",
        "Deshi Mula extension",
        "Bangladesh job research extension",
      ],
      path: "/extension",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    support: {
      title: "Corrections, evidence questions, and support",
      description:
        "Report an incorrect company identity, destination, evidence label, or salary source, and learn how corrections are reviewed before publication.",
      keywords: [
        "b4joinacompany correction",
        "company data correction",
        "workplace evidence support",
      ],
      path: "/support",
      priority: 0.5,
      changeFrequency: "monthly",
    },
  },
  disallowedPaths: [
    "/answer",
    "/api/",
    "/ask",
    "/auth/",
    "/company-match",
    "/context",
    "/export",
    "/history",
    "/notifications",
    "/saved",
  ],
};
