import Link from "next/link";

import { CompanySearch } from "@/components/company-search";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { datasetStats } from "@/lib/research";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  buildWebApplicationSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structured-data";

export const metadata = generatePageMetadata("home");

const outcomes = [
  {
    label: "Culture",
    title: "Which topics keep appearing?",
    copy: "Recurring themes and the source context behind them.",
    border: "border-t-blue",
  },
  {
    label: "Salary",
    title: "What amounts are reported for your role?",
    copy: "Submitted ranges, sample size, and missing pay period.",
    border: "border-t-amber",
  },
  {
    label: "Work setup",
    title: "What is reported—and still unknown?",
    copy: "Mode, schedule, confidence, and current-policy gaps.",
    border: "border-t-jade",
  },
  {
    label: "Questions",
    title: "What should you confirm directly?",
    copy: "Specific prompts for your interview or offer discussion.",
    border: "border-t-ink",
  },
] as const;

export default async function HomePage() {
  const stats = await datasetStats();

  return (
    <>
      <StructuredData
        data={[buildWebSiteSchema(), buildWebApplicationSchema()]}
      />
      <SiteHeader mode="public" />
      <main id="main">
        <section className="relative overflow-hidden border-b border-line py-19 max-sm:py-9.5 sm:pb-20.5">
          <div
            className="pointer-events-none absolute -top-60 right-[calc(50%_-_650px)] size-115 rounded-full border border-line max-sm:hidden"
            aria-hidden
          />
          <div className="relative mx-auto w-[calc(100%_-_40px)] max-w-280 max-sm:w-[calc(100%_-_28px)]">
            <header className="max-w-220">
              <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                Before you apply, interview, or accept
              </p>
              <h1 className="mt-3.5 max-w-212.5 font-display text-[clamp(3.375rem,7.2vw,5.125rem)] leading-[.96] font-bold tracking-[-.045em] text-ink max-sm:mt-2.5 max-sm:text-[clamp(2.625rem,13vw,3.375rem)] max-sm:leading-[.98]">
                Search a company{" "}
                <em className="text-jade not-italic">before you say yes.</em>
              </h1>
              <p className="mt-5.5 max-w-180 text-lg leading-[1.6] text-ink-soft max-sm:mt-3.75 max-sm:text-[15px] max-sm:leading-[1.55]">
                See culture topics, submitted salary context, work-setup evidence,
                and the questions you should ask next.
              </p>
            </header>

            <CompanySearch />

            <p className="mt-4 text-xs text-muted">
              Not ready to search?{" "}
              <Link
                className="font-extrabold text-jade-dark underline underline-offset-3"
                href="/company/technonext-ltd"
              >
                Open a complete company example →
              </Link>
            </p>

            <section
              className="mt-12 overflow-hidden rounded-[14px] border border-line-strong bg-white shadow-[0_14px_42px_rgb(22_56_61_/_6%)] max-sm:mt-8.5"
              aria-labelledby="brief-outcomes-title"
            >
              <header className="px-6.5 py-6.25 max-sm:px-4.5 max-sm:py-5.25">
                <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                  What your b4joinacompany Brief answers
                </p>
                <h2
                  className="mt-2 font-display text-[clamp(1.875rem,4vw,2.625rem)] leading-[1.05] font-bold tracking-[-.03em]"
                  id="brief-outcomes-title"
                >
                  One checkpoint for the decision ahead.
                </h2>
              </header>

              <div className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
                {outcomes.map((outcome, index) => (
                  <article
                    className={`min-h-47.5 border-t-4 border-r border-line px-5.25 py-5.75 max-sm:min-h-0 max-sm:border-r-0 max-sm:border-b ${
                      index === 3
                        ? "border-r-0"
                        : index === 1
                          ? "sm:border-r-0 lg:border-r"
                          : ""
                    } ${outcome.border}`}
                    key={outcome.label}
                  >
                    <span className="font-mono text-[10px] leading-[1.4] font-extrabold tracking-[.07em] text-muted uppercase">
                      {outcome.label}
                    </span>
                    <strong className="mt-4.5 block font-display text-[21px] leading-[1.25] font-bold">
                      {outcome.title}
                    </strong>
                    <p className="mt-2.25 text-[13px] leading-[1.6] text-muted">
                      {outcome.copy}
                    </p>
                  </article>
                ))}
              </div>

              <footer className="flex flex-wrap justify-between gap-x-6 gap-y-2.5 border-t border-line bg-[#fbfdfc] px-6.5 py-3.75 text-xs leading-[1.55] text-muted max-sm:grid max-sm:px-4.5">
                <p>
                  <strong className="text-ink">
                    {stats.stories.toLocaleString()}
                  </strong>{" "}
                  workplace stories ·{" "}
                  <strong className="text-ink">
                    {stats.companies.toLocaleString()}
                  </strong>{" "}
                  company records · community-submitted salary context
                </p>
                <p>
                  Reported, submitted, and official evidence remain separate.{" "}
                  <Link
                    className="font-extrabold text-jade-dark"
                    href="/method"
                  >
                    How evidence works →
                  </Link>
                </p>
              </footer>
            </section>

            <p className="mt-4.5 text-center text-xs text-muted">
              Use the brief before applying, preparing for an interview, or
              reviewing an offer.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
