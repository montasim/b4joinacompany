"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { initials } from "@/lib/utils";

const suggestions = [
  "What do engineers report?",
  "What changed recently?",
  "Where is evidence mixed?",
];

type AskPayload = {
  text: string;
  citations: string[];
  provider: string;
  gap?: boolean;
  error?: { message?: string };
};

export function AskForm({
  companySlug,
  companyName,
  storyCount,
  snapshotDate,
}: {
  companySlug: string;
  companyName: string;
  storyCount: number;
  snapshotDate: string;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{
    text: string;
    citations: string[];
    provider: string;
    gap?: boolean;
  } | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/v1/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ companySlug, question }),
      });
      const body = await response.text();
      let data: AskPayload | null = null;

      if (body) {
        try {
          data = JSON.parse(body) as AskPayload;
        } catch {
          throw new Error(
            "The research service returned an invalid response. Please try again.",
          );
        }
      }
      if (!response.ok) {
        throw new Error(
          data?.error?.message ?? "The answer could not be generated.",
        );
      }
      if (!data) {
        throw new Error(
          "The research service returned an empty response. Please try again.",
        );
      }
      setAnswer(data);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The answer could not be generated.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="relative overflow-hidden rounded-xl border border-line-strong bg-white p-6 shadow-panel before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-jade"
      onSubmit={submit}
    >
      <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
        <span className="grid size-11 place-items-center rounded-xl bg-jade-soft font-mono text-[10px] font-extrabold text-jade-dark">
          {initials(companyName)}
        </span>
        <div className="grid gap-1">
          <strong className="text-xs">{companyName}</strong>
          <span className="text-[9px] text-muted">
            {storyCount.toLocaleString()} reports · Snapshot {snapshotDate}
          </span>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <Button
            key={item}
            onClick={() => setQuestion(item)}
            size="sm"
            type="button"
            variant="outline"
          >
            {item}
          </Button>
        ))}
      </div>

      <label className="grid gap-2 text-[10px] font-extrabold">
        Your question
        <Textarea
          minLength={8}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about a role, team, topic, or time period"
          required
          value={question}
        />
      </label>
      <div className="mt-4 flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-stretch">
        <p className="m-0 max-w-107.5 text-[9px] leading-snug text-muted">
          Relevant excerpts are sent to the selected AI provider only after you
          choose Find answer.
        </p>
        <Button disabled={pending}>
          {pending ? "Finding evidence…" : "Find answer →"}
        </Button>
      </div>

      {error && (
        <p
          className="mt-4 rounded-lg bg-coral-soft p-3 text-[10px] text-coral"
          role="alert"
        >
          {error}
        </p>
      )}
      {answer && (
        <section
          className="mt-5 rounded-xl border-l-4 border-jade bg-mist p-5"
          aria-live="polite"
        >
          <p className="mb-2 font-mono text-[9px] font-extrabold tracking-wider text-jade uppercase">
            {answer.gap ? "Evidence gap" : "Cited answer"} · {answer.provider}
          </p>
          <h3 className="font-display text-xl leading-snug">{answer.text}</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {answer.citations.map((item) => (
              <span
                className="rounded bg-white px-2 py-1 font-mono text-[8px] text-blue"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      )}
    </form>
  );
}
