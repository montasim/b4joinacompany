"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronDown, Repeat2 } from "lucide-react";

import {
  CompanyAutocomplete,
  type CompanySuggestion,
} from "@/components/company-autocomplete";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  roleKey,
  roleOptionsFor,
  type RoleOption,
  type SalaryEvidence,
  type SalaryRole,
} from "@/lib/compare-roles";
import { initials } from "@/lib/utils";

const RECENT_COMPANIES_KEY = "b4join:recent-companies";

const topicLabels: Record<string, string> = {
  management: "Management & feedback",
  compensation: "Pay & benefits",
  stability: "Stability & job security",
  growth: "Growth & promotion",
  workload: "Workload & hours",
  culture: "Culture & safety",
  workplace: "Workplace flexibility",
  hiring: "Hiring process",
  "company-specific-evidence": "Company-specific evidence",
};

interface EvidenceQuestion {
  id: string;
  title: string;
}

interface WorkArrangement {
  workArrangement: {
    reportedMode: "remote" | "onsite" | "hybrid" | "mixed" | "unknown";
    confidence: "high" | "medium" | "low" | "unknown";
    evidenceSourceCount: number;
    hasConflictingReports: boolean;
  };
  reportedSchedule: {
    confidence: "high" | "medium" | "low" | "unknown";
    evidenceSourceCount: number;
    dailyHours: Array<{
      minimum: number;
      maximum: number;
      mentionCount: number;
    }>;
    flexibleEvidenceCount: number;
    overtimeEvidenceCount: number;
    afterHoursEvidenceCount: number;
  };
}

interface CompanyEvidence {
  slug: string;
  name: string;
  snapshotDate: string;
  metrics: {
    stories: number;
    sentiment: {
      positive: number;
      mixed: number;
      negative: number;
    };
  };
  links: Array<{
    label: string;
    url: string;
    kind: string;
  }>;
  questions: EvidenceQuestion[];
  workArrangement: WorkArrangement | null;
}

interface CompanyComparisonEvidence {
  company: CompanySuggestion;
  evidence: CompanyEvidence;
  salary: SalaryEvidence;
}

function rememberCompany(
  company: CompanySuggestion,
  recent: CompanySuggestion[],
  setRecent: (companies: CompanySuggestion[]) => void,
) {
  const next = [
    company,
    ...recent.filter((item) => item.slug !== company.slug),
  ].slice(0, 5);
  setRecent(next);
}

function salaryForRole(records: SalaryRole[], role: string) {
  if (!role) return undefined;
  return records.find((record) => roleKey(record.role) === role);
}

async function loadSalaryEvidence(
  company: Pick<CompanySuggestion, "slug" | "name">,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `/api/v1/companies/${encodeURIComponent(company.slug)}/salary`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(`Salary roles for ${company.name} could not be loaded.`);
  }
  return (await response.json()) as SalaryEvidence;
}

function money(value: number) {
  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value);
}

function modeLabel(value: WorkArrangement | null) {
  const mode = value?.workArrangement.reportedMode;
  if (!mode || mode === "unknown") return "No explicit work-mode evidence";
  if (mode === "mixed") return "Different work modes are reported";
  return `${mode[0].toUpperCase()}${mode.slice(1)} is reported`;
}

function workMeta(value: WorkArrangement | null) {
  if (!value) {
    return "No story or comment stated a work mode or schedule clearly enough to extract.";
  }
  const mode = value.workArrangement;
  const schedule = value.reportedSchedule;
  const details = [
    `${mode.evidenceSourceCount} work-mode ${mode.evidenceSourceCount === 1 ? "source" : "sources"}`,
    `${mode.confidence} confidence`,
  ];
  if (schedule.dailyHours[0]) {
    const hours = schedule.dailyHours[0];
    details.push(
      hours.minimum === hours.maximum
        ? `${hours.minimum} hours mentioned`
        : `${hours.minimum}–${hours.maximum} hours mentioned`,
    );
  } else if (schedule.evidenceSourceCount > 0) {
    details.push(`${schedule.evidenceSourceCount} schedule sources`);
  }
  return `${details.join(" · ")}. Derived from unverified workplace reports.`;
}

async function loadCompanyEvidence(company: CompanySuggestion) {
  const [companyResponse, salaryResponse] = await Promise.all([
    fetch(`/api/v1/extension/company?slug=${encodeURIComponent(company.slug)}`),
    fetch(`/api/v1/companies/${encodeURIComponent(company.slug)}/salary`),
  ]);

  if (!companyResponse.ok || !salaryResponse.ok) {
    throw new Error("The comparison evidence could not be loaded.");
  }

  return {
    company,
    evidence: (await companyResponse.json()) as CompanyEvidence,
    salary: (await salaryResponse.json()) as SalaryEvidence,
  } satisfies CompanyComparisonEvidence;
}

function CompanyPicker({
  side,
  query,
  selected,
  onQueryChange,
  onSelect,
}: {
  side: "first" | "second";
  query: string;
  selected: CompanySuggestion | null;
  onQueryChange: (value: string) => void;
  onSelect: (company: CompanySuggestion) => void;
}) {
  return (
    <label className="relative grid min-w-0 gap-2 text-xs font-extrabold">
      {side === "first" ? "First company" : "Second company"}
      <CompanyAutocomplete
        className="[&>div:first-child]:min-h-13.5 [&_input]:min-h-13 [&_input]:text-sm"
        committedValue={selected?.name}
        id={`${side}-company`}
        leading={
          <span
            className={`ml-2 grid size-9 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-extrabold ${
              selected
                ? "bg-jade-soft text-jade-dark"
                : "bg-mist text-muted"
            }`}
            aria-hidden
          >
            {selected
              ? initials(selected.name)
              : side === "first"
                ? "A"
                : "B"}
          </span>
        }
        placeholder="Search company name"
        value={query}
        onValueChange={onQueryChange}
        onSelect={onSelect}
      />
    </label>
  );
}

function EmptyComparison({
  selectedCount,
  duplicate,
  loading,
}: {
  selectedCount: number;
  duplicate: boolean;
  loading: boolean;
}) {
  return (
    <section
      className="mt-7.5 overflow-hidden rounded-[14px] border border-line-strong bg-white"
      aria-live="polite"
    >
      <header className="px-6.5 py-6 max-sm:px-4.5 max-sm:py-5.25">
        <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
          What the comparison answers
        </p>
        <h2 className="mt-1.75 font-display text-[32px] leading-tight font-bold tracking-[-.025em] max-sm:text-[27px]">
          {loading
            ? "Building your comparison…"
            : duplicate
              ? "Choose two different companies."
              : selectedCount === 1
                ? "Choose one more company."
                : "See the same questions for both companies."}
        </h2>
      </header>
      <div className="grid border-t border-line sm:grid-cols-5">
        {[
          "Culture topics",
          "Salary for one role",
          "Work-setup evidence",
          "Questions to verify",
          "Sources & freshness",
        ].map((label) => (
          <span
            className="grid min-h-23 place-items-center border-r border-line p-3.75 text-center text-xs font-extrabold text-ink-soft last:border-r-0 max-sm:min-h-13 max-sm:border-r-0 max-sm:border-b max-sm:last:border-b-0"
            key={label}
          >
            {label}
          </span>
        ))}
      </div>
      <footer className="bg-ink px-6.5 py-3.75 text-xs font-bold text-white max-sm:px-4.5">
        No scores. Unknown information remains unknown.
      </footer>
    </section>
  );
}

function QuestionList({ questions }: { questions: EvidenceQuestion[] }) {
  if (!questions.length) {
    return (
      <p className="text-xs leading-[1.55] text-muted">
        No repeated signal crossed the question threshold. Ask directly about
        the role, team, hours, and written terms.
      </p>
    );
  }

  return (
    <ul className="grid list-none gap-2.75 p-0">
      {questions.slice(0, 3).map((question) => (
        <li
          className="grid grid-cols-[22px_1fr] gap-2.25 text-[13px] leading-[1.45] before:grid before:size-5.5 before:place-items-center before:rounded-full before:bg-ink before:font-mono before:text-[10px] before:font-extrabold before:text-white before:content-['?']"
          key={question.id}
        >
          {question.title}
        </li>
      ))}
    </ul>
  );
}

function SideName({ children }: { children: string }) {
  return (
    <span className="mb-3 block font-mono text-[10px] leading-[1.4] font-extrabold tracking-[.05em] text-muted uppercase">
      {children}
    </span>
  );
}

function EvidenceCategory({
  label,
  description,
  first,
  second,
  children,
}: {
  label: string;
  description: string;
  first: CompanyComparisonEvidence;
  second: CompanyComparisonEvidence;
  children: (
    company: CompanyComparisonEvidence,
    side: "first" | "second",
  ) => React.ReactNode;
}) {
  return (
    <section className="border-b border-line bg-white">
      <header className="bg-[#fbfdfc] px-7.5 py-4 max-sm:px-5.75">
        <span className="font-mono text-[11px] font-extrabold tracking-[.07em] text-jade-dark uppercase">
          {label}
        </span>
        <p className="mt-0.75 text-[11px] leading-[1.45] text-muted">
          {description}
        </p>
      </header>
      <div className="grid border-t border-line sm:grid-cols-2">
        {[first, second].map((company, index) => (
          <article
            className="min-w-0 border-r border-line px-7.5 py-5.25 last:border-r-0 max-sm:border-r-0 max-sm:border-b max-sm:px-5.75 max-sm:last:border-b-0"
            key={company.company.slug}
          >
            <SideName>{company.company.name}</SideName>
            {children(company, index === 0 ? "first" : "second")}
          </article>
        ))}
      </div>
    </section>
  );
}

function CompanyHeads({
  first,
  second,
}: {
  first: CompanyComparisonEvidence;
  second: CompanyComparisonEvidence;
}) {
  return (
    <div className="grid border-y border-line bg-mist sm:grid-cols-[190px_1fr_1fr]">
      <div className="border-r border-line max-sm:hidden" aria-hidden />
      {[first, second].map((record, index) => (
        <article
          className="grid grid-cols-[auto_1fr_auto] items-center gap-2.75 border-r border-line px-4.5 py-4 last:border-r-0 max-sm:border-r-0 max-sm:border-b max-sm:last:border-b-0"
          key={record.company.slug}
        >
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-extrabold ${
              index === 0
                ? "bg-jade-soft text-jade-dark"
                : "bg-amber-soft text-amber-dark"
            }`}
          >
            {initials(record.company.name)}
          </span>
          <span className="min-w-0">
            <strong className="block truncate text-sm">
              {record.company.name}
            </strong>
            <small className="mt-1 block text-[10px] text-muted">
              {record.evidence.metrics.stories.toLocaleString()} stories ·{" "}
              {record.salary.roles.length.toLocaleString()} salary roles
            </small>
          </span>
          <Link
            className="text-[10px] font-extrabold text-jade-dark"
            href={`/company/${record.company.slug}`}
          >
            Open full brief <span aria-hidden>→</span>
          </Link>
        </article>
      ))}
    </div>
  );
}

function SalaryCell({
  record,
  role,
  scale,
}: {
  record: CompanyComparisonEvidence;
  role: string;
  scale: number;
}) {
  const salary = salaryForRole(record.salary.roles, role);
  if (!salary) {
    return (
      <div className="rounded-lg border border-dashed border-line-strong bg-mist p-3.5">
        <strong className="block font-display text-[19px] leading-[1.25]">
          No matched evidence for this role
        </strong>
        <p className="mt-2.75 text-xs leading-[1.55] text-muted">
          Ask directly; missing data is not a negative signal.
        </p>
      </div>
    );
  }

  const left = (salary.range.minimumBdt / scale) * 100;
  const width =
    ((salary.range.maximumBdt - salary.range.minimumBdt) / scale) * 100;

  return (
    <>
      <strong className="block font-display text-[28px] leading-[1.25]">
        ৳{money(salary.range.minimumBdt)}–{money(salary.range.maximumBdt)}
      </strong>
      <div
        className="relative mt-3.75 h-3 rounded-full bg-amber-soft before:absolute before:inset-x-0 before:top-1.25 before:h-0.5 before:bg-line"
        aria-label={`Submitted range from ${money(salary.range.minimumBdt)} to ${money(salary.range.maximumBdt)} BDT`}
        role="img"
      >
        <i
          className="absolute top-0.5 h-2 rounded-full bg-amber before:absolute before:-top-0.75 before:left-0 before:h-3.5 before:w-0.5 before:bg-amber-dark after:absolute after:-top-0.75 after:right-0 after:h-3.5 after:w-0.5 after:bg-amber-dark"
          style={{
            left: `${Math.min(left, 96)}%`,
            width: `${Math.max(Math.min(width, 100 - left), 2)}%`,
          }}
        />
      </div>
      <p className="mt-2.75 text-xs leading-[1.55] text-muted">
        {salary.sampleSize
          ? `${salary.sampleSize.toLocaleString()} submitted records`
          : "Sample size not published"}{" "}
        · pay period unspecified
      </p>
    </>
  );
}

function DetailsCategory({
  label,
  description,
  first,
  second,
  initiallyOpen = false,
  children,
}: {
  label: string;
  description: string;
  first: CompanyComparisonEvidence;
  second: CompanyComparisonEvidence;
  initiallyOpen?: boolean;
  children: (company: CompanyComparisonEvidence) => React.ReactNode;
}) {
  return (
    <details className="group border-b border-line bg-white" open={initiallyOpen}>
      <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-4 bg-[#fbfdfc] px-7.5 py-4 marker:hidden max-sm:px-5.75 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="font-mono text-[11px] font-extrabold tracking-[.07em] text-jade-dark uppercase">
            {label}
          </span>
          <span className="mt-0.75 block text-[11px] leading-[1.45] text-muted">
            {description}
          </span>
        </span>
        <span className="grid size-7 place-items-center rounded-full bg-mist transition-transform group-open:rotate-180">
          <ChevronDown className="size-3.5" aria-hidden />
        </span>
      </summary>
      <div className="grid border-t border-line sm:grid-cols-2">
        {[first, second].map((record) => (
          <article
            className="min-w-0 border-r border-line px-7.5 py-5.25 last:border-r-0 max-sm:border-r-0 max-sm:border-b max-sm:px-5.75 max-sm:last:border-b-0"
            key={record.company.slug}
          >
            <SideName>{record.company.name}</SideName>
            {children(record)}
          </article>
        ))}
      </div>
    </details>
  );
}

function ComparisonBrief({
  first,
  second,
  role,
  roleLabel,
}: {
  first: CompanyComparisonEvidence;
  second: CompanyComparisonEvidence;
  role: string;
  roleLabel: string;
}) {
  const displayedRole = roleLabel || "No submitted salary role";
  const firstSalary = salaryForRole(first.salary.roles, role);
  const secondSalary = salaryForRole(second.salary.roles, role);
  const salaryScale = Math.max(
    firstSalary?.range.maximumBdt ?? 0,
    secondSalary?.range.maximumBdt ?? 0,
    1,
  );
  const snapshot =
    first.evidence.snapshotDate === second.evidence.snapshotDate
      ? first.evidence.snapshotDate
      : `${first.evidence.snapshotDate} / ${second.evidence.snapshotDate}`;

  return (
    <section
      className="relative mt-8.5 overflow-hidden rounded-[14px] border border-line-strong bg-white shadow-[0_18px_52px_rgb(22_56_61_/_8%)] before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-1.25 before:bg-[linear-gradient(to_bottom,var(--color-jade)_0_24%,var(--color-blue)_24%_48%,var(--color-amber)_48%_72%,var(--color-ink)_72%)]"
      aria-label="Two-company b4joinacompany Brief"
    >
      <header className="flex items-end justify-between gap-5 px-7.5 py-6.25 max-sm:grid max-sm:px-5.75 max-sm:py-5.25">
        <div>
          <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
            Two-company b4joinacompany Brief
          </p>
          <h2 className="mt-1.75 font-display text-[clamp(1.9375rem,4vw,2.6875rem)] leading-[1.05] font-bold tracking-[-.03em]">
            What each company still needs to answer.
          </h2>
        </div>
        <span className="w-max rounded-full bg-amber-soft px-2.5 py-1.75 text-[11px] font-extrabold text-amber-dark">
          {displayedRole}
        </span>
      </header>

      <CompanyHeads first={first} second={second} />

      <EvidenceCategory
        label="Questions to verify"
        description="Prompts come from evidence gaps, not company scores."
        first={first}
        second={second}
      >
        {(record) => <QuestionList questions={record.evidence.questions} />}
      </EvidenceCategory>

      <EvidenceCategory
        label="Culture topics"
        description="Fixed question taxonomy detected in company reports. Frequency is not sentiment."
        first={first}
        second={second}
      >
        {(record) => {
          const topics = record.evidence.questions
            .map((question) => topicLabels[question.id] ?? question.id)
            .slice(0, 5);
          return (
            <>
              <div className="flex flex-wrap gap-2">
                {topics.length ? (
                  topics.map((topic) => (
                    <span
                      className="rounded-full bg-blue-soft px-2.5 py-2 text-xs font-extrabold text-blue"
                      key={topic}
                    >
                      {topic}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted">
                    No repeated topic crossed the current threshold.
                  </span>
                )}
              </div>
              <p className="mt-2.75 text-xs leading-[1.55] text-muted">
                {record.evidence.metrics.stories.toLocaleString()} workplace
                stories · evidence-driven question taxonomy
              </p>
            </>
          );
        }}
      </EvidenceCategory>

      <EvidenceCategory
        label={`Submitted amount for ${displayedRole}`}
        description="Community submitted · period unspecified · not company verified"
        first={first}
        second={second}
      >
        {(record) => (
          <SalaryCell record={record} role={role} scale={salaryScale} />
        )}
      </EvidenceCategory>

      <DetailsCategory
        label="Work setup"
        description="Derived from stories · not verified company policy"
        first={first}
        second={second}
        initiallyOpen
      >
        {(record) => (
          <>
            <strong className="block font-display text-[19px] leading-[1.25]">
              {modeLabel(record.evidence.workArrangement)}
            </strong>
            <p className="mt-2.75 text-xs leading-[1.55] text-muted">
              {workMeta(record.evidence.workArrangement)}
            </p>
          </>
        )}
      </DetailsCategory>

      <DetailsCategory
        label="Evidence basis & freshness"
        description="Coverage explains confidence; it does not rank employers."
        first={first}
        second={second}
      >
        {(record) => {
          const official = record.evidence.links
            .filter((link) => link.kind !== "deshimula")
            .map((link) => link.label);
          return (
            <>
              <strong className="block font-display text-[19px] leading-[1.25]">
                {record.evidence.metrics.stories.toLocaleString()} workplace
                stories · {record.salary.roles.length.toLocaleString()} salary
                roles
              </strong>
              <p className="mt-2.75 text-xs leading-[1.55] text-muted">
                Snapshot {record.evidence.snapshotDate} ·{" "}
                {official.length
                  ? official.join(", ")
                  : "no confirmed official destination in this snapshot"}
              </p>
            </>
          );
        }}
      </DetailsCategory>

      <footer className="flex flex-wrap justify-between gap-x-5 gap-y-2.5 bg-ink px-7.5 py-3.75 text-[11px] text-white/70 max-sm:grid max-sm:px-5.75">
        <span>Snapshot {snapshot}</span>
        <strong className="text-white">
          No winner is calculated. Verify role-specific conditions directly.
        </strong>
      </footer>
    </section>
  );
}

export function CompanyCompare() {
  const [firstQuery, setFirstQuery] = useState("");
  const [secondQuery, setSecondQuery] = useState("");
  const [first, setFirst] = useState<CompanySuggestion | null>(null);
  const [second, setSecond] = useState<CompanySuggestion | null>(null);
  const [role, setRole] = useState("");
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [roleState, setRoleState] = useState<
    "idle" | "loading" | "ready" | "empty" | "error"
  >("idle");
  const [recent, setRecent] = useState<CompanySuggestion[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(RECENT_COMPANIES_KEY) ?? "[]";
      return JSON.parse(stored) as CompanySuggestion[];
    } catch {
      return [];
    }
  });
  const [comparison, setComparison] = useState<{
    first: CompanyComparisonEvidence;
    second: CompanyComparisonEvidence;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const duplicate = Boolean(first && second && first.slug === second.slug);
  const ready = Boolean(first && second && !duplicate);
  const canBuild =
    ready &&
    ((roleState === "ready" && Boolean(role)) || roleState === "empty");
  const selectedCount = Number(Boolean(first)) + Number(Boolean(second));
  const selectedRoleLabel =
    roleOptions.find((option) => option.value === role)?.role ?? "";
  const sharedRoleOptions = roleOptions.filter(
    (option) => option.availability === "both",
  );
  const singleCompanyRoleOptions = roleOptions.filter(
    (option) => option.availability !== "both",
  );
  const rolePlaceholder = !ready
    ? "Select two companies first"
    : roleState === "loading"
      ? "Loading submitted roles…"
      : roleState === "error"
        ? "Salary roles unavailable"
        : roleState === "empty"
          ? "No submitted salary roles"
          : "Choose a submitted salary role";

  useEffect(() => {
    if (!first || !second || first.slug === second.slug) return;

    const controller = new AbortController();
    Promise.all([
      loadSalaryEvidence(first, controller.signal),
      loadSalaryEvidence(second, controller.signal),
    ])
      .then(([firstSalary, secondSalary]) => {
        const options = roleOptionsFor(
          firstSalary,
          secondSalary,
          first.name,
          second.name,
        );
        setRoleOptions(options);
        setRole((current) =>
          options.some((option) => option.value === current) ? current : "",
        );
        setRoleState(options.length ? "ready" : "empty");
      })
      .catch((caught) => {
        if ((caught as Error).name === "AbortError") return;
        setRole("");
        setRoleOptions([]);
        setRoleState("error");
      });

    return () => controller.abort();
  }, [first, second]);

  const message = useMemo(() => {
    if (duplicate) return "Choose a different second company.";
    if (ready) {
      if (roleState === "loading") {
        return "Loading submitted salary roles for both companies.";
      }
      if (roleState === "error") {
        return "The submitted salary roles could not be loaded. Try selecting the companies again.";
      }
      if (roleState === "empty") {
        return "Ready. Neither company has a submitted salary role; the other evidence can still be compared.";
      }
      return comparison
        ? "Comparison built. Missing evidence remains visible."
        : "Ready. Shared salary roles appear first; one-company roles keep their evidence gap visible.";
    }
    return "Choose two different companies from the suggestions.";
  }, [comparison, duplicate, ready, roleState]);

  function selectFirst(company: CompanySuggestion) {
    setRole("");
    setRoleOptions([]);
    setRoleState(
      second && second.slug !== company.slug ? "loading" : "idle",
    );
    setFirst(company);
    setFirstQuery(company.name);
    rememberCompany(company, recent, setRecent);
    setComparison(null);
    setError("");
  }

  function selectSecond(company: CompanySuggestion) {
    setRole("");
    setRoleOptions([]);
    setRoleState(
      first && first.slug !== company.slug ? "loading" : "idle",
    );
    setSecond(company);
    setSecondQuery(company.name);
    rememberCompany(company, recent, setRecent);
    setComparison(null);
    setError("");
  }

  function chooseRecent(company: CompanySuggestion) {
    if (!first || first.slug === company.slug) {
      selectFirst(company);
    } else {
      selectSecond(company);
    }
  }

  function swapCompanies() {
    const oldFirst = first;
    const oldFirstQuery = firstQuery;
    setFirst(second);
    setFirstQuery(secondQuery);
    setSecond(oldFirst);
    setSecondQuery(oldFirstQuery);
    if (oldFirst && second && oldFirst.slug !== second.slug) {
      setRoleState("loading");
    }
    if (comparison) {
      setComparison({
        first: comparison.second,
        second: comparison.first,
      });
    }
    setError("");
  }

  async function buildComparison(event: FormEvent) {
    event.preventDefault();
    if (!first || !second || first.slug === second.slug) return;
    setLoading(true);
    setError("");
    try {
      const [firstEvidence, secondEvidence] = await Promise.all([
        loadCompanyEvidence(first),
        loadCompanyEvidence(second),
      ]);
      setComparison({ first: firstEvidence, second: secondEvidence });
      const url = new URL(window.location.href);
      url.searchParams.set("a", first.slug);
      url.searchParams.set("b", second.slug);
      if (role) url.searchParams.set("role", role);
      else url.searchParams.delete("role");
      window.history.replaceState({}, "", url);
    } catch (caught) {
      setComparison(null);
      setError(
        caught instanceof Error
          ? caught.message
          : "The comparison evidence could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        className="overflow-visible rounded-[14px] border border-line-strong bg-white shadow-[0_16px_46px_rgb(22_56_61_/_8%)]"
        onSubmit={buildComparison}
      >
        <header className="flex items-end justify-between gap-5.5 border-b border-line px-6 py-5.5 max-sm:grid max-sm:px-4.5 max-sm:py-5">
          <div>
            <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">
              Build a fair comparison
            </p>
            <h2 className="mt-1.5 font-display text-[29px] leading-tight font-bold tracking-[-.025em] max-sm:text-[25px]">
              Choose two confirmed companies.
            </h2>
          </div>
          <span className="text-xs text-muted">
            Same categories · missing evidence stays visible
          </span>
        </header>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-4 px-6 py-6 max-sm:grid-cols-1 max-sm:px-4.5">
          <CompanyPicker
            side="first"
            query={firstQuery}
            selected={first}
            onQueryChange={(value) => {
              setFirstQuery(value);
              if (value !== first?.name) {
                setRole("");
                setRoleOptions([]);
                setRoleState("idle");
                setFirst(null);
                setComparison(null);
              }
            }}
            onSelect={selectFirst}
          />
          <button
            className="grid size-13.5 place-items-center rounded-full border border-line-strong bg-white text-jade-dark transition-colors hover:border-jade hover:bg-jade-soft focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-jade/30 max-sm:mx-auto max-sm:size-auto max-sm:grid-cols-[auto_auto] max-sm:gap-2 max-sm:rounded-lg max-sm:px-3 max-sm:py-2"
            type="button"
            aria-label="Swap selected companies"
            onClick={swapCompanies}
          >
            <Repeat2 className="size-5" aria-hidden />
            <small className="hidden font-bold max-sm:block">Swap</small>
          </button>
          <CompanyPicker
            side="second"
            query={secondQuery}
            selected={second}
            onQueryChange={(value) => {
              setSecondQuery(value);
              if (value !== second?.name) {
                setRole("");
                setRoleOptions([]);
                setRoleState("idle");
                setSecond(null);
                setComparison(null);
              }
            }}
            onSelect={selectSecond}
          />
        </div>

        <div className="grid grid-cols-[minmax(220px,290px)_1fr_auto] items-end gap-5.5 border-t border-line bg-[#fbfdfc] px-6 py-5 max-md:grid-cols-2 max-sm:grid-cols-1 max-sm:px-4.5">
          <div className="grid gap-1.75 text-xs font-extrabold">
            <span id="comparison-role-label">Salary role to compare</span>
            <Select
              disabled={
                !ready ||
                roleState === "loading" ||
                roleState === "error" ||
                roleState === "empty"
              }
              value={role || undefined}
              onValueChange={(value) => {
                setRole(value);
                setComparison(null);
              }}
            >
              <SelectTrigger aria-labelledby="comparison-role-label">
                <SelectValue placeholder={rolePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {sharedRoleOptions.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Submitted for both companies</SelectLabel>
                    {sharedRoleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {sharedRoleOptions.length > 0 &&
                  singleCompanyRoleOptions.length > 0 && <SelectSeparator />}
                {singleCompanyRoleOptions.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Submitted for one company</SelectLabel>
                    {singleCompanyRoleOptions.map((option) => (
                      <SelectItem
                        key={`${option.availability}-${option.value}`}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
            <small className="font-normal leading-[1.45] text-muted">
              {roleState === "ready"
                ? roleOptions.some((option) => option.availability === "both")
                  ? "Shared roles are listed first. “Only” means the other company has no matched submission."
                  : "No shared role was found. Each option names the company with submitted evidence."
                : "Roles come from community-submitted salary records, not a generic list."}
            </small>
          </div>

          <div className="flex flex-wrap items-center gap-1.75 pb-0.5">
            <span className="w-full text-[10px] text-muted">
              Recently viewed
            </span>
            {recent.length ? (
              recent.slice(0, 3).map((company) => (
                <button
                  className="rounded-full bg-mist px-2.25 py-1.5 text-[10px] font-bold text-ink-soft hover:bg-jade-soft hover:text-jade-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-jade/30"
                  type="button"
                  key={company.slug}
                  onClick={() => chooseRecent(company)}
                >
                  {company.name}
                </button>
              ))
            ) : (
              <span className="text-[10px] text-muted">
                Your selected companies will appear here.
              </span>
            )}
          </div>

          <Button
            className="max-md:col-start-2 max-sm:col-auto max-sm:w-full"
            type="submit"
            disabled={!canBuild || loading}
          >
            {loading ? "Building comparison…" : "Build comparison"}
            {!loading && <ArrowRight aria-hidden />}
          </Button>
        </div>

        <p
          className="px-6 pb-4.5 text-[11px] text-muted max-sm:px-4.5"
          aria-live="polite"
        >
          {error ? (
            <span className="font-bold text-coral">{error}</span>
          ) : (
            message
          )}
        </p>
      </form>

      {comparison ? (
        <ComparisonBrief
          first={comparison.first}
          second={comparison.second}
          role={role}
          roleLabel={selectedRoleLabel}
        />
      ) : (
        <EmptyComparison
          duplicate={duplicate}
          loading={loading}
          selectedCount={selectedCount}
        />
      )}
    </>
  );
}
