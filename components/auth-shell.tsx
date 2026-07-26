import Link from "next/link";
import { Check } from "lucide-react";

import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";

export function AuthShell({
  callbackURL = "/saved",
  error
}: {
  callbackURL?: string;
  error?: string;
}) {
  return (
    <>
      <AuthHeader />
      <main className="min-h-[calc(100vh-68px)] bg-[linear-gradient(rgba(19,59,66,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(19,59,66,.045)_1px,transparent_1px)] bg-size-[32px_32px]">
        <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-290 grid-cols-[minmax(0,.92fr)_minmax(500px,1.08fr)] items-center gap-16 py-12 max-lg:grid-cols-1 max-lg:gap-10 max-sm:w-[calc(100%_-_28px)] max-sm:py-8">
          <section className="max-w-145">
            <p className="font-mono text-[10px] leading-tight font-extrabold tracking-[.09em] text-jade uppercase">
              Private website workspace
            </p>
            <h1 className="mt-3 font-display text-[clamp(46px,5.4vw,66px)] leading-[.98] font-bold tracking-[-.04em] text-ink">
              Carry the research{" "}
              <em className="text-jade not-italic">
                behind your next decision.
              </em>
            </h1>
            <p className="mt-5 max-w-132 text-[14px] leading-[1.7] text-ink-soft">
              Keep a company checkpoint, decision context, private note, and
              pinned evidence revision—then return without rebuilding your
              research.
            </p>

            <section className="mt-7 overflow-hidden rounded-xl border border-line-strong bg-white shadow-sm">
              <header className="flex items-start justify-between gap-4 px-5 pt-5">
                <div>
                  <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
                    One Google account
                  </p>
                  <h2 className="mt-2 font-display text-[25px] leading-tight font-bold tracking-[-.025em]">
                    Open your private workspace.
                  </h2>
                </div>
                <Badge>Google only</Badge>
              </header>
              <div className="px-5 pb-5">
                <p className="mt-3 text-[10px] leading-relaxed text-muted">
                  Google identifies your workspace. b4join does not receive or
                  store your Google password.
                </p>
                <div className="mt-4">
                  <AuthForm
                    callbackURL={callbackURL}
                    googleEnabled={Boolean(
                      process.env.GOOGLE_CLIENT_ID &&
                        process.env.GOOGLE_CLIENT_SECRET
                    )}
                    initialError={error}
                  />
                </div>

                <details className="group mt-4 rounded-lg border border-line bg-mist/55" open>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[10px] font-extrabold text-ink marker:hidden">
                    After Google sign-in
                    <span className="text-jade transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="grid grid-cols-2 gap-2 border-t border-line p-3 max-sm:grid-cols-1">
                    <article className="rounded-lg border border-line bg-white p-3">
                      <small className="font-mono text-[8px] font-extrabold tracking-[.07em] text-jade uppercase">
                        Personal
                      </small>
                      <strong className="mt-1 block text-[11px]">
                        User workspace
                      </strong>
                      <p className="mt-1 text-[9px] leading-relaxed text-muted">
                        Resume your real saved checkpoints.
                      </p>
                    </article>
                    <article className="rounded-lg border border-line bg-white p-3">
                      <small className="font-mono text-[8px] font-extrabold tracking-[.07em] text-coral uppercase">
                        Restricted
                      </small>
                      <strong className="mt-1 block text-[11px]">
                        Admin workspace
                      </strong>
                      <p className="mt-1 text-[9px] leading-relaxed text-muted">
                        Review withheld evidence changes.
                      </p>
                    </article>
                  </div>
                </details>
                <p className="mt-3 text-center text-[9px] text-muted">
                  Account-scoped workspace · No separate b4join password
                </p>
              </div>
            </section>

            <aside className="mt-4 flex items-start gap-3 rounded-xl border border-line bg-white/70 p-4">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-jade-soft text-jade">
                <Check className="size-3" aria-hidden="true" />
              </span>
              <p className="text-[10px] leading-relaxed text-ink-soft">
                <strong className="block text-ink">
                  No account is needed for public company research or the
                  browser extension.
                </strong>
                <Link className="mr-3 font-extrabold text-jade-dark" href="/">
                  Continue public research →
                </Link>
                <Link className="font-extrabold text-jade-dark" href="/extension">
                  See the extension →
                </Link>
              </p>
            </aside>
          </section>

          <figure className="overflow-hidden rounded-xl border border-line-strong bg-white shadow-panel">
            <figcaption className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
                  Example private checkpoint
                </p>
                <h2 className="mt-2 font-display text-[25px] leading-tight font-bold tracking-[-.025em]">
                  What your workspace keeps together.
                </h2>
              </div>
              <Badge>Private</Badge>
            </figcaption>

            <header className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line px-6 py-4">
              <span className="grid size-11 place-items-center rounded-xl bg-jade-soft font-mono text-[10px] font-extrabold text-jade-dark">
                EC
              </span>
              <div>
                <strong className="block text-[12px]">Example company</strong>
                <p className="mt-1 text-[9px] text-muted">
                  Your role · Interviewing
                </p>
              </div>
              <span className="text-right text-[8px] text-muted">
                Saved recently
              </span>
            </header>

            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 border-b border-line bg-mist/70 px-6 py-4 text-center">
              <p>
                <strong className="block font-display text-xl">1</strong>
                <span className="text-[8px] text-muted">checkpoint</span>
              </p>
              <span className="text-jade" aria-hidden="true">→</span>
              <p>
                <strong className="block font-display text-xl">Offer</strong>
                <span className="text-[8px] text-muted">decision stage</span>
              </p>
              <span className="text-jade" aria-hidden="true">→</span>
              <p>
                <strong className="block font-display text-xl">R3</strong>
                <span className="text-[8px] text-muted">revision pinned</span>
              </p>
            </div>

            <ol className="m-0 grid list-none px-6">
              {[
                [
                  "Decision context",
                  "The company, role, stage, and priority stay together.",
                  "Return to the same decision without starting over.",
                  "Saved",
                  "bg-blue"
                ],
                [
                  "Evidence revision",
                  "The research revision you reviewed stays pinned.",
                  "It is never replaced silently by a newer snapshot.",
                  "Pinned",
                  "bg-amber"
                ],
                [
                  "Private note",
                  "Your interview context remains inside the workspace.",
                  "It never appears on the public company brief.",
                  "Private",
                  "bg-jade"
                ],
                [
                  "Next step",
                  "Resume the checkpoint when the decision moves.",
                  "Continue from the stage and priority you saved.",
                  "Ready",
                  "bg-coral"
                ]
              ].map(([label, title, copy, state, marker]) => (
                <li
                  className="grid grid-cols-[12px_minmax(0,1fr)_auto] items-start gap-4 border-b border-line py-4 last:border-b-0"
                  key={label}
                >
                  <span
                    className={`mt-1.5 size-2.5 rounded-full ring-4 ring-mist ${marker}`}
                    aria-hidden="true"
                  />
                  <div>
                    <small className="font-mono text-[8px] font-extrabold tracking-[.07em] text-muted uppercase">
                      {label}
                    </small>
                    <strong className="mt-1 block text-[11px] leading-snug">
                      {title}
                    </strong>
                    <p className="mt-1 text-[9px] leading-relaxed text-muted">
                      {copy}
                    </p>
                  </div>
                  <Badge className="bg-mist text-muted">{state}</Badge>
                </li>
              ))}
            </ol>

            <footer className="flex items-center justify-between gap-4 border-t border-line bg-mist/55 px-6 py-4 text-[9px] text-muted max-sm:flex-col max-sm:items-start">
              <p>
                <strong className="text-ink-soft">Example only.</strong> No
                visitor account data appears here.
              </p>
              <span className="font-extrabold text-jade-dark">
                Context → evidence → next step
              </span>
            </footer>
          </figure>
        </div>
      </main>
    </>
  );
}

export function AuthHeader() {
  return <SiteHeader active="Sign in" mode="public" />;
}
