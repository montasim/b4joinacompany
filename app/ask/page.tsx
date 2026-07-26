import Link from "next/link";
import { notFound } from "next/navigation";

import { AskForm } from "@/components/ask-form";
import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { getCompany } from "@/lib/research";

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const slug = (await searchParams).company?.trim();
  if (!slug) notFound();

  const company = await getCompany(slug);
  if (!company) notFound();

  return (
    <>
      <SiteHeader active="Research" />
      <main
        id="main"
        className="mx-auto min-h-[calc(100vh-64px)] w-[calc(100%_-_40px)] max-w-280 py-12 pb-20 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-14"
      >
        <nav className="mb-6 flex items-center gap-2 text-[11px] text-muted">
          <Link
            className="font-extrabold text-jade-dark no-underline"
            href={`/company/${company.slug}`}
          >
            {company.name}
          </Link>
          <span>/</span>
          <span>Ask the evidence</span>
        </nav>
        <PageHead
          copy={`b4join retrieves relevant sources for ${company.name}, then answers only from that evidence with visible citations.`}
          eyebrow="Company-scoped research"
          title="Ask one focused question."
        />
        <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-7.5 max-lg:grid-cols-1">
          <AskForm
            companyName={company.name}
            companySlug={company.slug}
            snapshotDate={company.snapshotDate}
            storyCount={company.storyCount}
          />
          <aside className="grid h-fit gap-3 max-lg:grid-cols-3 max-md:grid-cols-1">
            {[
              [
                "Evidence used",
                `${company.storyCount.toLocaleString()} company reports are searched at request time. Citations identify the retrieved evidence.`,
              ],
              [
                "Provider boundary",
                "Only relevant excerpts and your question are sent to the configured AI provider.",
              ],
              [
                "Ask is not general chat",
                "Questions stay scoped to this company. Unsupported claims return an Evidence Gap instead of a guess.",
              ],
            ].map(([title, copy]) => (
              <section
                className="rounded-xl border border-line bg-white p-5"
                key={title}
              >
                <h2 className="font-display text-lg font-bold">{title}</h2>
                <p className="mt-2 text-[10px] leading-relaxed text-muted">
                  {copy}
                </p>
              </section>
            ))}
          </aside>
        </div>
      </main>
    </>
  );
}
