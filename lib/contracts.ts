export type Vibe = "positive" | "mixed" | "negative";
export type VerificationStatus = "verified" | "probable" | "needs_review" | "unresolved";
export type HiringState = "recent" | "stale" | "closed";
export type ReportedWorkMode = "remote" | "onsite" | "hybrid" | "mixed" | "unknown";
export type DerivedConfidence = "high" | "medium" | "low" | "unknown";

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
