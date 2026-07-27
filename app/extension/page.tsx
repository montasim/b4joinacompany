import Link from "next/link";
import { ArrowDown, ArrowRight, Check, ExternalLink } from "lucide-react";

import { ExtensionProductPreview } from "@/components/extension-product-preview";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { datasetStats, getCompany } from "@/lib/research";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata("extension");

const releaseUrl = "https://github.com/montasim/deshi-mula-extended/releases/latest";

export default async function ExtensionPage() {
  const [stats, previewCompany] = await Promise.all([datasetStats(), getCompany("technonext-ltd")]);
  const companyName = previewCompany?.name ?? "Example company";
  const storyCount = previewCompany?.storyCount ?? 0;
  const snapshotDate = previewCompany?.snapshotDate ?? stats.snapshotDate;

  return (
    <>
      <SiteHeader active="Extension" mode="public" />
      <main id="main">
        <section className="relative overflow-hidden border-b border-line bg-[linear-gradient(rgb(20_120_110_/_4%)_1px,transparent_1px),linear-gradient(90deg,rgb(20_120_110_/_4%)_1px,transparent_1px),var(--color-mist)] bg-size-[32px_32px] py-16.5 pb-21.5 before:absolute before:top-7.5 before:right-[max(-130px,calc((100vw-1120px)/2-230px))] before:size-140 before:rounded-full before:border before:border-jade/13 max-md:py-12">
          <div className="relative mx-auto grid w-[calc(100%_-_40px)] max-w-280 grid-cols-[minmax(340px,.76fr)_minmax(590px,1.24fr)] items-center gap-14.5 max-sm:w-[calc(100%_-_28px)] max-lg:grid-cols-1">
            <div>
              <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                b4joinacompany for Deshi Mula
              </p>
              <h1 className="mt-3 max-w-135 font-display text-[clamp(49px,5vw,68px)] leading-[.98] font-bold tracking-[-.04em] text-ink">
                Know what to ask{" "}
                <em className="font-inherit text-jade not-italic underline decoration-amber decoration-6 underline-offset-5">
                  without leaving the story.
                </em>
              </h1>
              <p className="mt-5 max-w-130 text-base leading-[1.65] text-ink-soft">
                Open one panel for culture patterns, community-submitted pay, reported work setup, source stories,
                and cited questions.
              </p>
              <div className="mt-6.75 flex flex-wrap gap-2.5">
                <Button asChild size="lg">
                  <a href={releaseUrl} rel="noreferrer" target="_blank">
                    Get the extension <ExternalLink aria-hidden="true" className="size-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#extension-preview">
                    See it in action <ArrowDown aria-hidden="true" className="size-4" />
                  </a>
                </Button>
              </div>
              <ul
                aria-label="Extension requirements"
                className="mt-5.75 flex list-none flex-wrap gap-x-4.5 gap-y-2.5 p-0 text-[11px] font-bold text-muted"
              >
                {["No b4joinacompany account", "No setup screen", "Works on Deshi Mula"].map((item) => (
                  <li className="flex items-center gap-1.75" key={item}>
                    <span className="grid size-4.25 place-items-center rounded-full bg-jade-soft text-jade-dark">
                      <Check aria-hidden="true" className="size-2.5 stroke-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-mono text-[9px] leading-3.5 font-bold tracking-[.025em] text-quiet">
                Install on a desktop Brave or Chrome browser.
              </p>
            </div>

            <ExtensionProductPreview
              companyName={companyName}
              snapshotDate={snapshotDate}
              storyCount={storyCount}
            />
          </div>
        </section>

        <section className="bg-white py-19" aria-labelledby="extension-workflow-title">
          <div className="mx-auto w-[calc(100%_-_40px)] max-w-280 max-sm:w-[calc(100%_-_28px)]">
            <header className="mb-7.5 max-w-190">
              <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                A shorter path to the useful part
              </p>
              <h2
                className="mt-2.25 font-display text-[clamp(34px,4vw,48px)] leading-[1.05] font-bold tracking-[-.035em]"
                id="extension-workflow-title"
              >
                From company page to decision brief in one click.
              </h2>
            </header>
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center overflow-hidden rounded-[13px] border border-line-strong bg-mist max-md:grid-cols-1">
              {[
                [
                  "Open",
                  "Visit a Deshi Mula company or story.",
                  "The extension adds Research beside a confirmed company identity."
                ],
                [
                  "Recognize",
                  "Open the company panel.",
                  "No copying a company name and no separate account or setup flow."
                ],
                [
                  "Research",
                  "Read, filter, or ask.",
                  "Move from summarized signals back to the stories and cited evidence."
                ]
              ].map(([label, title, copy], index) => (
                <div className="contents" key={label}>
                  {index > 0 && (
                    <i
                      className="grid size-8 place-items-center rounded-full border border-line bg-white text-jade not-italic max-md:mx-6 max-md:-my-4 max-md:rotate-90"
                      aria-hidden="true"
                    >
                      →
                    </i>
                  )}
                  <article className="min-h-43 p-6.25 max-md:min-h-0">
                    <span className="mb-4.25 block font-mono text-[9px] font-extrabold tracking-[.07em] text-jade-dark uppercase">
                      {label}
                    </span>
                    <strong className="block font-display text-xl leading-tight">{title}</strong>
                    <p className="mt-2 text-[11px] leading-[1.6] text-muted">{copy}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-19" aria-labelledby="extension-integrity-title">
          <div className="mx-auto w-[calc(100%_-_40px)] max-w-280 overflow-hidden rounded-[14px] border border-line-strong bg-white shadow-[0_12px_35px_rgb(22_56_61_/_6%)] max-sm:w-[calc(100%_-_28px)]">
            <header className="max-w-195 px-8 py-7.5 pb-6.75 max-sm:px-5">
              <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                The labels travel with the evidence
              </p>
              <h2
                className="mt-2.25 font-display text-[clamp(32px,4vw,45px)] leading-[1.05] font-bold tracking-[-.035em]"
                id="extension-integrity-title"
              >
                Nothing is blurred into a company score.
              </h2>
              <p className="mt-2.5 text-[13px] leading-[1.6] text-ink-soft">
                The panel keeps four kinds of information separate so you can judge what deserves trust—and what
                still needs a direct question.
              </p>
            </header>
            <div className="grid grid-cols-4 border-t border-line max-md:grid-cols-2 max-sm:grid-cols-1">
              {[
                ["Reported", "Workplace stories", "Personal accounts with their original source context.", "border-t-blue"],
                [
                  "Submitted",
                  "Salary amounts",
                  "Community context with sample and missing-period labels.",
                  "border-t-amber"
                ],
                [
                  "Derived",
                  "Work setup",
                  "Unverified mentions, never presented as current policy.",
                  "border-t-coral"
                ],
                [
                  "Official",
                  "Company destinations",
                  "Website, careers, and LinkedIn links when accepted.",
                  "border-t-jade"
                ]
              ].map(([label, title, copy, color]) => (
                <article
                  className={`min-h-40.5 border-t-4 ${color} border-r border-r-line p-5.5 last:border-r-0 max-md:border-b max-md:border-b-line`}
                  key={label}
                >
                  <span className="font-mono text-[8px] font-extrabold tracking-[.07em] text-muted uppercase">
                    {label}
                  </span>
                  <strong className="mt-3 block font-display text-lg leading-tight">{title}</strong>
                  <p className="mt-1.75 text-[10px] leading-[1.55] text-muted">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-21" aria-labelledby="extension-install-title">
          <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-280 grid-cols-[minmax(0,1fr)_minmax(360px,.8fr)] gap-10.5 rounded-[14px] border border-line-strong bg-ink p-9 text-white max-sm:w-[calc(100%_-_28px)] max-lg:grid-cols-1 max-sm:p-6">
            <div>
              <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-[#89d5cc] uppercase">
                Install from GitHub
              </p>
              <h2
                className="mt-2.25 font-display text-[clamp(34px,4vw,48px)] leading-none font-bold tracking-[-.035em]"
                id="extension-install-title"
              >
                Research while you browse.
              </h2>
              <p className="mt-3 max-w-140 text-xs leading-[1.65] text-white/72">
                The extension works independently. Use the website only when you want a larger company brief,
                comparison, or private saved research.
              </p>
              <div className="mt-6.75 flex flex-wrap gap-2.5">
                <Button asChild size="lg">
                  <a href={releaseUrl} rel="noreferrer" target="_blank">
                    Download the latest release <ExternalLink aria-hidden="true" className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  className="border-white/30 bg-transparent text-white hover:border-white hover:bg-white/8 hover:text-white"
                  size="lg"
                  variant="outline"
                >
                  <Link href="/#research">
                    Use b4joinacompany on the web <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <ol className="m-0 grid list-none p-0">
              {[
                ["Download and extract", "Keep the extracted extension folder in a permanent location."],
                ["Open browser extensions", "Enable Developer mode in desktop Brave or Chrome."],
                ["Load unpacked", "Choose the extracted folder containing manifest.json."]
              ].map(([title, copy], index) => (
                <li
                  className="grid grid-cols-[28px_1fr] gap-3 border-b border-white/15 py-3.25 last:border-0"
                  key={title}
                >
                  <span className="grid size-6.25 place-items-center rounded-full bg-amber font-mono text-[9px] font-extrabold text-ink">
                    {index + 1}
                  </span>
                  <div>
                    <strong className="block text-[11px] text-white">{title}</strong>
                    <p className="mt-1 text-[9px] leading-3.5 text-white/62">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="col-span-full -mt-0.5 border-t border-white/15 pt-3.75 text-[9px] leading-3.5 text-white/62 max-lg:col-span-1">
              <strong className="text-white">Manual distribution:</strong> GitHub-installed versions do not update
              automatically. Return to Releases for future updates. Published b4joinacompany evidence currently covers{" "}
              {stats.companies.toLocaleString()} companies and {stats.stories.toLocaleString()} workplace stories.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
