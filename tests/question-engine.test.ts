import { describe, expect, it } from "vitest";
import { generateEvidenceQuestions } from "../lib/question-engine";

const story = (id: string, body: string, vibe: "positive" | "mixed" | "negative" = "mixed") => ({
  id,
  title: "Local report",
  role: "Software Engineer",
  dateLabel: "Jul 2026",
  vibe,
  body
});

describe("generateEvidenceQuestions", () => {
  it("ranks different questions from different company evidence", () => {
    const payQuestions = generateEvidenceQuestions({
      companyName: "PayCo",
      stories: [story("pay-1", "Salary increment is unclear and overtime pay was delayed.", "negative")],
      comments: [{ id: "comment-1", storyId: "pay-1", dateLabel: "Jul 2026", text: "The bonus and salary policy needs written confirmation." }]
    });
    const cultureQuestions = generateEvidenceQuestions({
      companyName: "CultureCo",
      stories: [story("culture-1", "The manager and leadership handled feedback respectfully.")],
      comments: [{ id: "comment-2", storyId: "culture-1", dateLabel: "Jul 2026", text: "Ask how concerns are escalated beyond the team lead." }]
    });

    expect(payQuestions[0]?.id).toBe("compensation");
    expect(cultureQuestions[0]?.id).toBe("management");
    expect(payQuestions[0]?.citations.some((citation) => citation.startsWith("Comment"))).toBe(true);
  });

  it("returns an evidence-gap prompt when no signal matches", () => {
    const questions = generateEvidenceQuestions({
      companyName: "QuietCo",
      stories: [story("quiet-1", "A short report with no recurring workplace detail.")],
      comments: []
    });

    expect(questions).toHaveLength(1);
    expect(questions[0]?.gap).toContain("No strong repeated signal");
  });
});
