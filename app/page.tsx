import Link from "next/link";
import { ArrowRight, MonitorSmartphone } from "lucide-react";
import { CompanySearch } from "@/components/company-search";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { datasetStats } from "@/lib/research";

export default async function HomePage() {
  const stats = await datasetStats();
  return (
    <>
      <SiteHeader mode="public" />
      <main>
        <section className="relative z-20 overflow-visible border-b border-line bg-mist py-14 sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute top-[-5rem] left-[max(1rem,calc(50%_-_36rem))] size-80 rounded-full border border-jade/15" aria-hidden />
          <div className="relative mx-auto grid w-[calc(100%_-_40px)] max-w-290 items-center gap-12 max-sm:w-[calc(100%_-_28px)] lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
            <div className="min-w-0">
              <p className="mb-4 font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">A decision tool for your next move</p>
              <h1 className="max-w-170 font-display text-[clamp(3.25rem,6.3vw,5.4rem)] leading-[.94] font-bold tracking-[-.045em] text-ink">
                Know what to <em className="font-inherit text-jade not-italic">verify</em>{" "}
                <span className="relative inline-block after:absolute after:right-0 after:-bottom-1 after:left-0 after:h-1 after:rotate-[-1deg] after:bg-amber">before you</span>{" "}
                say yes.
              </h1>
              <p className="mt-6 max-w-162 text-base leading-7 text-ink-soft">Turn workplace stories, official profiles, hiring signals, and salary disclosures into a brief you can use in an interview or offer discussion.</p>
              <CompanySearch />
            </div>
            <Card className="relative overflow-hidden border-line-strong shadow-panel before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[linear-gradient(to_bottom,var(--color-coral)_0_34%,var(--color-jade)_34%_73%,var(--color-amber)_73%)]">
              <CardHeader className="flex flex-row items-center justify-between gap-4 py-4 pl-7">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-jade-soft font-mono text-sm font-extrabold text-jade-dark">?</span>
                  <div className="grid min-w-0 gap-0.5">
                    <strong className="truncate text-sm">Your company</strong>
                    <small className="text-[10px] text-muted">Your role · Your location</small>
                  </div>
                </div>
                <Badge tone="amber">Decision checkpoint</Badge>
              </CardHeader>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 bg-mist px-7 py-4 text-center">
                <span className="grid gap-0.5"><strong className="font-display text-2xl">Reports</strong><small className="text-[9px] text-muted">workplace evidence</small></span>
                <b className="font-mono text-sm text-jade" aria-hidden>→</b>
                <span className="grid gap-0.5"><strong className="font-display text-2xl">3</strong><small className="text-[9px] text-muted">questions to verify</small></span>
              </div>
              <CardContent className="px-7 py-5">
                <p className="mb-2 font-mono text-[9px] font-extrabold tracking-[.1em] text-jade uppercase">Before accepting, ask</p>
                <h2 className="font-display text-[clamp(1.6rem,3vw,2rem)] leading-tight font-bold tracking-[-.025em]">What your offer may not tell you.</h2>
                <div className="mt-3">
                  {[
                    ["How are performance decisions documented?", "Compare reports with official terms"],
                    ["Who will manage me and how often will we meet?", "Verify this for your exact role"],
                    ["What salary range and overtime policy are approved?", "Confirm the written policy"]
                  ].map(([title, detail], index) => (
                    <div className="grid grid-cols-[1.75rem_1fr] gap-3 border-t border-line py-3 first:border-0" key={title}>
                      <span className="grid size-6 place-items-center rounded-full bg-ink font-mono text-[10px] font-extrabold text-white">{index + 1}</span>
                      <div className="grid gap-1"><strong className="text-[11px] leading-4">{title}</strong><small className="text-[9px] leading-4 text-muted">{detail}</small></div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <footer className="flex items-center justify-between gap-4 border-t border-line px-7 py-4">
                <p className="text-[9px] leading-4 text-muted">Every question links back to the reports<br />and official sources that produced it.</p>
                <Button asChild variant="amber" size="sm"><Link href="#research">Choose a company</Link></Button>
              </footer>
            </Card>
          </div>
        </section>

        <section className="border-b border-line bg-white">
          <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-290 divide-y divide-line max-sm:w-[calc(100%_-_28px)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <article className="grid gap-1 py-5 sm:px-6 sm:first:pl-0"><strong className="font-mono text-[9px] font-extrabold tracking-[.09em] text-jade uppercase">Reports</strong><span className="text-xs leading-5 text-ink-soft">Workplace stories reveal recurring experiences.</span></article>
            <article className="grid gap-1 py-5 sm:px-6"><strong className="font-mono text-[9px] font-extrabold tracking-[.09em] text-jade uppercase">Evidence</strong><span className="text-xs leading-5 text-ink-soft">Patterns remain connected to dated sources.</span></article>
            <article className="grid gap-1 py-5 sm:px-6 sm:last:pr-0"><strong className="font-mono text-[9px] font-extrabold tracking-[.09em] text-jade uppercase">Questions</strong><span className="text-xs leading-5 text-ink-soft">You verify what matters before deciding.</span></article>
          </div>
        </section>

        <section className="border-b border-line py-16 sm:py-20">
          <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-290 items-start gap-10 max-sm:w-[calc(100%_-_28px)] lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
            <div className="max-w-132">
              <p className="mb-3 font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">More useful than a review feed</p>
              <h2 className="font-display text-[clamp(2.25rem,4.2vw,3.5rem)] leading-[1.02] font-bold tracking-[-.035em]">Other people’s experiences should improve your questions—not make your decision for you.</h2>
              <p className="mt-5 text-[15px] leading-7 text-ink-soft">A single story can be incomplete. b4join looks across roles and dates, finds what repeats, and keeps the original evidence visible.</p>
            </div>
            <Card className="overflow-hidden">
              <CardHeader className="bg-white">
                <p className="mb-2 font-mono text-[9px] font-extrabold tracking-[.1em] text-jade uppercase">One question, traced</p>
                <h3 className="font-display text-2xl leading-tight font-bold">“How are performance decisions documented?”</h3>
              </CardHeader>
              <CardContent className="px-5 py-1">
                {[
                  ["Workplace reports", "14 recent sources mention related experiences", "Different roles · May–July 2026"],
                  ["Recurring pattern", "Feedback, management, and job stability", "Appears across teams rather than in one isolated story."],
                  ["Question to verify", "Ask for the process, owner, and written terms.", "The company can answer this for your exact role."]
                ].map(([label, title, copy], index) => (
                  <div className="relative grid grid-cols-[1.25rem_1fr] gap-3 border-t border-line py-4 first:border-0" key={label}>
                    <span className="relative mt-1 size-3 rounded-full border-3 border-white bg-jade ring-1 ring-line after:absolute after:top-3 after:left-1/2 after:h-[calc(100%+1.5rem)] after:w-px after:-translate-x-1/2 after:bg-line last:after:hidden" aria-hidden>{index === 2 ? "" : ""}</span>
                    <div className="grid gap-1"><small className="font-mono text-[8px] font-bold tracking-[.08em] text-muted uppercase">{label}</small><strong className="text-xs">{title}</strong><p className="text-[10px] leading-4 text-muted">{copy}</p></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto w-[calc(100%_-_40px)] max-w-290 max-sm:w-[calc(100%_-_28px)]">
            <p className="mb-3 font-mono text-[10px] font-extrabold tracking-[.1em] text-jade uppercase">Useful throughout your job search</p>
            <h2 className="max-w-180 font-display text-[clamp(2.25rem,4.2vw,3.5rem)] leading-[1.02] font-bold tracking-[-.035em]">Use the evidence differently at each stage.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Card className="p-5"><Badge>Applying</Badge><h3 className="mt-5 font-display text-2xl leading-tight font-bold">Choose where to spend your time.</h3><p className="mt-3 text-xs leading-5 text-muted">Review recurring signals, dated hiring evidence, and verified company destinations.</p></Card>
              <Card className="p-5"><Badge tone="blue">Interviewing</Badge><h3 className="mt-5 font-display text-2xl leading-tight font-bold">Ask company-specific questions.</h3><p className="mt-3 text-xs leading-5 text-muted">Focus on your team, manager, role, and expectations without reading every story.</p></Card>
              <Card className="p-5"><Badge tone="amber">Reviewing an offer</Badge><h3 className="mt-5 font-display text-2xl leading-tight font-bold">Verify what should be in writing.</h3><p className="mt-3 text-xs leading-5 text-muted">Check salary, probation, overtime, reporting line, and performance terms.</p></Card>
            </div>
            <div className="mt-4 flex items-center gap-4 rounded-xl border border-line bg-white p-4 max-sm:items-start max-sm:flex-wrap">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-jade-soft font-mono text-[11px] font-extrabold text-jade-dark">BJ</span>
              <div className="min-w-0 flex-1"><strong className="text-xs">Published snapshot {stats.snapshotDate}</strong><p className="mt-1 text-[10px] leading-4 text-muted">{stats.stories.toLocaleString()} stories across {stats.companies.toLocaleString()} companies · locally validated before publication</p></div>
              <Button asChild variant="outline" size="sm"><Link href="/method">Inspect the method <ArrowRight /></Link></Button>
            </div>
            <Card className="mt-4 grid items-center gap-5 border-line-strong p-5 sm:grid-cols-[auto_1fr_auto]">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-jade text-white [&_svg]:size-6"><MonitorSmartphone /></span>
              <div className="min-w-0">
                <p className="mb-2 font-mono text-[9px] font-extrabold tracking-[.1em] text-jade uppercase">Use it while you browse</p>
                <h2 className="font-display text-2xl leading-tight font-bold">Bring b4join research into Deshi Mula.</h2>
                <p className="mt-2 text-xs leading-5 text-muted">Deshi Mula Extended opens company evidence, stories, hiring signals, and cited Ask answers without leaving the company page.</p>
              </div>
              <Button asChild><Link href="/extension">Explore the extension <ArrowRight /></Link></Button>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
