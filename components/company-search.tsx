"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  CompanyAutocomplete,
  type CompanySuggestion,
} from "@/components/company-autocomplete";
import { Button } from "@/components/ui/button";

export function CompanySearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CompanySuggestion | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (selected) router.push(`/company/${selected.slug}`);
    else router.push(`/company-match?q=${encodeURIComponent(query.trim())}`);
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
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 max-sm:grid-cols-1">
        <CompanyAutocomplete
          className="[&>div:first-child]:min-h-13 [&_input]:min-h-12.5 [&_input]:text-sm"
          committedValue={selected?.name}
          id="company"
          value={query}
          showSearchIcon
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
      <p className="mt-3 text-xs text-muted">
        Public research · no sign-in · sources and uncertainty shown
      </p>
    </form>
  );
}
