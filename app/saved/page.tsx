import Link from "next/link";
import { headers } from "next/headers";
import { Search } from "lucide-react";
import { auth } from "@/lib/auth";
import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const saved = [
  ["TN", "TechnoNext Ltd", "Reviewing an offer", "1 of 3 answers recorded", "2026-07-24", "/company/technonext-ltd"],
  ["BJ", "BJIT", "Interviewing", "Two unanswered questions", "2026-07-22", "/states"],
  ["BS", "Brain Station 23", "Applying", "Checkpoint ready", "2026-07-18", "/states"]
];

const avatarTones = ["bg-jade-soft text-jade-dark", "bg-amber-soft text-amber-dark", "bg-blue-soft text-blue"];
const roles = ["Software Engineer", "Backend Engineer", "Product Designer"];
const updated = ["today", "2 days ago", "8 days ago"];

export default async function SavedPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <>
        <SiteHeader active="Saved" mode="public" />
        <main className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-290 py-14 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-24">
          <Card className="mx-auto max-w-190 shadow-panel">
            <CardContent className="flex flex-col items-start px-7 py-8 sm:px-10 sm:py-10">
              <p className="mb-3 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">
                Private workspace
              </p>
              <h1 className="max-w-140 font-display text-[clamp(34px,5vw,52px)] leading-[1.02] font-bold tracking-[-.03em] text-ink">
                Sign in to view saved decisions.
              </h1>
              <p className="mt-4 max-w-150 text-[15px] leading-[1.7] text-ink-soft">
                Your checkpoints, answers, notes, and comparisons are available only after you continue with Google.
              </p>
              <Button asChild className="mt-7" size="lg">
                <Link href="/auth/sign-in?next=/saved">Continue with Google</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader active="Saved" />
      <main className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-290 py-14 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-24">
        <PageHead
          eyebrow="Private to you"
          title="Your decisions in progress."
          copy="Return to the evidence, record new answers, or compare two offers. The number shown is what you still need to verify."
        />

        <div className="mb-7 flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
          <label className="relative block min-w-0 flex-1 sm:max-w-115">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
            />
            <Input className="pl-10" placeholder="Find a saved company" aria-label="Find a saved company" />
          </label>
          <select
            className="min-h-11.25 min-w-47 appearance-none rounded-lg border border-line-strong bg-[linear-gradient(45deg,transparent_50%,#34545a_50%),linear-gradient(135deg,#34545a_50%,transparent_50%)] bg-[position:calc(100%-16px)_50%,calc(100%-11px)_50%] bg-[size:5px_5px,5px_5px] bg-no-repeat px-4 pr-10 text-sm font-semibold text-ink outline-none focus:border-jade focus:ring-3 focus:ring-jade/10"
            aria-label="Filter by stage"
          >
            <option>All stages</option>
            <option>Applying</option>
            <option>Interviewing</option>
            <option>Reviewing an offer</option>
          </select>
        </div>

        <section className="grid gap-3" aria-label="Saved checkpoints">
          {saved.map(([mark, name, stage, status, date, href], index) => (
            <Card key={name} data-snapshot={date} data-status={status}>
              <CardContent className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-4 p-5 max-sm:grid-cols-[44px_minmax(0,1fr)]">
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-xl font-mono text-xs font-extrabold max-sm:size-11 ${avatarTones[index]}`}
                >
                  {mark}
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-xl leading-tight font-bold tracking-[-.015em] text-ink">{name}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {stage} · {roles[index]} · Updated {updated[index]}
                  </p>
                  <Badge className="mt-2" tone={index === 0 ? "coral" : index === 1 ? "amber" : "jade"}>
                    {3 - index} answers needed
                  </Badge>
                </div>
                <div className="flex items-center gap-2 max-sm:col-span-2 max-sm:mt-1 max-sm:pl-15">
                  <Button asChild size="sm">
                    <Link href={href}>Open checkpoint</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/compare">Compare</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </>
  );
}
