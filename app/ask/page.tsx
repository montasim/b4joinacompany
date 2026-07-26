import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { AskForm } from "@/components/ask-form";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getCompany, getCompanyQuestions } from "@/lib/research";
import { initials } from "@/lib/utils";

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string; question?: string }>;
}) {
  const params = await searchParams;
  const slug = params.company?.trim();
  if (!slug) notFound();

  const company = await getCompany(slug);
  if (!company) notFound();
  const preparedQuestions = await getCompanyQuestions(
    company.slug,
    company.name,
  );
  const initialQuestion = params.question?.trim().slice(0, 500) ?? "";

  return (
    <>
      <SiteHeader active="Research" />
      <main
        id="main"
        className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[linear-gradient(rgb(20_120_110_/_4%)_1px,transparent_1px),linear-gradient(90deg,rgb(20_120_110_/_4%)_1px,transparent_1px)] bg-size-[32px_32px] py-12 pb-20 max-sm:py-8 max-sm:pb-14"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-6 left-[max(-210px,calc((100vw-1120px)/2-310px))] size-132 rounded-full border border-jade/15 max-sm:hidden"
        />
        <div className="relative mx-auto w-[calc(100%_-_40px)] max-w-280 max-sm:w-[calc(100%_-_28px)]">
          <nav className="mb-7 flex items-center gap-2 text-[11px] text-muted max-sm:mb-5">
            <Link
              className="inline-flex items-center gap-1.5 font-extrabold text-jade-dark no-underline"
              href={`/company/${company.slug}`}
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              {company.name}
            </Link>
            <span aria-hidden="true">/</span>
            <span>Ask the evidence</span>
          </nav>

          <section className="mb-8 grid grid-cols-[minmax(0,1fr)_390px] items-end gap-12 max-lg:grid-cols-1 max-lg:gap-7 max-sm:mb-6">
            <header className="max-w-190">
              <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                Ask the evidence
              </p>
              <h1 className="mt-3 font-display text-[clamp(3rem,6vw,4.5rem)] leading-[.98] font-bold tracking-[-.04em] text-ink max-sm:text-[clamp(2.55rem,12vw,3.2rem)]">
                Turn one question into a{" "}
                <em className="text-jade not-italic underline decoration-amber decoration-[6px] underline-offset-6 max-sm:decoration-4">
                  cited answer.
                </em>
              </h1>
              <p className="mt-4.5 max-w-175 text-[16px] leading-[1.65] text-ink-soft max-sm:text-[15px]">
                Ask about {company.name}. b4joinacompany searches{" "}
                {company.storyCount.toLocaleString()} workplace{" "}
                {company.storyCount === 1 ? "report" : "reports"}, retrieves
                relevant excerpts, and shows where the answer came from—or
                where the evidence stops.
              </p>
            </header>

            <aside className="relative overflow-hidden rounded-[13px] border border-line-strong bg-white shadow-[0_14px_38px_rgb(22_56_61_/_7%)] before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[linear-gradient(to_bottom,#356c82_0_34%,#e9b44c_34%_67%,#14786e_67%)]">
              <header className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line px-5 py-4">
                <span className="grid size-11 place-items-center rounded-xl bg-jade-soft font-mono text-[10px] font-extrabold text-jade-dark">
                  {initials(company.name)}
                </span>
                <div>
                  <p className="font-mono text-[8px] font-extrabold tracking-[.07em] text-muted uppercase">
                    Question scope
                  </p>
                  <strong className="mt-1 block text-[12px]">
                    {company.name}
                  </strong>
                </div>
                <Badge>Company locked</Badge>
              </header>
              <div className="grid grid-cols-3 divide-x divide-line bg-[#fbfdfc]">
                <p className="px-4 py-3.5">
                  <strong className="block font-display text-[21px] leading-none">
                    {company.storyCount.toLocaleString()}
                  </strong>
                  <span className="mt-1.5 block text-[8px] leading-snug text-muted">
                    reports in scope
                  </span>
                </p>
                <p className="px-4 py-3.5">
                  <strong className="block font-display text-[21px] leading-none">
                    Up to 8
                  </strong>
                  <span className="mt-1.5 block text-[8px] leading-snug text-muted">
                    excerpts retrieved
                  </span>
                </p>
                <p className="px-4 py-3.5">
                  <strong className="block font-display text-[17px] leading-none">
                    {company.snapshotDate}
                  </strong>
                  <span className="mt-1.5 block text-[8px] leading-snug text-muted">
                    evidence snapshot
                  </span>
                </p>
              </div>
              <footer className="flex items-center justify-between gap-4 border-t border-line px-5 py-3">
                <p className="text-[8px] leading-relaxed text-muted">
                  The answer cannot use another company’s reports.
                </p>
                <Link
                  className="inline-flex shrink-0 items-center gap-1 text-[9px] font-extrabold text-jade-dark underline decoration-jade/30 underline-offset-3"
                  href={`/company/${company.slug}`}
                >
                  Back to brief <ArrowRight aria-hidden="true" className="size-3" />
                </Link>
              </footer>
            </aside>
          </section>

          <AskForm
            companyName={company.name}
            companySlug={company.slug}
            initialQuestion={initialQuestion}
            preparedQuestions={preparedQuestions
              .slice(0, 3)
              .map((question) => question.title)}
            snapshotDate={company.snapshotDate}
            storyCount={company.storyCount}
          />
        </div>
      </main>
    </>
  );
}
