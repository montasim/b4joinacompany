"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type LaneName = "reported" | "community" | "derived" | "destination";

interface Lane {
  id: LaneName;
  label: string;
  account: string;
  status: string;
  steps: Array<{ label: string; title: string; copy: string }>;
  footer: React.ReactNode;
  limitation: string;
}

const lanes: Lane[] = [
  {
    id: "reported",
    label: "Reported",
    account: "Reported account",
    status: "Unverified personal experience",
    steps: [
      {
        label: "Origin",
        title: "Stories, comments, and source-presented profile figures",
        copy: "Public Deshi Mula material with its source context."
      },
      {
        label: "Company match",
        title: "Canonical company record",
        copy: "Role, date, source label, and available link remain attached."
      },
      {
        label: "Transformation",
        title: "Fixed concern terms are scanned",
        copy: "Story labels and third-party topic summaries stay separate."
      },
      {
        label: "Product use",
        title: "Culture context and questions",
        copy: "Repeated terms become prompts to investigate."
      },
      {
        label: "Limit",
        title: "Not verified or representative",
        copy: "A report is not policy, universal experience, or a score."
      }
    ],
    footer: (
      <p>
        <strong className="text-ink">Label stays attached:</strong> reported account · role/date context · source
        label · limitation
      </p>
    ),
    limitation: "Not fact-checked"
  },
  {
    id: "community",
    label: "Submitted",
    account: "Community aggregate",
    status: "Unverified salary submission",
    steps: [
      {
        label: "Origin",
        title: "Rendered role-and-amount aggregates",
        copy: "Community salary context captured from Beton Kemon."
      },
      {
        label: "Company match",
        title: "Exact identity or reviewed match",
        copy: "Ambiguous fuzzy candidates remain unattached."
      },
      {
        label: "Transformation",
        title: "Range and context are preserved",
        copy: "BDT minimum, maximum, sample, bonus, and capture time."
      },
      {
        label: "Product use",
        title: "Negotiation context",
        copy: "Role amounts inform salary questions—not a pay verdict."
      },
      {
        label: "Limit",
        title: "Pay period remains unknown",
        copy: "Not employer-confirmed, current, or an approved band."
      }
    ],
    footer: (
      <p>
        <strong className="text-ink">Label stays attached:</strong> community submitted · source · sample context ·
        capture time · period unspecified
      </p>
    ),
    limitation: "Not company verified"
  },
  {
    id: "derived",
    label: "Derived",
    account: "Rules-derived",
    status: "Unverified interpretation",
    steps: [
      {
        label: "Origin",
        title: "Explicit work-mode or schedule language",
        copy: "Sentences in unverified stories and comments."
      },
      {
        label: "Company match",
        title: "Distinct source excerpts",
        copy: "Source ID, URL, role, and observed date remain linked."
      },
      {
        label: "Transformation",
        title: "Rules count explicit mentions",
        copy: "Coverage, conflicts, and extraction confidence stay visible."
      },
      {
        label: "Product use",
        title: "Work-setup clues",
        copy: "Reported mode and schedule become questions to confirm."
      },
      {
        label: "Limit",
        title: "Never current company policy",
        copy: "Confidence is support—not accuracy. Unknown never becomes onsite."
      }
    ],
    footer: (
      <p>
        <strong className="text-ink">Derived is not a source.</strong> It is a named, traceable transformation of
        unverified source material.
      </p>
    ),
    limitation: "Rules v1.0.0"
  },
  {
    id: "destination",
    label: "Destination",
    account: "Dated destination match",
    status: "Match status remains visible",
    steps: [
      {
        label: "Origin",
        title: "Website, LinkedIn, and careers candidates",
        copy: "Saved links, public candidates, and reviewed overrides."
      },
      {
        label: "Company match",
        title: "Identity signals are compared",
        copy: "Name, domain, aliases, and reciprocal public identity."
      },
      {
        label: "Transformation",
        title: "Destination and status are normalized",
        copy: "Verified, probable, needs review, or unresolved."
      },
      {
        label: "Product use",
        title: "Identity and navigation",
        copy: "Reach a company-controlled page from the captured record."
      },
      {
        label: "Limit",
        title: "A matched link proves only the match",
        copy: "Not a live vacancy, current policy, or verification of reports."
      }
    ],
    footer: (
      <p>
        <strong className="text-ink">Label stays attached:</strong> destination type · match status · checked date ·
        unresolved gaps
      </p>
    ),
    limitation: "Dated public-web record"
  }
];

const toneClasses: Record<
  LaneName,
  {
    rail: string;
    tab: string;
    dot: string;
    text: string;
    soft: string;
    ring: string;
    badge: string;
  }
> = {
  reported: {
    rail: "before:bg-blue",
    tab: "bg-blue-soft shadow-[inset_0_-3px_var(--color-blue)]",
    dot: "bg-blue",
    text: "text-blue",
    soft: "bg-blue-soft",
    ring: "border-blue ring-blue-soft",
    badge: "bg-blue-soft text-blue"
  },
  community: {
    rail: "before:bg-amber",
    tab: "bg-amber-soft shadow-[inset_0_-3px_var(--color-amber)]",
    dot: "bg-amber",
    text: "text-amber-dark",
    soft: "bg-amber-soft",
    ring: "border-amber ring-amber-soft",
    badge: "bg-amber-soft text-amber-dark"
  },
  derived: {
    rail: "before:bg-coral",
    tab: "bg-coral-soft shadow-[inset_0_-3px_var(--color-coral)]",
    dot: "bg-coral",
    text: "text-coral",
    soft: "bg-coral-soft",
    ring: "border-coral ring-coral-soft",
    badge: "bg-coral-soft text-coral"
  },
  destination: {
    rail: "before:bg-jade",
    tab: "bg-jade-soft shadow-[inset_0_-3px_var(--color-jade)]",
    dot: "bg-jade",
    text: "text-jade-dark",
    soft: "bg-jade-soft",
    ring: "border-jade ring-jade-soft",
    badge: "bg-jade-soft text-jade-dark"
  }
};

function isLaneName(value: string): value is LaneName {
  return lanes.some((lane) => lane.id === value);
}

export function MethodProvenance() {
  const [active, setActive] = useState<LaneName>("derived");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lane = lanes.find((item) => item.id === active) ?? lanes[2];
  const tone = toneClasses[active];

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      if (isLaneName(hash)) setActive(hash);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  function selectLane(index: number, moveFocus = false) {
    const next = lanes[index];
    setActive(next.id);
    window.history.replaceState(null, "", `#${next.id}`);
    if (moveFocus) tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % lanes.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + lanes.length) % lanes.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = lanes.length - 1;
    else return;
    event.preventDefault();
    selectLane(next, true);
  }

  return (
    <figure
      className={cn(
        "relative m-0 overflow-hidden rounded-[14px] border border-line-strong bg-white shadow-[0_24px_70px_rgb(22_56_61_/_11%)] before:absolute before:inset-y-0 before:left-0 before:z-3 before:w-1.25 before:transition-colors",
        tone.rail
      )}
    >
      <figcaption className="flex min-h-21.5 items-start justify-between gap-5 border-b border-line pt-5 pr-5.75 pb-4.25 pl-7 max-sm:flex-col">
        <div>
          <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
            The provenance thread
          </p>
          <h2 className="mt-1.25 font-display text-2xl leading-[1.08] font-bold tracking-[-.025em]">
            Follow one label from origin to limitation.
          </h2>
        </div>
        <span className="shrink-0 rounded-[5px] bg-jade-soft px-1.75 py-1.25 font-mono text-[7px] font-extrabold tracking-[.04em] text-jade-dark uppercase">
          Interactive evidence contract
        </span>
      </figcaption>

      <div
        aria-label="Choose an evidence label"
        className="grid grid-cols-4 border-b border-line bg-[#f8fbfa] pl-1.25 max-sm:grid-cols-2"
        role="tablist"
      >
        {lanes.map((item, index) => {
          const selected = active === item.id;
          return (
            <button
              aria-controls={`method-panel-${item.id}`}
              aria-selected={selected}
              className={cn(
                "flex min-h-11.75 items-center justify-center gap-2 border-r border-line bg-transparent px-2.25 py-2 text-[9px] font-extrabold text-muted transition-colors last:border-r-0 hover:bg-white hover:text-ink focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-jade",
                selected && `text-ink ${toneClasses[item.id].tab}`
              )}
              id={`method-tab-${item.id}`}
              key={item.id}
              onClick={() => selectLane(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              <span className={cn("size-1.75 rounded-full", toneClasses[item.id].dot)} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      <article
        aria-labelledby={`method-tab-${active}`}
        className="grid min-h-97.5 grid-rows-[auto_1fr_auto]"
        id={`method-panel-${active}`}
        role="tabpanel"
      >
        <header className="flex items-center justify-between gap-4 border-b border-line pt-3.25 pr-5.5 pb-3 pl-6.75">
          <span className={cn("font-mono text-[8px] font-extrabold tracking-[.05em] uppercase", tone.text)}>
            {lane.account}
          </span>
          <strong className={cn("rounded-[5px] px-1.75 py-1.25 text-[8px] text-ink-soft", tone.soft)}>
            {lane.status}
          </strong>
        </header>
        <ol className="relative m-0 grid list-none grid-cols-5 px-4.25 pt-6 pb-5.75 before:absolute before:top-10 before:right-[10%] before:left-[10%] before:h-0.5 before:bg-line max-md:grid-cols-1 max-md:gap-0 max-md:py-3 max-md:before:top-[8%] max-md:before:bottom-[8%] max-md:before:left-[32px] max-md:h-auto max-md:before:h-auto max-md:before:w-0.5">
          {lane.steps.map((step, index) => (
            <li
              className="relative z-1 min-w-0 px-2 max-md:grid max-md:grid-cols-[42px_1fr] max-md:gap-3 max-md:py-3"
              key={step.label}
            >
              <span
                className={cn(
                  "mx-auto mb-3.75 grid size-8.25 place-items-center rounded-full border-2 bg-white font-mono text-[8px] font-black ring-5 max-md:m-0",
                  tone.ring,
                  tone.text
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="text-center max-md:text-left">
                <small className="mb-1.75 block font-mono text-[8px] font-extrabold tracking-[.05em] text-quiet uppercase">
                  {step.label}
                </small>
                <strong className="block min-h-11 text-[10px] leading-[1.38] max-md:min-h-0">{step.title}</strong>
                <p className="mt-1.5 text-[9px] leading-[1.48] text-muted">{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
        <footer className="grid min-h-14.5 grid-cols-[1fr_auto] items-center gap-4 border-t border-line bg-[#fbfdfc] pt-3 pr-5.5 pb-3 pl-6.75 max-sm:grid-cols-1">
          <div className="text-[9px] leading-[1.45] text-muted">{lane.footer}</div>
          <span
            className={cn(
              "rounded-[5px] px-1.75 py-1.25 font-mono text-[8px] font-extrabold uppercase",
              tone.badge
            )}
          >
            {lane.limitation}
          </span>
        </footer>
      </article>
    </figure>
  );
}
