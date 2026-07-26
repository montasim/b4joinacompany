"use client";

import { FormEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type CorrectionKind =
  | "website"
  | "linkedin"
  | "careers"
  | "identity"
  | "other";

interface FormErrors {
  company?: string;
  source?: string;
  details?: string;
}

function companySlug(value: string) {
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    const companyPath = url.pathname.match(/\/company\/([^/?#]+)/);
    if (companyPath?.[1]) return decodeURIComponent(companyPath[1]);
  } catch {
    // A company name is also accepted and normalized for manual review.
  }
  return trimmed
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function SupportCorrectionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "pending" }
    | { kind: "error"; message: string }
    | { kind: "success"; id: string }
  >({ kind: "idle" });

  function clearField(field: keyof FormErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status.kind !== "idle") setStatus({ kind: "idle" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const kind = String(form.get("kind") ?? "") as CorrectionKind;
    const company = String(form.get("company") ?? "").trim();
    const source = String(form.get("source") ?? "").trim();
    const details = String(form.get("details") ?? "").trim();
    const nextErrors: FormErrors = {};

    if (company.length < 2) {
      nextErrors.company =
        "Add the company name or b4joinacompany page this concerns.";
    }
    if (source) {
      try {
        const parsed = new URL(source);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          nextErrors.source =
            "Paste a complete URL beginning with http:// or https://.";
        }
      } catch {
        nextErrors.source =
          "Paste a complete URL beginning with http:// or https://.";
      }
    }
    if (details.length < 10) {
      nextErrors.details =
        "Describe what is wrong and what should be checked.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus({
        kind: "error",
        message:
          "The correction is still a draft. Review the highlighted fields.",
      });
      const first = Object.keys(nextErrors)[0];
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${first}"]`)
        ?.focus();
      return;
    }

    setErrors({});
    setStatus({ kind: "pending" });
    try {
      const response = await fetch("/api/v1/corrections", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          companySlug: companySlug(company),
          kind,
          ...(source ? { suggestedUrl: source } : {}),
          details,
        }),
      });
      const body = (await response.json().catch(() => null)) as
        | { id?: string; error?: { message?: string } }
        | null;
      if (!response.ok) {
        throw new Error(
          body?.error?.message ?? "The correction could not be queued.",
        );
      }
      setStatus({ kind: "success", id: body?.id ?? "queued" });
      formElement.reset();
    } catch (cause) {
      setStatus({
        kind: "error",
        message:
          cause instanceof Error
            ? cause.message
            : "The correction could not be queued.",
      });
    }
  }

  return (
    <section
      aria-labelledby="correction-title"
      className="relative overflow-hidden rounded-2xl border border-line-strong bg-white shadow-panel before:absolute before:top-0 before:bottom-0 before:left-0 before:z-10 before:w-1.25 before:bg-[linear-gradient(to_bottom,var(--color-jade)_0_38%,var(--color-blue)_38%_63%,var(--color-amber)_63%_82%,var(--color-coral)_82%)]"
      id="correction-note"
    >
      <header className="flex items-start justify-between gap-5 border-b border-line py-6 pr-6 pl-7.5 max-sm:grid max-sm:gap-3 max-sm:py-5 max-sm:pr-4.5 max-sm:pl-5.5">
        <div>
          <p className="font-mono text-[10px] font-extrabold tracking-[.08em] text-jade uppercase">
            Correction note
          </p>
          <h2
            className="mt-2 font-display text-[31px] leading-[1.08] font-bold tracking-[-.03em] max-sm:text-[26px]"
            id="correction-title"
          >
            Show what should be checked.
          </h2>
        </div>
        <span className="w-max rounded-full bg-mist px-2 py-1.5 font-mono text-[8px] font-extrabold text-muted">
          {status.kind === "pending"
            ? "Submitting…"
            : status.kind === "success"
              ? "Queued for review"
              : "Draft · not sent"}
        </span>
      </header>

      <p className="border-b border-line bg-[#fbfdfc] py-4 pr-6 pl-7.5 text-[10px] leading-relaxed text-muted max-sm:pr-4.5 max-sm:pl-5.5">
        Add the company or b4joinacompany page, then include the strongest official
        source you have. A source helps separate a correction from an
        unsupported claim.
      </p>

      <form
        noValidate
        onSubmit={submit}
        ref={formRef}
      >
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-4.25 py-5.5 pr-6 pl-7.5 max-sm:grid-cols-1 max-sm:pr-4.5 max-sm:pl-5.5">
          <label className="grid content-start gap-1.5 text-[10px] font-extrabold">
            What needs correction?
            <select
              className="min-h-11.25 w-full rounded-lg border border-line-strong bg-[#fbfdfc] px-3 text-xs text-ink outline-none focus:border-jade focus:ring-3 focus:ring-jade/10"
              defaultValue="website"
              name="kind"
            >
              <option value="website">Official website</option>
              <option value="linkedin">LinkedIn profile</option>
              <option value="careers">Careers page</option>
              <option value="identity">Company identity or name</option>
              <option value="other">Evidence or salary context</option>
            </select>
            <small className="min-h-3.5 text-[8px] leading-snug font-normal text-muted">
              Choose the published detail that needs review.
            </small>
          </label>

          <label className="grid content-start gap-1.5 text-[10px] font-extrabold">
            Company or b4joinacompany page
            <Input
              aria-invalid={Boolean(errors.company)}
              autoComplete="organization"
              className={errors.company ? "border-coral bg-coral-soft" : ""}
              name="company"
              onChange={() => clearField("company")}
              placeholder="Company name or page URL"
              type="text"
            />
            <small className="min-h-3.5 text-[8px] leading-snug font-normal text-muted">
              {errors.company ? (
                <span className="font-bold text-coral">{errors.company}</span>
              ) : (
                "Use the exact company name when possible."
              )}
            </small>
          </label>

          <label className="col-span-full grid content-start gap-1.5 text-[10px] font-extrabold max-sm:col-span-1">
            <span>
              Official source to review{" "}
              <small className="ml-1 text-[8px] font-normal text-quiet">
                Optional
              </small>
            </span>
            <Input
              aria-invalid={Boolean(errors.source)}
              autoComplete="url"
              className={errors.source ? "border-coral bg-coral-soft" : ""}
              inputMode="url"
              name="source"
              onChange={() => clearField("source")}
              placeholder="https://company.com/careers"
              type="url"
            />
            <small className="min-h-3.5 text-[8px] leading-snug font-normal text-muted">
              {errors.source ? (
                <span className="font-bold text-coral">{errors.source}</span>
              ) : (
                "Website, LinkedIn, careers, or another first-party URL."
              )}
            </small>
          </label>

          <label className="col-span-full grid content-start gap-1.5 text-[10px] font-extrabold max-sm:col-span-1">
            What should change?
            <Textarea
              aria-invalid={Boolean(errors.details)}
              className={errors.details ? "border-coral bg-coral-soft" : ""}
              maxLength={3000}
              minLength={10}
              name="details"
              onChange={() => clearField("details")}
              placeholder="Describe what is wrong, what you believe is correct, and where the evidence can be checked."
            />
            <small className="min-h-3.5 text-[8px] leading-snug font-normal text-muted">
              {errors.details ? (
                <span className="font-bold text-coral">{errors.details}</span>
              ) : (
                "At least 10 characters. Keep private workplace details out."
              )}
            </small>
          </label>
        </div>

        {status.kind === "error" && (
          <p
            className="mx-6 mb-5 ml-7.5 rounded-lg border border-coral/30 bg-coral-soft p-3 text-[10px] leading-relaxed text-coral max-sm:mx-4.5 max-sm:ml-5.5"
            role="alert"
          >
            {status.message}
          </p>
        )}
        {status.kind === "success" && (
          <p
            className="mx-6 mb-5 ml-7.5 rounded-lg border border-jade/25 bg-jade-soft p-3 text-[10px] leading-relaxed text-ink-soft max-sm:mx-4.5 max-sm:ml-5.5"
            role="status"
          >
            <strong className="text-ink">Correction queued for review.</strong>{" "}
            Reference {status.id}. Published company data has not changed.
          </p>
        )}

        <footer className="grid grid-cols-[1fr_auto] items-center gap-5 border-t border-line bg-[#fbfdfc] py-4 pr-6 pl-7.5 max-sm:grid-cols-1 max-sm:pr-4.5 max-sm:pl-5.5">
          <p className="text-[8px] leading-relaxed text-muted">
            <strong className="block text-ink">
              Saved for manual review.
            </strong>
            Nothing changes a published company record until a maintainer
            verifies the source and includes it in a later dataset release.
          </p>
          <Button disabled={status.kind === "pending"} type="submit">
            {status.kind === "pending"
              ? "Submitting…"
              : "Submit correction →"}
          </Button>
        </footer>
      </form>

      <ol
        aria-label="How manual correction review works"
        className="relative grid grid-cols-3 border-t border-line bg-mist px-7.5 py-5 before:absolute before:top-7.25 before:right-[16.5%] before:left-[16.5%] before:h-px before:bg-line-strong max-sm:grid-cols-1 max-sm:gap-4 max-sm:before:top-7 max-sm:before:bottom-7 max-sm:before:left-7.5 max-sm:h-auto max-sm:before:h-auto max-sm:before:w-px"
      >
        {[
          ["You send", "A company and source", "bg-jade"],
          ["b4joinacompany checks", "The destination or evidence", "bg-blue"],
          ["If accepted", "A later snapshot is updated", "bg-amber"],
        ].map(([label, copy, color]) => (
          <li
            className="relative z-10 grid justify-items-center gap-2 px-2 text-center max-sm:grid-cols-[16px_1fr] max-sm:justify-items-start max-sm:text-left"
            key={label}
          >
            <span
              className={`size-4 rounded-full border-4 border-mist shadow-[0_0_0_1px_var(--color-line-strong)] ${color}`}
            />
            <div>
              <small className="block font-mono text-[7px] font-extrabold tracking-[.04em] text-muted uppercase">
                {label}
              </small>
              <strong className="mt-1 block text-[9px] leading-snug">
                {copy}
              </strong>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
