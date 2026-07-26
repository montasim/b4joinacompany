import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LockKeyhole, ShieldX } from "lucide-react";

import { AdminReviewDesk } from "@/components/admin/admin-review-desk";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { resolveAdminRole } from "@/lib/admin-session";
import { datasetStats } from "@/lib/research";

function AccessDenied() {
  return (
    <>
      <SiteHeader active="Sign in" mode="user" />
      <main className="grid min-h-[calc(100vh-68px)] place-items-center bg-mist px-5 py-16 max-sm:px-3.5">
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
  if (!session) redirect("/auth/sign-in?next=/admin");

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
