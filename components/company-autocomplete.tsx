"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Search } from "lucide-react";

import type { CompanyRecord } from "@/lib/contracts";
import { cn } from "@/lib/utils";

const RECENT_COMPANIES_KEY = "b4join:recent-companies";
const LEGACY_RECENT_COMPANIES_KEY = "beforejoin:recent-companies";

export type CompanySuggestion = Pick<
  CompanyRecord,
  | "slug"
  | "name"
  | "storyCount"
  | "positiveCount"
  | "mixedCount"
  | "negativeCount"
  | "websiteUrl"
  | "linkedinUrl"
  | "careersUrl"
  | "verificationStatus"
>;

interface CompanyAutocompleteProps {
  className?: string;
  committedValue?: string | null;
  id: string;
  leading?: ReactNode;
  value: string;
  placeholder?: string;
  showSearchIcon?: boolean;
  onValueChange: (value: string) => void;
  onSelect: (company: CompanySuggestion) => void;
}

export function CompanyAutocomplete({
  className,
  committedValue,
  id,
  leading,
  value,
  placeholder = "Search for a company name",
  showSearchIcon = false,
  onValueChange,
  onSelect,
}: CompanyAutocompleteProps) {
  const listId = useId();
  const requestRef = useRef<AbortController | null>(null);
  const selectedValueRef = useRef<string | null>(null);
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [recent, setRecent] = useState<CompanySuggestion[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored =
        window.localStorage.getItem(RECENT_COMPANIES_KEY) ??
        window.localStorage.getItem(LEGACY_RECENT_COMPANIES_KEY) ??
        "[]";
      return JSON.parse(stored) as CompanySuggestion[];
    } catch {
      return [];
    }
  });
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = value.trim();
    requestRef.current?.abort();

    if (
      committedValue === value ||
      selectedValueRef.current === value ||
      query.length < 2
    ) {
      return;
    }

    const controller = new AbortController();
    requestRef.current = controller;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/companies?q=${encodeURIComponent(query)}&limit=6`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { items?: CompanySuggestion[] };
        setSuggestions(data.items ?? []);
        setActiveIndex(-1);
        setOpen(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [committedValue, value]);

  function choose(company: CompanySuggestion) {
    const nextRecent = [company, ...recent.filter((item) => item.slug !== company.slug)].slice(0, 5);
    setRecent(nextRecent);
    window.localStorage.setItem(RECENT_COMPANIES_KEY, JSON.stringify(nextRecent));
    window.localStorage.removeItem(LEGACY_RECENT_COMPANIES_KEY);
    selectedValueRef.current = company.name;
    onValueChange(company.name);
    onSelect(company);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const items = value.trim().length >= 2 ? suggestions : recent;
    if (!open || items.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, items.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      choose(items[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const showingRecent = value.trim().length < 2;
  const visibleItems = showingRecent ? recent : suggestions;

  return (
    <div className={cn("relative min-w-0", className)}>
      <div className={cn("flex min-h-11.25 items-center rounded-lg border border-line-strong bg-white focus-within:border-jade focus-within:ring-3 focus-within:ring-jade/10", showSearchIcon && "pl-3")}>
        {leading}
        {showSearchIcon && <Search aria-hidden />}
        <input
          className="min-h-10.75 min-w-0 w-full border-0 bg-transparent px-3 text-xs font-bold text-ink outline-none placeholder:text-muted/80"
          id={id}
          type="search"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          value={value}
          placeholder={placeholder}
          required
          onChange={(event) => {
            const nextValue = event.target.value;
            selectedValueRef.current = null;
            onValueChange(nextValue);
            if (nextValue.trim().length < 2) {
              setSuggestions([]);
              setLoading(false);
              setOpen(recent.length > 0);
            } else {
              setOpen(true);
            }
          }}
          onFocus={() => (value.trim().length >= 2 || recent.length > 0) && setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {open && (value.trim().length >= 2 || recent.length > 0) && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-70 w-full overflow-hidden rounded-lg border border-line-strong bg-white shadow-xl" id={listId} role="listbox">
          {showingRecent && <p className="m-0 border-b border-line bg-mist px-3 py-2.5 font-mono text-[8px] font-bold tracking-wider text-muted uppercase">Recent searches</p>}
          {loading ? (
            <p className="m-0 px-3 py-3 text-[10px] text-muted">Finding companies…</p>
          ) : visibleItems.length > 0 ? (
            visibleItems.map((company, index) => (
              <button
                id={`${listId}-${index}`}
                className={cn("flex w-full items-center justify-between gap-4 border-0 bg-white px-3 py-3 text-left first:border-0 not-first:border-t not-first:border-line hover:bg-jade-soft", activeIndex === index && "bg-jade-soft")}
                type="button"
                role="option"
                aria-selected={activeIndex === index}
                key={company.slug}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(company)}
              >
                <span className="grid min-w-0 gap-1">
                  <strong className="truncate text-[11px]">{company.name}</strong>
                  <small className="text-[9px] text-muted">{company.storyCount.toLocaleString()} workplace stories</small>
                </span>
                <em className="shrink-0 font-mono text-[9px] font-extrabold not-italic text-jade-dark uppercase">Choose</em>
              </button>
            ))
          ) : (
            <p className="m-0 px-3 py-3 text-[10px] text-muted">No close company match found.</p>
          )}
        </div>
      )}
    </div>
  );
}
