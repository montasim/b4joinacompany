"use client";

import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";

import { ReportedSalaryEvidence } from "@/components/reported-salary-evidence";
import { ReportedWorkArrangement } from "@/components/reported-work-arrangement";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CompanyRecord,
  CompanySalaryEvidence,
  CompanyWorkArrangement,
  EvidenceQuestion,
  StoryRecord,
} from "@/lib/contracts";
import { initials } from "@/lib/utils";

export interface CultureTopic {
  label: string;
  count: number;
}

const questionPreviewCount = 3;

function shortDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function compactBdt(value: number) {
  if (value < 1_000) return `৳${value.toLocaleString("en-BD")}`;
  const amount = value / 1_000;
  return `৳${Number.isInteger(amount) ? amount : amount.toFixed(1)}k`;
}

function topicLabel(question: EvidenceQuestion) {
  const labels: Record<string, string> = {
    management: "Management & feedback",
    compensation: "Pay & benefits",
    stability: "Job stability",
    growth: "Growth & promotion",
    workload: "Workload & hours",
    culture: "Respect & safety",
    workplace: "Workplace flexibility",
    hiring: "Hiring process",
  };
  return labels[question.id] ?? "No repeated topic detected";
}

function arrangementLabel(record: CompanyWorkArrangement | null) {
  if (!record || record.workArrangement.reportedMode === "unknown") {
    return "Needs confirmation";
  }
  if (record.workArrangement.reportedMode === "mixed") {
    return "More than one setup reported";
  }
  return `${record.workArrangement.reportedMode[0].toUpperCase()}${record.workArrangement.reportedMode.slice(1)} mentioned`;
}

function OfficialLinks({
  company,
  compact = false,
}: {
  company: CompanyRecord;
  compact?: boolean;
}) {
  const links = [
    company.websiteUrl ? ["Website", company.websiteUrl] : null,
    company.linkedinUrl ? ["LinkedIn", company.linkedinUrl] : null,
    company.careersUrl ? ["Careers", company.careersUrl] : null,
  ].filter((link): link is [string, string] => Boolean(link));

  if (!links.length) return null;

  if (compact) {
    return (
      <details className="group relative">
        <summary className="flex min-h-9 cursor-pointer list-none items-center rounded-lg border border-line bg-white px-3 text-xs font-extrabold marker:hidden [&::-webkit-details-marker]:hidden">
          Official links
          <ChevronDown className="ml-2 size-3.5 transition-transform group-open:rotate-180" />
        </summary>
        <div className="absolute top-[calc(100%+6px)] left-0 z-30 grid min-w-38 gap-1 rounded-lg border border-line-strong bg-white p-1.5 shadow-panel">
          {links.map(([label, href]) => (
            <a
              className="flex min-h-9 items-center justify-between gap-3 rounded-md px-2.5 text-xs font-bold no-underline hover:bg-jade-soft hover:text-jade-dark"
              href={href}
              key={label}
              rel="noreferrer"
              target="_blank"
            >
              {label}
              <ExternalLink className="size-3.5" />
            </a>
          ))}
        </div>
      </details>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {links.map(([label, href]) => (
        <a
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-extrabold no-underline transition-colors hover:border-jade hover:bg-jade-soft hover:text-jade-dark"
          href={href}
          key={label}
          rel="noreferrer"
          target="_blank"
        >
          {label}
          <ExternalLink className="size-3.5" />
        </a>
      ))}
    </div>
  );
}

export function CheckpointView({
  canSaveCompany,
  company,
  questions,
  stories,
  workArrangement,
  salaryEvidence,
  cultureTopics,
}: {
  canSaveCompany: boolean;
  company: CompanyRecord;
  questions: EvidenceQuestion[];
  stories: StoryRecord[];
  workArrangement: CompanyWorkArrangement | null;
  salaryEvidence: CompanySalaryEvidence[];
  cultureTopics: CultureTopic[];
}) {
  const [selectedRole, setSelectedRole] = useState(
    salaryEvidence[0]?.role ?? "",
  );
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [questionsExpanded, setQuestionsExpanded] = useState(false);
  const selectedSalary =
    salaryEvidence.find((record) => record.role === selectedRole) ??
    salaryEvidence[0] ??
    null;
  const storyTotal =
    company.positiveCount + company.mixedCount + company.negativeCount;
  const topicMaximum = Math.max(1, ...cultureTopics.map((topic) => topic.count));
  const leadingTopics = questions.slice(0, 2).map(topicLabel);
  const visibleQuestions = questionsExpanded
    ? questions
    : questions.slice(0, questionPreviewCount);
  const hiddenQuestionCount = Math.max(
    0,
    questions.length - questionPreviewCount,
  );
  const storySourceCount = stories.length || company.storyCount;
  const workSourceCount =
    (workArrangement?.workArrangement.evidenceSourceCount ?? 0) +
    (workArrangement?.reportedSchedule.evidenceSourceCount ?? 0);
  const salaryContributors = useMemo(
    () =>
      salaryEvidence.reduce(
        (total, record) => total + (record.sampleSize ?? 0),
        0,
      ),
    [salaryEvidence],
  );

  async function saveCompany() {
    if (saveState === "saving" || saveState === "saved") return;
    setSaveState("saving");
    try {
      const response = await fetch("/api/v1/workspace/checkpoints", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          companySlug: company.slug,
          stage: "Researching",
          role: selectedRole || "Role not specified",
          priority: "Not specified",
          note: "",
          snapshotVersion: company.snapshotDate,
        }),
      });
      if (response.status === 401) {
        window.location.href = `/auth/sign-in?next=${encodeURIComponent(`/company/${company.slug}`)}`;
        return;
      }
      if (!response.ok) throw new Error("Checkpoint could not be saved");
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <main
      className="mx-auto w-[calc(100%_-_40px)] max-w-280 py-12 pb-20 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-16"
      id="main"
    >
      <nav
        aria-label="Breadcrumb"
        className="mb-5.5 flex items-center gap-2 text-[11px] text-muted"
      >
        <Link className="font-extrabold text-jade-dark no-underline" href="/">
          Research
        </Link>
        <span>/</span>
        <span>b4joinacompany Brief</span>
      </nav>

      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line pb-6 max-sm:grid-cols-[auto_1fr]">
        <span className="grid size-13 place-items-center rounded-lg bg-jade-soft text-sm font-extrabold text-jade-dark">
          {initials(company.name)}
        </span>
        <div>
          <h1 className="font-display text-[clamp(34px,5vw,50px)] leading-none font-bold tracking-[-.035em]">
            {company.name}
          </h1>
          <p className="mt-1.75 text-[13px] text-muted">
            Bangladesh
            {company.sourceName !== company.name
              ? ` · Also found as ${company.sourceName}`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 max-sm:col-span-full max-sm:justify-start">
          <div className="max-sm:hidden">
            <OfficialLinks company={company} />
          </div>
          <div className="hidden max-sm:block">
            <OfficialLinks company={company} compact />
          </div>
          {canSaveCompany && (
            <Button
              aria-pressed={saveState === "saved"}
              disabled={saveState === "saving" || saveState === "saved"}
              onClick={saveCompany}
              size="sm"
              type="button"
              variant="outline"
            >
              {saveState === "saving"
                ? "Saving…"
                : saveState === "saved"
                  ? "Saved"
                  : "Save company"}
            </Button>
          )}
        </div>
        {canSaveCompany && saveState === "error" && (
          <p
            className="col-span-full text-right text-[10px] font-bold text-coral max-sm:text-left"
            role="alert"
          >
            The checkpoint could not be saved. Try again.
          </p>
        )}
      </header>

      <section
        aria-labelledby="brief-title"
        className="mt-7 overflow-hidden rounded-[14px] border border-line-strong bg-white shadow-[0_14px_42px_rgb(22_56_61_/_7%)]"
      >
        <header className="flex items-end justify-between gap-6 p-6.5 max-sm:grid max-sm:items-start max-sm:p-5">
          <div>
            <p className="font-mono text-[10px] font-extrabold tracking-[.08em] text-jade uppercase">
              Your b4joinacompany Brief
            </p>
            <h2
              className="mt-2 font-display text-[clamp(28px,3.5vw,40px)] leading-[1.08] font-bold tracking-[-.035em]"
              id="brief-title"
            >
              What to know before the next conversation.
            </h2>
          </div>
          {salaryEvidence.length > 0 && (
            <div className="grid min-w-61 gap-2 text-xs font-extrabold max-sm:min-w-0">
              <span id="company-salary-role-label">Salary role</span>
              <Select
                onValueChange={setSelectedRole}
                value={selectedRole || undefined}
              >
                <SelectTrigger
                  aria-labelledby="company-salary-role-label"
                  className="bg-[#fbfdfc]"
                >
                  <SelectValue placeholder="Choose a submitted salary role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Community-submitted roles</SelectLabel>
                    {salaryEvidence.map((record) => (
                      <SelectItem key={record.id} value={record.role}>
                        {record.role}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </header>

        <div className="grid grid-cols-3 border-t border-line max-md:grid-cols-2 max-sm:grid-cols-1">
          <article className="min-h-41 border-r border-line p-5.5 max-md:border-b max-sm:min-h-0 max-sm:border-r-0 max-sm:p-4.5">
            <Badge tone="blue">Recurring story topics</Badge>
            <strong className="mt-3 block font-display text-[21px] leading-tight">
              {leadingTopics.length
                ? leadingTopics.join(" & ")
                : "No repeated topic detected"}
            </strong>
            <p className="mt-2 text-[13px] leading-relaxed text-muted max-sm:hidden">
              Fixed-taxonomy matches identify what to inspect. They are not
              sentiment conclusions.
            </p>
          </article>
          <article className="min-h-41 border-r border-line p-5.5 max-md:border-r-0 max-md:border-b max-sm:min-h-0 max-sm:p-4.5">
            <Badge tone="blue">Author-selected · not a rating</Badge>
            <strong className="mt-3 block font-display text-[21px] leading-tight">
              {company.positiveCount} positive · {company.mixedCount} mixed ·{" "}
              {company.negativeCount} negative
            </strong>
            <p className="mt-2 text-[13px] leading-relaxed text-muted max-sm:hidden">
              This is the published story mix; read the accounts before
              treating it as company-wide.
            </p>
          </article>
          <article className="min-h-41 p-5.5 max-md:col-span-2 max-sm:col-span-1 max-sm:min-h-0 max-sm:border-b max-sm:p-4.5">
            <Badge tone="blue">Work setup</Badge>
            <strong className="mt-3 block font-display text-[21px] leading-tight">
              {arrangementLabel(workArrangement)}
            </strong>
            <p className="mt-2 text-[13px] leading-relaxed text-muted max-sm:hidden">
              {workArrangement && workSourceCount
                ? `${workSourceCount} unverified source mentions are available.`
                : "The current snapshot does not establish a reliable arrangement."}
            </p>
          </article>
          <article className="col-span-full grid grid-cols-[190px_200px_minmax(180px,1fr)_260px] items-center gap-5 border-t border-line p-5.5 max-md:grid-cols-[170px_1fr] max-sm:grid-cols-1 max-sm:p-4.5">
            <Badge className="w-max" tone="amber">
              Community submitted
            </Badge>
            <div>
              <strong className="block font-display text-2xl leading-tight">
                {selectedSalary
                  ? `${compactBdt(selectedSalary.salaryRange.minimumBdt)}–${compactBdt(selectedSalary.salaryRange.maximumBdt)}`
                  : "No submitted range"}
              </strong>
              <span className="mt-1.5 block w-max rounded-full bg-amber-soft px-2 py-1 text-[9px] font-extrabold text-amber-dark uppercase">
                Period unknown
              </span>
              <span className="mt-1 block text-[11px] text-muted">
                {selectedSalary
                  ? selectedSalary.sampleSize
                    ? `${selectedSalary.sampleSize} submitted records`
                    : "Sample size unavailable"
                  : "No matching salary source"}
              </span>
            </div>
            <div
              aria-hidden="true"
              className="relative h-2 overflow-hidden rounded-full bg-amber-soft max-md:col-span-2 max-sm:col-span-1"
            >
              {selectedSalary && (
                <span
                  className="absolute top-0 bottom-0 rounded-full bg-amber"
                  style={{
                    left: `${Math.min(94, (selectedSalary.salaryRange.minimumBdt / Math.max(1, ...salaryEvidence.map((item) => item.salaryRange.maximumBdt))) * 100)}%`,
                    width: `${Math.max(3, ((selectedSalary.salaryRange.maximumBdt - selectedSalary.salaryRange.minimumBdt) / Math.max(1, ...salaryEvidence.map((item) => item.salaryRange.maximumBdt))) * 100)}%`,
                  }}
                />
              )}
            </div>
            <p className="text-[13px] leading-relaxed text-muted max-md:col-span-2 max-sm:col-span-1">
              Pay period not supplied · Not verified by the company
            </p>
          </article>
        </div>

        <aside className="grid grid-cols-[300px_1fr] gap-6 bg-ink p-6.5 text-white max-md:grid-cols-1 max-sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-jade text-sm font-extrabold">
              {questions.length}
            </span>
            <p className="text-xs leading-relaxed text-white/70">
              <strong className="block font-display text-lg text-white">
                Take these into the interview.
              </strong>
              They come from recurring topics and missing official information.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <strong className="text-xs">
              {questions.length}{" "}
              {questions.length === 1 ? "question" : "questions"} ready
            </strong>
            <a
              className="ml-auto text-[11px] font-extrabold text-amber underline underline-offset-3 max-sm:mt-1 max-sm:w-full"
              href="#questions"
            >
              Review the questions ↓
            </a>
          </div>
        </aside>
        <footer className="border-t border-line px-6.5 py-3 text-xs leading-relaxed text-muted max-sm:px-4.5">
          Based on {company.storyCount.toLocaleString()} workplace{" "}
          {company.storyCount === 1 ? "story" : "stories"} and{" "}
          {salaryEvidence.length.toLocaleString()} salary{" "}
          {salaryEvidence.length === 1 ? "role" : "roles"} · Snapshot{" "}
          {shortDate(company.snapshotDate)} ·{" "}
          <a className="font-extrabold text-jade-dark" href="#sources">
            Review sources
          </a>
        </footer>
      </section>

      <nav
        aria-label="Company brief sections"
        className="sticky top-17 z-30 mt-5 mb-8 flex items-center gap-1 overflow-x-auto rounded-xl border border-line-strong bg-white/98 p-2 shadow-[0_10px_28px_rgb(22_56_61_/_14%)] backdrop-blur-md max-sm:top-15.5 max-sm:mb-6 [&_a]:whitespace-nowrap [&_a]:rounded-md [&_a]:border [&_a]:border-transparent [&_a]:px-3 [&_a]:py-2 [&_a]:text-xs [&_a]:font-bold [&_a]:text-muted [&_a]:no-underline [&_a]:transition-colors [&_a]:hover:border-line [&_a]:hover:bg-jade-soft [&_a]:hover:text-jade-dark [&_a]:focus-visible:border-jade [&_a]:focus-visible:bg-jade-soft [&_a]:focus-visible:text-jade-dark [&_a]:focus-visible:outline-none"
      >
        <a href="#questions">Questions</a>
        <a href="#culture">Culture</a>
        <a href="#work-setup">Work setup</a>
        <a href="#salary">Salary</a>
        <a href="#ask">Ask</a>
        <a href="#sources">Sources</a>
      </nav>

      <section
        className="scroll-mt-35 rounded-xl border border-line-strong bg-white"
        id="questions"
      >
        <header className="grid grid-cols-[1fr_auto] items-start gap-5 p-6 max-sm:grid-cols-1 max-sm:p-5">
          <div>
            <p className="font-mono text-[10px] font-extrabold tracking-[.08em] text-jade uppercase">
              Prepare for the conversation
            </p>
            <h2 className="mt-2 font-display text-[32px] leading-tight font-bold tracking-[-.03em]">
              Questions to verify
            </h2>
            <p className="mt-2 max-w-175 text-sm leading-relaxed text-muted">
              Use these prompts to confirm what public and community evidence
              cannot establish.
            </p>
          </div>
        </header>
        <div className="px-6 pb-6 max-sm:px-5 max-sm:pb-5">
          <div id="questions-list">
            {visibleQuestions.map((question, index) => (
              <article
                className="grid grid-cols-[34px_1fr_auto] items-start gap-4 border-t border-line py-5 first:border-t-0 first:pt-0 max-sm:grid-cols-[30px_1fr]"
                key={question.id}
              >
                <span
                  className={`grid size-8.5 place-items-center rounded-full text-xs font-extrabold text-white ring-4 ${
                    index % 3 === 0
                      ? "bg-coral ring-coral-soft"
                      : index % 3 === 1
                        ? "bg-jade ring-jade-soft"
                        : "bg-amber ring-amber-soft"
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-[22px] leading-tight font-bold tracking-[-.02em]">
                    {question.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {question.guidance}
                  </p>
                  <details className="group mt-3">
                    <summary className="cursor-pointer list-none text-[11px] font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3 marker:hidden [&::-webkit-details-marker]:hidden">
                      Why ask this? · {question.citations.length} cited{" "}
                      {question.citations.length === 1 ? "source" : "sources"}
                    </summary>
                    <div className="mt-3 rounded-lg bg-mist p-3.5">
                      <p className="text-[11px] leading-relaxed text-ink-soft">
                        {question.rationale}
                      </p>
                      {question.citations.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {question.citations.map((citation) => (
                            <span
                              className="rounded-md bg-white px-2 py-1 font-mono text-[8px] leading-relaxed text-blue"
                              key={citation}
                            >
                              {citation}
                            </span>
                          ))}
                        </div>
                      )}
                      {question.gap && (
                        <p className="mt-3 rounded-lg bg-coral-soft p-3 text-[10px] leading-relaxed text-coral">
                          <strong>Evidence gap:</strong> {question.gap}
                        </p>
                      )}
                    </div>
                  </details>
                </div>
                <a
                  className="text-[11px] font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3 max-sm:col-start-2"
                  href="#sources"
                >
                  Sources ↓
                </a>
              </article>
            ))}
          </div>
          {hiddenQuestionCount > 0 && (
            <div className="flex justify-center border-t border-line pt-5">
              <Button
                aria-controls="questions-list"
                aria-expanded={questionsExpanded}
                onClick={() => setQuestionsExpanded((expanded) => !expanded)}
                type="button"
                variant="outline"
              >
                {questionsExpanded
                  ? "Show fewer questions"
                  : `See ${hiddenQuestionCount} more ${
                      hiddenQuestionCount === 1 ? "question" : "questions"
                    }`}
                <ChevronDown
                  aria-hidden="true"
                  className={`size-3.5 transition-transform ${
                    questionsExpanded ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          )}
        </div>
      </section>

      <section
        className="mt-4.5 scroll-mt-35 rounded-xl border border-line-strong bg-white"
        id="culture"
      >
        <header className="grid grid-cols-[1fr_auto] items-start gap-5 p-6 max-sm:grid-cols-1 max-sm:p-5">
          <div>
            <Badge tone="blue">Two views, kept separate</Badge>
            <h2 className="mt-2 font-display text-[32px] leading-tight font-bold tracking-[-.03em]">
              What the available culture evidence can show
            </h2>
            <p className="mt-2 max-w-175 text-sm leading-relaxed text-muted">
              Topic frequency comes from fixed-taxonomy matches. Story balance
              comes from author-selected labels. Neither is verified company
              policy.
            </p>
          </div>
          <Badge tone="amber">Not a rating</Badge>
        </header>
        <div className="px-6 pb-6 max-sm:px-5 max-sm:pb-5">
          <figure className="border-b border-line pb-6">
            <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <strong className="font-display text-lg">
                Topics mentioned in {storySourceCount.toLocaleString()}{" "}
                available story texts
              </strong>
              <span className="text-xs text-muted">
                Fixed taxonomy · categories can overlap · frequency is not
                sentiment
              </span>
            </figcaption>
            {cultureTopics.length ? (
              <div className="grid gap-3">
                {cultureTopics.map((topic) => (
                  <div
                    className="grid grid-cols-[150px_1fr_36px] items-center gap-3.5 max-sm:grid-cols-[112px_1fr_28px] max-sm:gap-2"
                    key={topic.label}
                  >
                    <span className="text-[13px] font-bold max-sm:text-xs">
                      {topic.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-3 overflow-hidden rounded-full bg-blue-soft"
                    >
                      <i
                        className="block h-full rounded-full bg-blue"
                        style={{ width: `${(topic.count / topicMaximum) * 100}%` }}
                      />
                    </span>
                    <strong className="text-right font-mono text-[13px] text-blue">
                      {topic.count}
                    </strong>
                  </div>
                ))}
                <p className="ml-41 text-xs leading-relaxed text-muted max-sm:ml-0">
                  Bars are relative to the most-mentioned topic in this story
                  set.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-line-strong bg-mist p-5">
                <strong className="text-xs">
                  No repeated topic crossed the current matching rules
                </strong>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  This is an evidence gap, not a positive or negative culture
                  signal.
                </p>
              </div>
            )}
          </figure>

          <figure className="mt-6">
            <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <strong className="font-display text-lg">
                Author-selected labels on {storyTotal.toLocaleString()}{" "}
                workplace {storyTotal === 1 ? "story" : "stories"}
              </strong>
              <span className="text-xs text-muted">
                Source collection context · not a company score
              </span>
            </figcaption>
            <div
              aria-label={`${company.positiveCount} positive, ${company.mixedCount} mixed, ${company.negativeCount} negative stories`}
              className="flex h-4.5 overflow-hidden rounded-full border border-ink/5 bg-line"
              role="img"
            >
              <span
                className="bg-jade"
                style={{
                  width: `${storyTotal ? (company.positiveCount / storyTotal) * 100 : 0}%`,
                }}
              />
              <span
                className="bg-amber"
                style={{
                  width: `${storyTotal ? (company.mixedCount / storyTotal) * 100 : 0}%`,
                }}
              />
              <span
                className="bg-coral"
                style={{
                  width: `${storyTotal ? (company.negativeCount / storyTotal) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="mt-3.5 grid grid-cols-3 gap-2.5 max-sm:gap-1.5">
              {[
                ["Positive", company.positiveCount, "bg-jade"],
                ["Mixed", company.mixedCount, "bg-amber"],
                ["Negative", company.negativeCount, "bg-coral"],
              ].map(([label, count, color]) => (
                <div
                  className="flex items-start gap-2 rounded-lg border border-line bg-[#fbfdfc] p-3.5 max-sm:p-2.5"
                  key={String(label)}
                >
                  <span
                    className={`mt-1 size-2.5 shrink-0 rounded-full ${color}`}
                  />
                  <p className="text-xs text-muted">
                    <strong className="mb-0.5 block font-display text-[22px] leading-none text-ink max-sm:text-lg">
                      {Number(count)}
                    </strong>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </figure>
          <p className="mt-4 rounded-lg bg-blue-soft p-3.5 text-[13px] leading-relaxed text-ink-soft">
            <strong>How to use this:</strong> frequent topics and the published
            label mix are reasons to read the sources and ask sharper
            questions—not automatic verdicts about every team.
          </p>
        </div>
      </section>

      {workArrangement ? (
        <ReportedWorkArrangement record={workArrangement} />
      ) : (
        <details
          className="group mt-4.5 scroll-mt-35 overflow-hidden rounded-xl border border-line-strong bg-white"
          id="work-setup"
        >
          <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-5 p-6 marker:hidden max-sm:grid-cols-1 max-sm:p-5 [&::-webkit-details-marker]:hidden">
            <div>
              <Badge tone="blue">Unverified derived evidence</Badge>
              <h2 className="mt-2 font-display text-[32px] leading-tight font-bold tracking-[-.03em]">
                Work setup
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                No explicit remote, onsite, hybrid, or schedule evidence was
                found in the current snapshot.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="amber">No explicit source</Badge>
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
            </div>
          </summary>
          <div className="border-t border-line px-6 pb-6 max-sm:px-5 max-sm:pb-5">
            <p className="mt-5 rounded-lg bg-coral-soft p-3.5 text-[13px] leading-relaxed text-coral">
              <strong>Not verified company policy.</strong> Unknown does not
              mean onsite. Confirm the current arrangement and schedule
              directly.
            </p>
          </div>
        </details>
      )}

      <ReportedSalaryEvidence
        records={salaryEvidence}
        selectedRole={selectedRole}
      />

      {!salaryEvidence.length && (
        <details
          className="group mt-4.5 scroll-mt-35 overflow-hidden rounded-xl border border-line-strong bg-white"
          id="salary"
          open
        >
          <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-5 p-6 marker:hidden max-sm:grid-cols-1 max-sm:p-5 [&::-webkit-details-marker]:hidden">
            <div>
              <Badge tone="amber">Community submitted</Badge>
              <h2 className="mt-2 font-display text-[32px] leading-tight font-bold tracking-[-.03em]">
                Submitted BDT amounts by role
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                No company-matched salary submissions are available in this
                dataset snapshot.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="amber">No submitted range</Badge>
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
            </div>
          </summary>
          <div className="border-t border-line px-6 pb-6 max-sm:px-5 max-sm:pb-5">
            <p className="mt-5 rounded-lg bg-coral-soft p-3.5 text-[13px] leading-relaxed text-coral">
              <strong>Evidence gap.</strong> Ask the company for the approved
              numerical range, pay period, benefits, and review cycle in
              writing.
            </p>
          </div>
        </details>
      )}

      <section
        className="mt-4.5 scroll-mt-35 rounded-xl border border-line-strong bg-white"
        id="ask"
      >
        <header className="p-6 max-sm:p-5">
          <p className="font-mono text-[10px] font-extrabold tracking-[.08em] text-jade uppercase">
            Company-scoped research
          </p>
          <h2 className="mt-2 font-display text-[32px] leading-tight font-bold tracking-[-.03em]">
            Ask one focused question
          </h2>
          <p className="mt-2 max-w-175 text-sm leading-relaxed text-muted">
            b4joinacompany retrieves relevant evidence for this company, then returns a
            cited answer or an explicit evidence gap.
          </p>
        </header>
        <div className="grid grid-cols-[1fr_auto] items-end gap-3 px-6 pb-6 max-sm:grid-cols-1 max-sm:px-5 max-sm:pb-5">
          <label className="grid gap-2 text-[13px] font-extrabold">
            Start with a prepared question
            <input
              className="min-h-11 rounded-lg border border-line-strong bg-[#fbfdfc] px-3 text-sm text-ink"
              readOnly
              value={
                questions[0]?.title ??
                `What should I verify directly with ${company.name}?`
              }
            />
          </label>
          <Button asChild>
            <Link
              href={`/ask?company=${encodeURIComponent(company.slug)}&question=${encodeURIComponent(
                questions[0]?.title ??
                  `What should I verify directly with ${company.name}?`,
              )}`}
            >
              Ask from the evidence →
            </Link>
          </Button>
        </div>
      </section>

      <section
        className="mt-4.5 scroll-mt-35 rounded-xl border border-line-strong bg-white"
        id="sources"
      >
        <header className="p-6 max-sm:p-5">
          <p className="font-mono text-[10px] font-extrabold tracking-[.08em] text-jade uppercase">
            Sources
          </p>
          <h2 className="mt-2 font-display text-[32px] leading-tight font-bold tracking-[-.03em]">
            Where this brief comes from
          </h2>
          <p className="mt-2 max-w-175 text-sm leading-relaxed text-muted">
            Each source keeps its role, snapshot date, and limitations visible.
          </p>
        </header>
        <div className="px-6 pb-6 max-sm:px-5 max-sm:pb-5">
          <div className="grid border-t border-line">
            <div className="grid grid-cols-[110px_1fr_auto] items-center gap-4 border-b border-line py-4 max-sm:grid-cols-[1fr_auto]">
              <Badge className="w-max" tone="blue">
                Reported
              </Badge>
              <strong className="text-[13px] max-sm:col-span-2 max-sm:row-start-2">
                {company.storyCount.toLocaleString()} Deshi Mula workplace{" "}
                {company.storyCount === 1 ? "story" : "stories"} and associated
                comments
              </strong>
              <a
                className="inline-flex items-center gap-1 text-xs font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3"
                href={company.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open source <ExternalLink className="size-3.5" />
              </a>
            </div>
            {salaryEvidence.length > 0 && (
              <div className="grid grid-cols-[110px_1fr_auto] items-center gap-4 border-b border-line py-4 max-sm:grid-cols-[1fr_auto]">
                <Badge className="w-max" tone="amber">
                  Submitted
                </Badge>
                <strong className="text-[13px] max-sm:col-span-2 max-sm:row-start-2">
                  {salaryEvidence.length} salary-role{" "}
                  {salaryEvidence.length === 1 ? "aggregate" : "aggregates"}
                  {salaryContributors
                    ? ` from ${salaryContributors.toLocaleString()} submitted records`
                    : ""}
                </strong>
                <a
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3"
                  href={salaryEvidence[0].sourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open source <ExternalLink className="size-3.5" />
                </a>
              </div>
            )}
            {(company.websiteUrl ||
              company.linkedinUrl ||
              company.careersUrl) && (
              <div className="grid grid-cols-[110px_1fr_auto] items-center gap-4 border-b border-line py-4 max-sm:grid-cols-[1fr_auto]">
                <Badge className="w-max">Official</Badge>
                <strong className="text-[13px] max-sm:col-span-2 max-sm:row-start-2">
                  Website, LinkedIn company page, and careers destinations
                  available in the current snapshot
                </strong>
                <div className="max-sm:justify-self-end">
                  <OfficialLinks company={company} compact />
                </div>
              </div>
            )}
          </div>

          {stories.length > 0 && (
            <details className="group mt-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg bg-mist p-3.5 text-xs font-extrabold marker:hidden [&::-webkit-details-marker]:hidden">
                Inspect recent story sources
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 grid gap-2.5">
                {stories.slice(0, 3).map((story) => (
                  <a
                    className="grid grid-cols-[1fr_auto] gap-4 rounded-lg border border-line bg-[#fbfdfc] p-4 no-underline transition-colors hover:border-jade"
                    href={story.sourceUrl}
                    key={story.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span>
                      <strong className="block text-xs">{story.title}</strong>
                      <span className="mt-1.5 block text-[10px] leading-relaxed text-muted">
                        {story.role} · {story.dateLabel} · Author-selected{" "}
                        {story.vibe} label
                      </span>
                    </span>
                    <ExternalLink className="size-4 text-jade-dark" />
                  </a>
                ))}
              </div>
            </details>
          )}
        </div>
      </section>
    </main>
  );
}
