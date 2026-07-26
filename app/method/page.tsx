import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, X } from "lucide-react";

import { MethodProvenance } from "@/components/method-provenance";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { datasetStats } from "@/lib/research";

export const metadata: Metadata = {
  title: "How b4join handles evidence",
  description:
    "See how b4join preserves evidence origin, names every transformation, limits AI answers, and keeps uncertainty visible."
};

const questionPaths = [
  {
    id: "01",
    eyebrow: "Default checkpoint",
    title: "Rules prepare what to verify.",
    flag: "No AI call",
    tone: "blue",
    steps: [
      [
        "Input",
        "Company stories + joined comments",
        "Role and date context are retained."
      ],
      [
        "Scan",
        "Eight fixed candidate concerns",
        "Term recurrence ranks management, pay, stability, growth, workload, culture, work setup, and hiring."
      ],
      [
        "Output",
        "Question + guidance + rationale",
        "Up to three source labels are attached. Thin evidence keeps an Evidence Gap."
      ]
    ],
    footer: "A prepared question is a prompt for direct verification—not a finding about the company."
  },
  {
    id: "02",
    eyebrow: "Optional Ask",
    title: "Generated text needs source review.",
    flag: "Excerpts sent on Ask",
    tone: "amber",
    steps: [
      [
        "Retrieve",
        "A bounded set of company story excerpts",
        "If lexical matching finds none, early company stories may supply fallback context."
      ],
      [
        "Request",
        "The provider is instructed to stay cited",
        "Retrieved excerpts leave b4join only after Ask is used."
      ],
      [
        "Return",
        "Answer with [S#] labels—or labeled retrieval fallback",
        "Generated prose is not independently fact-checked. Inspect the cited stories."
      ]
    ],
    footer: "When the AI allowance is exhausted, Ask stops before retrieval; public evidence remains available."
  }
] as const;

const revisionSteps = [
  [
    "Published release",
    "Versioned evidence and lane-specific dates",
    "Public research reads from the active release.",
    "v1.3.0"
  ],
  [
    "New source or correction",
    "Prepared for operator review",
    "The correction desk creates a review task; it changes nothing automatically.",
    "Not published"
  ],
  [
    "Integrity review",
    "Identity, labels, joins, and files are checked",
    "Integrity checks do not fact-check personal claims.",
    "Owner run"
  ],
  [
    "Later release",
    "Accepted changes can enter a new version",
    "Earlier release identifiers remain meaningful.",
    "New version"
  ]
] as const;

export default async function MethodPage() {
  const stats = await datasetStats();

  return (
    <>
      <SiteHeader active="Method" mode="public" />
      <main id="main">
        <section
          className="relative overflow-hidden border-b border-line bg-[linear-gradient(rgb(20_120_110_/_4%)_1px,transparent_1px),linear-gradient(90deg,rgb(20_120_110_/_4%)_1px,transparent_1px),var(--color-mist)] bg-size-[32px_32px] py-16.5 pb-18.5 before:absolute before:top-[-110px] before:left-[max(-170px,calc((100vw-1120px)/2-240px))] before:size-130 before:rounded-full before:border before:border-jade/13 max-md:py-12"
          id="provenance"
        >
          <div className="relative mx-auto grid w-[calc(100%_-_40px)] max-w-280 grid-cols-[minmax(350px,.72fr)_minmax(660px,1.28fr)] items-center gap-13 max-sm:w-[calc(100%_-_28px)] max-xl:grid-cols-1">
            <div>
              <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                How the evidence travels
              </p>
              <h1 className="mt-3 max-w-135 font-display text-[clamp(48px,5.2vw,69px)] leading-[.98] font-bold tracking-[-.042em]">
                Every insight keeps a trail back to its{" "}
                <em className="font-inherit text-jade not-italic underline decoration-amber decoration-5 underline-offset-7">
                  source.
                </em>
              </h1>
              <p className="mt-5 max-w-130 text-sm leading-[1.68] text-ink-soft">
                b4join preserves what each source can support, names every transformation, and turns recurring terms
                and missing facts into questions—not conclusions.
              </p>
              <div className="mt-6.25 flex flex-wrap gap-2.25">
                <Button asChild size="lg">
                  <a href="#question-paths">
                    Follow the full method <ArrowDown aria-hidden="true" className="size-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#boundaries">Read the safeguards</a>
                </Button>
              </div>
              <p className="mt-4.75 flex items-start gap-2 text-[11px] leading-[1.5] font-bold text-muted">
                <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-jade-soft text-[8px] font-black text-jade-dark">
                  ✓
                </span>
                Reported, submitted, derived, and destination evidence never collapse into one score.
              </p>
            </div>

            <MethodProvenance />
          </div>
        </section>

        <section className="border-b border-line bg-white" aria-label="Dataset release receipt">
          <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-280 grid-cols-[1.35fr_repeat(3,1fr)] max-sm:w-[calc(100%_-_28px)] max-md:grid-cols-2">
            <div className="grid min-h-22.75 content-center gap-1.25 border-r border-line py-4.25 pr-5.75 max-md:border-b">
              <small className="font-mono text-[8px] font-extrabold tracking-[.05em] text-jade-dark uppercase">
                Published evidence receipt
              </small>
              <strong className="font-display text-[21px] leading-[1.15]">Dataset release v1.3.0</strong>
              <p className="text-[9px] leading-3.5 text-muted">
                {stats.stories.toLocaleString()} stories across {stats.companies.toLocaleString()} companies.
              </p>
            </div>
            {[
              [stats.snapshotDate, "Main story snapshot"],
              ["Schema · joins · hashes", "Integrity checks"],
              ["Claims not fact-checked", "Truth boundary"]
            ].map(([value, label]) => (
              <div
                className="grid min-h-22.75 content-center gap-1.25 border-r border-line px-5.75 py-4.25 last:border-r-0 max-md:border-b max-md:odd:border-r-0"
                key={label}
              >
                <strong className="font-display text-lg leading-[1.15]">{value}</strong>
                <small className="text-[10px] text-muted">{label}</small>
              </div>
            ))}
          </div>
        </section>

        <section
          className="border-b border-line py-18.5"
          id="question-paths"
          aria-labelledby="question-path-title"
        >
          <div className="mx-auto w-[calc(100%_-_40px)] max-w-280 max-sm:w-[calc(100%_-_28px)]">
            <header className="mb-7.75 grid grid-cols-[minmax(0,.9fr)_minmax(380px,1.1fr)] items-end gap-13 max-md:grid-cols-1 max-md:gap-4">
              <div>
                <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                  Two paths, kept distinct
                </p>
                <h2
                  className="mt-2.25 max-w-152.5 font-display text-[clamp(35px,4.2vw,50px)] leading-[1.02] font-bold tracking-[-.035em]"
                  id="question-path-title"
                >
                  Prepared questions are not the same as AI answers.
                </h2>
              </div>
              <p className="max-w-140 justify-self-end text-[13px] leading-[1.68] text-ink-soft max-md:justify-self-start">
                The checkpoint engine is rules-based. Ask is optional and uses a bounded set of company story
                excerpts. Keeping the paths separate makes the limitation of each one visible.
              </p>
            </header>

            <div className="grid grid-cols-2 gap-4.5 max-md:grid-cols-1">
              {questionPaths.map((path) => {
                const ask = path.tone === "amber";
                return (
                  <article
                    className={`overflow-hidden rounded-[13px] border border-line-strong bg-white shadow-[0_14px_40px_rgb(22_56_61_/_6%)] before:block before:h-1.25 ${
                      ask ? "before:bg-amber" : "before:bg-blue"
                    }`}
                    key={path.id}
                  >
                    <header className="grid grid-cols-[37px_1fr_auto] items-center gap-3 border-b border-line px-5.25 py-4.75 max-sm:grid-cols-[37px_1fr]">
                      <span
                        className={`grid size-9.25 place-items-center rounded-full font-mono text-[9px] font-black ${
                          ask ? "bg-amber-soft text-amber-dark" : "bg-blue-soft text-blue"
                        }`}
                      >
                        {path.id}
                      </span>
                      <div>
                        <small className="font-mono text-[7px] font-extrabold text-muted uppercase">{path.eyebrow}</small>
                        <h3 className="mt-1.25 font-display text-[22px] leading-tight font-bold">{path.title}</h3>
                      </div>
                      <em className="rounded-[5px] bg-jade-soft px-1.75 py-1.25 font-mono text-[7px] font-extrabold text-jade-dark not-italic uppercase max-sm:col-start-2 max-sm:w-max">
                        {path.flag}
                      </em>
                    </header>
                    <ol className="m-0 grid list-none px-5.25 py-1.25">
                      {path.steps.map(([label, title, copy]) => (
                        <li
                          className="grid min-h-20.75 grid-cols-[75px_1fr] content-center gap-x-3 gap-y-1.25 border-b border-line py-3.5 last:border-0"
                          key={label}
                        >
                          <span
                            className={`row-span-2 pt-0.5 font-mono text-[8px] font-extrabold uppercase ${
                              ask ? "text-amber-dark" : "text-blue"
                            }`}
                          >
                            {label}
                          </span>
                          <strong className="text-xs leading-[1.35]">{title}</strong>
                          <p className="text-[10px] leading-[1.5] text-muted">{copy}</p>
                        </li>
                      ))}
                    </ol>
                    <footer className="min-h-14.25 border-t border-line bg-[#fbfdfc] px-5.25 py-3.25 text-[9px] leading-[1.45] text-muted">
                      {path.footer}
                    </footer>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-ink py-18.5 text-white" id="boundaries" aria-labelledby="method-boundary-title">
          <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-280 grid-cols-[minmax(290px,.75fr)_minmax(570px,1.25fr)] items-start gap-14.5 max-sm:w-[calc(100%_-_28px)] max-lg:grid-cols-1">
            <div>
              <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade-soft uppercase">
                The language boundary
              </p>
              <h2
                className="mt-2.5 max-w-120 font-display text-[clamp(35px,4.2vw,50px)] leading-[1.02] font-bold tracking-[-.035em]"
                id="method-boundary-title"
              >
                Careful wording is part of the method.
              </h2>
              <p className="mt-4.25 max-w-125 text-[13px] leading-[1.68] text-white/68">
                Personal accounts can show what deserves investigation. They cannot establish policy, intent, or one
                final judgment about everyone’s experience.
              </p>
            </div>
            <div className="grid grid-cols-2 overflow-hidden rounded-[13px] border border-white/16 bg-white/4 max-sm:grid-cols-1">
              {[
                [
                  "b4join can say",
                  [
                    "Several dated reports mention a related concern.",
                    "A submitted role range provides unverified negotiation context.",
                    "Explicit work-mode language appears in named source excerpts."
                  ],
                  "jade"
                ],
                [
                  "b4join will not say",
                  [
                    "The company has good or bad culture.",
                    "A submitted amount is an HR-approved salary band.",
                    "Missing work-mode evidence means the role is onsite."
                  ],
                  "coral"
                ]
              ].map(([heading, items, tone]) => {
                const positive = tone === "jade";
                return (
                  <section
                    className="min-h-65 border-r border-white/14 p-5.5 last:border-r-0 max-sm:min-h-0 max-sm:border-r-0 max-sm:border-b max-sm:border-white/14"
                    key={heading as string}
                  >
                    <header className="flex items-center gap-2.5">
                      <span
                        className={`grid size-7.75 place-items-center rounded-full text-white ${
                          positive ? "bg-jade" : "bg-coral"
                        }`}
                      >
                        {positive ? <Check aria-hidden="true" className="size-4" /> : <X aria-hidden="true" className="size-4" />}
                      </span>
                      <h3 className="font-display text-[21px] font-bold">{heading as string}</h3>
                    </header>
                    <ul className="mt-5 grid list-none gap-3.75 p-0">
                      {(items as readonly string[]).map((item) => (
                        <li
                          className="grid grid-cols-[7px_1fr] gap-2.5 text-[11px] leading-[1.55] text-white/78"
                          key={item}
                        >
                          <span
                            className={`mt-1.75 size-1.75 rounded-full ${positive ? "bg-jade" : "bg-coral"}`}
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
              <footer className="col-span-full border-t border-white/14 px-6 py-3.25 text-[9px] leading-[1.5] text-white/58 max-sm:col-span-1">
                Unknown is not positive or negative. Conflicting reports remain conflicting. Missing evidence stays
                visible as a gap.
              </footer>
            </div>
          </div>
        </section>

        <section className="border-b border-line py-18.5" aria-labelledby="method-revision-title">
          <div className="mx-auto w-[calc(100%_-_40px)] max-w-280 max-sm:w-[calc(100%_-_28px)]">
            <header className="mb-7.75 grid grid-cols-[minmax(0,.9fr)_minmax(380px,1.1fr)] items-end gap-13 max-md:grid-cols-1 max-md:gap-4">
              <div>
                <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                  Change without rewriting history
                </p>
                <h2
                  className="mt-2.25 max-w-152.5 font-display text-[clamp(35px,4.2vw,50px)] leading-[1.02] font-bold tracking-[-.035em]"
                  id="method-revision-title"
                >
                  A later release does not silently rewrite saved context.
                </h2>
              </div>
              <p className="max-w-140 justify-self-end text-[13px] leading-[1.68] text-ink-soft max-md:justify-self-start">
                Evidence is published in versioned releases. Corrections and new source material require an owner-run
                review and update before they can appear in a later release.
              </p>
            </header>

            <div className="overflow-hidden rounded-[13px] border border-line-strong bg-white shadow-[0_14px_40px_rgb(22_56_61_/_6%)]">
              <ol className="relative m-0 grid list-none grid-cols-4 px-5.75 pt-6.5 pb-6 before:absolute before:top-11.25 before:right-[12%] before:left-[12%] before:h-0.5 before:bg-line max-md:grid-cols-1 max-md:before:top-[8%] max-md:before:bottom-[8%] max-md:before:left-[42px] max-md:h-auto max-md:before:w-0.5">
                {revisionSteps.map(([label, title, copy, status], index) => (
                  <li
                    className="relative z-1 min-w-0 px-3.5 max-md:grid max-md:grid-cols-[48px_1fr] max-md:gap-x-3 max-md:py-3"
                    key={label}
                  >
                    <span
                      className={`mx-auto mb-4.25 grid size-9.75 place-items-center rounded-full border-2 bg-white font-mono text-[9px] font-black ring-5 max-md:row-span-4 max-md:m-0 ${
                        index === 1
                          ? "border-amber text-amber-dark ring-amber-soft"
                          : index === 2
                            ? "border-blue text-blue ring-blue-soft"
                            : "border-jade text-jade-dark ring-jade-soft"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <small className="mb-2 block text-center font-mono text-[8px] font-extrabold tracking-[.04em] text-quiet uppercase max-md:text-left">
                      {label}
                    </small>
                    <strong className="block min-h-9.5 text-center text-[11px] leading-[1.4] max-md:min-h-0 max-md:text-left">
                      {title}
                    </strong>
                    <p className="mt-1.75 text-center text-[9px] leading-[1.48] text-muted max-md:text-left">{copy}</p>
                    <em className="mx-auto mt-2.75 block w-max rounded-[5px] bg-jade-soft px-1.75 py-1.25 font-mono text-[7px] font-extrabold text-jade-dark not-italic uppercase max-md:mx-0">
                      {status}
                    </em>
                  </li>
                ))}
              </ol>
              <aside className="grid grid-cols-[28px_1fr] gap-3 border-t border-line bg-jade-soft px-6 py-4">
                <span className="font-display text-xl text-jade-dark">↳</span>
                <div>
                  <small className="font-mono text-[8px] font-extrabold tracking-[.04em] text-jade-dark uppercase">
                    Private checkpoint
                  </small>
                  <strong className="mt-1 block text-[11px]">
                    Stores its snapshot version and appends revisions on successful saves.
                  </strong>
                  <p className="mt-1 text-[9px] leading-[1.48] text-muted">
                    It does not silently merge a conflicting edit.
                  </p>
                </div>
              </aside>
              <footer className="flex flex-wrap gap-5 border-t border-line px-6 py-3.5">
                <Link className="text-[10px] font-extrabold text-jade-dark underline-offset-3 hover:underline" href="/support">
                  Prepare a source-backed correction →
                </Link>
                <Link
                  className="text-[10px] font-extrabold text-jade-dark underline-offset-3 hover:underline"
                  href="/#research"
                >
                  Open a company source list →
                </Link>
              </footer>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto flex w-[calc(100%_-_40px)] max-w-280 items-end justify-between gap-8 max-sm:w-[calc(100%_-_28px)] max-md:flex-col max-md:items-start">
            <div>
              <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                Use the method
              </p>
              <h2 className="mt-2.25 font-display text-[clamp(34px,4vw,48px)] leading-[1.05] font-bold tracking-[-.035em]">
                Put a company through the evidence trail.
              </h2>
              <p className="mt-3 max-w-170 text-[13px] leading-[1.6] text-ink-soft">
                Build one brief, compare two companies on the same unknowns, or carry the research into Deshi Mula
                with the extension.
              </p>
            </div>
            <nav aria-label="Method next steps" className="flex shrink-0 flex-wrap items-center gap-2.5">
              <Button asChild>
                <Link href="/#research">
                  Check a company <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/compare">Compare companies</Link>
              </Button>
              <Link className="px-2 text-xs font-extrabold text-jade-dark hover:underline" href="/extension">
                Use the extension →
              </Link>
            </nav>
          </div>
        </section>
      </main>
    </>
  );
}
