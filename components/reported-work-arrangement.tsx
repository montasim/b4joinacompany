import { ChevronDown } from "lucide-react";

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

function modeHeadline(record: CompanyWorkArrangement) {
  const { reportedMode, evidenceSourceCount } = record.workArrangement;
  if (reportedMode === "unknown") {
    return "No explicit work-mode evidence was extracted.";
  }
  if (reportedMode === "mixed") {
    return `${evidenceSourceCount} sources mention more than one work arrangement.`;
  }
  return `${evidenceSourceCount} ${
    evidenceSourceCount === 1 ? "source mentions" : "sources mention"
  } ${reportedMode}.`;
}

function evidencePeriod(record: CompanyWorkArrangement) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const format = (value: string | null) => {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isNaN(date.valueOf()) ? value : formatter.format(date);
  };
  const start = format(record.evidencePeriod.start);
  const end = format(record.evidencePeriod.end);
  if (start && end) return start === end ? start : `${start}–${end}`;
  return start ?? end ?? "Date range unavailable";
}

export function ReportedWorkArrangement({
  record,
}: {
  record: CompanyWorkArrangement;
}) {
  const { workArrangement, reportedSchedule } = record;
  const modeCounts = [
    ["Hybrid", workArrangement.modeEvidenceCounts.hybrid],
    ["Remote", workArrangement.modeEvidenceCounts.remote],
    ["Onsite", workArrangement.modeEvidenceCounts.onsite],
  ] as const;
  const scheduleCounts = [
    ["Overtime", reportedSchedule.overtimeEvidenceCount],
    ["Flexible hours", reportedSchedule.flexibleEvidenceCount],
    ["After-hours", reportedSchedule.afterHoursEvidenceCount],
  ] as const;
  const scheduleMaximum = Math.max(
    1,
    ...scheduleCounts.map(([, count]) => count),
  );
  const hasEvidence =
    workArrangement.evidenceSourceCount > 0 ||
    reportedSchedule.evidenceSourceCount > 0;

  return (
    <details
      className="group mt-4.5 scroll-mt-35 overflow-hidden rounded-xl border border-line-strong bg-white"
      id="work-setup"
    >
      <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-5 p-6 marker:hidden max-sm:grid-cols-1 max-sm:p-5 [&::-webkit-details-marker]:hidden">
        <div>
          <Badge tone="blue">Inferred from stories — not verified</Badge>
          <h2 className="mt-2 font-display text-[32px] leading-tight font-bold tracking-[-.03em]">
            Work setup
          </h2>
          <p className="mt-2 max-w-175 text-sm leading-relaxed text-muted">
            <strong className="text-ink">{modeHeadline(record)}</strong>{" "}
            {hasEvidence
              ? "These mentions are not enough to establish a reliable current policy."
              : "The current extraction did not find a reliable setup or schedule pattern."}
          </p>
        </div>
        <div className="flex items-center gap-3 max-sm:justify-between">
          <Badge tone="amber">
            {workArrangement.evidenceSourceCount} work-mode ·{" "}
            {reportedSchedule.evidenceSourceCount} schedule sources
          </Badge>
          <ChevronDown className="size-4 text-jade-dark transition-transform group-open:rotate-180" />
        </div>
      </summary>

      <div className="border-t border-line px-6 pb-6 max-sm:px-5 max-sm:pb-5">
        {hasEvidence ? (
          <>
            <div className="grid grid-cols-2 gap-7.5 border-t border-line pt-5 max-md:grid-cols-1">
              <section>
                <h3 className="mb-4 font-display text-[21px] font-bold">
                  Work-mode mentions
                </h3>
                <div className="grid gap-3">
                  {modeCounts.map(([label, count]) => (
                    <div
                      className="grid grid-cols-[80px_1fr_100px] items-center gap-3 max-sm:grid-cols-[70px_1fr_auto] max-sm:gap-2"
                      key={label}
                    >
                      <span className="text-[13px] font-bold">{label}</span>
                      <span
                        aria-hidden="true"
                        className="flex min-h-3 items-center gap-1"
                      >
                        {count ? (
                          Array.from({ length: Math.min(count, 12) }).map(
                            (_, index) => (
                              <i
                                className="size-2.5 shrink-0 rounded-full bg-blue"
                                key={index}
                              />
                            ),
                          )
                        ) : (
                          <span className="text-quiet">—</span>
                        )}
                      </span>
                      <strong className="text-right text-[11px] text-muted">
                        {count
                          ? `${count} ${count === 1 ? "source" : "sources"}`
                          : "No explicit source"}
                      </strong>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="mb-4 font-display text-[21px] font-bold">
                  Schedule-related mentions
                </h3>
                <div className="grid gap-3">
                  {scheduleCounts.map(([label, count]) => (
                    <div
                      className="grid grid-cols-[100px_1fr_28px] items-center gap-3 max-sm:grid-cols-[88px_1fr_24px] max-sm:gap-2"
                      key={label}
                    >
                      <span className="text-[13px] font-bold">{label}</span>
                      <span
                        aria-hidden="true"
                        className="h-2.25 overflow-hidden rounded-full bg-coral-soft"
                      >
                        <i
                          className="block h-full rounded-full bg-coral"
                          style={{
                            width: `${(count / scheduleMaximum) * 100}%`,
                          }}
                        />
                      </span>
                      <strong className="text-right text-[11px] text-muted">
                        {count}
                      </strong>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {(reportedSchedule.dailyHours.length > 0 ||
              reportedSchedule.timeRanges.length > 0 ||
              reportedSchedule.workdaysPerWeek.length > 0) && (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
                {reportedSchedule.dailyHours.map((range) => (
                  <Badge key={`hours-${range.minimum}-${range.maximum}`}>
                    {rangeLabel(range, "reported hours/day")}
                  </Badge>
                ))}
                {reportedSchedule.timeRanges.map((range) => (
                  <Badge key={`time-${range.start}-${range.end}`} tone="blue">
                    Reported time {range.start}–{range.end}
                  </Badge>
                ))}
                {reportedSchedule.workdaysPerWeek.map((range) => (
                  <Badge
                    key={`days-${range.minimum}-${range.maximum}`}
                    tone="amber"
                  >
                    {rangeLabel(range, "reported days/week")}
                  </Badge>
                ))}
              </div>
            )}

            <p className="mt-4 rounded-lg bg-blue-soft p-3.5 text-[13px] leading-relaxed text-ink-soft">
              <strong>Coverage:</strong> Work-mode counts use{" "}
              {workArrangement.evidenceSourceCount} distinct{" "}
              {workArrangement.evidenceSourceCount === 1 ? "source" : "sources"};
              schedule counts use {reportedSchedule.evidenceSourceCount}. The
              categories can overlap.
            </p>
          </>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-line-strong bg-mist p-5">
            <strong className="text-xs">No explicit work setup found</strong>
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              The available stories and comments did not state remote, onsite,
              hybrid, or schedule details clearly enough to extract. Unknown
              does not mean onsite.
            </p>
          </div>
        )}

        <p className="mt-4 rounded-lg bg-coral-soft p-3.5 text-[13px] leading-relaxed text-coral">
          <strong>Not verified company policy.</strong> {record.disclaimer} The
          evidence period is {evidencePeriod(record)}. Confirm the current
          arrangement and schedule directly.
          {workArrangement.hasConflictingReports
            ? " The available accounts also conflict."
            : ""}
        </p>
      </div>
    </details>
  );
}
