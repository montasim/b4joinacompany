import "server-only";
import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type {
  CompanyRecord,
  CompanySalaryEvidence,
  CompanyWorkArrangement,
  StoryRecord,
} from "@/lib/contracts";
import { sampleStories, technonext } from "@/lib/fixtures";
import { generateEvidenceQuestions, type QuestionCommentSource, type QuestionStorySource } from "@/lib/question-engine";
import { normalizeText } from "@/lib/utils";
import { datasetFile } from "@/lib/dataset-path";

interface RawCompany {
  company_id: string;
  company_slug: string;
  display_name: string;
  source_url: string;
  source_snapshot_date: string;
  crawled_story_count: number;
  positive_count?: number;
  mixed_count?: number;
  negative_count?: number;
  glassdoor_rating?: number | null;
  recommend_to_friend_percent?: number | null;
}

interface RawProfile {
  company_slug: string;
  display_name: string;
  website_url?: string | null;
  linkedin_url?: string | null;
  careers_url?: string | null;
  verification_status?: CompanyRecord["verificationStatus"];
}

interface RawStory {
  story_id: string;
  company_url?: string;
  company_display_name: string;
  title?: string | null;
  excerpt: string;
  body: string;
  job_title: string;
  published_at_iso?: string | null;
  published_at_display: string;
  vibe?: StoryRecord["vibe"] | null;
  upvotes?: number;
  comments?: number;
  source_url: string;
}

interface RawComment {
  comment_id: string;
  story_id: string;
  published_at_display?: string | null;
  text?: string | null;
}

interface RawWorkArrangement {
  dataset_version: string;
  derivation_version: string;
  derived_at: string;
  company_slug: string;
  display_name: string;
  source_url: string;
  source_snapshot_date: string;
  verification_status: "unverified_derived_data";
  disclaimer: string;
  work_arrangement: {
    reported_mode: CompanyWorkArrangement["workArrangement"]["reportedMode"];
    confidence: CompanyWorkArrangement["workArrangement"]["confidence"];
    has_conflicting_reports: boolean;
    evidence_source_count: number;
    mode_evidence_counts: CompanyWorkArrangement["workArrangement"]["modeEvidenceCounts"];
    remote_restricted_evidence_count: number;
  };
  reported_schedule: {
    confidence: CompanyWorkArrangement["reportedSchedule"]["confidence"];
    evidence_source_count: number;
    daily_hours: Array<{ minimum: number; maximum: number; mention_count: number }>;
    time_ranges: Array<{ start: string; end: string; mention_count: number }>;
    workdays_per_week: Array<{ minimum: number; maximum: number; mention_count: number }>;
    flexible_evidence_count: number;
    overtime_evidence_count: number;
    after_hours_evidence_count: number;
  };
  evidence_period: { start: string | null; end: string | null };
  roles: string[];
  source_breakdown: Record<string, number>;
  evidence_mentions: Array<{
    source_kind: "story" | "comment";
    source_id: string;
    story_id: string;
    source_url: string;
    role: string;
    published_at: string | null;
    published_at_display: string;
    excerpt: string;
    signals: {
      modes: Array<"remote" | "onsite" | "hybrid">;
      daily_hours: Array<{ minimum: number; maximum: number }>;
      time_ranges: Array<{ start: string; end: string }>;
      workdays_per_week: Array<{ minimum: number; maximum: number }>;
      flexible: boolean;
      overtime: boolean;
      after_hours: boolean;
      remote_restricted: boolean;
    };
    verification_status: "unverified_personal_account";
  }>;
}

interface RawSalaryEvidence {
  salary_evidence_id: string;
  dataset_version: string;
  company_slug: string;
  display_name: string;
  source_company_name: string;
  role: string;
  salary_range: {
    minimum_bdt: number;
    maximum_bdt: number;
    currency: "BDT";
    pay_period: "unspecified";
    raw: string;
  };
  sample_size: number | null;
  bonus: {
    reported_count: number;
    answered_count: number;
    most_common_frequency: string | null;
  } | null;
  source_url: string;
  source_kind: "betonkemon_community_aggregate";
  source_fingerprint: string;
  captured_at: string;
  verification_status: "unverified_user_submitted";
  disclaimer: string;
  company_match: {
    method: "exact_canonical_name" | "manual_name_review";
    confidence: number;
    dataset_name: string;
    source_name: string;
  };
}

const dataPath = (...parts: string[]) =>
  datasetFile(path.join(...parts));

async function jsonLines<T>(file: string): Promise<T[]> {
  const contents = await readFile(dataPath(file), "utf8");
  return contents
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}

const loadCompanies = cache(async () => {
  const [rawCompanies, profiles] = await Promise.all([
    jsonLines<RawCompany>("companies.jsonl"),
    jsonLines<RawProfile>("company_web_profiles.jsonl")
  ]);
  const bySlug = new Map(profiles.map((profile) => [profile.company_slug, profile]));
  return rawCompanies.map<CompanyRecord>((company) => {
    const profile = bySlug.get(company.company_slug);
    return {
      id: company.company_id,
      slug: company.company_slug,
      name: profile?.display_name ?? company.display_name,
      sourceName: company.display_name,
      sourceUrl: company.source_url,
      snapshotDate: company.source_snapshot_date,
      storyCount: company.crawled_story_count,
      positiveCount: company.positive_count ?? 0,
      mixedCount: company.mixed_count ?? 0,
      negativeCount: company.negative_count ?? 0,
      glassdoorRating: company.glassdoor_rating ?? null,
      recommendPercent: company.recommend_to_friend_percent ?? null,
      websiteUrl: profile?.website_url ?? null,
      linkedinUrl: profile?.linkedin_url ?? null,
      careersUrl: profile?.careers_url ?? null,
      verificationStatus: profile?.verification_status ?? "unresolved",
      aliases: company.display_name === profile?.display_name ? [] : [company.display_name]
    };
  });
});

const loadStories = cache(async () => jsonLines<RawStory>("stories.jsonl"));
const loadComments = cache(async () => jsonLines<RawComment>("comments.jsonl"));
const loadWorkArrangements = cache(async () =>
  jsonLines<RawWorkArrangement>("company_work_arrangements.jsonl")
);
const loadSalaryEvidence = cache(async () => {
  try {
    return await jsonLines<RawSalaryEvidence>("company_salary_evidence.jsonl");
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  }
});

function compactText(value: string) {
  return normalizeText(value).replace(/\s+/g, "");
}

function editDistance(left: string, right: string) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1)
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function relevanceScore(query: string, candidate: string) {
  const normalizedCandidate = normalizeText(candidate);
  const compactQuery = compactText(query);
  const compactCandidate = compactText(candidate);

  if (!normalizedCandidate || !compactCandidate) return 0;
  if (normalizedCandidate === query) return 1_000;
  if (compactCandidate === compactQuery) return 980;
  if (normalizedCandidate.startsWith(query)) return 850;
  if (compactCandidate.startsWith(compactQuery)) return 820;
  if (normalizedCandidate.includes(query)) return 720;
  if (compactCandidate.includes(compactQuery)) return 700;
  if (normalizedCandidate.split(" ").some((word) => word.startsWith(query))) return 650;

  if (compactQuery.length < 4) return 0;
  const comparableCandidates = [
    compactCandidate,
    compactCandidate.slice(0, Math.min(compactCandidate.length, compactQuery.length))
  ];
  const similarity = Math.max(
    ...comparableCandidates.map((value) => {
      const comparisonLength = Math.max(compactQuery.length, value.length);
      return 1 - editDistance(compactQuery, value) / comparisonLength;
    })
  );
  return similarity >= 0.62 ? Math.round(similarity * 500) : 0;
}

export async function searchCompanies(query: string, limit = 12) {
  const normalized = normalizeText(query);
  if (normalized.length < 2) return [];
  const companies = await loadCompanies();
  return companies
    .map((company) => {
      const candidates = [
        company.name,
        company.sourceName,
        company.slug,
        company.websiteUrl,
        company.linkedinUrl,
        ...company.aliases
      ].filter((value): value is string => Boolean(value));
      const relevance = Math.max(...candidates.map((candidate) => relevanceScore(normalized, candidate)));
      const popularityTieBreak = relevance > 0 ? Math.min(company.storyCount, 20) / 100 : 0;
      return { company, score: relevance + popularityTieBreak };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.company.name.localeCompare(b.company.name))
    .slice(0, limit)
    .map(({ company }) => company);
}

export async function getCompany(slug: string) {
  return (await loadCompanies()).find((company) => company.slug === slug) ?? (slug === technonext.slug ? technonext : null);
}

export async function getCompanyWorkArrangement(
  slug: string
): Promise<CompanyWorkArrangement | null> {
  const record = (await loadWorkArrangements()).find(
    (item) => item.company_slug === slug
  );
  if (!record) return null;
  return {
    datasetVersion: record.dataset_version,
    derivationVersion: record.derivation_version,
    derivedAt: record.derived_at,
    companySlug: record.company_slug,
    displayName: record.display_name,
    sourceUrl: record.source_url,
    sourceSnapshotDate: record.source_snapshot_date,
    verificationStatus: record.verification_status,
    disclaimer: record.disclaimer,
    workArrangement: {
      reportedMode: record.work_arrangement.reported_mode,
      confidence: record.work_arrangement.confidence,
      hasConflictingReports: record.work_arrangement.has_conflicting_reports,
      evidenceSourceCount: record.work_arrangement.evidence_source_count,
      modeEvidenceCounts: record.work_arrangement.mode_evidence_counts,
      remoteRestrictedEvidenceCount:
        record.work_arrangement.remote_restricted_evidence_count,
    },
    reportedSchedule: {
      confidence: record.reported_schedule.confidence,
      evidenceSourceCount: record.reported_schedule.evidence_source_count,
      dailyHours: record.reported_schedule.daily_hours.map((range) => ({
        minimum: range.minimum,
        maximum: range.maximum,
        mentionCount: range.mention_count,
      })),
      timeRanges: record.reported_schedule.time_ranges.map((range) => ({
        start: range.start,
        end: range.end,
        mentionCount: range.mention_count,
      })),
      workdaysPerWeek: record.reported_schedule.workdays_per_week.map(
        (range) => ({
          minimum: range.minimum,
          maximum: range.maximum,
          mentionCount: range.mention_count,
        })
      ),
      flexibleEvidenceCount:
        record.reported_schedule.flexible_evidence_count,
      overtimeEvidenceCount:
        record.reported_schedule.overtime_evidence_count,
      afterHoursEvidenceCount:
        record.reported_schedule.after_hours_evidence_count,
    },
    evidencePeriod: record.evidence_period,
    roles: record.roles,
    sourceBreakdown: record.source_breakdown,
    evidenceMentions: record.evidence_mentions.map((mention) => ({
      sourceKind: mention.source_kind,
      sourceId: mention.source_id,
      storyId: mention.story_id,
      sourceUrl: mention.source_url,
      role: mention.role,
      publishedAt: mention.published_at,
      publishedAtLabel: mention.published_at_display,
      excerpt: mention.excerpt,
      signals: {
        modes: mention.signals.modes,
        dailyHours: mention.signals.daily_hours.map((range) => ({
          ...range,
          mentionCount: 1,
        })),
        timeRanges: mention.signals.time_ranges,
        workdaysPerWeek: mention.signals.workdays_per_week,
        flexible: mention.signals.flexible,
        overtime: mention.signals.overtime,
        afterHours: mention.signals.after_hours,
        remoteRestricted: mention.signals.remote_restricted,
      },
      verificationStatus: mention.verification_status,
    })),
  };
}

export async function getCompanySalaryEvidence(
  slug: string
): Promise<CompanySalaryEvidence[]> {
  return (await loadSalaryEvidence())
    .filter((record) => record.company_slug === slug)
    .map((record) => ({
      id: record.salary_evidence_id,
      datasetVersion: record.dataset_version,
      companySlug: record.company_slug,
      displayName: record.display_name,
      sourceCompanyName: record.source_company_name,
      role: record.role,
      salaryRange: {
        minimumBdt: record.salary_range.minimum_bdt,
        maximumBdt: record.salary_range.maximum_bdt,
        currency: record.salary_range.currency,
        payPeriod: record.salary_range.pay_period,
        raw: record.salary_range.raw,
      },
      sampleSize: record.sample_size,
      bonus: record.bonus
        ? {
            reportedCount: record.bonus.reported_count,
            answeredCount: record.bonus.answered_count,
            mostCommonFrequency: record.bonus.most_common_frequency,
          }
        : null,
      sourceUrl: record.source_url,
      sourceKind: record.source_kind,
      sourceFingerprint: record.source_fingerprint,
      capturedAt: record.captured_at,
      verificationStatus: record.verification_status,
      disclaimer: record.disclaimer,
      companyMatch: {
        method: record.company_match.method,
        confidence: record.company_match.confidence,
        datasetName: record.company_match.dataset_name,
        sourceName: record.company_match.source_name,
      },
    }))
    .sort(
      (left, right) =>
        (right.sampleSize ?? 0) - (left.sampleSize ?? 0) ||
        left.role.localeCompare(right.role)
    );
}

export async function getStories(slug: string, query = "", limit = 20): Promise<StoryRecord[]> {
  const normalized = normalizeText(query);
  const stories = await loadStories();
  const result = stories
    .filter((story) => story.company_url?.endsWith(`/companies/${slug}`))
    .filter((story) =>
      normalized
        ? normalizeText(`${story.title ?? ""} ${story.job_title} ${story.body}`).includes(normalized)
        : true
    )
    .slice(0, limit)
    .map((story) => ({
      id: story.story_id,
      companySlug: slug,
      title: story.title || "Untitled story",
      excerpt: story.excerpt.slice(0, 560),
      privateBody: story.body,
      role: story.job_title || "Anonymous",
      date: story.published_at_iso ?? null,
      dateLabel: story.published_at_display,
      vibe: story.vibe ?? "mixed",
      reactions: story.upvotes ?? 0,
      comments: story.comments ?? 0,
      sourceUrl: story.source_url
    }));
  return result.length || slug !== technonext.slug || query ? result : sampleStories;
}

export async function getCompanyQuestions(slug: string, companyName?: string) {
  const [rawStories, rawComments] = await Promise.all([loadStories(), loadComments()]);
  const companyStories = rawStories.filter((story) => story.company_url?.endsWith(`/companies/${slug}`));
  const stories: QuestionStorySource[] = (companyStories.length || slug !== technonext.slug ? companyStories : sampleStories.map((story) => ({
    story_id: story.id,
    title: story.title,
    excerpt: story.excerpt,
    body: story.privateBody,
    job_title: story.role,
    published_at_display: story.dateLabel,
    vibe: story.vibe
  } as RawStory))).map((story) => ({
    id: story.story_id,
    title: story.title ?? "Untitled story",
    role: story.job_title || "Anonymous",
    dateLabel: story.published_at_display,
    vibe: story.vibe ?? "mixed",
    body: story.body || story.excerpt
  }));
  const storyIds = new Set(stories.map((story) => story.id));
  const comments: QuestionCommentSource[] = rawComments
    .filter((comment) => storyIds.has(comment.story_id))
    .map((comment) => ({
      id: comment.comment_id,
      storyId: comment.story_id,
      dateLabel: comment.published_at_display ?? "Undated",
      text: comment.text ?? ""
    }))
    .filter((comment) => comment.text.trim());
  return generateEvidenceQuestions({ companyName: companyName ?? slug, stories, comments });
}

export async function datasetStats() {
  const companies = await loadCompanies();
  return {
    companies: companies.length,
    stories: companies.reduce((sum, company) => sum + company.storyCount, 0),
    comments: (await loadComments()).length,
    snapshotDate: companies[0]?.snapshotDate ?? "2026-07-24"
  };
}
