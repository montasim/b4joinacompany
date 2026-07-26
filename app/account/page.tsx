import type { ReactNode } from "react";
import Link from "next/link";

import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

function Row({
  title,
  copy,
  action
}: {
  title: string;
  copy: string;
  action: ReactNode;
}) {
  return (
    <div className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-5 py-3.25 [&+&]:border-t [&+&]:border-line max-[620px]:items-start">
      <div>
        <strong className="block text-[11px]">{title}</strong>
        <p className="mt-1 text-[9px] leading-normal text-muted">{copy}</p>
      </div>
      {action}
    </div>
  );
}

function SectionHeader({
  title,
  copy,
  action
}: {
  title: string;
  copy: string;
  action?: ReactNode;
}) {
  return (
    <CardHeader className="flex items-start justify-between gap-4.5 p-0 pb-3.75">
      <div>
        <h2 className="font-display text-[22px] leading-[1.1] font-bold tracking-[-.03em] text-ink">
          {title}
        </h2>
        <p className="mt-1.25 text-[10px] leading-normal text-muted">{copy}</p>
      </div>
      {action}
    </CardHeader>
  );
}

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-270 px-5 py-[62px] max-sm:px-3.5 max-sm:py-[38px] max-sm:pb-[62px]">
        <PageHead
          eyebrow="Private workspace · Owner account"
          title="Account and privacy."
          copy="Control identity, notifications, connected devices, and the data stored for your decisions."
        />

        <div className="grid grid-cols-[210px_minmax(0,1fr)] gap-7.5 max-[740px]:grid-cols-1">
          <nav
            aria-label="Account settings"
            className="sticky top-23.5 grid self-start rounded-[10px] border border-line bg-white p-2 max-[740px]:static max-[740px]:grid-cols-3 max-[620px]:grid-cols-2"
          >
            <a
              aria-current="page"
              className="rounded-[7px] bg-jade-soft p-2.5 text-[10px] font-bold text-jade-dark no-underline max-[740px]:text-center"
              href="#profile"
            >
              Profile
            </a>
            {[
              ["Updates", "#notifications"],
              ["Extension", "#extension"],
              ["Privacy", "#privacy"]
            ].map(([label, href]) => (
              <a
                className="rounded-[7px] p-2.5 text-[10px] font-bold text-muted no-underline hover:bg-jade-soft hover:text-jade-dark max-[740px]:text-center"
                href={href}
                key={href}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="grid gap-3">
            <Card
              className="rounded-[11px] p-5.5 max-[620px]:p-4.5"
              id="profile"
            >
              <SectionHeader
                title="Profile"
                copy="Identity shared by the website and connected extension."
                action={<Badge>Verified · Owner</Badge>}
              />
              <Row
                title="Montasim Mamun"
                copy="montasimmamun@gmail.com · Google sign-in"
                action={
                  <Button size="sm" variant="outline">
                    Edit profile
                  </Button>
                }
              />
            </Card>

            <Card
              className="rounded-[11px] p-5.5 max-[620px]:p-4.5"
              id="notifications"
            >
              <SectionHeader
                title="Evidence updates"
                copy="Saved checkpoints never refresh automatically."
              />
              <Row
                title="In-app notices"
                copy="Always on for relevant evidence changes"
                action={<Badge>On</Badge>}
              />
              <Row
                title="Weekly email digest"
                copy="Off by default; never includes notes or answers"
                action={
                  <Badge className="bg-mist-deep text-muted">Off</Badge>
                }
              />
            </Card>

            <Card
              className="rounded-[11px] p-5.5 max-[620px]:p-4.5"
              id="extension"
            >
              <SectionHeader
                title="Deshi Mula Extended"
                copy="The extension uses the public Research API without an account or pairing."
                action={
                  <Button asChild size="sm">
                    <Link href="/extension">View extension</Link>
                  </Button>
                }
              />
              <Row
                title="Independent access"
                copy="Company research, stories, jobs, and Ask work without signing in."
                action={<Badge>No account needed</Badge>}
              />
            </Card>

            <Card className="rounded-[11px] p-5.5 max-[620px]:p-4.5">
              <SectionHeader
                title="Administrative access"
                copy="This account can enter the restricted Owner console."
                action={<Badge>Owner</Badge>}
              />
              <Row
                title="Owner permissions"
                copy="Roles, providers, quotas, snapshots, and all Operator capabilities"
                action={
                  <Button asChild size="sm" variant="outline">
                    <Link href="/admin">Open console</Link>
                  </Button>
                }
              />
            </Card>

            <Card
              className="rounded-[11px] p-5.5 max-[620px]:p-4.5"
              id="privacy"
            >
              <SectionHeader
                title="Workspace data"
                copy="Notes, answers, comparisons, and checkpoint history."
              />
              <Row
                title="Export workspace"
                copy="Download your private data and revision history"
                action={
                  <Button size="sm" variant="outline">
                    Request export
                  </Button>
                }
              />
              <Row
                title="Delete account and workspace"
                copy="Destructive action requires reauthentication and explicit confirmation."
                action={
                  <Button size="sm" variant="outline">
                    Delete account
                  </Button>
                }
              />
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
