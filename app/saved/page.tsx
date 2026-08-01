import Link from "next/link";
import { headers } from "next/headers";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  LockKeyhole,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getCompany } from "@/lib/research";
import { initials } from "@/lib/utils";
import {
  listCheckpoints,
  type StoredCheckpoint,
} from "@/lib/workspace";

export const dynamic = "force-dynamic";

type SavedCheckpoint = StoredCheckpoint & {
  companyName: string;
};

const stagePresentation: Record<
  string,
  {
    label: string;
    nextAction: string;
    badgeClass: string;
    accentClass: string;
    stripeClass: string;
  }
> = {
  applying: {
    label: "Checkpoint ready",
    nextAction: "Review the evidence before you submit the application.",
    badgeClass: "bg-jade-soft text-jade-dark",
    accentClass: "bg-jade",
    stripeClass: "before:bg-jade",
  },
  interviewing: {
    label: "Interview prep",
    nextAction: "Prepare the role and team questions for your next interview.",
    badgeClass: "bg-blue-soft text-blue",
    accentClass: "bg-blue",
    stripeClass: "before:bg-blue",
  },
  "reviewing an offer": {
    label: "Decision pending",
    nextAction: "Review the checkpoint before your next offer conversation.",
    badgeClass: "bg-amber-soft text-amber-dark",
    accentClass: "bg-amber",
    stripeClass: "before:bg-amber",
  },
};

function stageKey(stage: string) {
  return stage.trim().toLocaleLowerCase("en");
}

function presentationFor(stage: string) {
  return (
    stagePresentation[stageKey(stage)] ?? {
      label: "In progress",
      nextAction: "Return to the evidence and continue your decision.",
      badgeClass: "bg-mist-deep text-ink-soft",
      accentClass: "bg-line-strong",
      stripeClass: "before:bg-line-strong",
    }
  );
}

function companyNameFallback(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function relativeUpdatedAt(date: Date) {
  const timestamp = new Date(date).getTime();
  const elapsedDays = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000)),
  );

  if (elapsedDays === 0) return "today";
  if (elapsedDays === 1) return "yesterday";
  if (elapsedDays < 7) return `${elapsedDays} days ago`;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year:
      new Date(date).getFullYear() === new Date().getFullYear()
        ? undefined
        : "numeric",
  }).format(new Date(date));
}

async function enrichCheckpoints(checkpoints: StoredCheckpoint[]) {
  return Promise.all(
    checkpoints.map(async (checkpoint): Promise<SavedCheckpoint> => {
      const company = await getCompany(checkpoint.companySlug);
      return {
        ...checkpoint,
        companyName:
          company?.name ?? companyNameFallback(checkpoint.companySlug),
      };
    }),
  );
}

function SignedOutWorkspace() {
  const lockedItems = [
    {
      title: "Your company, role, stage, and priority",
      label: "Company checkpoint",
      copy: "The context behind the decision you are making.",
      state: "Private",
      marker: "bg-blue",
    },
    {
      title: "The exact research revision you saved",
      label: "Evidence snapshot",
      copy: "New evidence never replaces it silently.",
      state: "Pinned",
      marker: "bg-amber",
    },
    {
      title: "The detail you want for the next conversation",
      label: "Private note",
      copy: "Attached to the checkpoint—not the public company page.",
      state: "Yours",
      marker: "bg-jade",
    },
    {
      title: "Where you intended to continue",
      label: "Next action",
      copy: "Return without rebuilding the research context.",
      state: "Ready",
      marker: "bg-coral",
    },
  ];

  return (
    <main
      id="main"
      className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[linear-gradient(rgba(20,120,110,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(20,120,110,.04)_1px,transparent_1px)] bg-size-[32px_32px]"
    >
      <span
        className="pointer-events-none absolute top-14 right-[max(-170px,calc((100vw-1120px)/2-260px))] size-130 rounded-full border border-jade/15 max-sm:hidden"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid w-[calc(100%_-_40px)] max-w-280 grid-cols-[minmax(360px,.88fr)_minmax(510px,1.12fr)] items-center gap-16 py-[60px] pb-[78px] max-lg:grid-cols-1 max-lg:gap-10 max-sm:w-[calc(100%_-_28px)] max-sm:py-9 max-sm:pb-14">
      <section className="max-w-145">
        <p className="mb-3 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">
          Private decision desk
        </p>
        <h1 className="font-display text-[clamp(44px,6vw,68px)] leading-[.98] font-bold tracking-[-.04em] text-ink">
          Return to the decisions{" "}
          <em className="text-jade not-italic underline decoration-amber decoration-[6px] underline-offset-5 max-sm:decoration-4">
            still in motion.
          </em>
        </h1>
        <p className="mt-5 max-w-130 text-[15px] leading-[1.7] text-ink-soft">
          Keep the company, role, decision stage, priority, private note, and
          exact evidence snapshot together.
        </p>
        <Button asChild className="mt-7 w-full max-w-92 justify-between" size="lg">
          <Link href="/auth/sign-in?next=/saved">
            <span className="grid size-6 place-items-center rounded-md bg-white font-bold text-blue">
              G
            </span>
            <span>Continue with Google</span>
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Button>
        <p className="mt-2 max-w-92 text-center text-[10px] text-muted">
          One Google account · No separate b4joinacompany password
        </p>
        <aside className="mt-7 flex max-w-125 items-start gap-3 rounded-xl border border-line bg-white/65 p-4">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-jade-soft text-jade">
            <Check aria-hidden className="size-3" />
          </span>
          <p className="text-[11px] leading-relaxed text-ink-soft">
            <strong className="block text-ink">Public research stays open.</strong>
            Company research and the browser extension do not require an
            account.{" "}
            <Link className="font-extrabold text-jade-dark" href="/#research">
              Check a company →
            </Link>{" "}
            or{" "}
            <Link className="font-extrabold text-jade-dark" href="/extension">
              Use the extension →
            </Link>
            .
          </p>
        </aside>
      </section>

      <Card className="relative overflow-hidden rounded-2xl shadow-panel before:absolute before:inset-y-0 before:left-0 before:z-2 before:w-1.25 before:bg-[linear-gradient(to_bottom,#356c82_0_27%,#e9b44c_27%_52%,#14786e_52%_76%,#c95d63_76%)]">
        <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="mb-1 font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
              Locked workspace
            </p>
            <h2 className="font-display text-[26px] leading-tight font-bold tracking-[-.025em]">
              What waits behind sign-in.
            </h2>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-mist text-jade-dark">
            <LockKeyhole aria-hidden className="size-4" />
          </span>
        </header>
        <ol className="relative m-0 grid list-none px-6 before:absolute before:top-12 before:bottom-12 before:left-[38px] before:w-px before:bg-line-strong">
          {lockedItems.map((item) => (
            <li
              className="grid grid-cols-[12px_minmax(0,1fr)_auto] items-start gap-4 border-b border-line py-5 last:border-b-0"
              key={item.label}
            >
              <span
                className={`relative z-1 mt-1.5 size-3.5 rounded-full border-[3px] border-white ring-1 ring-line-strong ${item.marker}`}
                aria-hidden
              />
              <div>
                <small className="font-mono text-[8px] font-extrabold tracking-[.08em] text-muted uppercase">
                  {item.label}
                </small>
                <strong className="mt-1 block text-[12px] leading-snug text-ink">
                  {item.title}
                </strong>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  {item.copy}
                </p>
              </div>
              <Badge className="bg-mist text-muted">{item.state}</Badge>
            </li>
          ))}
        </ol>
        <footer className="flex items-center justify-between gap-4 border-t border-line bg-mist/60 px-6 py-4 text-[9px] text-muted">
          <span>Google identifies the workspace</span>
          <strong className="text-ink-soft">No visitor data is shown here</strong>
        </footer>
      </Card>
      </div>
    </main>
  );
}

function EmptyWorkspace() {
  return (
    <section className="grid min-h-105 place-items-center rounded-xl border border-dashed border-line-strong bg-white/55 px-6 py-12 text-center">
      <div className="max-w-145">
        <span className="mx-auto mb-5 grid size-12 place-items-center rounded-full bg-jade-soft text-jade-dark">
          <LockKeyhole aria-hidden className="size-5" />
        </span>
        <p className="mb-2 font-mono text-[10px] font-extrabold tracking-[.08em] text-jade uppercase">
          Private workspace
        </p>
        <h2 className="font-display text-[clamp(32px,5vw,48px)] leading-tight font-bold tracking-[-.03em]">
          No checkpoints saved yet.
        </h2>
        <p className="mx-auto mt-3 max-w-125 text-[12px] leading-relaxed text-muted">
          Choose a company, review its brief, then save the role, stage,
          priority, note, and evidence revision you want to revisit.
        </p>
        <Button asChild className="mt-6">
          <Link href="/#research">
            Check a company <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Button>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-ink-soft">
          <span className="rounded-md bg-white px-3 py-2">Choose a company</span>
          <span aria-hidden className="text-jade">
            →
          </span>
          <span className="rounded-md bg-white px-3 py-2">Review the brief</span>
          <span aria-hidden className="text-jade">
            →
          </span>
          <span className="rounded-md bg-white px-3 py-2">
            Save the checkpoint
          </span>
        </div>
      </div>
    </section>
  );
}

function WorkspaceUnavailable() {
  return (
    <section
      className="flex items-start gap-4 rounded-xl border border-coral/35 bg-coral-soft p-5"
      role="alert"
    >
      <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-coral" />
      <div className="min-w-0">
        <h2 className="font-display text-xl font-bold">
          Your workspace could not be loaded.
        </h2>
        <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
          The saved records are still private and unchanged. Reload this page
          when the connection is available.
        </p>
        <Button asChild className="mt-4" size="sm" variant="outline">
          <Link href="/saved">Reload workspace</Link>
        </Button>
      </div>
    </section>
  );
}

function SavedLedger({ checkpoints }: { checkpoints: SavedCheckpoint[] }) {
  return (
    <section
      className="overflow-hidden rounded-[14px] border border-line-strong bg-white shadow-[0_12px_35px_rgb(22_56_61_/_6%)]"
      aria-labelledby="saved-ledger-title"
    >
      <header className="flex items-end justify-between gap-6 border-b border-line bg-white px-6 py-5 max-sm:items-start">
        <div>
          <p className="mb-1 font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
            Saved checkpoints
          </p>
          <h2
            className="font-display text-[26px] leading-tight font-bold tracking-[-.025em]"
            id="saved-ledger-title"
          >
            Continue where you left off.
          </h2>
        </div>
        <span className="text-right text-[9px] leading-relaxed text-muted">
          {checkpoints.length.toLocaleString()}{" "}
          {checkpoints.length === 1 ? "checkpoint" : "checkpoints"}
          <br />
          newest first
        </span>
      </header>

      <div className="grid">
        {checkpoints.map((checkpoint, index) => {
          const presentation = presentationFor(checkpoint.stage);
          const hasNote = checkpoint.note.trim().length > 0;

          return (
            <details
              className={`group relative border-b border-line bg-white before:absolute before:inset-y-0 before:left-0 before:z-2 before:w-1 last:border-b-0 ${presentation.stripeClass}`}
              key={checkpoint.id}
              open={index === 0}
            >
              <summary className="grid min-h-22 cursor-pointer list-none grid-cols-[48px_minmax(0,1fr)_auto_auto_20px] items-center gap-4 px-6 py-4 marker:hidden hover:bg-mist/45 focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-jade/30 max-md:grid-cols-[44px_minmax(0,1fr)_20px] max-sm:px-4">
                <span className="relative grid size-12 place-items-center rounded-xl bg-jade-soft font-mono text-[11px] font-extrabold text-jade-dark max-md:size-11">
                  {initials(checkpoint.companyName)}
                  <span
                    className={`absolute bottom-0 left-0 h-1 w-full rounded-b-xl ${presentation.accentClass}`}
                    aria-hidden
                  />
                </span>
                <div className="min-w-0">
                  <strong className="block truncate text-[13px] text-ink">
                    {checkpoint.companyName}
                  </strong>
                  <p className="mt-1 truncate text-[10px] text-muted">
                    {checkpoint.role} · {checkpoint.stage}
                  </p>
                </div>
                <span
                  className={`rounded-md px-2.5 py-1 text-[9px] font-extrabold max-md:col-start-2 max-md:row-start-2 max-md:w-fit ${presentation.badgeClass}`}
                >
                  {presentation.label}
                </span>
                <time
                  className="text-right text-[9px] text-muted max-md:col-start-2 max-md:row-start-2 max-md:justify-self-end"
                  dateTime={new Date(checkpoint.updatedAt).toISOString()}
                >
                  Updated {relativeUpdatedAt(checkpoint.updatedAt)}
                </time>
                <ChevronDown
                  aria-hidden
                  className="size-4 text-muted transition-transform group-open:rotate-180 max-md:col-start-3 max-md:row-span-2 max-md:row-start-1"
                />
              </summary>

              <div className="grid grid-cols-[minmax(0,1fr)_310px] border-t border-line bg-mist/35 max-lg:grid-cols-1">
                <div className="grid grid-cols-3 divide-x divide-line p-5 max-sm:grid-cols-1 max-sm:divide-x-0 max-sm:divide-y">
                  <article className="px-4 first:pl-0 max-sm:px-0 max-sm:py-4 max-sm:first:pt-0">
                    <small className="font-mono text-[8px] font-extrabold tracking-[.08em] text-muted uppercase">
                      Priority
                    </small>
                    <strong className="mt-2 block text-[11px] text-ink">
                      {checkpoint.priority}
                    </strong>
                    <p className="mt-1 text-[9px] leading-relaxed text-muted">
                      What matters most in this decision.
                    </p>
                  </article>
                  <article className="px-4 max-sm:px-0 max-sm:py-4">
                    <small className="font-mono text-[8px] font-extrabold tracking-[.08em] text-muted uppercase">
                      Evidence snapshot
                    </small>
                    <strong className="mt-2 block break-words text-[11px] text-ink">
                      {checkpoint.snapshotVersion} · revision{" "}
                      {checkpoint.revision}
                    </strong>
                    <p className="mt-1 text-[9px] leading-relaxed text-muted">
                      This saved revision remains pinned.
                    </p>
                  </article>
                  <article className="px-4 last:pr-0 max-sm:px-0 max-sm:py-4 max-sm:last:pb-0">
                    <small className="font-mono text-[8px] font-extrabold tracking-[.08em] text-muted uppercase">
                      Private note
                    </small>
                    <strong className="mt-2 block text-[11px] text-ink">
                      {hasNote ? "Note attached" : "No note yet"}
                    </strong>
                    <p className="mt-1 line-clamp-3 text-[9px] leading-relaxed text-muted">
                      {hasNote
                        ? checkpoint.note
                        : "Add context when you return to this checkpoint."}
                    </p>
                  </article>
                </div>
                <aside className="grid content-center gap-4 border-l border-line bg-white p-5 max-lg:border-t max-lg:border-l-0">
                  <div>
                    <small className="font-mono text-[8px] font-extrabold tracking-[.08em] text-jade uppercase">
                      Next action
                    </small>
                    <strong className="mt-2 block text-[11px] leading-relaxed text-ink">
                      {presentation.nextAction}
                    </strong>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href={`/company/${checkpoint.companySlug}`}>
                        Open checkpoint
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/compare">Compare companies</Link>
                    </Button>
                  </div>
                </aside>
              </div>
            </details>
          );
        })}
      </div>

      <footer className="flex items-center justify-between gap-4 border-t border-line bg-mist/55 px-6 py-4 text-[9px] text-muted max-sm:flex-col max-sm:items-start">
        <p>Checkpoints are private and ordered by their latest update.</p>
        <Link className="font-extrabold text-jade-dark" href="/support">
          Get support →
        </Link>
      </footer>
    </section>
  );
}

export default async function SavedPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <>
        <SiteHeader active="Saved" mode="public" />
        <SignedOutWorkspace />
      </>
    );
  }

  let checkpoints: SavedCheckpoint[] | null = null;

  try {
    checkpoints = await enrichCheckpoints(
      await listCheckpoints(session.user.id),
    );
  } catch {
    checkpoints = null;
  }

  return (
    <>
      <SiteHeader active="Saved" mode="user" />
      <main id="main" className="mx-auto min-h-[calc(100vh-64px)] w-[calc(100%_-_40px)] max-w-280 py-14 max-sm:w-[calc(100%_-_28px)] max-sm:py-8">
        <header className="mb-8 flex items-end justify-between gap-8 max-md:flex-col max-md:items-start">
          <div className="max-w-175">
            <p className="mb-3 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">
              Private workspace
            </p>
            <h1 className="font-display text-[clamp(42px,6vw,64px)] leading-[.98] font-bold tracking-[-.04em] text-ink">
              Your decision desk.
            </h1>
            <p className="mt-4 max-w-155 text-[14px] leading-[1.7] text-ink-soft">
              Resume a checkpoint from the role, stage, priority, note, and
              evidence revision you saved.
            </p>
          </div>
          <Button asChild>
            <Link href="/#research">
              Check another company
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
        </header>

        {checkpoints === null ? (
          <WorkspaceUnavailable />
        ) : checkpoints.length === 0 ? (
          <EmptyWorkspace />
        ) : (
          <SavedLedger checkpoints={checkpoints} />
        )}
      </main>
    </>
  );
}
