import { CompanyCompare } from "@/components/company-compare";
import { SiteHeader } from "@/components/site-header";

export default function ComparePage() {
  return (
    <>
      <SiteHeader active="Compare" />
      <main
        className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-280 py-14 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-24"
        id="main"
      >
        <header className="mb-8.5 max-w-225 max-sm:mb-6.25">
          <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
            Side-by-side research
          </p>
          <h1 className="mt-3 max-w-220 font-display text-[clamp(3rem,6vw,4.5rem)] leading-[.98] font-bold tracking-[-.04em] text-ink max-sm:mt-2.25 max-sm:text-[clamp(2.5625rem,12vw,3.1875rem)]">
            Compare two companies{" "}
            <em className="text-jade not-italic">without inventing a winner.</em>
          </h1>
          <p className="mt-4.5 max-w-190 text-[17px] leading-[1.6] text-ink-soft max-sm:mt-3.5 max-sm:text-[15px]">
            Put culture topics, salary for the same role, work-setup evidence,
            and unanswered questions on one decision surface.
          </p>
        </header>

        <CompanyCompare />
      </main>
    </>
  );
}
