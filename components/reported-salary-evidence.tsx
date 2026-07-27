"use client";

import { ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CompanySalaryEvidence } from "@/lib/contracts";

const salaryPreviewCount = 7;

function compactBdt(value: number) {
  if (value < 1_000) return `৳${value.toLocaleString("en-BD")}`;
  const amount = value / 1_000;
  return `৳${Number.isInteger(amount) ? amount : amount.toFixed(1)}k`;
}

function shortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function ReportedSalaryEvidence({
  records,
  selectedRole,
}: {
  records: CompanySalaryEvidence[];
  selectedRole?: string;
}) {
  const [salariesExpanded, setSalariesExpanded] = useState(false);

  if (records.length === 0) return null;

  const source = records[0];
  const selectedSalary =
    records.find((record) => record.role === selectedRole) ?? records[0];
  const previewRecords = records.slice(0, salaryPreviewCount);
  if (
    selectedSalary &&
    !previewRecords.some((record) => record.id === selectedSalary.id)
  ) {
    previewRecords[salaryPreviewCount - 1] = selectedSalary;
  }
  const visibleRecords = salariesExpanded ? records : previewRecords;
  const hiddenSalaryCount = Math.max(0, records.length - previewRecords.length);
  const contributors = records.reduce(
    (total, record) => total + (record.sampleSize ?? 0),
    0,
  );
  const maximum = Math.max(
    1,
    ...records.map((record) => record.salaryRange.maximumBdt),
  );

  return (
    <details
      className="group mt-4.5 scroll-mt-35 overflow-hidden rounded-xl border border-line-strong bg-white"
      id="salary"
      open
    >
      <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-5 p-6 marker:hidden max-sm:grid-cols-1 max-sm:p-5 [&::-webkit-details-marker]:hidden">
        <div>
          <Badge tone="amber">Community submitted — not company verified</Badge>
          <h2 className="mt-2 font-display text-[32px] leading-tight font-bold tracking-[-.03em]">
            Submitted BDT amounts by role
          </h2>
          <p className="mt-2 max-w-175 text-sm leading-relaxed text-muted">
            Ranges provide negotiation context. The source does not supply a
            pay period, so confirm whether amounts are monthly and what the
            package includes.
          </p>
        </div>
        <div className="flex items-center gap-3 max-sm:justify-between">
          <Badge tone="amber">
            {records.length} {records.length === 1 ? "role" : "roles"}
          </Badge>
          <ChevronDown className="size-4 text-amber-dark transition-transform group-open:rotate-180" />
        </div>
      </summary>

      <div className="border-t border-line px-6 pb-6 max-sm:px-5 max-sm:pb-5">
        <p className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-amber-soft p-3.5 text-[13px]">
          <span>
            Selected role:{" "}
            <strong>{selectedRole || records[0]?.role || "Not selected"}</strong>
          </span>
          <a
            className="text-xs font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3"
            href="#brief-title"
          >
            Change role above ↑
          </a>
        </p>

        <figure className="mt-4.5">
          <figcaption className="sr-only">
            Community-submitted BDT amount ranges and sample sizes by role. Pay
            period is not supplied.
          </figcaption>
          <div className="grid gap-0" id="salary-role-list">
            {visibleRecords.map((record) => {
              const selected =
                record.role === (selectedRole || records[0]?.role);
              const left =
                (record.salaryRange.minimumBdt / maximum) * 100;
              const width =
                ((record.salaryRange.maximumBdt -
                  record.salaryRange.minimumBdt) /
                  maximum) *
                100;
              return (
                <article
                  className={`grid grid-cols-[210px_1fr_130px] items-center gap-5 border-t border-line px-2.5 py-4 max-sm:grid-cols-[1fr_auto] max-sm:gap-2 ${
                    selected ? "rounded-lg bg-amber-soft" : ""
                  }`}
                  key={record.id}
                >
                  <div>
                    <strong className="block text-[13px]">{record.role}</strong>
                    <small className="mt-1 block text-[11px] text-muted">
                      {record.sampleSize
                        ? `${record.sampleSize.toLocaleString()} submitted records`
                        : "Sample size unavailable"}
                      {record.sampleSize !== null && record.sampleSize < 5
                        ? " · limited"
                        : ""}
                    </small>
                  </div>
                  <div
                    aria-hidden="true"
                    className="relative h-4 max-sm:col-span-2 max-sm:row-start-2"
                  >
                    <span className="absolute top-1.75 right-0 left-0 h-0.5 bg-line" />
                    <span
                      className="absolute top-1 z-10 h-2 rounded-full bg-amber"
                      style={{
                        left: `${left}%`,
                        width: `${Math.max(2, width)}%`,
                      }}
                    >
                      <i className="absolute top-[-4px] bottom-[-4px] left-0 w-0.5 bg-amber-dark" />
                      <i className="absolute top-[-4px] right-0 bottom-[-4px] w-0.5 bg-amber-dark" />
                    </span>
                  </div>
                  <b className="text-right font-display text-sm">
                    {compactBdt(record.salaryRange.minimumBdt)}–
                    {compactBdt(record.salaryRange.maximumBdt)}
                  </b>
                </article>
              );
            })}
          </div>
          {hiddenSalaryCount > 0 && (
            <div className="flex justify-center border-t border-line pt-5">
              <Button
                aria-controls="salary-role-list"
                aria-expanded={salariesExpanded}
                onClick={() => setSalariesExpanded((expanded) => !expanded)}
                type="button"
                variant="outline"
              >
                {salariesExpanded
                  ? "Show fewer salary roles"
                  : `See ${hiddenSalaryCount} more salary ${
                      hiddenSalaryCount === 1 ? "role" : "roles"
                    }`}
                <ChevronDown
                  aria-hidden="true"
                  className={`size-3.5 transition-transform ${
                    salariesExpanded ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          )}
        </figure>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] leading-relaxed text-muted">
          <p>
            Captured {shortDate(source.capturedAt)} · Source: Beton Kemon ·{" "}
            {contributors
              ? `${contributors.toLocaleString()} submitted records`
              : "Contributor count unavailable"}{" "}
            · Company match: {source.companyMatch.method.replaceAll("_", " ")}
          </p>
          <a
            className="inline-flex items-center gap-1 font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3"
            href={source.sourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Review source <ExternalLink className="size-3.5" />
          </a>
        </div>
        <p className="mt-4 rounded-lg bg-coral-soft p-3.5 text-[13px] leading-relaxed text-coral">
          <strong>Use as a conversation starter.</strong>{" "}
          Community-submitted estimates are not independently confirmed by the
          company. Confirm the pay period, benefits, current range, and review
          cycle in writing.
        </p>
      </div>
    </details>
  );
}
