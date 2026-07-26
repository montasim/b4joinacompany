"use client";

import Link from "next/link";
import {
  ArrowRight,
  GitCompareArrows,
  RotateCcw,
  Search,
} from "lucide-react";

import { Brand } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ErrorPageKind = "not-found" | "company-not-found" | "server-error";

type StatusRow = {
  label: string;
  title: string;
  copy: string;
  state: string;
  markerClass: string;
  stateClass: string;
};

const pageContent: Record<
  ErrorPageKind,
  {
    code: string;
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    cardEyebrow: string;
    cardTitle: string;
    badge: string;
    badgeTone: "amber" | "coral";
    supportLabel: string;
    rows: StatusRow[];
    footer: string;
  }
> = {
  "not-found": {
    code: "404",
    eyebrow: "Route not found",
    title: "This link does not lead to a",
    accent: "b4join page.",
    description:
      "The address may be outdated or incomplete. Start with a company search, or compare two confirmed companies.",
    cardEyebrow: "Available research paths",
    cardTitle: "Continue from a confirmed destination.",
    badge: "Route missing",
    badgeTone: "amber",
    supportLabel: "Report a broken link",
    rows: [
      {
        label: "Requested destination",
        title: "No published route matched this address.",
        copy: "Nothing on this screen is presented as company evidence.",
        state: "Not found",
        markerClass: "bg-coral",
        stateClass: "bg-coral-soft text-coral",
      },
      {
        label: "Company research",
        title: "Search by company name, website, or LinkedIn.",
        copy: "The public research index remains available.",
        state: "Available",
        markerClass: "bg-jade",
        stateClass: "bg-jade-soft text-jade-dark",
      },
      {
        label: "Company comparison",
        title: "Choose two confirmed companies.",
        copy: "Missing evidence will remain visible in the comparison.",
        state: "Available",
        markerClass: "bg-blue",
        stateClass: "bg-blue-soft text-blue",
      },
    ],
    footer:
      "Nothing on this screen changes published evidence or private saved research.",
  },
  "company-not-found": {
    code: "404",
    eyebrow: "Company not found",
    title: "That company is not in this",
    accent: "published release.",
    description:
      "The company link may be outdated, incomplete, or use a different name. Search by name, alias, website, or LinkedIn address.",
    cardEyebrow: "Company resolution",
    cardTitle: "Start again with an explicit match.",
    badge: "No match",
    badgeTone: "amber",
    supportLabel: "Report a missing company",
    rows: [
      {
        label: "Company address",
        title: "No company record matched this route.",
        copy: "b4join will not attach evidence to an uncertain identity.",
        state: "Unresolved",
        markerClass: "bg-coral",
        stateClass: "bg-coral-soft text-coral",
      },
      {
        label: "Company search",
        title: "Names, aliases, websites, and LinkedIn are searchable.",
        copy: "Choose the exact company before opening a brief.",
        state: "Available",
        markerClass: "bg-jade",
        stateClass: "bg-jade-soft text-jade-dark",
      },
      {
        label: "Correction path",
        title: "A missing destination can be reported with a source.",
        copy: "Published data changes only in a later dataset release.",
        state: "Manual review",
        markerClass: "bg-amber",
        stateClass: "bg-amber-soft text-amber-dark",
      },
    ],
    footer:
      "An unresolved company is kept separate instead of being guessed from a similar name.",
  },
  "server-error": {
    code: "500",
    eyebrow: "Request interrupted",
    title: "This research page could not",
    accent: "finish loading.",
    description:
      "The request stopped before a result was shown. Try the page again; if it repeats, return to research or report the problem.",
    cardEyebrow: "Request status",
    cardTitle: "The next useful step stays clear.",
    badge: "Interrupted",
    badgeTone: "coral",
    supportLabel: "Report this problem",
    rows: [
      {
        label: "Requested view",
        title: "The page did not finish rendering.",
        copy: "No incomplete result is being presented as evidence.",
        state: "Interrupted",
        markerClass: "bg-coral",
        stateClass: "bg-coral-soft text-coral",
      },
      {
        label: "Public research",
        title: "Stable research routes remain available.",
        copy: "Return to the company index if retrying does not work.",
        state: "Available",
        markerClass: "bg-jade",
        stateClass: "bg-jade-soft text-jade-dark",
      },
      {
        label: "Repeated problem",
        title: "Send the page address through Support.",
        copy: "Do not include passwords, credentials, or private notes.",
        state: "Report",
        markerClass: "bg-amber",
        stateClass: "bg-amber-soft text-amber-dark",
      },
    ],
    footer:
      "If you were saving private research, check your workspace before repeating the action.",
  },
};

function ErrorHeader() {
  return (
    <>
      <a
        className="fixed top-2 left-2 z-100 -translate-y-[160%] rounded-lg bg-ink px-3 py-2 text-xs font-bold text-white no-underline transition-transform focus:translate-y-0"
        href="#main"
      >
        Skip to content
      </a>
      <header className="border-b border-line bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 w-[calc(100%_-_40px)] max-w-280 items-center justify-between gap-6 max-sm:w-[calc(100%_-_28px)]">
          <Brand />
          <nav className="flex items-center gap-1" aria-label="Recovery navigation">
            <Link
              className="rounded-lg px-3 py-2.25 text-xs font-bold text-muted no-underline hover:bg-jade-soft hover:text-jade-dark"
              href="/"
            >
              Research
            </Link>
            <Link
              className="rounded-lg px-3 py-2.25 text-xs font-bold text-muted no-underline hover:bg-jade-soft hover:text-jade-dark max-sm:hidden"
              href="/method"
            >
              Method
            </Link>
            <Link
              className="rounded-lg px-3 py-2.25 text-xs font-bold text-muted no-underline hover:bg-jade-soft hover:text-jade-dark"
              href="/support"
            >
              Support
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}

function StandaloneFooter() {
  return (
    <footer className="border-t border-line bg-white py-7">
      <div className="mx-auto flex w-[calc(100%_-_40px)] max-w-280 items-center justify-between gap-6 text-[10px] text-muted max-sm:w-[calc(100%_-_28px)] max-sm:flex-col max-sm:items-start">
        <p>Company research for better questions—not automatic verdicts.</p>
        <Link
          className="font-bold text-jade-dark underline decoration-jade/30 underline-offset-3"
          href="/support"
        >
          Support &amp; corrections
        </Link>
      </div>
    </footer>
  );
}

export function ErrorPage({
  kind,
  onRetry,
  standalone = false,
}: {
  kind: ErrorPageKind;
  onRetry?: () => void;
  standalone?: boolean;
}) {
  const content = pageContent[kind];
  const isServerError = kind === "server-error";
  const companyNotFound = kind === "company-not-found";

  return (
    <>
      <ErrorHeader />
      <main
        className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[linear-gradient(rgb(20_120_110_/_4%)_1px,transparent_1px),linear-gradient(90deg,rgb(20_120_110_/_4%)_1px,transparent_1px)] bg-size-[32px_32px]"
        id="main"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-10 left-[max(-190px,calc((100vw-1120px)/2-290px))] size-130 rounded-full border border-jade/15 max-sm:hidden"
        />
        <div className="relative mx-auto grid w-[calc(100%_-_40px)] max-w-280 grid-cols-[minmax(340px,.86fr)_minmax(500px,1.14fr)] items-center gap-16 py-15 pb-18 max-lg:grid-cols-1 max-lg:gap-10 max-sm:w-[calc(100%_-_28px)] max-sm:py-9 max-sm:pb-13">
          <section
            aria-live={isServerError ? "polite" : undefined}
            className="max-w-145"
            role={isServerError ? "alert" : undefined}
          >
            <p className="font-mono text-[10px] leading-tight font-extrabold tracking-[.09em] text-jade uppercase">
              {content.code} · {content.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-[clamp(46px,5.4vw,66px)] leading-[.98] font-bold tracking-[-.04em] text-ink">
              {content.title}{" "}
              <em className="text-jade not-italic underline decoration-amber decoration-[6px] underline-offset-5 max-sm:decoration-4">
                {content.accent}
              </em>
            </h1>
            <p className="mt-5 max-w-132 text-[15px] leading-[1.7] text-ink-soft">
              {content.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5 max-sm:grid">
              {isServerError ? (
                <Button
                  className="justify-between"
                  onClick={onRetry}
                  size="lg"
                  type="button"
                >
                  Try again
                  <RotateCcw aria-hidden="true" className="size-4" />
                </Button>
              ) : (
                <Button asChild className="justify-between" size="lg">
                  <Link href="/">
                    {companyNotFound ? "Change company search" : "Search a company"}
                    <Search aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
              )}
              <Button asChild className="justify-between" size="lg" variant="outline">
                <Link href={isServerError ? "/" : "/compare"}>
                  {isServerError ? "Return to research" : "Compare companies"}
                  {isServerError ? (
                    <ArrowRight aria-hidden="true" className="size-4" />
                  ) : (
                    <GitCompareArrows aria-hidden="true" className="size-4" />
                  )}
                </Link>
              </Button>
            </div>

            <Link
              className="mt-5 inline-flex items-center gap-1 text-[11px] font-extrabold text-jade-dark underline decoration-jade/30 underline-offset-3"
              href="/support"
            >
              {content.supportLabel} <span aria-hidden="true">→</span>
            </Link>
          </section>

          <aside
            aria-labelledby={`${kind}-recovery-title`}
            className="relative overflow-hidden rounded-[13px] border border-line-strong bg-white shadow-panel before:absolute before:inset-y-0 before:left-0 before:z-2 before:w-1.25 before:bg-[linear-gradient(to_bottom,#356c82_0_24%,transparent_24%_31%,#e9b44c_31%_53%,#14786e_53%_78%,#c95d63_78%)]"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 max-sm:px-5">
              <div>
                <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
                  {content.cardEyebrow}
                </p>
                <h2
                  className="mt-2 max-w-105 font-display text-[26px] leading-[1.1] font-bold tracking-[-.025em]"
                  id={`${kind}-recovery-title`}
                >
                  {content.cardTitle}
                </h2>
              </div>
              <Badge tone={content.badgeTone}>{content.badge}</Badge>
            </header>

            <ol className="m-0 grid list-none px-6 max-sm:px-5">
              {content.rows.map((row) => (
                <li
                  className="grid grid-cols-[12px_minmax(0,1fr)_auto] items-start gap-4 border-b border-line py-4.5 last:border-b-0 max-sm:grid-cols-[12px_minmax(0,1fr)]"
                  key={row.label}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 size-2.5 rounded-full ring-4 ring-mist ${row.markerClass}`}
                  />
                  <div>
                    <small className="font-mono text-[8px] font-extrabold tracking-[.07em] text-muted uppercase">
                      {row.label}
                    </small>
                    <strong className="mt-1.5 block text-[12px] leading-[1.45]">
                      {row.title}
                    </strong>
                    <p className="mt-1 text-[9px] leading-[1.5] text-muted">
                      {row.copy}
                    </p>
                  </div>
                  <span
                    className={`mt-1 w-max rounded-[5px] px-2 py-1.5 font-mono text-[7px] font-extrabold uppercase max-sm:col-start-2 ${row.stateClass}`}
                  >
                    {row.state}
                  </span>
                </li>
              ))}
            </ol>

            <footer className="border-t border-line bg-[#fbfdfc] px-6 py-3.5 text-[9px] leading-[1.55] text-muted max-sm:px-5">
              {content.footer}
            </footer>
          </aside>
        </div>
      </main>
      {standalone && <StandaloneFooter />}
    </>
  );
}
