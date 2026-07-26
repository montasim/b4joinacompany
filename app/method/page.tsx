import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleAlert,
  FileText,
  Link2,
  MessageSquareText,
  ShieldCheck,
  X
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { datasetStats } from "@/lib/research";

export const metadata: Metadata = {
  title: "How the evidence works",
  description:
    "See how b4join keeps workplace reports, recurring signals, citations, and evidence gaps connected."
};

const methodSteps = [
  {
    number: "01",
    eyebrow: "Keep the lanes separate",
    title: "A report stays a report.",
    copy: "Stories and comments remain attributed personal experiences. Official websites, LinkedIn pages, careers destinations, and salary sources are checked separately; they do not turn a workplace claim into company policy.",
    details: ["Stories + comments", "Official destinations"]
  },
  {
    number: "02",
    eyebrow: "Look for useful recurrence",
    title: "Signals rise when related terms repeat.",
    copy: "A rules-based engine scans eight candidate concerns. More matching terms and sources move a signal higher; a one-source match remains visible as an evidence gap.",
    details: ["Across roles and dates", "One-source gaps marked"]
  },
  {
    number: "03",
    eyebrow: "Turn uncertainty into action",
    title: "The output is a question, not a score.",
    copy: "Each checkpoint includes practical guidance, a plain-language rationale, and up to three source citations so the candidate can verify the current reality for their exact role.",
    details: ["Question + guidance", "Rationale + citations"]
  }
] as const;

const signalTopics = [
  "Management",
  "Pay",
  "Stability",
  "Growth",
  "Workload",
  "Culture",
  "Work setup",
  "Hiring"
] as const;

const canSay = [
  "Several dated reports mention management or feedback.",
  "This pattern is worth asking about for your role.",
  "Only one local source matched, so direct confirmation matters."
] as const;

const willNotSay = [
  "The company has good or bad management.",
  "A reported practice is an official company policy.",
  "No matching reports means the issue does not exist."
] as const;

export default async function MethodPage() {
  const stats = await datasetStats();

  return (
    <>
      <SiteHeader active="Research" mode="public" />
      <main>
        <section className="relative overflow-hidden border-b border-line bg-mist py-14 sm:py-18 lg:py-22">
          <div
            className="pointer-events-none absolute top-[-8rem] right-[max(-5rem,calc(50%_-_42rem))] size-105 rounded-full border border-jade/15"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid w-[calc(100%_-_40px)] max-w-290 items-center gap-11 max-sm:w-[calc(100%_-_28px)] lg:grid-cols-[.82fr_1.18fr] lg:gap-14">
            <div className="max-w-145">
              <p className="mb-4 font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                Evidence you can inspect
              </p>
              <h1 className="font-display text-[clamp(3rem,5.8vw,5rem)] leading-[.96] font-bold tracking-[-.045em] text-ink">
                Every question keeps its{" "}
                <span className="relative inline-block text-jade after:absolute after:right-0 after:-bottom-1 after:left-0 after:h-1 after:rotate-[-1deg] after:bg-amber">
                  evidence trail.
                </span>
              </h1>
              <p className="mt-6 max-w-140 text-[15px] leading-7 text-ink-soft">
                b4join organizes personal workplace reports into things a candidate can verify. It keeps the
                original sources, dates, disagreements, and missing evidence visible instead of deciding whether a
                company is good or bad.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/#research">
                    Check a company <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#boundaries">Read the safeguards</a>
                </Button>
              </div>
              <p className="mt-5 flex items-center gap-2 text-[11px] font-bold text-muted">
                <ShieldCheck aria-hidden="true" className="size-4 text-jade" />
                No rankings · No verdicts · No hidden sources
              </p>
            </div>

            <article
              className="overflow-hidden rounded-2xl border border-line-strong bg-white shadow-panel"
              aria-labelledby="trace-title"
            >
              <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
                <div>
                  <p className="mb-1 font-mono text-[10px] font-extrabold tracking-[.08em] text-jade uppercase">
                    Illustrative evidence trace
                  </p>
                  <h2 id="trace-title" className="font-display text-xl font-bold tracking-[-.02em] text-ink">
                    One question, with its lineage intact
                  </h2>
                </div>
                <Badge>Inspectable</Badge>
              </header>

              <div className="grid items-stretch gap-3 p-5 max-md:grid-cols-1 sm:p-6 md:grid-cols-[minmax(0,.95fr)_22px_minmax(0,.72fr)_22px_minmax(0,1.08fr)]">
                <section className="rounded-xl border border-line bg-mist p-3.5" aria-label="Illustrative source inputs">
                  <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-muted uppercase">
                    Source inputs
                  </p>
                  <div className="mt-3 grid gap-2">
                    <div className="rounded-lg border border-line bg-white p-3">
                      <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-coral uppercase">
                        <FileText aria-hidden="true" className="size-3.5" /> S1 · Story
                      </span>
                      <p className="mt-2 text-[11px] leading-5 text-ink-soft">
                        A dated report describes unclear performance feedback.
                      </p>
                    </div>
                    <div className="rounded-lg border border-line bg-white p-3">
                      <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-blue uppercase">
                        <MessageSquareText aria-hidden="true" className="size-3.5" /> C1 · Comment
                      </span>
                      <p className="mt-2 text-[11px] leading-5 text-ink-soft">
                        A related comment asks who owns review decisions.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="grid place-items-center text-jade max-md:rotate-90" aria-hidden="true">
                  <ArrowRight className="size-5" />
                </div>

                <section className="grid content-center rounded-xl border border-jade/25 bg-jade-soft p-3.5 text-center">
                  <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
                    Related signal
                  </p>
                  <strong className="mt-3 font-display text-lg leading-tight text-ink">
                    Management and feedback
                  </strong>
                  <p className="mt-2 text-[10px] leading-4.5 text-ink-soft">
                    Related terms appear in more than one source.
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {["manager", "feedback", "review"].map((term) => (
                      <span
                        className="rounded bg-white/80 px-2 py-1 font-mono text-[8px] font-bold text-jade-dark"
                        key={term}
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </section>

                <div className="grid place-items-center text-jade max-md:rotate-90" aria-hidden="true">
                  <ArrowRight className="size-5" />
                </div>

                <section className="grid content-center rounded-xl border border-amber bg-amber-soft p-4">
                  <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-amber-dark uppercase">
                    Candidate action
                  </p>
                  <h3 className="mt-3 font-display text-xl leading-[1.18] font-bold tracking-[-.02em] text-ink">
                    “How are performance decisions documented?”
                  </h3>
                  <p className="mt-2 text-[10px] leading-4.5 text-ink-soft">
                    Ask for the process, decision owner, and written terms.
                  </p>
                </section>
              </div>

              <footer className="grid gap-3 border-t border-line bg-mist px-5 py-4 text-[10px] sm:grid-cols-2 sm:px-6">
                <span className="flex items-center gap-2 text-ink-soft">
                  <Link2 aria-hidden="true" className="size-4 shrink-0 text-jade" />
                  Citations remain attached: S1 · C1
                </span>
                <span className="flex items-center gap-2 text-ink-soft">
                  <CircleAlert aria-hidden="true" className="size-4 shrink-0 text-amber-dark" />
                  Gaps stay explicit when evidence is thin
                </span>
              </footer>
            </article>
          </div>
        </section>

        <section className="border-b border-line bg-white" aria-label="Current evidence snapshot">
          <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-290 divide-y divide-line max-sm:w-[calc(100%_-_28px)] sm:grid-cols-[1.25fr_repeat(3,1fr)] sm:divide-x sm:divide-y-0">
            <div className="grid content-center gap-1 py-5 sm:pr-6">
              <strong className="font-mono text-[10px] font-extrabold tracking-[.09em] text-jade uppercase">
                Published evidence receipt
              </strong>
              <span className="text-[11px] text-muted">Snapshot {stats.snapshotDate} · validated before publication</span>
            </div>
            <div className="grid gap-0.5 py-5 sm:px-6">
              <strong className="font-display text-2xl">{stats.stories.toLocaleString()}</strong>
              <small className="text-[10px] text-muted">workplace stories</small>
            </div>
            <div className="grid gap-0.5 py-5 sm:px-6">
              <strong className="font-display text-2xl">{stats.comments.toLocaleString()}</strong>
              <small className="text-[10px] text-muted">related comments</small>
            </div>
            <div className="grid gap-0.5 py-5 sm:pl-6">
              <strong className="font-display text-2xl">{stats.companies.toLocaleString()}</strong>
              <small className="text-[10px] text-muted">company records</small>
            </div>
          </div>
        </section>

        <section className="border-b border-line py-16 sm:py-20" aria-labelledby="method-steps">
          <div className="mx-auto w-[calc(100%_-_40px)] max-w-290 max-sm:w-[calc(100%_-_28px)]">
            <div className="grid items-end gap-6 lg:grid-cols-[.88fr_1.12fr]">
              <div>
                <p className="mb-3 font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                  The method, in order
                </p>
                <h2
                  id="method-steps"
                  className="max-w-150 font-display text-[clamp(2.35rem,4.3vw,3.6rem)] leading-[1.01] font-bold tracking-[-.038em] text-ink"
                >
                  The source changes. The boundary does not.
                </h2>
              </div>
              <p className="max-w-150 justify-self-end text-[14px] leading-7 text-ink-soft lg:pb-1">
                The sequence exists to preserve meaning: first identify what kind of source is speaking, then find
                related candidate concerns, then produce something the company can answer directly.
              </p>
            </div>

            <ol className="mt-9 grid list-none divide-y divide-line border-y border-line p-0 md:grid-cols-3 md:divide-x md:divide-y-0">
              {methodSteps.map((step) => (
                <li className="relative grid content-start gap-3 py-7 md:px-7 md:first:pl-0 md:last:pr-0" key={step.number}>
                  <div className="flex items-center justify-between gap-4">
                    <strong className="font-display text-4xl text-jade/35">{step.number}</strong>
                    <span className="font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
                      {step.eyebrow}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl leading-tight font-bold tracking-[-.025em] text-ink">
                    {step.title}
                  </h3>
                  <p className="text-[12px] leading-6 text-ink-soft">{step.copy}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {step.details.map((detail) => (
                      <span
                        className="rounded-md bg-jade-soft px-2 py-1.5 text-[9px] font-bold text-jade-dark"
                        key={detail}
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono text-[9px] font-extrabold tracking-[.08em] text-muted uppercase">
                Candidate concerns scanned
              </span>
              {signalTopics.map((topic) => (
                <span
                  className="rounded-full border border-line bg-white px-3 py-1.5 text-[10px] font-bold text-ink-soft"
                  key={topic}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink py-16 text-white sm:py-20" id="boundaries" aria-labelledby="boundary-title">
          <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-290 gap-10 max-sm:w-[calc(100%_-_28px)] lg:grid-cols-[.78fr_1.22fr] lg:gap-15">
            <div className="max-w-130">
              <p className="mb-3 font-mono text-[10px] font-extrabold tracking-[.1em] text-jade-soft uppercase">
                The language boundary
              </p>
              <h2
                id="boundary-title"
                className="font-display text-[clamp(2.35rem,4.3vw,3.6rem)] leading-[1.01] font-bold tracking-[-.038em]"
              >
                Careful wording is part of the method.
              </h2>
              <p className="mt-5 text-[14px] leading-7 text-white/70">
                Personal accounts can reveal what to investigate. They cannot establish policy, intent, or a final
                judgment about everyone’s experience.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/5">
              <div className="grid sm:grid-cols-2">
                <section className="border-b border-white/15 p-5 sm:border-r sm:border-b-0 sm:p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-full bg-jade text-white">
                      <Check aria-hidden="true" className="size-4" />
                    </span>
                    <h3 className="font-display text-xl font-bold">b4join can say</h3>
                  </div>
                  <ul className="m-0 grid list-none gap-4 p-0">
                    {canSay.map((item) => (
                      <li className="grid grid-cols-[8px_1fr] gap-3 text-[12px] leading-5.5 text-white/80" key={item}>
                        <span className="mt-2 size-2 rounded-full bg-jade" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-full bg-coral text-white">
                      <X aria-hidden="true" className="size-4" />
                    </span>
                    <h3 className="font-display text-xl font-bold">b4join will not say</h3>
                  </div>
                  <ul className="m-0 grid list-none gap-4 p-0">
                    {willNotSay.map((item) => (
                      <li className="grid grid-cols-[8px_1fr] gap-3 text-[12px] leading-5.5 text-white/80" key={item}>
                        <span className="mt-2 size-2 rounded-full bg-coral" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
              <footer className="border-t border-white/15 px-5 py-4 text-[10px] leading-5 text-white/60 sm:px-6">
                Unknown is not positive or negative. Conflicting reports remain conflicting. Missing evidence stays
                visible as a gap.
              </footer>
            </div>
          </div>
        </section>

        <section className="border-b border-line py-16 sm:py-20" aria-labelledby="question-anatomy">
          <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-290 items-start gap-10 max-sm:w-[calc(100%_-_28px)] lg:grid-cols-[.82fr_1.18fr] lg:gap-15">
            <div className="max-w-135">
              <p className="mb-3 font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                What follows every signal
              </p>
              <h2
                id="question-anatomy"
                className="font-display text-[clamp(2.35rem,4.3vw,3.6rem)] leading-[1.01] font-bold tracking-[-.038em] text-ink"
              >
                A useful output carries its own limits.
              </h2>
              <p className="mt-5 text-[14px] leading-7 text-ink-soft">
                The question is only the visible tip. The checkpoint also explains why it surfaced, what source
                material supports it, and where the evidence remains too thin.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  ["Snapshot date", "Shows when the published evidence was last assembled."],
                  ["Original source links", "Let you read the story or official destination in context."],
                  ["Correction route", "Lets incorrect identity or destination data enter a review queue."]
                ].map(([title, copy]) => (
                  <div className="grid grid-cols-[10px_1fr] gap-3" key={title}>
                    <span className="mt-1.5 size-2.5 rounded-full bg-jade" aria-hidden="true" />
                    <div>
                      <strong className="block text-[12px] text-ink">{title}</strong>
                      <p className="mt-1 text-[11px] leading-5 text-muted">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <article className="overflow-hidden rounded-2xl border border-line-strong bg-white shadow-[0_18px_48px_rgb(18_53_60_/_8%)]">
              <header className="border-b border-line p-5 sm:p-6">
                <p className="mb-2 font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
                  Question
                </p>
                <h3 className="font-display text-2xl leading-tight font-bold tracking-[-.025em] text-ink">
                  How are performance decisions documented?
                </h3>
                <p className="mt-3 text-[12px] leading-5.5 text-ink-soft">
                  Ask who owns decisions, how written feedback is recorded, and how concerns move beyond your
                  immediate manager.
                </p>
              </header>
              <div className="grid sm:grid-cols-[.9fr_1.1fr]">
                <section className="border-b border-line p-5 sm:border-r sm:border-b-0 sm:p-6">
                  <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-muted uppercase">
                    Why ask this
                  </p>
                  <p className="mt-3 text-[11px] leading-5.5 text-ink-soft">
                    Related management and feedback terms appeared across the illustrative story and comment. The
                    question asks for the current process rather than treating either account as fact.
                  </p>
                </section>
                <section className="grid gap-4 p-5 sm:p-6">
                  <div>
                    <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-muted uppercase">
                      Sources
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge tone="blue">S1 · Story</Badge>
                      <Badge tone="blue">C1 · Comment</Badge>
                    </div>
                  </div>
                  <div className="rounded-lg bg-amber-soft p-3">
                    <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-amber-dark uppercase">
                      Evidence gap
                    </p>
                    <p className="mt-1.5 text-[10px] leading-4.5 text-ink-soft">
                      The reports cannot establish the current policy for your team. Ask for direct confirmation.
                    </p>
                  </div>
                </section>
              </div>
            </article>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-290 items-center gap-7 rounded-2xl border border-line-strong bg-white p-6 shadow-panel max-sm:w-[calc(100%_-_28px)] sm:grid-cols-[1fr_auto] sm:p-8">
            <div>
              <p className="mb-2 font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
                Use the method
              </p>
              <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)] leading-tight font-bold tracking-[-.035em] text-ink">
                Put a real company through the evidence trail.
              </h2>
              <p className="mt-3 max-w-165 text-[13px] leading-6 text-ink-soft">
                Build one checkpoint, compare two companies on the same unknowns, or carry the research into Deshi
                Mula with the extension.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:max-w-70 sm:justify-end">
              <Button asChild>
                <Link href="/#research">Check a company</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/compare">Compare companies</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/extension">Use the extension</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
