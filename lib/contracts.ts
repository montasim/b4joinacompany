export type Vibe = "positive" | "mixed" | "negative";
export type VerificationStatus = "verified" | "probable" | "needs_review" | "unresolved";
export type HiringState = "recent" | "stale" | "closed";
export type ReportedWorkMode = "remote" | "onsite" | "hybrid" | "mixed" | "unknown";
export type DerivedConfidence = "high" | "medium" | "low" | "unknown";
export type EvidenceCoverage =
  | "both"
  | "deshimula_only"
  | "betonkemon_only"
  | "review";
export type EvidenceCoverageFilter = EvidenceCoverage | "all" | "deshimula";

export interface CompanyRecord {
  id: string;
  slug: string;
  name: string;
  sourceName: string;
  sourceUrl: string;
  snapshotDate: string;
  storyCount: number;
  positiveCount: number;
  mixedCount: number;
  negativeCount: number;
  glassdoorRating: number | null;
  recommendPercent: number | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  careersUrl: string | null;
  verificationStatus: VerificationStatus;
  aliases: string[];
}

export interface CompanyDirectoryRecord {
  id: string;
  slug: string;
  name: string;
  href: string;
  coverage: EvidenceCoverage;
  storyCount: number;
  salaryEntryCount: number;
  salaryRoleCount: number;
  deshimulaUrl: string | null;
  betonkemonUrl: string | null;
  capturedAt: string | null;
  reportedSalaryRange: {
    minimumBdt: number;
    maximumBdt: number;
    raw: string;
  } | null;
  reviewCandidateCount: number;
}

export interface BetonkemonCompanyRecord {
  slug: string;
  name: string;
  sourceUrl: string;
  capturedAt: string;
  salaryEntryCount: number;
  roleCount: number;
  reportedSalaryRange: {
    minimumBdt: number;
    maximumBdt: number;
    raw: string;
  } | null;
  matchedCompanySlug: string | null;
}

export interface StoryRecord {
  id: string;
  companySlug: string;
  title: string;
  excerpt: string;
  privateBody?: string;
  role: string;
  date: string | null;
  dateLabel: string;
  vibe: Vibe;
  reactions: number;
  comments: number;
  sourceUrl: string;
}

export interface EvidenceQuestion {
  id: string;
  title: string;
  guidance: string;
  rationale: string;
  citations: string[];
  gap?: string;
}

export interface WorkArrangementRange {
  minimum: number;
  maximum: number;
  mentionCount: number;
}

export interface WorkArrangementTimeRange {
  start: string;
  end: string;
  mentionCount: number;
}

export interface WorkArrangementEvidence {
  sourceKind: "story" | "comment";
  sourceId: string;
  storyId: string;
  sourceUrl: string;
  role: string;
  publishedAt: string | null;
  publishedAtLabel: string;
  excerpt: string;
  signals: {
    modes: Exclude<ReportedWorkMode, "mixed" | "unknown">[];
    dailyHours: WorkArrangementRange[];
    timeRanges: Omit<WorkArrangementTimeRange, "mentionCount">[];
    workdaysPerWeek: Omit<WorkArrangementRange, "mentionCount">[];
    flexible: boolean;
    overtime: boolean;
    afterHours: boolean;
    remoteRestricted: boolean;
  };
  verificationStatus: "unverified_personal_account";
}

export interface CompanyWorkArrangement {
  datasetVersion: string;
  derivationVersion: string;
  derivedAt: string;
  companySlug: string;
  displayName: string;
  sourceUrl: string;
  sourceSnapshotDate: string;
  verificationStatus: "unverified_derived_data";
  disclaimer: string;
  workArrangement: {
    reportedMode: ReportedWorkMode;
    confidence: DerivedConfidence;
    hasConflictingReports: boolean;
    evidenceSourceCount: number;
    modeEvidenceCounts: {
      remote: number;
      onsite: number;
      hybrid: number;
    };
    remoteRestrictedEvidenceCount: number;
  };
  reportedSchedule: {
    confidence: DerivedConfidence;
    evidenceSourceCount: number;
    dailyHours: WorkArrangementRange[];
    timeRanges: WorkArrangementTimeRange[];
    workdaysPerWeek: WorkArrangementRange[];
    flexibleEvidenceCount: number;
    overtimeEvidenceCount: number;
    afterHoursEvidenceCount: number;
  };
  evidencePeriod: {
    start: string | null;
    end: string | null;
  };
  roles: string[];
  sourceBreakdown: Record<string, number>;
  evidenceMentions: WorkArrangementEvidence[];
}

export interface CompanySalaryEvidence {
  id: string;
  datasetVersion: string;
  companySlug: string;
  displayName: string;
  sourceCompanyName: string;
  role: string;
  salaryRange: {
    minimumBdt: number;
    maximumBdt: number;
    currency: "BDT";
    payPeriod: "unspecified";
    raw: string;
  };
  sampleSize: number | null;
  bonus: {
    reportedCount: number;
    answeredCount: number;
    mostCommonFrequency: string | null;
  } | null;
  sourceUrl: string;
  sourceKind: "betonkemon_community_aggregate";
  sourceFingerprint: string;
  capturedAt: string;
  verificationStatus: "unverified_user_submitted";
  disclaimer: string;
  companyMatch: {
    method: "exact_canonical_name" | "manual_name_review";
    confidence: number;
    datasetName: string;
    sourceName: string;
  };
}

export interface Checkpoint {
  company: CompanyRecord;
  stage: "Applying" | "Interviewing" | "Reviewing an offer";
  role: string;
  priority: string;
  snapshotVersion: string;
  questions: EvidenceQuestion[];
}

export interface ApiError {
  error: { code: string; message: string; requestId?: string };
}
