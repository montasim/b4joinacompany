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
    <form className="mt-7 max-w-155 rounded-xl border border-line-strong bg-white p-4.5 shadow-lg" id="research" onSubmit={submit}>
      <label className="mb-2 block text-[11px] font-extrabold" htmlFor="company">Which company are you considering?</label>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 max-sm:grid-cols-1">
        <CompanyAutocomplete
          id="company"
          value={query}
          showSearchIcon
          onValueChange={(value) => {
            setQuery(value);
            if (value !== selected?.name) setSelected(null);
          }}
          onSelect={setSelected}
        />
        <Button type="submit">Build my checkpoint <span aria-hidden>→</span></Button>
      </div>
      <p className="mt-3 flex items-center gap-2 text-[10px] text-muted"><i className="size-1.75 rounded-full bg-jade ring-4 ring-jade-soft" />Try a name, alias, website, or LinkedIn address</p>
    </form>
  );
}
