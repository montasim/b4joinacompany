"use client";

import { useRef, useState } from "react";
import { Heart, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

type PreviewTab = "brief" | "stories" | "jobs" | "ask";

const tabs: Array<{ id: PreviewTab; label: string }> = [
  { id: "brief", label: "Brief" },
  { id: "stories", label: "Stories" },
  { id: "jobs", label: "Jobs & salary" },
  { id: "ask", label: "Ask" }
];

function EvidenceLabel({
  children,
  tone = "jade"
}: {
  children: React.ReactNode;
  tone?: "jade" | "blue" | "amber";
}) {
  return (
    <p
      className={cn(
        "font-mono text-[7px] leading-none font-extrabold tracking-[.08em] uppercase",
        tone === "jade" && "text-jade-dark",
        tone === "blue" && "text-blue",
        tone === "amber" && "text-amber-dark"
      )}
    >
      {children}
    </p>
  );
}

function BriefPane({ storyCount }: { storyCount: number }) {
  return (
    <section aria-labelledby="extension-tab-brief" id="extension-pane-brief" role="tabpanel">
      <div className="mb-3.5">
        <EvidenceLabel>Deshi Mula evidence</EvidenceLabel>
        <h3 className="mt-1.5 font-display text-[21px] leading-[1.12] font-bold">
          Turn reported experiences into questions to verify.
        </h3>
        <p className="mt-1.5 text-[10px] leading-3.75 text-muted">
          {storyCount.toLocaleString()} workplace stories organized without rating the company.
        </p>
      </div>
      <article className="overflow-hidden rounded-[10px] border border-line-strong bg-white">
        <header className="flex items-center justify-between gap-2.5 border-b border-line bg-jade-soft px-2.75 py-2.5">
          <div>
            <small className="block font-mono text-[7px] font-extrabold text-jade-dark uppercase">
              Decision scan
            </small>
            <strong className="mt-0.75 block font-display text-sm leading-tight">The inside view</strong>
          </div>
          <span className="rounded-full bg-white px-1.5 py-1 text-[7px] font-extrabold text-muted">
            Not a verdict
          </span>
        </header>
        {[
          ["Culture", "Compensation and leadership recur", "Read the source stories for context"],
          ["Work", "Current setup needs confirmation", "Derived from reports · not company policy"],
          ["Pay", "Community-submitted role ranges", "Pay period may not be supplied"]
        ].map(([label, title, copy]) => (
          <div
            className="grid min-h-14.5 grid-cols-[50px_1fr] gap-2.5 border-b border-line px-2.75 py-2.5 last:border-0"
            key={label}
          >
            <span className="font-mono text-[8px] leading-3 font-extrabold text-jade-dark">{label}</span>
            <div>
              <strong className="block text-[10px] leading-[1.35]">{title}</strong>
              <small className="mt-0.75 block text-[8px] leading-[1.4] text-muted">{copy}</small>
            </div>
          </div>
        ))}
      </article>
      <div className="mt-3 grid gap-1 rounded-r-[7px] border-l-3 border-amber bg-amber-soft px-3 py-2.5">
        <span className="font-mono text-[7px] font-extrabold text-amber-dark uppercase">3 questions ready</span>
        <strong className="font-display text-[11px] leading-[1.3]">
          How are performance decisions documented?
        </strong>
      </div>
    </section>
  );
}

function StoriesPane() {
  return (
    <section aria-labelledby="extension-tab-stories" id="extension-pane-stories" role="tabpanel">
      <div className="mb-3.5">
        <EvidenceLabel tone="blue">Source explorer</EvidenceLabel>
        <h3 className="mt-1.5 font-display text-[21px] leading-[1.12] font-bold">Find the stories that matter.</h3>
        <p className="mt-1.5 text-[10px] leading-3.75 text-muted">
          Search this company’s published workplace experiences.
        </p>
      </div>
      <label className="grid min-h-9.5 grid-cols-[auto_1fr] items-center gap-2 rounded-[7px] border border-line-strong bg-white px-2.5 text-muted">
        <Search aria-hidden="true" className="size-3.5" />
        <span className="sr-only">Story search preview</span>
        <input
          aria-label="Story search preview"
          className="min-w-0 border-0 bg-transparent text-[10px] text-ink outline-0"
          readOnly
          value="management"
        />
      </label>
      <div className="mt-2 grid grid-cols-4 rounded-[7px] bg-jade-soft p-1" aria-hidden="true">
        {["Recent", "Positive", "Mixed", "Negative"].map((label) => (
          <span
            className={cn(
              "px-0.5 py-1.5 text-center text-[8px] font-extrabold text-muted",
              label === "Negative" && "rounded-[5px] bg-white text-jade-dark shadow-sm"
            )}
            key={label}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="mt-2 border-t border-line">
        {[
          ["What engineers report about feedback", "Software Engineer · published story", "Negative"],
          ["Growth depends on the team", "Anonymous · published story", "Mixed"]
        ].map(([title, copy, vibe], index) => (
          <article className="grid grid-cols-[3px_1fr] gap-2.5 border-b border-line py-3" key={title}>
            <span className={cn("rounded-sm bg-coral", index === 1 && "bg-amber")} aria-hidden="true" />
            <div>
              <strong className="block font-display text-xs leading-[1.3]">{title}</strong>
              <small className="mt-1 block text-[8px] text-muted">{copy}</small>
              <em
                className={cn(
                  "mt-1.5 block w-max rounded bg-coral-soft px-1.25 py-0.75 text-[7px] text-coral not-italic",
                  index === 1 && "bg-amber-soft text-amber-dark"
                )}
              >
                {vibe}
              </em>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function JobsPane() {
  return (
    <section aria-labelledby="extension-tab-jobs" id="extension-pane-jobs" role="tabpanel">
      <div className="mb-3.5">
        <EvidenceLabel tone="amber">Community submitted · unverified</EvidenceLabel>
        <h3 className="mt-1.5 font-display text-[21px] leading-[1.12] font-bold">
          See role context before the conversation.
        </h3>
        <p className="mt-1.5 text-[10px] leading-3.75 text-muted">
          Reported BDT amounts are negotiation context, not company-confirmed ranges.
        </p>
      </div>
      <article className="rounded-[10px] border border-line-strong bg-white p-3.5">
        <header className="flex items-start justify-between gap-2.5">
          <div>
            <small className="block font-mono text-[7px] font-extrabold text-muted uppercase">Selected role</small>
            <strong className="mt-1 block text-[10px]">Software Engineer</strong>
          </div>
          <span className="text-[8px] text-muted">10 submissions</span>
        </header>
        <strong className="mt-4 block font-display text-[25px] leading-none">৳62.3k–72.3k</strong>
        <div className="relative mt-3 h-2 rounded-full bg-amber-soft">
          <i className="absolute left-[38%] h-full w-1/4 rounded-full bg-amber" />
        </div>
        <p className="mt-2.25 text-[8px] leading-[1.45] text-muted">
          Pay period not supplied · confirm the complete package.
        </p>
      </article>
      <article className="mt-3 rounded-lg bg-jade-soft p-3">
        <EvidenceLabel>Official destination</EvidenceLabel>
        <strong className="mt-1.5 block text-[10px]">Company careers page ↗</strong>
        <p className="mt-1 text-[8px] leading-[1.4] text-muted">
          A destination to check—not a guaranteed live vacancy.
        </p>
      </article>
    </section>
  );
}

function AskPane() {
  return (
    <section aria-labelledby="extension-tab-ask" id="extension-pane-ask" role="tabpanel">
      <div className="mb-3.5">
        <EvidenceLabel tone="blue">Cited company research</EvidenceLabel>
        <h3 className="mt-1.5 font-display text-[21px] leading-[1.12] font-bold">Ask one focused question.</h3>
        <p className="mt-1.5 text-[10px] leading-3.75 text-muted">
          The answer is limited to retrieved company evidence.
        </p>
      </div>
      <div className="rounded-lg border border-line-strong bg-white p-3">
        <span className="block font-mono text-[7px] font-extrabold text-muted uppercase">Your question</span>
        <strong className="mt-1.75 block text-[10px] leading-[1.45]">
          What do engineers report about management feedback?
        </strong>
      </div>
      <article className="mt-2.5 rounded-r-lg border-l-3 border-jade bg-jade-soft p-3">
        <span className="font-mono text-[7px] font-extrabold text-jade-dark uppercase">
          Answer from the evidence
        </span>
        <p className="mt-1.75 text-[9px] leading-[1.55] text-ink-soft">
          Reports are mixed. Peer learning appears positively, while management feedback and decision consistency
          recur as concerns. <span className="font-extrabold text-jade-dark">[S12] [S28] [S41]</span>
        </p>
      </article>
      <p className="mt-2.5 text-[8px] leading-3 text-muted">
        Ask requires an explicit retention disclosure before the first request.
      </p>
    </section>
  );
}

export function ExtensionProductPreview({
  companyName,
  snapshotDate,
  storyCount
}: {
  companyName: string;
  snapshotDate: string;
  storyCount: number;
}) {
  const [activeTab, setActiveTab] = useState<PreviewTab>("brief");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectTab(index: number, moveFocus = false) {
    const next = tabs[index];
    setActiveTab(next.id);
    if (moveFocus) tabRefs.current[index]?.focus();
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(next, true);
  }

  return (
    <figure
      className="relative z-1 m-0 min-w-0 drop-shadow-[0_24px_35px_rgb(22_56_61_/_12%)]"
      id="extension-preview"
    >
      <figcaption className="sr-only">
        Interactive preview of the b4joinacompany research panel beside a Deshi Mula company page.
      </figcaption>
      <div
        className="grid min-h-10.5 grid-cols-[72px_minmax(0,1fr)_30px] items-center gap-3 rounded-t-[15px] border border-line-strong border-b-line bg-white px-3.5"
        aria-hidden="true"
      >
        <span className="flex gap-1.5">
          <i className="block size-2 rounded-full bg-coral" />
          <i className="block size-2 rounded-full bg-amber" />
          <i className="block size-2 rounded-full bg-jade" />
        </span>
        <span className="flex min-w-0 items-center gap-1.75 overflow-hidden rounded-md bg-mist px-2.75 py-1.5 text-[9px] text-ellipsis whitespace-nowrap text-muted">
          <i className="size-1.75 shrink-0 rounded-full bg-jade" /> deshimula.com/companies/technonext-ltd
        </span>
        <span className="text-[11px] tracking-[2px] text-quiet">•••</span>
      </div>
      <div className="grid min-h-148.5 grid-cols-[minmax(0,.78fr)_minmax(350px,1.22fr)] rounded-b-[15px] border border-t-0 border-line-strong bg-[#e9efed] max-md:block max-md:min-h-0">
        <div
          className="min-w-0 overflow-hidden rounded-bl-[15px] bg-[#f9fbfa] text-[#1c4052] opacity-68 max-md:hidden"
          aria-hidden="true"
        >
          <header className="flex min-h-14.25 items-center gap-2.25 border-b border-[#dce5e3] bg-white px-4">
            <span className="grid size-6.75 place-items-center rounded-[50%_50%_42%_58%] bg-[#4aa765] font-mono text-[7px] font-extrabold text-white">
              DM
            </span>
            <strong className="text-xs">Deshi Mula</strong>
            <nav className="ml-auto flex gap-2.25 text-[7px] font-extrabold text-[#74898e]">
              <span>Stories</span>
              <span>Companies</span>
              <span>Hiring</span>
            </nav>
          </header>
          <div className="px-5 py-10.75">
            <p className="font-mono text-[7px] font-extrabold tracking-[.08em] text-jade">COMPANY STORIES</p>
            <h2 className="mt-2 font-display text-[27px] font-bold">{companyName}</h2>
            <button
              className="mt-3.5 inline-flex min-h-7.5 items-center gap-1.5 rounded-[7px] border border-[#9fc7c1] bg-[#eff8f6] px-2.5 py-1.25 text-[9px] font-extrabold text-jade-dark"
              tabIndex={-1}
              type="button"
            >
              <Search className="size-3" /> Research
            </button>
            {["Engineering culture and growth", "What to know before joining"].map((title, index) => (
              <article
                className="mt-4.5 grid grid-cols-[34px_1fr] gap-2.5 rounded-[10px] border border-[#e3e9e7] bg-white p-3.75"
                key={title}
              >
                <span className="grid size-8.5 place-items-center rounded-lg bg-jade-soft font-mono text-[8px] font-extrabold text-jade-dark">
                  TN
                </span>
                <div>
                  <strong className="block font-display text-[11px] leading-tight">{title}</strong>
                  {[90, 72, ...(index === 0 ? [54] : [])].map((width) => (
                    <i
                      className="mt-1.75 block h-1.25 rounded-full bg-[#e7ecea]"
                      key={width}
                      style={{ width: `${width}%` }}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="relative z-2 -my-3.5 mr-3.25 -ml-7 grid h-155.5 min-w-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] self-center overflow-hidden rounded-[14px] border border-line-strong bg-white shadow-[-15px_0_38px_rgb(22_56_61_/_15%)] before:absolute before:inset-y-0 before:left-0 before:z-3 before:w-1 before:bg-[linear-gradient(to_bottom,var(--color-blue)_0_33.33%,var(--color-amber)_33.33%_66.66%,var(--color-jade)_66.66%)] max-md:m-3 max-md:h-155.5">
          <header className="grid min-h-16.25 grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-2.25 border-b border-line py-2.5 pr-3 pl-3.75">
            <span className="grid size-9 place-items-center rounded-[9px] bg-jade text-white" aria-hidden="true">
              <svg className="size-5.75 fill-none stroke-current stroke-[1.8]" viewBox="0 0 32 32">
                <path d="M8 7.5h10.5a5.5 5.5 0 0 1 0 11H13" />
                <path d="M8 7.5v17M8 24.5h8" />
                <path d="m20 22 2.5 2.5L27 19" />
              </svg>
            </span>
            <div className="min-w-0">
              <small className="mb-0.5 block font-mono text-[8px] font-extrabold tracking-[.04em] text-muted uppercase">
                Researching
              </small>
              <strong className="block overflow-hidden font-display text-[15px] leading-[1.2] text-ellipsis whitespace-nowrap">
                {companyName}
              </strong>
            </div>
            <span className="grid size-7.5 place-items-center rounded-lg border border-line bg-[#fff7f8] text-[#a24e5d]">
              <Heart aria-hidden="true" className="size-3.5 fill-current" />
            </span>
            <span className="grid size-7.5 place-items-center rounded-lg border border-line text-muted">
              <X aria-hidden="true" className="size-4" />
            </span>
          </header>
          <div
            aria-label="Preview extension views"
            className="grid min-h-12 grid-cols-[.8fr_.9fr_1.45fr_.7fr] border-b border-line pr-3 pl-3.75"
            role="tablist"
          >
            {tabs.map((tab, index) => (
              <button
                aria-controls={`extension-pane-${tab.id}`}
                aria-selected={activeTab === tab.id}
                className={cn(
                  "relative min-w-0 px-1 text-[9px] font-extrabold whitespace-nowrap text-muted transition-colors after:absolute after:right-1.25 after:bottom-[-1px] after:left-1.25 after:h-0.75 after:rounded-t-sm after:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-jade",
                  activeTab === tab.id && "text-jade-dark after:bg-jade"
                )}
                id={`extension-tab-${tab.id}`}
                key={tab.id}
                onClick={() => selectTab(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                role="tab"
                tabIndex={activeTab === tab.id ? 0 : -1}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="min-h-0 overflow-hidden bg-[#fbfdfc] pt-4.5 pr-4.25 pb-5 pl-5">
            {activeTab === "brief" && <BriefPane storyCount={storyCount} />}
            {activeTab === "stories" && <StoriesPane />}
            {activeTab === "jobs" && <JobsPane />}
            {activeTab === "ask" && <AskPane />}
          </div>
          <footer className="grid min-h-9.25 grid-cols-[1fr_auto_auto] items-center gap-2.5 border-t border-line bg-white pr-3 pl-4 text-[7px] text-muted">
            <span className="flex items-center gap-1.25">
              <i className="size-1.5 rounded-full bg-jade" /> Snapshot · {snapshotDate}
            </span>
            <strong className="text-[7px] text-jade-dark">Sources</strong>
            <strong className="text-[7px] text-jade-dark">Open b4joinacompany ↗</strong>
          </footer>
        </aside>
      </div>
    </figure>
  );
}
