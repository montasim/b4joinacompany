import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { searchCompanies } from "@/lib/research";
import { initials, normalizeText } from "@/lib/utils";

export default async function MatchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = ((await searchParams).q ?? "").trim();
  const matches = await searchCompanies(query);
  const normalizedQuery = normalizeText(query).replace(/\s+/g, "");
  const exactMatch = matches.find((company) =>
    [company.name, company.sourceName, company.slug, ...company.aliases].some(
      (value) => normalizeText(value).replace(/\s+/g, "") === normalizedQuery
    )
  );

  if (exactMatch) redirect(`/company/${exactMatch.slug}`);

  return (
    <>
      <SiteHeader active="Research" />
      <main
        id="main"
        className="relative mx-auto min-h-[calc(100vh-64px)] w-[calc(100%_-_40px)] max-w-280 py-12 pb-20 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-14"
      >
        <PageHead
          eyebrow="Confirm the company"
          title={query ? `Which “${query}” do you mean?` : "Search for a company."}
          copy={
            query
              ? "Choose explicitly so evidence is never attached to the wrong company."
              : "Enter a company name, alias, website, or LinkedIn address to build a brief."
          }
        />
        {query && (
          <div className="mb-4 flex items-center gap-3 text-sm font-semibold text-ink">
            <Badge>{matches.length} matches</Badge>
            <span>{query}</span>
          </div>
        )}

        {matches.length > 0 ? (
          <section className="grid gap-3" aria-label="Company matches">
            {matches.map((company) => (
              <Card key={company.slug}>
                <CardContent className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-4 p-4.5 max-sm:grid-cols-[44px_minmax(0,1fr)]">
                  <span className="grid size-11 place-items-center rounded-xl bg-jade-soft font-mono text-[11px] font-extrabold text-jade-dark">
                    {initials(company.name)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-extrabold text-ink">{company.name}</h2>
                    <p className="mt-1 truncate text-[11px] leading-relaxed text-muted">
                      {company.websiteUrl ?? company.sourceUrl} · {company.storyCount} stories
                    </p>
                  </div>
                  <Button asChild className="max-sm:col-span-2 max-sm:mt-1 max-sm:ml-15" size="sm">
                    <Link href={`/company/${company.slug}`}>Choose company</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-start p-7">
              <h2 className="font-display text-2xl font-bold tracking-[-.02em] text-ink">No close company match found.</h2>
              <p className="mt-2 max-w-150 text-sm leading-relaxed text-ink-soft">
                Try a shorter company name, a known alias, its website, or its LinkedIn address.
              </p>
              <Button asChild className="mt-5" variant="outline">
                <Link href="/#research">Search again</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
