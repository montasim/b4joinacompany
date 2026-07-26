import type { Checkpoint, CompanyRecord, StoryRecord } from "@/lib/contracts";

export const technonext: CompanyRecord = {
  id: "technonext-ltd",
  slug: "technonext-ltd",
  name: "TechnoNext Ltd",
  sourceName: "TechnoNe><t Ltd",
  sourceUrl: "https://deshimula.com/companies/technonext-ltd",
  snapshotDate: "2026-07-24",
  storyCount: 81,
  positiveCount: 7,
  mixedCount: 6,
  negativeCount: 68,
  glassdoorRating: 3.2,
  recommendPercent: 44,
  websiteUrl: "https://technonext.com/",
  linkedinUrl: "https://www.linkedin.com/company/technonextsoftwareltd",
  careersUrl: "https://technonext.com/career",
  verificationStatus: "verified",
  aliases: ["TechnoNe><t Ltd", "Technonext", "T3chnonext"]
};

export const sampleStories: StoryRecord[] = [
  {
    id: "6a5683e706165a87282e152a",
    companySlug: "technonext-ltd",
    title: "অহেতুক বরখাস্ত করা প্রসঙ্গে",
    excerpt: "The report describes concerns about evaluation scope, written documentation, and termination decisions.",
    role: "AI Engineer",
    date: "2026-07-15",
    dateLabel: "15 Jul 2026",
    vibe: "negative",
    reactions: 6,
    comments: 0,
    sourceUrl: "https://deshimula.com/story/6a5683e706165a87282e152a"
  },
  {
    id: "6a4fe46206165a872826042f",
    companySlug: "technonext-ltd",
    title: "U$-Bangla Group being unsafe for women day by day",
    excerpt: "The report raises concerns about management accountability, employee safety, and escalation processes.",
    role: "Sr. Software Engineer",
    date: "2026-07-10",
    dateLabel: "10 Jul 2026",
    vibe: "negative",
    reactions: 3,
    comments: 7,
    sourceUrl: "https://deshimula.com/story/6a4fe46206165a872826042f"
  },
  {
    id: "6a479e2ffc0508ef5436423f",
    companySlug: "technonext-ltd",
    title: "Alarming! What's really happening inside",
    excerpt: "The report describes leadership changes, internal politics, and uncertainty across teams.",
    role: "Ex-Manager",
    date: "2026-07-03",
    dateLabel: "3 Jul 2026",
    vibe: "negative",
    reactions: 6,
    comments: 7,
    sourceUrl: "https://deshimula.com/story/6a479e2ffc0508ef5436423f"
  }
];

export const sampleCheckpoint: Checkpoint = {
  company: technonext,
  stage: "Reviewing an offer",
  role: "Software Engineer",
  priority: "Job stability",
  snapshotVersion: "2026-07-24",
  questions: [
    {
      id: "performance",
      title: "How are performance decisions documented?",
      guidance: "Ask when written feedback is provided, who approves decisions, and what happens during probation.",
      rationale: "Management, feedback, and job stability recur across recent engineering and non-engineering stories.",
      citations: ["S1 · AI Engineer · Jul 2026", "S2 · Software Engineer · Jul 2026"]
    },
    {
      id: "manager",
      title: "Who will manage me, and how often will we meet?",
      guidance: "Ask for the reporting line, team structure, and regular one-to-one schedule for your exact role.",
      rationale: "Technical learning is reported positively, but the experience appears to vary by team and manager.",
      citations: ["S4 · Engineer · Jun 2026", "S7 · Former employee · May 2026"]
    },
    {
      id: "salary",
      title: "What salary range and overtime policy are approved?",
      guidance: "Ask for the numerical range, increment cycle, overtime policy, and variable components in writing.",
      rationale: "Official sources describe pay as competitive or negotiable, but no numerical range is published.",
      citations: ["Website · checked 24 Jul", "Careers · checked 24 Jul"],
      gap: "No published numerical salary range was found. This is an absence of evidence, not a negative salary signal."
    }
  ]
};
