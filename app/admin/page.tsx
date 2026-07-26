import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { datasetStats } from "@/lib/research";
import { getAdminContext } from "@/lib/admin-session";
import { datasetUpdateState, datasetUpdatesEnabled } from "@/lib/dataset-update";
import { DatasetUpdatePanel } from "@/components/admin/dataset-update-panel";

const reports = [
  ["LinkedIn destination may be incorrect", "TechnoNext Ltd", "24 Jul", "Review"],
  ["Company alias belongs to another identity", "Betopia", "23 Jul", "Verified"],
  ["Careers page returns 404", "BJIT", "22 Jul", "Candidate"]
] as const;

const eyebrowClass =
  "mb-2.75 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase";
const sectionTitleClass =
  "font-display text-[clamp(27px,3vw,38px)] leading-[1.1] font-bold tracking-[-.03em] text-ink";
const settingsRowClass =
  "grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-5 py-3.25 [&+&]:border-t [&+&]:border-line max-sm:items-start";

function SettingsRow({
  title,
  copy,
  action
}: {
  title: string;
  copy: string;
  action: ReactNode;
}) {
  return (
    <div className={settingsRowClass}>
      <div>
        <strong className="block text-[11px]">{title}</strong>
        <p className="mt-1 text-[9px] leading-normal text-muted">{copy}</p>
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }: { status: (typeof reports)[number][3] }) {
  const tone =
    status === "Review" ? "amber" : status === "Candidate" ? "coral" : "jade";

  return <Badge tone={tone}>{status}</Badge>;
}

export default async function AdminPage() {
  const admin = await getAdminContext();
  if (!admin) redirect("/auth/sign-in?next=/admin");
  const { role } = admin;

  const stats = await datasetStats();

  return (
    <>
      <SiteHeader active="Admin" mode="admin" />
      <main className="mx-auto w-full max-w-270 px-5 py-[62px] max-sm:px-3.5 max-sm:py-[38px] max-sm:pb-[62px]">
        <PageHead
          eyebrow={`Restricted operations · ${role === "owner" ? "Owner" : "Operator"} access`}
          title="Evidence system health."
          copy="Operate correction queues, validated snapshots, provider health, and role-bound controls without mixing them into the user workspace."
        />

        <section
          aria-label="System summary"
          className="my-7 grid grid-cols-5 gap-2.5 max-[1100px]:grid-cols-3 max-[960px]:grid-cols-2 max-[740px]:grid-cols-1"
        >
          {[
            ["Active snapshot", stats.snapshotDate],
            ["Companies", stats.companies],
            ["Comments", stats.comments],
            ["Corrections open", 18],
            ["API health", "Ready"]
          ].map(([label, value]) => (
            <Card className="rounded-[9px] p-4" key={label}>
              <span className="block text-[9px] text-muted">{label}</span>
              <strong className="mt-2 block font-display text-2xl leading-none font-extrabold">
                {value}
              </strong>
            </Card>
          ))}
        </section>

        <section className="mt-14" id="corrections">
          <p className={eyebrowClass}>Needs verification</p>
          <h2 className={sectionTitleClass}>Correction reports</h2>
          <p className="mt-1.75 text-xs leading-[1.55] text-muted">
            Reports create a review task; they never edit a published snapshot.
          </p>

          <div className="mt-4.5 overflow-hidden rounded-[10px] border border-line bg-white max-[740px]:overflow-x-auto">
            <div className="grid min-w-170 grid-cols-[minmax(180px,1.4fr)_repeat(3,minmax(100px,.7fr))_auto] items-center gap-3.25 bg-mist-deep px-4 py-3.5 font-mono text-[8px] leading-tight font-bold text-muted uppercase">
              <span>Report</span>
              <span>Company</span>
              <span>Submitted</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {reports.map(([report, company, submitted, status]) => (
              <div
                className="grid min-w-170 grid-cols-[minmax(180px,1.4fr)_repeat(3,minmax(100px,.7fr))_auto] items-center gap-3.25 border-t border-line px-4 py-3.5"
                key={report}
              >
                <strong className="text-[11px]">{report}</strong>
                <span className="text-[9px] text-muted">{company}</span>
                <span className="text-[9px] text-muted">{submitted}</span>
                <StatusBadge status={status} />
                <Button size="sm" variant="outline">
                  Open
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14" id="snapshots">
          <p className={eyebrowClass}>Publication</p>
          <h2 className={sectionTitleClass}>Published snapshot</h2>
          <div className="mt-4.5">
            <DatasetUpdatePanel initial={datasetUpdateState()} enabled={datasetUpdatesEnabled()} />
          </div>
          <Card className="mt-4.5 rounded-[11px] px-5.5 max-sm:px-4.5">
            <SettingsRow
              title={`Snapshot ${stats.snapshotDate}`}
              copy={`${stats.companies.toLocaleString()} companies · ${stats.stories.toLocaleString()} stories · ${stats.comments.toLocaleString()} comments · validated locally`}
              action={
                <Button size="sm" variant="outline">
                  Inspect manifest
                </Button>
              }
            />
            <SettingsRow
              title="Pending enrichment candidates"
              copy="18 destinations and 7 hiring signals await review"
              action={
                <Button size="sm" variant="outline">
                  Export queue
                </Button>
              }
            />
          </Card>
        </section>

        <section className="mt-14" id="providers">
          <p className={eyebrowClass}>Generation providers</p>
          <h2 className={sectionTitleClass}>Provider health</h2>
          <Card className="mt-4.5 rounded-[11px] px-5.5 max-sm:px-4.5">
            <SettingsRow
              title="Gemini · configured model"
              copy="Primary when a key is available"
              action={<Badge>Available</Badge>}
            />
            <SettingsRow
              title="Groq"
              copy="Fallback · optional in this environment"
              action={<Badge tone="amber">Paused</Badge>}
            />
            <SettingsRow
              title="Deterministic fallback"
              copy="Always available · cited evidence without generated prose"
              action={<Badge>Ready</Badge>}
            />
          </Card>
        </section>

        <section className="mt-14" id="roles">
          <p className={eyebrowClass}>Role-bound access</p>
          <h2 className={sectionTitleClass}>Administrators</h2>
          <Card className="mt-4.5 rounded-[11px] px-5.5 max-sm:px-4.5">
            <SettingsRow
              title="Owner · Montasim Mamun"
              copy="Roles, providers, global quotas, snapshot activation, and all Operator capabilities"
              action={<Badge>Owner</Badge>}
            />
            <SettingsRow
              title="Operator access"
              copy="Corrections, enrichment review, and snapshot inspection—no role or provider changes"
              action={
                role === "owner" ? (
                  <Button size="sm" variant="outline">
                    Invite Operator
                  </Button>
                ) : (
                  <Badge className="bg-mist-deep text-muted">Read only</Badge>
                )
              }
            />
          </Card>
        </section>
      </main>
    </>
  );
}
