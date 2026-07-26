import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldCheck, ShieldX } from "lucide-react";

import { AdminReviewDesk } from "@/components/admin/admin-review-desk";
import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { resolveAdminRole } from "@/lib/admin-session";
import { datasetStats } from "@/lib/research";

function AdminGate() {
  const steps = [
    [
      "1",
      "Confirm the company",
      "Keep evidence away from the wrong company record."
    ],
    [
      "2",
      "Inspect the source",
      "See where the change came from and what remains uncertain."
    ],
    [
      "3",
      "Prepare a revision",
      "Approval never edits a published snapshot in place."
    ]
  ];

  return (
    <>
      <SiteHeader active="Sign in" />
      <main
        className="relative grid min-h-[calc(100vh-64px)] place-items-center overflow-hidden border-b border-line bg-[linear-gradient(rgba(20,120,110,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(20,120,110,.04)_1px,transparent_1px)] bg-size-[32px_32px] py-16 pb-[78px]"
        id="main"
      >
        <span
          className="pointer-events-none absolute top-13 left-[max(-240px,calc((100vw-1120px)/2-370px))] size-140 rounded-full border border-jade/15 max-sm:hidden"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid w-[calc(100%_-_40px)] max-w-280 grid-cols-[minmax(360px,.85fr)_minmax(500px,1.15fr)] items-center gap-[74px] max-lg:grid-cols-1 max-sm:w-[calc(100%_-_28px)] max-sm:gap-8">
          <section className="max-w-160">
            <p className="font-mono text-[10px] font-extrabold tracking-[.09em] text-jade uppercase">
              Restricted evidence desk
            </p>
            <h1 className="mt-3 font-display text-[clamp(46px,6vw,70px)] leading-[.97] font-bold tracking-[-.04em] text-ink">
              Review changes{" "}
              <em className="text-jade not-italic underline decoration-amber decoration-[5px] underline-offset-8 max-sm:decoration-4">
                before they become research.
              </em>
            </h1>
            <p className="mt-5 max-w-145 text-[15px] leading-[1.7] text-ink-soft">
              The queue is visible only to the configured admin Google account.
              Public company research remains available without signing in.
            </p>
            <div className="mt-7 max-w-92">
              <AuthForm
                callbackURL="/auth/continue?next=%2Fadmin"
                googleEnabled={Boolean(
                  process.env.GOOGLE_CLIENT_ID &&
                    process.env.GOOGLE_CLIENT_SECRET
                )}
              />
              <p className="mt-2 text-center text-[9px] text-muted">
                Role checked after Google sign-in · No separate admin password
              </p>
            </div>
          </section>

          <figure className="relative overflow-hidden rounded-[13px] border border-line-strong bg-white shadow-panel before:absolute before:inset-y-0 before:left-0 before:z-2 before:w-1.25 before:bg-[linear-gradient(to_bottom,#356c82_0_33.333%,#e9b44c_33.333%_66.666%,#14786e_66.666%)]">
            <figcaption className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <p className="font-mono text-[9px] font-extrabold tracking-[.08em] text-jade uppercase">
                  Protected workflow
                </p>
                <h2
                  className="mt-2 font-display text-[27px] leading-tight font-bold tracking-[-.03em]"
                  id="admin-gate-title"
                >
                  What the review desk controls.
                </h2>
              </div>
              <Badge tone="coral">Admin only</Badge>
            </figcaption>
            <ol className="m-0 grid list-none px-6">
              {steps.map(([number, title, copy]) => (
                <li
                  className="grid grid-cols-[28px_minmax(0,1fr)] gap-4 border-b border-line py-5 last:border-b-0"
                  key={number}
                >
                  <span className="grid size-7 place-items-center rounded-full bg-ink font-mono text-[9px] font-extrabold text-white">
                    {number}
                  </span>
                  <div>
                    <strong className="block text-[12px]">{title}</strong>
                    <p className="mt-1 text-[10px] leading-relaxed text-muted">
                      {copy}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <footer className="flex items-center gap-3 border-t border-line bg-mist/65 px-6 py-4 text-[9px] leading-relaxed text-muted">
              <ShieldCheck className="size-4 shrink-0 text-jade" aria-hidden="true" />
              No queue records are exposed before role verification.
            </footer>
          </figure>
        </div>
      </main>
    </>
  );
}

function AccessDenied() {
  return (
    <>
      <SiteHeader active="Sign in" mode="user" />
      <main id="main" className="grid min-h-[calc(100vh-64px)] place-items-center bg-mist px-5 py-16 max-sm:px-3.5">
        <section className="grid w-full max-w-230 grid-cols-[minmax(0,1fr)_minmax(330px,430px)] items-center gap-16 max-md:grid-cols-1 max-md:gap-8">
          <div>
            <p className="font-mono text-[10px] font-extrabold tracking-[.1em] text-coral uppercase">
              Admin access required
            </p>
            <h1 className="mt-3 font-display text-[clamp(43px,6vw,68px)] leading-[.97] font-bold tracking-[-.04em] text-ink">
              This workspace belongs to{" "}
              <em className="text-jade not-italic">the review team.</em>
            </h1>
            <p className="mt-5 max-w-150 text-[15px] leading-[1.7] text-ink-soft">
              Your Google account is signed in for private research, but it does
              not have permission to view withheld evidence changes.
            </p>
            <Button className="mt-7" asChild>
              <Link href="/saved">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Return to your private workspace
              </Link>
            </Button>
          </div>

          <aside className="relative overflow-hidden rounded-xl border border-line-strong bg-white p-7 shadow-panel">
            <span
              className="absolute inset-y-0 left-0 w-1 bg-coral"
              aria-hidden="true"
            />
            <span className="grid size-11 place-items-center rounded-xl bg-coral-soft text-coral">
              <ShieldX className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-[28px] leading-tight font-bold tracking-[-.03em] text-ink">
              The queue stays private.
            </h2>
            <p className="mt-3 text-[11px] leading-[1.65] text-muted">
              Company corrections, source notes, and reviewer decisions are
              withheld until a verified account has an assigned admin role.
            </p>
            <div className="mt-6 flex items-center gap-2 border-t border-line pt-4 font-mono text-[8px] font-extrabold tracking-[.06em] text-muted uppercase">
              <LockKeyhole className="size-3.5 text-jade" aria-hidden="true" />
              Role checked through Google sign-in
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return <AdminGate />;

  const role = resolveAdminRole(session);
  if (!role) return <AccessDenied />;

  const stats = await datasetStats();

  return (
    <>
      <SiteHeader
        active="Admin"
        mode="admin"
        purpose="Evidence review"
      />
      <AdminReviewDesk role={role} snapshotDate={stats.snapshotDate} />
    </>
  );
}
