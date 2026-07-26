"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileSearch,
  MessageSquareText,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { type FormEvent, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

const fallbackQuestions = [
  "What do employees report about management and feedback?",
  "What should I verify about pay and overtime?",
  "Where does the available evidence disagree?",
];

type AskPayload = {
  text?: string;
  citations?: string[];
  provider?: string;
  gap?: boolean;
  error?: { code?: string; message?: string };
};

type AnswerState = {
  text: string;
  citations: string[];
  provider: string;
  gap?: boolean;
  question: string;
};

type ErrorState = {
  message: string;
  quota: boolean;
};

export function AskForm({
  companySlug,
  companyName,
  storyCount,
  snapshotDate,
  preparedQuestions,
  initialQuestion = "",
}: {
  companySlug: string;
  companyName: string;
  storyCount: number;
  snapshotDate: string;
  preparedQuestions: string[];
  initialQuestion?: string;
}) {
  const suggestions =
    preparedQuestions.length > 0
      ? preparedQuestions.slice(0, 3)
      : fallbackQuestions;
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState<AnswerState | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trimmedQuestion = question.trim();
  const canSubmit = trimmedQuestion.length >= 8 && !pending;

  function clearResult() {
    setAnswer(null);
    setError(null);
  }

  function updateQuestion(value: string) {
    setQuestion(value);
    if (answer || error) clearResult();
  }

  function selectPreparedQuestion(value: string) {
    updateQuestion(value);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submittedQuestion = question.trim();
    if (submittedQuestion.length < 8 || pending) return;

    setPending(true);
    setAnswer(null);
    setError(null);

    try {
      const response = await fetch("/api/v1/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          companySlug,
          question: submittedQuestion,
        }),
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
        setError({
          message:
            data?.error?.message ?? "The answer could not be generated.",
          quota:
            response.status === 429 ||
            data?.error?.code === "GENERATION_QUOTA_REACHED",
        });
        return;
      }

      if (!data?.text) {
        throw new Error(
          "The research service returned an empty response. Please try again.",
        );
      }

      setAnswer({
        text: data.text,
        citations: data.citations ?? [],
        provider: data.provider ?? "research adapter",
        gap: data.gap,
        question: submittedQuestion,
      });
    } catch (cause) {
      setError({
        message:
          cause instanceof Error
            ? cause.message
            : "The answer could not be generated.",
        quota: false,
      });
    } finally {
      setPending(false);
    }
  }

  const finalStepTone = error
    ? "border-coral bg-coral-soft text-coral"
    : answer?.gap
      ? "border-amber bg-amber-soft text-amber-dark"
      : answer
        ? "border-jade bg-jade-soft text-jade-dark"
        : "border-line bg-white text-muted";

  return (
    <form
      aria-busy={pending}
      className="relative overflow-hidden rounded-[14px] border border-line-strong bg-white shadow-panel"
      onSubmit={submit}
    >
      <header className="grid grid-cols-3 border-b border-line bg-[#fbfdfc] max-md:grid-cols-1">
        <div className="flex items-center gap-3 border-r border-line px-5 py-4 max-md:border-r-0 max-md:border-b">
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-amber bg-amber-soft font-mono text-[10px] font-extrabold text-amber-dark">
            1
          </span>
          <span>
            <strong className="block text-[11px]">Ask one question</strong>
            <small className="mt-0.5 block text-[8px] text-muted">
              Keep it focused and specific
            </small>
          </span>
        </div>
        <div className="flex items-center gap-3 border-r border-line px-5 py-4 max-md:border-r-0 max-md:border-b">
          <span
            className={`grid size-8 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-extrabold ${
              pending || answer || error
                ? "border-blue bg-blue-soft text-blue"
                : "border-line bg-white text-muted"
            }`}
          >
            {answer ? <Check aria-hidden="true" className="size-3.5" /> : "2"}
          </span>
          <span>
            <strong className="block text-[11px]">Match the reports</strong>
            <small className="mt-0.5 block text-[8px] text-muted">
              Retrieve the closest excerpts
            </small>
          </span>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <span
            className={`grid size-8 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-extrabold ${finalStepTone}`}
          >
            {answer && !answer.gap ? (
              <Check aria-hidden="true" className="size-3.5" />
            ) : (
              "3"
            )}
          </span>
          <span>
            <strong className="block text-[11px]">Read the cited answer</strong>
            <small className="mt-0.5 block text-[8px] text-muted">
              See the answer or evidence gap
            </small>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-[minmax(0,1fr)_300px] max-lg:grid-cols-1">
        <section className="p-7 max-sm:p-5">
          <div className="mb-5">
            <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
              Prepared from this company’s evidence
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.65rem,3vw,2.15rem)] leading-tight font-bold tracking-[-.025em]">
              Start with a question worth asking.
            </h2>
            <p className="mt-2 max-w-170 text-[12px] leading-relaxed text-muted">
              Choose a prepared prompt or write your own. The search remains
              limited to {companyName}.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2.5 max-md:grid-cols-1">
            {suggestions.map((item, index) => (
              <button
                className="group flex min-h-20 cursor-pointer items-start gap-3 rounded-lg border border-line-strong bg-[#fbfdfc] p-3 text-left text-[10px] leading-relaxed font-bold text-ink transition-colors hover:border-jade hover:bg-jade-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-jade/25 disabled:pointer-events-none disabled:opacity-50"
                disabled={pending}
                key={`${index}-${item}`}
                onClick={() => selectPreparedQuestion(item)}
                type="button"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-jade-soft font-mono text-[8px] font-extrabold text-jade-dark group-hover:bg-white">
                  {index + 1}
                </span>
                <span>{item}</span>
              </button>
            ))}
          </div>

          <label
            className="grid gap-2 text-[11px] font-extrabold"
            htmlFor="evidence-question"
          >
            What do you want to verify?
            <Textarea
              className="min-h-32 bg-white px-4 py-3.5 text-sm"
              disabled={pending}
              id="evidence-question"
              maxLength={500}
              minLength={8}
              onChange={(event) => updateQuestion(event.target.value)}
              placeholder="Example: What do engineers report about overtime?"
              ref={textareaRef}
              required
              value={question}
            />
          </label>

          <div className="mt-3 flex items-center justify-between gap-4 text-[9px] text-muted">
            <p>Use a role, concern, or time period to make the search sharper.</p>
            <span className="shrink-0 font-mono">
              {question.length.toLocaleString()} / 500
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-5 border-t border-line pt-5 max-sm:flex-col max-sm:items-stretch">
            <p className="m-0 max-w-120 text-[9px] leading-relaxed text-muted">
              Nothing is sent to the AI provider until you choose Find a cited
              answer.
            </p>
            <Button
              className="min-w-45"
              disabled={!canSubmit}
              size="lg"
            >
              {pending ? (
                <>
                  <Search aria-hidden="true" className="size-4 animate-pulse" />
                  Searching reports…
                </>
              ) : (
                <>
                  Find a cited answer
                  <ArrowRight aria-hidden="true" className="size-4" />
                </>
              )}
            </Button>
          </div>
        </section>

        <aside className="relative overflow-hidden bg-ink px-6 py-7 text-white before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-[linear-gradient(to_right,#356c82_0_34%,#e9b44c_34%_67%,#14786e_67%)] max-lg:border-t max-lg:border-line max-sm:px-5 max-sm:py-6">
          <Badge className="bg-white/10 text-white">Evidence contract</Badge>
          <h2 className="mt-3 font-display text-[24px] leading-tight font-bold">
            The answer stays inside the evidence.
          </h2>
          <div className="mt-5 grid gap-4">
            <div className="flex items-start gap-3">
              <FileSearch
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-amber"
              />
              <p className="text-[10px] leading-relaxed text-white/75">
                Only reports attached to {companyName} can be retrieved.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-jade-soft"
              />
              <p className="text-[10px] leading-relaxed text-white/75">
                Your question and relevant excerpts are sent only after you
                submit.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-coral"
              />
              <p className="text-[10px] leading-relaxed text-white/75">
                If the reports cannot support an answer, you get an explicit
                evidence gap—not a guess.
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-white/15 pt-4">
            <p className="font-mono text-[8px] tracking-[.08em] text-white/55 uppercase">
              Current snapshot
            </p>
            <strong className="mt-1.5 block text-[11px]">
              {storyCount.toLocaleString()} reports · {snapshotDate}
            </strong>
          </div>
        </aside>
      </div>

      <section
        aria-live="polite"
        className="border-t border-line bg-mist px-7 py-6 max-sm:px-5"
      >
        {!pending && !error && !answer && (
          <div className="grid min-h-31 place-items-center rounded-xl border border-dashed border-line-strong bg-white/70 px-5 py-6 text-center">
            <div>
              <MessageSquareText
                aria-hidden="true"
                className="mx-auto size-5 text-jade"
              />
              <p className="mt-2 font-mono text-[8px] font-extrabold tracking-[.08em] text-jade uppercase">
                No search yet
              </p>
              <h2 className="mt-2 font-display text-[21px] font-bold">
                Your cited answer will appear here.
              </h2>
              <p className="mt-1.5 text-[10px] text-muted">
                Ask one focused question to retrieve the relevant evidence.
              </p>
            </div>
          </div>
        )}

        {pending && (
          <div className="grid min-h-31 place-items-center rounded-xl border border-blue/30 bg-blue-soft px-5 py-6 text-center">
            <div>
              <FileSearch
                aria-hidden="true"
                className="mx-auto size-5 animate-pulse text-blue"
              />
              <p className="mt-2 font-mono text-[8px] font-extrabold tracking-[.08em] text-blue uppercase">
                Searching the evidence
              </p>
              <h2 className="mt-2 font-display text-[21px] font-bold">
                Looking through {storyCount.toLocaleString()}{" "}
                {storyCount === 1 ? "report" : "reports"}.
              </h2>
              <p className="mt-1.5 text-[10px] text-muted">
                Matching the closest excerpts before asking the provider.
              </p>
            </div>
          </div>
        )}

        {!pending && error && (
          <div
            className={`rounded-xl border p-5 ${
              error.quota
                ? "border-amber/40 bg-amber-soft"
                : "border-coral/35 bg-coral-soft"
            }`}
            role="alert"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                aria-hidden="true"
                className={`mt-0.5 size-5 shrink-0 ${
                  error.quota ? "text-amber-dark" : "text-coral"
                }`}
              />
              <div className="min-w-0">
                <p
                  className={`font-mono text-[8px] font-extrabold tracking-[.08em] uppercase ${
                    error.quota ? "text-amber-dark" : "text-coral"
                  }`}
                >
                  {error.quota
                    ? "Generation allowance reached"
                    : "Research service unavailable"}
                </p>
                <h2 className="mt-2 font-display text-[21px] font-bold">
                  {error.quota
                    ? "The evidence is still available."
                    : "Your question was not answered."}
                </h2>
                <p className="mt-2 max-w-180 text-[11px] leading-relaxed text-ink-soft">
                  {error.message}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {!error.quota && (
                    <Button size="sm" type="submit" variant="outline">
                      <RotateCcw aria-hidden="true" className="size-3.5" />
                      Try again
                    </Button>
                  )}
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/company/${companySlug}#sources`}>
                      Review company sources
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!pending && answer && (
          <article
            className={`overflow-hidden rounded-xl border bg-white ${
              answer.gap ? "border-amber/50" : "border-jade/35"
            }`}
          >
            <header className="border-b border-line px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge tone={answer.gap ? "amber" : "jade"}>
                  {answer.gap
                    ? "Evidence gap"
                    : "Cited answer · community evidence"}
                </Badge>
                <span className="font-mono text-[8px] text-muted uppercase">
                  {answer.provider}
                </span>
              </div>
              <h2 className="mt-3 font-display text-[clamp(1.45rem,3vw,1.9rem)] leading-tight font-bold tracking-[-.02em]">
                {answer.gap
                  ? "The reports do not answer this clearly."
                  : "What the retrieved reports say"}
              </h2>
              <p className="mt-2 text-[10px] leading-relaxed text-muted">
                <strong className="text-ink-soft">Asked:</strong>{" "}
                {answer.question}
              </p>
            </header>

            <div className="grid grid-cols-[minmax(0,1fr)_250px] max-md:grid-cols-1">
              <div className="px-5 py-5">
                <p className="whitespace-pre-wrap text-[15px] leading-[1.75] text-ink-soft">
                  {answer.text}
                </p>
              </div>
              <aside className="border-l border-line bg-[#fbfdfc] px-5 py-5 max-md:border-t max-md:border-l-0">
                <p className="font-mono text-[8px] font-extrabold tracking-[.08em] text-blue uppercase">
                  Evidence labels used
                </p>
                {answer.citations.length > 0 ? (
                  <ol className="mt-3 grid gap-2">
                    {answer.citations.map((item, index) => (
                      <li
                        className="flex items-start gap-2 rounded-md border border-line bg-white px-2.5 py-2 font-mono text-[8px] leading-relaxed text-blue"
                        key={`${item}-${index}`}
                      >
                        <span className="font-extrabold">S{index + 1}</span>
                        <span>{item.replace(/^S\d+\s*·\s*/, "")}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-3 text-[9px] leading-relaxed text-muted">
                    No source label supported a more specific answer.
                  </p>
                )}
                <Link
                  className="mt-4 inline-flex items-center gap-1 text-[9px] font-extrabold text-jade-dark underline decoration-jade/30 underline-offset-3"
                  href={`/company/${companySlug}#sources`}
                >
                  Inspect company sources
                  <ArrowRight aria-hidden="true" className="size-3" />
                </Link>
              </aside>
            </div>

            <footer className="flex items-center justify-between gap-4 border-t border-line bg-mist px-5 py-3 max-sm:flex-col max-sm:items-start">
              <p className="text-[8px] leading-relaxed text-muted">
                Snapshot {snapshotDate} · The result describes retrieved
                workplace reports, not verified company policy.
              </p>
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 text-[9px] font-extrabold text-jade-dark underline decoration-jade/30 underline-offset-3"
                onClick={() => {
                  clearResult();
                  requestAnimationFrame(() => textareaRef.current?.focus());
                }}
                type="button"
              >
                <RotateCcw aria-hidden="true" className="size-3" />
                Ask another question
              </button>
            </footer>
          </article>
        )}
      </section>
    </form>
  );
}
