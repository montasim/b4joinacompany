"use client";

import Link from "next/link";
import { useState } from "react";

import {
  CompanyAutocomplete,
  type CompanySuggestion,
} from "@/components/company-autocomplete";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils";

function questionRows(company: CompanySuggestion) {
  return [
    {
      label: "Performance process",
      status: "Answer needed",
      detail: `Open ${company.name}’s checkpoint and verify how goals, reviews, and performance plans are documented.`,
      tone: "unresolved",
    },
    {
      label: "Manager and team",
      status: "Answer needed",
      detail: "Confirm the reporting line, immediate team, and feedback cadence for your role.",
      tone: "unresolved",
    },
    {
      label: "Salary and overtime",
      status: "Answer needed",
      detail: "Confirm the complete range, benefits, and overtime policy in writing.",
      tone: "unresolved",
    },
    {
      label: "Positive evidence",
      status: `${company.positiveCount.toLocaleString()} positive stories`,
      detail: `${company.negativeCount.toLocaleString()} negative and ${company.mixedCount.toLocaleString()} mixed stories are also available for context.`,
      tone: "resolved",
    },
  ];
}

export function CompanyCompare() {
  const [firstQuery, setFirstQuery] = useState("");
  const [secondQuery, setSecondQuery] = useState("");
  const [first, setFirst] = useState<CompanySuggestion | null>(null);
  const [second, setSecond] = useState<CompanySuggestion | null>(null);

  const ready = Boolean(first && second && first.slug !== second.slug);
  const duplicate = Boolean(first && second && first.slug === second.slug);
  const selectedCount = Number(Boolean(first)) + Number(Boolean(second));
  const firstRows = first ? questionRows(first) : [];
  const secondRows = second ? questionRows(second) : [];

  return (
    <>
      <section className="my-7 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-3 rounded-xl border border-line bg-white p-5 max-sm:grid-cols-1" aria-label="Choose companies to compare">
        <label className="grid gap-2 text-[10px] font-extrabold">
          First company
          <CompanyAutocomplete
            id="first-company"
            value={firstQuery}
            onValueChange={(value) => {
              setFirstQuery(value);
              if (value !== first?.name) setFirst(null);
            }}
            onSelect={setFirst}
          />
        </label>
        <span className="pb-3 font-mono text-[9px] font-bold tracking-widest text-muted max-sm:p-0 max-sm:text-center">AND</span>
        <label className="grid gap-2 text-[10px] font-extrabold">
          Second company
          <CompanyAutocomplete
            id="second-company"
            value={secondQuery}
            onValueChange={(value) => {
              setSecondQuery(value);
              if (value !== second?.name) setSecond(null);
            }}
            onSelect={setSecond}
          />
        </label>
      </section>

      {!ready && (
        <section className="grid min-h-55 place-items-center content-center rounded-xl border border-dashed border-line-strong bg-white/45 p-8 text-center" aria-live="polite">
          <span className="mb-4 grid size-10.5 place-items-center rounded-full bg-jade-soft font-mono text-lg font-extrabold text-jade-dark" aria-hidden>↔</span>
          <p className="mb-2 font-mono text-[10px] font-extrabold tracking-wider text-jade uppercase">Comparison preview</p>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {duplicate
              ? "Choose a different second company."
              : selectedCount === 1
                ? "Choose one more company."
                : "Choose two companies to compare."}
          </h2>
          <p className="mt-2 max-w-120 text-[11px] leading-relaxed text-muted">
            {duplicate
              ? "A comparison needs two different company records."
              : "The evidence matrix will appear here after you select both companies from the suggestions."}
          </p>
        </section>
      )}

      {ready && first && second && (
        <section className="grid gap-4">
          <div className="flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start">
            <div className="grid gap-2">
              <p className="m-0 font-mono text-[10px] font-extrabold tracking-wider text-jade uppercase">Decision checkpoint</p>
              <h2 className="font-display text-2xl font-bold tracking-tight">What each offer must clarify</h2>
              <p className="m-0 text-xs leading-relaxed text-muted">Unresolved items are prompts for your next conversation, not company ratings.</p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/saved">Save comparison</Link>
            </Button>
          </div>

          <p className="m-0 hidden text-[10px] text-muted max-sm:block">Scroll sideways to see both companies.</p>
          <div className="overflow-hidden rounded-xl border border-line bg-white max-lg:overflow-x-auto" aria-label="Company comparison">
            <div className="grid grid-cols-[160px_repeat(2,minmax(0,1fr))] bg-mist-deep max-lg:grid-cols-[130px_repeat(2,minmax(200px,1fr))] max-sm:grid-cols-[100px_repeat(2,190px)]">
              <div aria-hidden="true" />
              {[first, second].map((company, index) => (
                <div className="flex items-center gap-2.5 border-l border-line p-4 max-sm:p-3" key={company.slug}>
                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg text-[10px] font-extrabold ${index === 1 ? "bg-amber-soft text-amber-dark" : "bg-jade-soft text-jade-dark"}`}>
                    {initials(company.name)}
                  </span>
                  <div className="grid gap-1">
                    <strong className="text-xs">{company.name}</strong>
                    <span className="text-[9px] text-muted">{company.storyCount.toLocaleString()} relevant stories</span>
                  </div>
                </div>
              ))}
            </div>

            {firstRows.map((firstRow, index) => (
              <div className="grid grid-cols-[160px_repeat(2,minmax(0,1fr))] border-t border-line max-lg:grid-cols-[130px_repeat(2,minmax(200px,1fr))] max-sm:grid-cols-[100px_repeat(2,190px)]" key={firstRow.label}>
                <div className="p-4 text-[10px] font-extrabold text-muted max-sm:p-3">{firstRow.label}</div>
                {[firstRow, secondRows[index]].map((cell, cellIndex) => (
                  <div className="grid content-start gap-2 border-l border-line p-4 max-sm:p-3" key={`${firstRow.label}-${cellIndex}`}>
                    <strong className={`text-xs ${cell.tone === "resolved" ? "text-jade" : "text-coral"}`}>{cell.status}</strong>
                    <p className="m-0 text-[10px] leading-relaxed text-muted">{cell.detail}</p>
                  </div>
                ))}
              </div>
            ))}

            <div className="grid grid-cols-[160px_repeat(2,minmax(0,1fr))] border-t border-line max-lg:grid-cols-[130px_repeat(2,minmax(200px,1fr))] max-sm:grid-cols-[100px_repeat(2,190px)]">
              <div className="p-4 text-[10px] font-extrabold text-muted max-sm:p-3">Official destinations</div>
              {[first, second].map((company) => (
                <div className="flex flex-wrap gap-x-4 gap-y-2 border-l border-line p-4 text-[10px] font-extrabold text-blue [&_a]:no-underline max-sm:p-3" key={company.slug}>
                  <Link href={`/company/${company.slug}`}>Company profile</Link>
                  {company.websiteUrl && (
                    <a href={company.websiteUrl} target="_blank" rel="noreferrer">Website ↗</a>
                  )}
                  {company.linkedinUrl && (
                    <a href={company.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
