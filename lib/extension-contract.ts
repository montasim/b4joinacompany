import "server-only";

import type {
  CompanyRecord,
  CompanyWorkArrangement,
  EvidenceQuestion,
  StoryRecord,
} from "@/lib/contracts";

export function extensionCompany(
  company: CompanyRecord,
  questions: EvidenceQuestion[] = [],
  workArrangement: CompanyWorkArrangement | null = null
) {
  const themes = [
    {
      label: "Positive experiences",
      detail: "Supportive experiences reported in the published snapshot.",
      count: company.positiveCount,
    },
    {
      label: "Mixed experiences",
      detail: "Reports containing both supportive and concerning context.",
      count: company.mixedCount,
    },
    {
      label: "Concerns to verify",
      detail: "Negative experiences that can inform interview questions.",
      count: company.negativeCount,
    },
  ].filter((theme) => theme.count > 0);

  const links = [
    {
      label: "Deshi Mula profile",
      url: company.sourceUrl,
      kind: "deshimula",
      verification: "native",
    },
    company.websiteUrl
      ? {
          label: "Official website",
          url: company.websiteUrl,
          kind: "website",
          verification: company.verificationStatus,
        }
      : null,
    company.linkedinUrl
      ? {
          label: "LinkedIn",
          url: company.linkedinUrl,
          kind: "linkedin",
          verification: company.verificationStatus,
        }
      : null,
    company.careersUrl
      ? {
          label: "Careers",
          url: company.careersUrl,
          kind: "careers",
          verification: company.verificationStatus,
        }
      : null,
  ].filter(Boolean);

  return {
    snapshotVersion: company.snapshotDate,
    snapshotDate: company.snapshotDate,
    slug: company.slug,
    name: company.name,
    sourceName: company.sourceName,
    brief: {
      headline: "Turn reported experiences into questions to verify.",
      copy: `${company.storyCount.toLocaleString()} workplace stories are organized into recurring signals without rating the company.`,
      disclaimer: "Workplace stories are unverified personal accounts. Use them as prompts, not conclusions.",
    },
    metrics: {
      stories: company.storyCount,
      rating: company.glassdoorRating,
      recommendPercent: company.recommendPercent,
      sentiment: {
        positive: company.positiveCount,
        mixed: company.mixedCount,
        negative: company.negativeCount,
      },
    },
    themes,
    links,
    verificationStatus: company.verificationStatus,
    questions,
    workArrangement,
    confidence:
      company.verificationStatus === "verified"
        ? 1
        : company.verificationStatus === "probable"
          ? 0.8
          : company.verificationStatus === "needs_review"
            ? 0.55
            : 0.3,
  };
}

export function extensionStory(story: StoryRecord) {
  return {
    id: story.id,
    title: story.title,
    excerpt: story.excerpt,
    role: story.role || null,
    date: story.dateLabel || story.date,
    vibe: story.vibe,
    reactions: story.reactions,
    comments: story.comments,
    url: story.sourceUrl,
  };
}
