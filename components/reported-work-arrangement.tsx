import { AlertTriangle, CalendarClock, ExternalLink, Laptop, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  CompanyWorkArrangement,
  WorkArrangementRange,
} from "@/lib/contracts";

function rangeLabel(range: WorkArrangementRange, unit: string) {
  const value =
    range.minimum === range.maximum
      ? `${range.minimum}`
      : `${range.minimum}–${range.maximum}`;
  return `${value} ${unit}`;
}

function modeLabel(mode: CompanyWorkArrangement["workArrangement"]["reportedMode"]) {
  if (mode === "unknown") return "No explicit work-mode evidence";
  if (mode === "mixed") return "Conflicting work-mode reports";
  return `Reported ${mode}`;
}

export function ReportedWorkArrangement({
  record,
}: {
  record: CompanyWorkArrangement;
}) {
  const { workArrangement, reportedSchedule } = record;
  const hasSchedule =
    reportedSchedule.evidenceSourceCount > 0 ||
    reportedSchedule.dailyHours.length > 0 ||
    reportedSchedule.timeRanges.length > 0 ||
    reportedSchedule.workdaysPerWeek.length > 0;
  const hasEvidence =
    workArrangement.evidenceSourceCount > 0 || hasSchedule;

  return (
    <section className="mt-12 rounded-xl border border-line-strong bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="mb-3 font-mono text-[10px] font-extrabold tracking-wider text-jade uppercase">
            Unverified derived evidence
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Reported work setup and schedule
          </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">
            Mentions are extracted from workplace stories and comments. They
            describe personal accounts, not a current company policy.
          </p>
        </div>
        <Badge tone={workArrangement.reportedMode === "unknown" ? "amber" : undefined}>
          {modeLabel(workArrangement.reportedMode)}
        </Badge>
      </div>

      {hasEvidence ? (
        <>
          <div className="mt-6 grid grid-cols-3 gap-3 max-md:grid-cols-1">
            <article className="rounded-lg bg-jade-soft p-4">
              <Laptop className="mb-3 size-5 text-jade-dark" />
              <span className="block text-[9px] font-extrabold tracking-wide text-muted uppercase">
                Work arrangement
              </span>
              <strong className="mt-1 block text-sm capitalize">
                {workArrangement.reportedMode}
              </strong>
              <small className="mt-1 block text-[9px] text-muted">
                {workArrangement.confidence} extraction confidence ·{" "}
                {workArrangement.evidenceSourceCount} source
                {workArrangement.evidenceSourceCount === 1 ? "" : "s"}
              </small>
            </article>
            <article className="rounded-lg bg-blue-soft p-4">
              <Timer className="mb-3 size-5 text-blue" />
              <span className="block text-[9px] font-extrabold tracking-wide text-muted uppercase">
                Reported schedule
              </span>
              <strong className="mt-1 block text-sm">
                {reportedSchedule.dailyHours.length
                  ? reportedSchedule.dailyHours
                      .map((range) => rangeLabel(range, "hours/day"))
                      .join(", ")
                  : "No daily hours extracted"}
              </strong>
              <small className="mt-1 block text-[9px] text-muted">
                {reportedSchedule.confidence} extraction confidence
              </small>
            </article>
            <article className="rounded-lg bg-amber-soft p-4">
              <CalendarClock className="mb-3 size-5 text-amber-dark" />
              <span className="block text-[9px] font-extrabold tracking-wide text-muted uppercase">
                Other reported signals
              </span>
              <strong className="mt-1 block text-sm">
                {[
                  reportedSchedule.flexibleEvidenceCount
                    ? `${reportedSchedule.flexibleEvidenceCount} flexible`
                    : "",
                  reportedSchedule.overtimeEvidenceCount
                    ? `${reportedSchedule.overtimeEvidenceCount} overtime`
                    : "",
                  reportedSchedule.afterHoursEvidenceCount
                    ? `${reportedSchedule.afterHoursEvidenceCount} after-hours`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" · ") || "No additional schedule signals"}
              </strong>
              <small className="mt-1 block text-[9px] text-muted">
                Counts are evidence mentions, not frequency of company practice
              </small>
            </article>
          </div>

          {(reportedSchedule.timeRanges.length > 0 ||
            reportedSchedule.workdaysPerWeek.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {reportedSchedule.timeRanges.map((range) => (
                <Badge key={`${range.start}-${range.end}`}>
                  Reported time {range.start}–{range.end}
                </Badge>
              ))}
              {reportedSchedule.workdaysPerWeek.map((range) => (
                <Badge key={`${range.minimum}-${range.maximum}`} tone="amber">
                  {rangeLabel(range, "days/week")}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-6 grid gap-3">
            {record.evidenceMentions.slice(0, 4).map((mention) => (
              <a
                className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-line p-4 no-underline transition-colors hover:border-jade"
                href={mention.sourceUrl}
                key={`${mention.sourceKind}-${mention.sourceId}-${mention.excerpt}`}
                rel="noreferrer"
                target="_blank"
              >
                <span>
                  <small className="font-mono text-[8px] font-extrabold tracking-wide text-jade uppercase">
                    Unverified {mention.sourceKind} · {mention.role || "Anonymous"} ·{" "}
                    {mention.publishedAtLabel || "Date unavailable"}
                  </small>
                  <span className="mt-2 block text-[10px] leading-relaxed text-ink-soft">
                    “{mention.excerpt}”
                  </span>
                </span>
                <ExternalLink className="size-4 text-jade-dark" />
              </a>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-line-strong bg-surface p-5">
          <strong className="text-xs">No explicit work setup found</strong>
          <p className="mt-1 text-[10px] leading-relaxed text-muted">
            The available stories and comments did not state remote, onsite,
            hybrid, or schedule details clearly enough to extract. Unknown does
            not mean onsite.
          </p>
        </div>
      )}

      <div className="mt-5 flex gap-3 rounded-lg bg-coral-soft p-4 text-coral">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <p className="text-[10px] leading-relaxed">
          <strong>Not verified:</strong> {record.disclaimer}
          {workArrangement.hasConflictingReports
            ? " The available accounts also conflict."
            : ""}
        </p>
      </div>
    </section>
  );
}
