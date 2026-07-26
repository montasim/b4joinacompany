import type { EvidenceQuestion, Vibe } from "@/lib/contracts";

export interface QuestionStorySource {
  id: string;
  title: string;
  role: string;
  dateLabel: string;
  vibe: Vibe;
  body: string;
}

export interface QuestionCommentSource {
  id: string;
  storyId: string;
  dateLabel: string;
  text: string;
}

interface SignalDefinition {
  id: string;
  label: string;
  keywords: string[];
  title: (company: string) => string;
  guidance: string;
}

interface SignalEvidence {
  definition: SignalDefinition;
  score: number;
  stories: QuestionStorySource[];
  comments: QuestionCommentSource[];
  matchedTerms: string[];
}

const signals: SignalDefinition[] = [
  {
    id: "management",
    label: "management and feedback",
    keywords: ["manager", "management", "leadership", "team lead", "supervisor", "boss", "hr", "ম্যানেজ", "ম্যানেজমেন্ট", "বস", "লিড"],
    title: (company) => `How does ${company} handle management and feedback?`,
    guidance: "Ask who owns decisions, how written feedback is recorded, and how concerns move beyond your immediate manager."
  },
  {
    id: "compensation",
    label: "pay and benefits",
    keywords: ["salary", "pay", "increment", "raise", "bonus", "benefit", "overtime", "বেতন", "সেলারি", "ইনক্রিমেন্ট", "বোনাস"],
    title: (company) => `What pay and overtime terms should I verify at ${company}?`,
    guidance: "Ask for the numerical salary range, increment cycle, payment timing, overtime rule, and benefits in writing."
  },
  {
    id: "stability",
    label: "stability and job security",
    keywords: ["layoff", "laid off", "fired", "terminate", "termination", "job security", "probation", "resign", "ছাঁটাই", "বরখাস্ত", "চাকরি", "প্রবেশন"],
    title: (company) => `How are role changes and job-security decisions communicated at ${company}?`,
    guidance: "Ask what happens during probation, who can change your role, how notice is handled, and which commitments are documented."
  },
  {
    id: "growth",
    label: "growth and promotion",
    keywords: ["promotion", "promoted", "career", "growth", "learning", "training", "পদোন্নতি", "প্রমোশন", "ক্যারিয়ার", "ট্রেনিং"],
    title: (company) => `What does progression look like for my role at ${company}?`,
    guidance: "Ask how expectations are measured, when promotion is reviewed, who decides, and what learning support is actually available."
  },
  {
    id: "workload",
    label: "workload and working hours",
    keywords: ["workload", "overtime", "work life", "working hours", "deadline", "late night", "weekend", "overwork", "ওভারটাইম", "কাজের চাপ", "রাত জাগা"],
    title: (company) => `What workload and availability should I expect at ${company}?`,
    guidance: "Ask about normal hours, peak periods, weekend work, escalation expectations, and how workload is rebalanced when deadlines move."
  },
  {
    id: "culture",
    label: "culture, respect, and safety",
    keywords: ["culture", "toxic", "harass", "abuse", "respect", "bully", "unsafe", "discrimination", "সংস্কৃতি", "হয়রানি", "নিরাপদ", "অপমান"],
    title: (company) => `How does ${company} handle respect, conflict, and safety concerns?`,
    guidance: "Ask for the reporting channel, response owner, expected timeline, and protections when a concern involves a manager or senior colleague."
  },
  {
    id: "workplace",
    label: "workplace flexibility",
    keywords: ["remote", "work from home", "wfh", "office", "hybrid", "flexible", "রিমোট", "বাসা থেকে", "অফিস", "হাইব্রিড"],
    title: (company) => `What working pattern is actually practiced at ${company}?`,
    guidance: "Ask where the role is performed, how often plans change, who approves flexibility, and whether the written policy matches the team norm."
  },
  {
    id: "hiring",
    label: "hiring and interview process",
    keywords: ["interview", "interviewer", "recruit", "hiring", "offer", "candidate", "ইন্টারভিউ", "নিয়োগ", "অফার", "প্রার্থী"],
    title: (company) => `What should I verify about the hiring process at ${company}?`,
    guidance: "Ask who you will meet, how the role is evaluated, what the timeline is, and whether the offer matches the responsibilities discussed."
  }
];

function normalized(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function matchingTerms(text: string, definition: SignalDefinition) {
  const value = normalized(text);
  return definition.keywords.filter((keyword) => value.includes(normalized(keyword)));
}

function storyCitation(story: QuestionStorySource) {
  return `Story · ${story.title || "Untitled report"} · ${story.role} · ${story.dateLabel}`;
}

function commentCitation(comment: QuestionCommentSource) {
  return `Comment · ${comment.dateLabel} · ${comment.id.slice(0, 8)}`;
}

function buildSignalEvidence(definition: SignalDefinition, stories: QuestionStorySource[], comments: QuestionCommentSource[]): SignalEvidence {
  const matchingStories = stories
    .map((story) => ({ story, terms: matchingTerms(`${story.title} ${story.body}`, definition) }))
    .filter((item) => item.terms.length)
    .sort((a, b) => b.terms.length - a.terms.length || a.story.dateLabel.localeCompare(b.story.dateLabel))
    .map((item) => item.story);
  const matchingComments = comments
    .map((comment) => ({ comment, terms: matchingTerms(comment.text, definition) }))
    .filter((item) => item.terms.length)
    .sort((a, b) => b.terms.length - a.terms.length || a.comment.dateLabel.localeCompare(b.comment.dateLabel))
    .map((item) => item.comment);
  const matchedTerms = Array.from(new Set([
    ...matchingStories.flatMap((story) => matchingTerms(`${story.title} ${story.body}`, definition)),
    ...matchingComments.flatMap((comment) => matchingTerms(comment.text, definition))
  ])).slice(0, 4);
  const negativeStories = matchingStories.filter((story) => story.vibe === "negative").length;
  return {
    definition,
    score: matchingStories.reduce((total, story) => total + Math.min(4, matchingTerms(`${story.title} ${story.body}`, definition).length), 0) +
      matchingComments.reduce((total, comment) => total + Math.min(2, matchingTerms(comment.text, definition).length) * 0.65, 0) +
      negativeStories * 0.35,
    stories: matchingStories,
    comments: matchingComments,
    matchedTerms
  };
}

function fallbackQuestion(company: string, stories: QuestionStorySource[]): EvidenceQuestion {
  return {
    id: "company-specific-evidence",
    title: `What should I verify directly with ${company}?`,
    guidance: "Ask the hiring team to explain the role's expectations, decision owners, working pattern, and written terms before you commit.",
    rationale: stories.length
      ? `The local dataset has ${stories.length} reports for this company, but no repeated issue crossed the signal threshold. Use the reports as prompts and ask for current, role-specific evidence.`
      : "No local workplace reports were found for this company, so there is not enough company-specific evidence to form a stronger question.",
    citations: stories.slice(0, 2).map(storyCitation),
    gap: "No strong repeated signal was found in the local dataset. This is an evidence gap, not a positive or negative finding."
  };
}

export function generateEvidenceQuestions(input: {
  companyName: string;
  stories: QuestionStorySource[];
  comments: QuestionCommentSource[];
  limit?: number;
}): EvidenceQuestion[] {
  const limit = input.limit ?? signals.length;
  const evidence = signals
    .map((definition) => buildSignalEvidence(definition, input.stories, input.comments))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.definition.id.localeCompare(b.definition.id));
  const selected = evidence.slice(0, limit);
  if (!selected.length) return [fallbackQuestion(input.companyName, input.stories)];

  return selected.map((item) => {
    const storyCitations = item.stories.slice(0, 2).map(storyCitation);
    const commentCitations = item.comments.slice(0, Math.max(0, 2 - storyCitations.length)).map(commentCitation);
    const sourceCount = item.stories.length + item.comments.length;
    const sourceLabel = `${item.stories.length} ${item.stories.length === 1 ? "story" : "stories"}${item.comments.length ? ` and ${item.comments.length} ${item.comments.length === 1 ? "comment" : "comments"}` : ""}`;
    return {
      id: item.definition.id,
      title: item.definition.title(input.companyName),
      guidance: item.definition.guidance,
      rationale: `This company-specific signal appears across ${sourceLabel}. Repeated terms include ${item.matchedTerms.join(", ")}; the question is meant to verify the current reality for your role, not to treat reports as established facts.`,
      citations: [...storyCitations, ...commentCitations].slice(0, 3),
      ...(sourceCount < 2 ? { gap: "Only one local source matched this signal. Ask for direct confirmation before drawing a conclusion." } : {})
    };
  });
}
