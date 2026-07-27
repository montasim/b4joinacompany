export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  priority?: number;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}

export interface SiteSEO {
  siteName: string;
  siteUrl: string;
  titleDefault: string;
  description: string;
  locale: string;
  keywords: string[];
}

export interface SEOConfig {
  site: SiteSEO;
  pages: Record<string, PageSEO>;
  disallowedPaths: string[];
}
