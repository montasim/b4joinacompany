import { notFound } from "next/navigation";
import { CheckpointView } from "@/components/checkpoint-view";
import { SiteHeader } from "@/components/site-header";
import { sampleCheckpoint } from "@/lib/fixtures";
import {
  getCompany,
  getCompanyQuestions,
  getCompanySalaryEvidence,
  getCompanyWorkArrangement,
  getStories,
} from "@/lib/research";

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();
  const [stories, questions, workArrangement, salaryEvidence] = await Promise.all([
    getStories(slug),
    getCompanyQuestions(slug, company.name),
    getCompanyWorkArrangement(slug),
    getCompanySalaryEvidence(slug),
  ]);
  const checkpoint = { ...sampleCheckpoint, company, snapshotVersion: company.snapshotDate, questions };
  return <><SiteHeader /><CheckpointView checkpoint={checkpoint} stories={stories} workArrangement={workArrangement} salaryEvidence={salaryEvidence} /></>;
}
