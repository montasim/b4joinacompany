import Link from "next/link";

import {
  EvidenceCoverageMark,
  evidenceCoverageCopy,
} from "@/components/evidence-coverage-mark";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import type {
  EvidenceCoverage,
  EvidenceCoverageFilter,
} from "@/lib/contracts";
import { browseCompanyDirectory } from "@/lib/research";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata("companies");

const pageSize = 40;
const filters: Array<{
  value: Exclude<EvidenceCoverageFilter, "deshimula">;
  label: string;
}> = [
  { value: "all", label: "All records" },
  { value: "both", label: "Both sources" },
  { value: "deshimula_only", label: "Deshi only" },
  { value: "betonkemon_only", label: "Beton only" },
  { value: "review", label: "Needs review" },
];
const validFilters = new Set(filters.map((filter) => filter.value));

function recordSummary(
  coverage: EvidenceCoverage,
  stories: number,
  salaryEntries: number,
  salaryRoles: number,
) {
  if (coverage === "both") {
    return `${stories.toLocaleString()} workplace stories · ${salaryEntries.toLocaleString()} salary entries across ${salaryRoles.toLocaleString()} roles`;
  }
  if (coverage === "betonkemon_only") {
    return `${salaryEntries.toLocaleString()} salary entries across ${salaryRoles.toLocaleString()} roles · no accepted workplace-story match`;
  }
  if (coverage === "review") {
    return `${stories.toLocaleString()} workplace stories · a possible salary match remains unconfirmed`;
  }
  return `${stories.toLocaleString()} workplace stories · no accepted salary-source match`;
}

function directoryHref({
  query,
  coverage,
  page,
}: {
  query: string;
  coverage: EvidenceCoverageFilter;
  page?: number;
}) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (coverage !== "all") params.set("coverage", coverage);
  if (page && page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return suffix ? `/companies?${suffix}` : "/companies";
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; coverage?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const requestedCoverage = params.coverage ?? "all";
  const coverage = validFilters.has(
    requestedCoverage as Exclude<EvidenceCoverageFilter, "deshimula">,
  )
    ? (requestedCoverage as EvidenceCoverageFilter)
    : "all";
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  const directory = await browseCompanyDirectory({
    query,
    coverage,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
  const totalPages = Math.max(1, Math.ceil(directory.total / pageSize));
  const counts = directory.counts;

  return (
    <>
      <SiteHeader active="Directory" mode="public" />
      <main id="main" className="mx-auto min-h-[calc(100vh-64px)] w-[calc(100%_-_40px)] max-w-280 py-12 pb-20 max-sm:w-[calc(100%_-_28px)] max-sm:py-8">
        <header className="grid gap-8 border-b border-line pb-9 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
              Evidence coverage ledger
            </p>
            <h1 className="mt-3 max-w-190 font-display text-[clamp(2.75rem,6vw,4.75rem)] leading-[.98] font-bold tracking-[-.045em] text-ink">
              See what exists—even when the sources do not meet.
            </h1>
            <p className="mt-5 max-w-175 text-base leading-[1.65] text-ink-soft">
              Deshi Mula workplace stories and Beton Kemon salary records are listed independently. Only accepted identity matches are joined; possible matches stay visibly unresolved.
            </p>
          </div>
          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-line-strong bg-white">
            {([
              ["both", "Both sources"],
              ["deshimula_only", "Deshi only"],
              ["betonkemon_only", "Beton only"],
              ["review", "Needs review"],
            ] as const).map(([key, label], index) => (
              <div className={`p-4 ${index % 2 === 0 ? "border-r border-line" : ""} ${index < 2 ? "border-b border-line" : ""}`} key={key}>
                <strong className="font-display text-2xl text-ink">{counts[key].toLocaleString()}</strong>
                <span className="mt-1 block text-[10px] font-bold text-muted">{label}</span>
              </div>
            ))}
          </div>
        </header>

        <section className="sticky top-16 z-30 -mx-2 mt-6 rounded-xl border border-line-strong bg-white/95 p-3 shadow-[0_12px_34px_rgb(22_56_61_/_8%)] backdrop-blur-md" aria-label="Directory controls">
          <form className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 max-sm:grid-cols-1" action="/companies">
            <input type="hidden" name="coverage" value={coverage} />
            <label className="sr-only" htmlFor="directory-query">Search companies</label>
            <input className="min-h-11 rounded-lg border border-line-strong bg-white px-3 text-sm font-semibold outline-none placeholder:text-muted focus:border-jade focus:ring-3 focus:ring-jade/10" id="directory-query" name="q" placeholder="Search either source by company name" defaultValue={query} />
            <Button type="submit">Search directory</Button>
          </form>
          <nav className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5" aria-label="Evidence coverage filters">
            {filters.map((filter) => (
              <Link className={`shrink-0 rounded-full border px-2.5 py-1.5 font-mono text-[8px] font-extrabold tracking-[.04em] uppercase no-underline ${coverage === filter.value ? "border-ink bg-ink text-white" : "border-line-strong text-muted hover:border-jade hover:text-jade-dark"}`} href={directoryHref({ query, coverage: filter.value })} key={filter.value} aria-current={coverage === filter.value ? "page" : undefined}>
                {filter.label}
              </Link>
            ))}
          </nav>
        </section>

        <div className="mt-7 flex items-baseline justify-between gap-4 border-b border-line pb-3">
          <h2 className="font-display text-2xl font-bold tracking-[-.02em]">
            {query ? `Results for “${query}”` : "All company records"}
          </h2>
          <span className="font-mono text-[9px] font-extrabold tracking-[.07em] text-muted uppercase">{directory.total.toLocaleString()} records</span>
        </div>

        {directory.items.length > 0 ? (
          <ol className="divide-y divide-line" aria-label="Company evidence records">
            {directory.items.map((company) => (
              <li key={company.id}>
                <Link className="group grid grid-cols-[110px_minmax(0,1fr)_auto] items-center gap-5 px-2 py-5 text-ink no-underline hover:bg-jade-soft/50 max-sm:grid-cols-[82px_minmax(0,1fr)] max-sm:gap-3" href={company.href}>
                  <EvidenceCoverageMark coverage={company.coverage} />
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <strong className="truncate text-sm font-extrabold">{company.name}</strong>
                      <span className={`rounded-full px-2 py-1 font-mono text-[7px] font-extrabold uppercase ${company.coverage === "both" ? "bg-jade-soft text-jade-dark" : company.coverage === "review" ? "bg-amber-soft text-amber-dark" : "bg-mist text-muted"}`}>
                        {evidenceCoverageCopy[company.coverage].shortLabel}
                      </span>
                    </span>
                    <small className="mt-1.5 block text-[10px] leading-relaxed text-muted">
                      {recordSummary(company.coverage, company.storyCount, company.salaryEntryCount, company.salaryRoleCount)}
                    </small>
                  </span>
                  <span className="font-mono text-[9px] font-extrabold text-jade-dark uppercase group-hover:translate-x-1 max-sm:col-start-2">Open record →</span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-xl border border-line-strong bg-white p-8">
            <h2 className="font-display text-2xl font-bold">No records match this view.</h2>
            <p className="mt-2 text-sm text-muted">Try a shorter name or clear the evidence filter.</p>
            <Button asChild className="mt-5" variant="outline"><Link href="/companies">View all records</Link></Button>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-8 flex items-center justify-between border-t border-line pt-5" aria-label="Directory pagination">
            {page > 1 ? <Button asChild variant="outline"><Link href={directoryHref({ query, coverage, page: page - 1 })}>← Previous</Link></Button> : <span />}
            <span className="font-mono text-[9px] font-extrabold text-muted uppercase">Page {Math.min(page, totalPages)} of {totalPages}</span>
            {page < totalPages ? <Button asChild variant="outline"><Link href={directoryHref({ query, coverage, page: page + 1 })}>Next →</Link></Button> : <span />}
          </nav>
        )}
      </main>
    </>
  );
}
