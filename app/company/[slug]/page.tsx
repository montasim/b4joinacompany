import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { CheckpointView } from "@/components/checkpoint-view";
import { SiteHeader } from "@/components/site-header";
import { auth } from "@/lib/auth";
import {
  getCompany,
  getCompanyQuestions,
  getCompanySalaryEvidence,
  getCompanyWorkArrangement,
  getStories,
} from "@/lib/research";

const topicTaxonomy = [
  {
    label: "Management & feedback",
    keywords: ["manager", "management", "leadership", "boss", "hr", "ম্যানেজ", "বস", "লিড"],
  },
  {
    label: "Pay & benefits",
    keywords: ["salary", "pay", "increment", "bonus", "benefit", "overtime", "বেতন", "সেলারি", "বোনাস"],
  },
  {
    label: "Job stability",
    keywords: ["layoff", "fired", "termination", "job security", "probation", "ছাঁটাই", "বরখাস্ত", "প্রবেশন"],
  },
  {
    label: "Growth & learning",
    keywords: ["promotion", "career", "growth", "learning", "training", "পদোন্নতি", "ক্যারিয়ার", "ট্রেনিং"],
  },
  {
    label: "Workload & hours",
    keywords: ["workload", "overtime", "working hours", "deadline", "weekend", "কাজের চাপ", "ওভারটাইম"],
  },
  {
    label: "Respect & safety",
    keywords: ["culture", "toxic", "harass", "abuse", "respect", "unsafe", "হয়রানি", "নিরাপদ", "অপমান"],
  },
] as const;

function cultureTopics(
  stories: Awaited<ReturnType<typeof getStories>>,
) {
  return topicTaxonomy
    .map((topic) => ({
      label: topic.label,
      count: stories.filter((story) => {
        const text = `${story.title} ${story.excerpt} ${story.privateBody ?? ""}`.toLocaleLowerCase();
        return topic.keywords.some((keyword) =>
          text.includes(keyword.toLocaleLowerCase()),
        );
      }).length,
    }))
    .filter((topic) => topic.count > 0)
    .sort((left, right) => right.count - left.count)
    .slice(0, 4);
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();
  const requestHeaders = await headers();
  const [stories, questions, workArrangement, salaryEvidence, session] =
    await Promise.all([
      getStories(slug, "", Math.max(company.storyCount, 20)),
      getCompanyQuestions(slug, company.name),
      getCompanyWorkArrangement(slug),
      getCompanySalaryEvidence(slug),
      auth.api.getSession({ headers: requestHeaders }),
    ]);
  return (
    <>
      <SiteHeader />
      <CheckpointView
        canSaveCompany={Boolean(session)}
        company={company}
        cultureTopics={cultureTopics(stories)}
        questions={questions.slice(0, 3)}
        salaryEvidence={salaryEvidence}
        stories={stories.map((story) => ({
          id: story.id,
          companySlug: story.companySlug,
          title: story.title,
          excerpt: story.excerpt,
          role: story.role,
          date: story.date,
          dateLabel: story.dateLabel,
          vibe: story.vibe,
          reactions: story.reactions,
          comments: story.comments,
          sourceUrl: story.sourceUrl,
        }))}
        workArrangement={workArrangement}
      />
    </>
  );
}
