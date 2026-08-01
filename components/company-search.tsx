"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  CompanyAutocomplete,
  type CompanySuggestion,
} from "@/components/company-autocomplete";
import { Button } from "@/components/ui/button";
import type { EvidenceCoverageFilter } from "@/lib/contracts";

const coverageOptions: Array<{
  value: Exclude<EvidenceCoverageFilter, "deshimula">;
  label: string;
}> = [
  { value: "all", label: "All evidence" },
  { value: "both", label: "Both sources" },
  { value: "deshimula_only", label: "Deshi only" },
  { value: "betonkemon_only", label: "Beton only" },
  { value: "review", label: "Needs review" },
];

export function CompanySearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CompanySuggestion | null>(null);
  const [coverage, setCoverage] = useState<EvidenceCoverageFilter>("all");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (selected) router.push(selected.href ?? `/company/${selected.slug}`);
    else {
      router.push(
        `/companies?q=${encodeURIComponent(query.trim())}&coverage=${coverage}`,
      );
    }
  }

  return (
    <form
      className="relative mt-8.5 rounded-[14px] border border-line-strong bg-white px-6 py-5.5 shadow-[0_18px_48px_rgb(22_56_61_/_8%)] max-sm:mt-6 max-sm:p-4.25"
      id="research"
      onSubmit={submit}
    >
      <label className="mb-2.25 block text-xs font-extrabold" htmlFor="company">
        Which company are you considering?
      </label>
      <div className="mb-3 flex flex-wrap gap-1.5" aria-label="Evidence coverage">
        {coverageOptions.map((option) => (
          <button
            className={`rounded-full border px-2.5 py-1.5 font-mono text-[8px] font-extrabold tracking-[.04em] uppercase transition-colors ${
              coverage === option.value
                ? "border-ink bg-ink text-white"
                : "border-line-strong bg-white text-muted hover:border-jade hover:text-jade-dark"
            }`}
            key={option.value}
            type="button"
            aria-pressed={coverage === option.value}
            onClick={() => {
              setCoverage(option.value);
              setSelected(null);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 max-sm:grid-cols-1">
        <CompanyAutocomplete
          className="[&>div:first-child]:min-h-13 [&_input]:min-h-12.5 [&_input]:text-sm"
          committedValue={selected?.name}
          id="company"
          value={query}
          showSearchIcon
          coverage={coverage}
          onValueChange={(value) => {
            setQuery(value);
            if (value !== selected?.name) setSelected(null);
          }}
          onSelect={setSelected}
        />
        <Button className="min-h-13 px-5.5" type="submit">
          Build my brief <span aria-hidden>→</span>
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <p>Public research · no sign-in · sources and uncertainty shown</p>
        <Link className="font-extrabold text-jade-dark underline underline-offset-3" href="/companies">
          Browse the evidence directory →
        </Link>
      </div>
    </form>
  );
}
