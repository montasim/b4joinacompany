import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { EvidenceCoverageMark } from "@/components/evidence-coverage-mark";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBetonkemonCompany } from "@/lib/research";
import { generateDynamicPageMetadata } from "@/lib/seo/metadata";

function money(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await getBetonkemonCompany(slug);
  if (!company) return {};
  return {
    ...generateDynamicPageMetadata({
      title: `${company.name} salary evidence`,
      description: `Community-submitted salary coverage for ${company.name} from Beton Kemon, shown without an accepted Deshi Mula company match.`,
      path: `/salary-company/${slug}`,
      keywords: [`${company.name} salary`, "Beton Kemon salary"],
    }),
    robots: { index: false, follow: true },
  };
}

export default async function SalaryCompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getBetonkemonCompany(slug);
  if (!company) notFound();
  if (company.matchedCompanySlug) redirect(`/company/${company.matchedCompanySlug}`);

  const capturedDate = new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeZone: "Asia/Dhaka",
  }).format(new Date(company.capturedAt));

  return (
    <>
      <SiteHeader active="Directory" mode="public" />
      <main id="main" className="mx-auto min-h-[calc(100vh-64px)] w-[calc(100%_-_40px)] max-w-280 py-12 pb-20 max-sm:w-[calc(100%_-_28px)] max-sm:py-8">
        <Link className="font-mono text-[9px] font-extrabold tracking-[.06em] text-jade-dark uppercase no-underline hover:underline" href="/companies?coverage=betonkemon_only">
          ← Beton-only records
        </Link>

        <header className="mt-7 grid gap-8 border-b border-line pb-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <EvidenceCoverageMark coverage="betonkemon_only" />
              <Badge tone="amber">Beton Kemon only</Badge>
            </div>
            <h1 className="mt-5 font-display text-[clamp(2.75rem,6vw,4.75rem)] leading-[.98] font-bold tracking-[-.045em] text-ink">
              {company.name}
            </h1>
            <p className="mt-5 max-w-175 text-base leading-[1.65] text-ink-soft">
              Salary evidence exists for this name, but the dataset has no accepted match to a Deshi Mula workplace-story company. It remains a separate record to avoid attaching evidence to the wrong employer.
            </p>
          </div>
          <aside className="rounded-xl border border-amber bg-amber-soft p-5">
            <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-amber-dark uppercase">Identity boundary</p>
            <strong className="mt-2 block font-display text-xl leading-tight text-ink">No workplace stories are joined here.</strong>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">A similar name is not enough. This record can be linked only after the company identity is confirmed.</p>
          </aside>
        </header>

        <section className="mt-8 overflow-hidden rounded-[14px] border border-line-strong bg-white shadow-[0_16px_44px_rgb(22_56_61_/_7%)]" aria-labelledby="salary-summary-title">
          <header className="border-b border-line px-6 py-5 max-sm:px-4">
            <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-amber-dark uppercase">Community-submitted aggregate</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-[-.03em]" id="salary-summary-title">Reported salary coverage</h2>
          </header>
          <div className="grid sm:grid-cols-3">
            <div className="border-r border-line p-6 max-sm:border-r-0 max-sm:border-b max-sm:p-4">
              <span className="text-[10px] font-bold text-muted">Reported range</span>
              <strong className="mt-2 block font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-ink">
                {company.reportedSalaryRange
                  ? `${money(company.reportedSalaryRange.minimumBdt)}–${money(company.reportedSalaryRange.maximumBdt)}`
                  : "Not captured"}
              </strong>
              <small className="mt-2 block text-[9px] text-muted">Pay period is unspecified.</small>
            </div>
            <div className="border-r border-line p-6 max-sm:border-r-0 max-sm:border-b max-sm:p-4">
              <span className="text-[10px] font-bold text-muted">Salary entries</span>
              <strong className="mt-2 block font-display text-4xl text-ink">{company.salaryEntryCount.toLocaleString()}</strong>
              <small className="mt-2 block text-[9px] text-muted">Count reported by the source index.</small>
            </div>
            <div className="p-6 max-sm:p-4">
              <span className="text-[10px] font-bold text-muted">Role coverage</span>
              <strong className="mt-2 block font-display text-4xl text-ink">{company.roleCount.toLocaleString()}</strong>
              <small className="mt-2 block text-[9px] text-muted">Detailed role rows were not imported for unmatched records.</small>
            </div>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-mist px-6 py-4 max-sm:px-4">
            <p className="text-[10px] leading-relaxed text-muted">Captured {capturedDate} · unverified user-submitted evidence</p>
            <Button asChild size="sm" variant="outline">
              <a href={company.sourceUrl} target="_blank" rel="noreferrer">Open source ↗</a>
            </Button>
          </footer>
        </section>

        <section className="mt-8 grid gap-5 border-t border-line pt-8 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold">Know the matching Deshi Mula company?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">Send the exact source URL through support. The evidence should only be joined after an identity check.</p>
          </div>
          <div className="flex flex-wrap items-start gap-2 sm:justify-end">
            <Button asChild variant="outline"><Link href="/support">Suggest a correction</Link></Button>
            <Button asChild><Link href="/companies">Browse all records</Link></Button>
          </div>
        </section>
      </main>
    </>
  );
}
