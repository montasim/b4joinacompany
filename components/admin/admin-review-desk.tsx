"use client";

import {
  ArrowRight,
  Check,
  Database,
  ExternalLink,
  Info,
  RotateCw,
  ShieldCheck,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

type AdminRole = "owner" | "operator";
type QueueKind = "destination" | "match" | "refresh";
type QueueSource = "loading" | "live" | "example" | "unavailable";
type Decision = "approved" | "rejected";

type CorrectionPayload = {
  id: string;
  companySlug: string;
  kind: "website" | "linkedin" | "careers" | "identity" | "other";
  suggestedUrl: string | null;
  details: string;
  status: string;
  createdAt: string;
};

type ReviewItem = {
  id: string;
  kind: QueueKind;
  typeLabel: string;
  company: string;
  prompt: string;
  docket: string;
  currentLabel: string;
  currentValue: string;
  currentCopy: string;
  proposedLabel: string;
  proposedValue: string;
  proposedCopy: string;
  supports: string;
  uncertain: string;
  outcome: string;
  example: boolean;
  reviewed?: Decision;
};

const filterLabels: Record<"all" | QueueKind, string> = {
  all: "All",
  destination: "Destinations",
  match: "Matches",
  refresh: "Refreshes"
};

const exampleItems: ReviewItem[] = [
  {
    id: "example-destination",
    kind: "destination",
    typeLabel: "Destination",
    company: "Example company A",
    prompt: "Does this LinkedIn page belong here?",
    docket: "Docket D-014 · destination correction",
    currentLabel: "Current record",
    currentValue: "No LinkedIn destination recorded",
    currentCopy:
      "The public company brief currently links only to its recorded website.",
    proposedLabel: "Proposed destination",
    proposedValue: "linkedin.com/company/example-a",
    proposedCopy: "Example correction note · not a submitted queue record.",
    supports: "Legal name, country, and website domain agree.",
    uncertain:
      "The proposed page is not linked from the recorded company website.",
    outcome: "Prepare the LinkedIn destination for a later snapshot.",
    example: true
  },
  {
    id: "example-match",
    kind: "match",
    typeLabel: "Company match",
    company: "Example company B",
    prompt: "Can submitted salary evidence attach?",
    docket: "Docket M-009 · company identity",
    currentLabel: "Submitted salary source",
    currentValue: "Example Co.",
    currentCopy: "12 example role submissions · no live source attached.",
    proposedLabel: "Canonical candidate",
    proposedValue: "Example company B",
    proposedCopy: "example-b.test · 18 example workplace stories.",
    supports: "Name overlap and location agree in this example.",
    uncertain:
      "No official destination cross-links the example source record.",
    outcome: "Attach the ranges only to a future reviewable revision.",
    example: true
  },
  {
    id: "example-refresh",
    kind: "refresh",
    typeLabel: "Refresh",
    company: "Example company C",
    prompt: "Is candidate revision R5 ready?",
    docket: "Docket R-021 · evidence refresh",
    currentLabel: "Published example R4",
    currentValue: "18 stories · 6 salary roles",
    currentCopy: "Work setup remains unknown from the example evidence.",
    proposedLabel: "Candidate example R5",
    proposedValue: "20 stories · 7 salary roles",
    proposedCopy:
      "Two example stories mention hybrid work; policy remains unverified.",
    supports: "Two source URLs and one salary role passed example checks.",
    uncertain:
      "Hybrid mentions are reported experiences, not verified company policy.",
    outcome: "Prepare R5 while saved checkpoints remain pinned to R4.",
    example: true
  }
];

function companyName(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function shortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Submission date unavailable";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function kindForCorrection(kind: CorrectionPayload["kind"]): QueueKind {
  if (kind === "identity") return "match";
  if (kind === "other") return "refresh";
  return "destination";
}

function toReviewItem(correction: CorrectionPayload): ReviewItem {
  const kind = kindForCorrection(correction.kind);
  const name = companyName(correction.companySlug) || "Unresolved company";
  const suffix = correction.id.replaceAll("-", "").slice(0, 6).toUpperCase();
  const typeLabel =
    kind === "destination"
      ? "Destination"
      : kind === "match"
        ? "Company match"
        : "Refresh";

  if (kind === "match") {
    return {
      id: correction.id,
      kind,
      typeLabel,
      company: name,
      prompt: "Does this submitted identity belong to this company?",
      docket: `Docket M-${suffix} · company identity`,
      currentLabel: "Canonical company",
      currentValue: name,
      currentCopy: `Current dataset record · ${correction.companySlug}`,
      proposedLabel: "Submitted identity note",
      proposedValue: correction.details,
      proposedCopy: `Received ${shortDate(correction.createdAt)} through the correction form.`,
      supports: "The submitter selected this company record before sending the note.",
      uncertain:
        "The identity claim still needs an official destination or source cross-link.",
      outcome: "Prepare the match for the next dataset revision.",
      example: false
    };
  }

  if (kind === "refresh") {
    return {
      id: correction.id,
      kind,
      typeLabel,
      company: name,
      prompt: "Does this note justify a new evidence review?",
      docket: `Docket R-${suffix} · evidence refresh`,
      currentLabel: "Published record",
      currentValue: name,
      currentCopy: "The current snapshot remains unchanged while this note is reviewed.",
      proposedLabel: "Submitted evidence note",
      proposedValue: correction.details,
      proposedCopy: `Received ${shortDate(correction.createdAt)} through the correction form.`,
      supports: "The note is attached to a known company record.",
      uncertain:
        "A reviewer must still confirm the source and the claim it supports.",
      outcome: "Open a candidate revision without changing the published snapshot.",
      example: false
    };
  }

  const destination =
    correction.kind === "linkedin"
      ? "LinkedIn"
      : correction.kind === "careers"
        ? "careers"
        : "website";
  return {
    id: correction.id,
    kind,
    typeLabel,
    company: name,
    prompt: `Does this ${destination} destination belong here?`,
    docket: `Docket D-${suffix} · destination correction`,
    currentLabel: "Current record",
    currentValue: `${destination.charAt(0).toUpperCase() + destination.slice(1)} destination needs review`,
    currentCopy: "The published record stays unchanged while this submission is withheld.",
    proposedLabel: "Proposed destination",
    proposedValue:
      correction.suggestedUrl ?? "No destination URL was included",
    proposedCopy: `${correction.details} · Submitted ${shortDate(correction.createdAt)}.`,
    supports: "The destination was submitted against this company record.",
    uncertain:
      "The destination must be confirmed against an official company identity.",
    outcome: `Prepare the ${destination} destination for the next dataset revision.`,
    example: false
  };
}

function QueueTypeBadge({ kind, label }: { kind: QueueKind; label: string }) {
  const tone =
    kind === "destination" ? "jade" : kind === "match" ? "blue" : "amber";
  return <Badge tone={tone}>{label}</Badge>;
}

function ReviewQueueNotice({ source }: { source: QueueSource }) {
  const content = {
    loading: {
      title: "Loading the protected queue",
      copy: "Correction details appear only after the admin session is verified."
    },
    live: {
      title: "Live correction submissions",
      copy: "These records came from the protected correction queue. Decisions are stored without editing the published snapshot."
    },
    example: {
      title: "Example review queue",
      copy: "No pending correction records were found. These generic examples change only on this screen."
    },
    unavailable: {
      title: "Review database unavailable",
      copy: "Generic examples are shown so the workflow remains inspectable. Example decisions are never stored."
    }
  }[source];

  return (
    <aside
      className="mb-4 flex items-start gap-3 rounded-xl border border-line bg-white px-4 py-3.5 text-ink-soft"
      role={source === "unavailable" ? "alert" : "status"}
    >
      <span
        className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${
          source === "unavailable"
            ? "bg-coral-soft text-coral"
            : source === "live"
              ? "bg-jade-soft text-jade-dark"
              : "bg-blue-soft text-blue"
        }`}
      >
        {source === "live" ? (
          <ShieldCheck className="size-4" aria-hidden="true" />
        ) : source === "unavailable" ? (
          <RotateCw className="size-4" aria-hidden="true" />
        ) : (
          <Info className="size-4" aria-hidden="true" />
        )}
      </span>
      <p className="m-0 text-[11px] leading-[1.5]">
        <strong className="block text-ink">{content.title}</strong>
        {content.copy}
      </p>
    </aside>
  );
}

export function AdminReviewDesk({
  role,
  snapshotDate
}: {
  role: AdminRole;
  snapshotDate: string;
}) {
  const [source, setSource] = useState<QueueSource>("loading");
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [filter, setFilter] = useState<"all" | QueueKind>("all");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"ready" | "error">("ready");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadQueue() {
      try {
        const response = await fetch("/api/v1/admin/review-queue", {
          cache: "no-store"
        });
        const payload = await response.json().catch(() => null);
        if (!active) return;

        if (!response.ok) {
          setItems(exampleItems);
          setSelectedId(exampleItems[0].id);
          setSource("unavailable");
          return;
        }

        const corrections = Array.isArray(payload?.items)
          ? (payload.items as CorrectionPayload[])
          : [];
        if (corrections.length === 0) {
          setItems(exampleItems);
          setSelectedId(exampleItems[0].id);
          setSource("example");
          return;
        }

        const liveItems = corrections.map(toReviewItem);
        setItems(liveItems);
        setSelectedId(liveItems[0].id);
        setSource("live");
      } catch {
        if (!active) return;
        setItems(exampleItems);
        setSelectedId(exampleItems[0].id);
        setSource("unavailable");
      }
    }

    void loadQueue();
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(
    () => ({
      all: items.length,
      destination: items.filter((item) => item.kind === "destination").length,
      match: items.filter((item) => item.kind === "match").length,
      refresh: items.filter((item) => item.kind === "refresh").length
    }),
    [items]
  );

  const filteredItems = useMemo(
    () =>
      filter === "all"
        ? items
        : items.filter((item) => item.kind === filter),
    [filter, items]
  );
  const selected =
    items.find((item) => item.id === selectedId) ?? filteredItems[0] ?? null;
  const pendingCount = items.filter((item) => !item.reviewed).length;
  const roleLabel = role === "owner" ? "Owner reviewer" : "Operator reviewer";

  function chooseFilter(nextFilter: "all" | QueueKind) {
    setFilter(nextFilter);
    const nextItems =
      nextFilter === "all"
        ? items
        : items.filter((item) => item.kind === nextFilter);
    if (!nextItems.some((item) => item.id === selectedId)) {
      setSelectedId(nextItems[0]?.id ?? "");
    }
    setReason("");
    setNote("");
    setMessage("");
  }

  function chooseItem(id: string) {
    setSelectedId(id);
    setReason("");
    setNote("");
    setMessage("");
  }

  async function decide(decision: Decision) {
    if (!selected || selected.reviewed || submitting) return;
    if (!reason) {
      setMessageTone("error");
      setMessage("Choose the evidence basis before recording a decision.");
      document.querySelector<HTMLSelectElement>("#admin-decision-reason")?.focus();
      return;
    }

    setSubmitting(true);
    setMessage("");

    if (!selected.example) {
      try {
        const response = await fetch("/api/v1/admin/review-queue", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selected.id,
            decision,
            reason,
            note: note.trim() || undefined
          })
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(
            payload?.error?.message ??
              "The decision could not be recorded. Refresh the queue."
          );
        }
      } catch (error) {
        setMessageTone("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "The decision could not be recorded. Refresh the queue."
        );
        setSubmitting(false);
        return;
      }
    }

    setItems((current) =>
      current.map((item) =>
        item.id === selected.id ? { ...item, reviewed: decision } : item
      )
    );
    setMessageTone("ready");
    setMessage(
      selected.example
        ? `${decision === "approved" ? "Example approved" : "Example rejected"}. This demonstration changed only on this screen.`
        : decision === "approved"
          ? "Approved for the next revision. The published snapshot was not changed."
          : "Change rejected. The published snapshot was not changed."
    );
    setSubmitting(false);
  }

  return (
    <main id="main" className="min-h-[calc(100vh-64px)] bg-mist pb-20">
      <header className="border-b border-line bg-[linear-gradient(rgba(20,120,110,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,120,110,.03)_1px,transparent_1px)] bg-size-[32px_32px]">
        <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-280 grid-cols-[minmax(0,1fr)_410px] items-end gap-[58px] py-[51px] pb-[45px] max-lg:grid-cols-1 max-lg:gap-7 max-sm:w-[calc(100%_-_28px)] max-sm:py-9">
          <div className="max-w-170">
            <p className="font-mono text-[10px] leading-tight font-extrabold tracking-[.1em] text-jade uppercase">
              Evidence review desk
            </p>
            <h1 className="mt-2.5 font-display text-[clamp(46px,5vw,64px)] leading-[.98] font-bold tracking-[-.04em] text-ink">
              Decide what can enter{" "}
              <em className="text-jade not-italic">
                the next snapshot.
              </em>
            </h1>
            <p className="mt-3.75 max-w-175 text-[14px] leading-[1.6] text-ink-soft">
              Pending changes stay outside public research until their company
              identity, source, evidence label, and limitations are reviewed.
            </p>
          </div>

          <aside
            className="overflow-hidden rounded-xl border border-line-strong bg-white shadow-panel"
            aria-label="Review queue summary"
          >
            <header className="grid grid-cols-[1fr_auto] items-center gap-x-3 border-b border-line px-5 py-4">
              <div>
                <span className="block font-mono text-[8px] font-extrabold tracking-[.08em] text-muted uppercase">
                  Signed in with Google
                </span>
                <strong className="mt-1 block text-[12px] text-ink">
                  {roleLabel}
                </strong>
              </div>
              <Badge tone="coral">Restricted</Badge>
            </header>
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 bg-[#f8fbfa] px-5 py-5 text-center">
              <p>
                <strong className="block font-display text-xl leading-none text-ink">
                  {source === "loading" ? "—" : pendingCount}
                </strong>
                <span className="mt-1 block text-[8px] text-muted">waiting</span>
              </p>
              <ArrowRight className="size-4 text-jade" aria-hidden="true" />
              <p>
                <strong className="block font-display text-xl leading-none text-ink">
                  1 at a time
                </strong>
                <span className="mt-1 block text-[8px] text-muted">reviewed</span>
              </p>
              <ArrowRight className="size-4 text-jade" aria-hidden="true" />
              <p>
                <strong className="block font-display text-xl leading-none text-ink">
                  Next revision
                </strong>
                <span className="mt-1 block text-[8px] text-muted">prepared</span>
              </p>
            </div>
            <footer className="border-t border-line px-5 py-3.5 text-[9px] leading-[1.5] text-muted">
              Snapshot {snapshotDate}. Approval never edits a published snapshot
              in place.
            </footer>
          </aside>
        </div>
      </header>

      <section
        className="mx-auto w-[calc(100%_-_40px)] max-w-280 pt-7 max-sm:w-[calc(100%_-_28px)] max-sm:pt-4"
        id="corrections"
      >
        <ReviewQueueNotice source={source} />

        <div className="grid min-h-155 grid-cols-[300px_minmax(0,1fr)] overflow-hidden rounded-xl border border-line-strong bg-white shadow-[0_24px_60px_rgba(18,53,60,.08)] max-lg:grid-cols-[260px_minmax(0,1fr)] max-md:min-h-0 max-md:grid-cols-1 max-md:overflow-visible max-md:border-0 max-md:bg-transparent max-md:shadow-none">
          <aside
            className="border-r border-line bg-white max-md:overflow-hidden max-md:rounded-xl max-md:border max-md:border-line-strong"
            aria-labelledby="admin-queue-title"
          >
            <header className="flex items-end justify-between gap-4 border-b border-line px-5 py-5">
              <div>
                <p className="font-mono text-[9px] font-extrabold tracking-[.09em] text-jade uppercase">
                  Withheld evidence
                </p>
                <h2
                  className="mt-1.5 font-display text-2xl font-bold tracking-[-.03em] text-ink"
                  id="admin-queue-title"
                >
                  Review queue
                </h2>
              </div>
              <span className="text-[9px] text-muted">
                <strong className="text-[13px] text-coral">
                  {source === "loading" ? "—" : pendingCount}
                </strong>{" "}
                pending
              </span>
            </header>

            <div
              className="grid grid-cols-2 gap-1.5 border-b border-line bg-mist px-3 py-3"
              aria-label="Filter review queue"
            >
              {(Object.keys(filterLabels) as Array<"all" | QueueKind>).map(
                (kind) => (
                  <button
                    key={kind}
                    className="flex min-h-8.5 cursor-pointer items-center justify-between rounded-md border-0 bg-transparent px-2.5 text-[9px] font-extrabold text-muted transition-colors hover:bg-white hover:text-jade-dark aria-pressed:bg-white aria-pressed:text-jade-dark"
                    type="button"
                    aria-pressed={filter === kind}
                    onClick={() => chooseFilter(kind)}
                  >
                    {filterLabels[kind]}
                    <span className="font-mono">{counts[kind]}</span>
                  </button>
                )
              )}
            </div>

            <div className="grid">
              {source === "loading" ? (
                <div className="space-y-3 px-4 py-5" aria-label="Loading queue">
                  {[0, 1, 2].map((item) => (
                    <span
                      className="block h-20 animate-pulse rounded-lg bg-mist"
                      key={item}
                    />
                  ))}
                </div>
              ) : filteredItems.length ? (
                filteredItems.map((item) => {
                  const selectedItem = selected?.id === item.id;
                  return (
                    <button
                      className={`relative grid min-h-29 cursor-pointer justify-items-start gap-1.5 border-0 border-b border-line bg-white px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-[#fbfdfc] ${
                        selectedItem
                          ? "bg-jade-soft/45 shadow-[inset_4px_0_0_#14796f]"
                          : ""
                      } ${item.reviewed ? "bg-mist/70" : ""}`}
                      key={item.id}
                      type="button"
                      aria-pressed={selectedItem}
                      onClick={() => chooseItem(item.id)}
                    >
                      <QueueTypeBadge kind={item.kind} label={item.typeLabel} />
                      <strong className="font-display text-[15px] leading-tight text-ink">
                        {item.company}
                      </strong>
                      <small className="text-[9px] leading-[1.4] text-muted">
                        {item.prompt}
                      </small>
                      <em
                        className={`mt-0.5 text-[8px] font-bold not-italic ${
                          item.reviewed === "approved"
                            ? "text-jade-dark"
                            : item.reviewed === "rejected"
                              ? "text-coral"
                              : "text-muted"
                        }`}
                      >
                        {item.reviewed === "approved"
                          ? "Approved"
                          : item.reviewed === "rejected"
                            ? "Rejected"
                            : "Waiting"}
                      </em>
                    </button>
                  );
                })
              ) : (
                <p className="m-0 px-5 py-7 text-[10px] leading-relaxed text-muted">
                  No items match this filter.
                </p>
              )}
            </div>
          </aside>

          <article
            className="min-w-0 bg-white max-md:mt-4 max-md:overflow-hidden max-md:rounded-xl max-md:border max-md:border-line-strong"
            aria-live="polite"
          >
            {selected ? (
              <>
                <section className="px-7 pt-7 max-sm:px-4 max-sm:pt-5">
                  <header className="flex items-start justify-between gap-5 max-sm:grid max-sm:gap-3">
                    <div>
                      <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
                        {selected.docket}
                      </p>
                      <h2 className="mt-2 max-w-170 font-display text-[clamp(26px,3vw,34px)] leading-[1.08] font-bold tracking-[-.035em] text-ink">
                        {selected.prompt}
                      </h2>
                    </div>
                    <Badge tone={selected.example ? "blue" : "amber"}>
                      {selected.example ? "Example only" : "Withheld"}
                    </Badge>
                  </header>

                  <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-stretch gap-4 max-sm:grid-cols-1">
                    <article className="min-w-0 rounded-xl border border-line bg-[#fbfdfc] p-4">
                      <small className="font-mono text-[8px] font-extrabold text-muted uppercase">
                        {selected.currentLabel}
                      </small>
                      <strong className="mt-2.5 block [overflow-wrap:anywhere] text-[12px] leading-[1.45] text-ink">
                        {selected.currentValue}
                      </strong>
                      <p className="mt-2 text-[9px] leading-[1.55] text-muted">
                        {selected.currentCopy}
                      </p>
                    </article>
                    <span className="grid place-items-center text-jade max-sm:rotate-90">
                      <ArrowRight className="size-5" aria-hidden="true" />
                    </span>
                    <article className="min-w-0 rounded-xl border border-line bg-[#fbfdfc] p-4">
                      <small className="font-mono text-[8px] font-extrabold text-muted uppercase">
                        {selected.proposedLabel}
                      </small>
                      <strong className="mt-2.5 block break-words text-[12px] leading-[1.45] text-ink">
                        {selected.proposedValue}
                      </strong>
                      <p className="mt-2 break-words text-[9px] leading-[1.55] text-muted">
                        {selected.proposedCopy}
                      </p>
                    </article>
                  </div>

                  <dl className="m-0 border-y border-line">
                    {[
                      ["Supports the change", selected.supports],
                      ["Still uncertain", selected.uncertain],
                      ["If approved", selected.outcome]
                    ].map(([term, description]) => (
                      <div
                        className="grid grid-cols-[135px_minmax(0,1fr)] gap-5 border-b border-line py-3.5 last:border-b-0 max-sm:grid-cols-1 max-sm:gap-1.5"
                        key={term}
                      >
                        <dt className="font-mono text-[8px] font-extrabold text-muted uppercase">
                          {term}
                        </dt>
                        <dd className="m-0 text-[10px] leading-[1.55] text-ink-soft">
                          {description}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <section className="mt-7 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 border-t border-line bg-[#f8fbfa] px-7 py-6 max-sm:grid-cols-1 max-sm:px-4">
                  <label className="grid content-start gap-2 text-[10px] font-extrabold text-ink">
                    Decision reason
                    <select
                      className="min-h-11.25 w-full rounded-lg border border-line-strong bg-white px-3 text-[11px] text-ink outline-none focus:border-jade focus:ring-3 focus:ring-jade/10"
                      id="admin-decision-reason"
                      value={reason}
                      disabled={Boolean(selected.reviewed)}
                      onChange={(event) => {
                        setReason(event.target.value);
                        setMessage("");
                      }}
                    >
                      <option value="">Choose the evidence basis</option>
                      <option value="Source and identity support the change">
                        Source and identity support the change
                      </option>
                      <option value="Identity is not sufficiently supported">
                        Identity is not sufficiently supported
                      </option>
                      <option value="Source is stale or unreachable">
                        Source is stale or unreachable
                      </option>
                      <option value="More evidence is required">
                        More evidence is required
                      </option>
                    </select>
                  </label>
                  <label className="grid content-start gap-2 text-[10px] font-extrabold text-ink">
                    <span>
                      Reviewer note{" "}
                      <span className="font-normal text-muted">Optional</span>
                    </span>
                    <Textarea
                      className="min-h-20 bg-white text-[11px]"
                      value={note}
                      disabled={Boolean(selected.reviewed)}
                      placeholder="Record the detail another reviewer would need."
                      onChange={(event) => setNote(event.target.value)}
                    />
                  </label>

                  {message && (
                    <p
                      className={`col-span-2 m-0 rounded-lg px-3.5 py-3 text-[10px] leading-[1.5] max-sm:col-span-1 ${
                        messageTone === "error"
                          ? "bg-coral-soft text-[#8b4046]"
                          : "bg-jade-soft text-jade-dark"
                      }`}
                      role="status"
                    >
                      {message}
                    </p>
                  )}

                  <footer className="col-span-2 flex justify-end gap-2 max-sm:col-span-1 max-sm:grid">
                    <Button
                      className="border-coral/45 text-[#8b4046] hover:border-coral hover:bg-coral-soft hover:text-[#8b4046]"
                      type="button"
                      variant="outline"
                      disabled={Boolean(selected.reviewed) || submitting}
                      onClick={() => decide("rejected")}
                    >
                      <X className="size-4" aria-hidden="true" />
                      Reject change
                    </Button>
                    <Button
                      type="button"
                      disabled={Boolean(selected.reviewed) || submitting}
                      onClick={() => decide("approved")}
                    >
                      <Check className="size-4" aria-hidden="true" />
                      {submitting
                        ? "Recording…"
                        : "Approve for next revision"}
                    </Button>
                  </footer>
                </section>
              </>
            ) : (
              <div className="grid min-h-120 place-items-center px-6 text-center">
                <div className="max-w-80">
                  <Database
                    className="mx-auto size-8 text-line-strong"
                    aria-hidden="true"
                  />
                  <h2 className="mt-4 font-display text-2xl font-bold text-ink">
                    Choose a queue item
                  </h2>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">
                    Select a withheld change to inspect its source and review
                    boundary.
                  </p>
                </div>
              </div>
            )}
          </article>
        </div>

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4 text-[9px] leading-relaxed text-muted">
          <p className="m-0 flex items-center gap-2">
            <ShieldCheck className="size-4 text-jade" aria-hidden="true" />
            Review decisions prepare a revision; publication remains a separate
            operation.
          </p>
          <a
            className="inline-flex items-center gap-1.5 font-extrabold text-jade-dark underline decoration-jade/30 underline-offset-3"
            href="/method"
          >
            Review the evidence method
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </footer>
      </section>
    </main>
  );
}
