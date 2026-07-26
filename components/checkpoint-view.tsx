import Link from "next/link";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DecisionContextEditor } from "@/components/decision-context-editor";
import { ReportedWorkArrangement } from "@/components/reported-work-arrangement";
import type {
  Checkpoint,
  CompanyWorkArrangement,
  StoryRecord,
} from "@/lib/contracts";
import { initials } from "@/lib/utils";

export function CheckpointView({
  checkpoint,
  stories,
  workArrangement,
}: {
  checkpoint: Checkpoint;
  stories: StoryRecord[];
  workArrangement: CompanyWorkArrangement | null;
}) {
  const { company } = checkpoint;
  return (
    <main className="mx-auto w-[calc(100%_-_40px)] max-w-290 py-15 max-sm:w-[calc(100%_-_28px)] max-sm:py-9">
      <nav className="mb-6 flex items-center gap-2 text-[11px] text-muted"><Link className="font-extrabold text-jade-dark no-underline" href="/">Research</Link><span>/</span><span>Offer checkpoint</span></nav>
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line pb-6 max-sm:grid-cols-[auto_1fr]">
        <span className="grid size-13.5 place-items-center rounded-lg bg-jade-soft text-sm font-extrabold text-jade-dark">{initials(company.name)}</span>
        <div><h1 className="font-display text-[clamp(34px,5vw,50px)] leading-none font-bold tracking-tight">{company.name}</h1><p className="mt-1 text-[10px] text-muted">Bangladesh · Also found as {company.sourceName}</p></div>
        <div className="flex flex-wrap justify-end gap-2 max-sm:col-span-full max-sm:justify-start [&_a]:inline-flex [&_a]:min-h-9.5 [&_a]:items-center [&_a]:gap-1.5 [&_a]:rounded-lg [&_a]:border [&_a]:border-line [&_a]:bg-white [&_a]:px-3 [&_a]:py-2 [&_a]:text-[11px] [&_a]:font-extrabold [&_a]:no-underline [&_svg]:size-4">
          {company.websiteUrl && <a href={company.websiteUrl} target="_blank">Website <ExternalLink /></a>}
          {company.linkedinUrl && <a href={company.linkedinUrl} target="_blank">LinkedIn <ExternalLink /></a>}
          {company.careersUrl && <a href={company.careersUrl} target="_blank">Careers <ExternalLink /></a>}
        </div>
      </header>
      <DecisionContextEditor
        stage={checkpoint.stage}
        role={checkpoint.role}
        priority={checkpoint.priority}
      />
      <aside className="my-5 grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-amber bg-amber-soft p-4 max-sm:grid-cols-[auto_1fr] [&_svg]:size-5">
        <RefreshCw className="text-amber-dark" />
        <div><strong className="text-[11px]">New evidence is available</strong><p className="mt-1 text-[9px] text-muted">Your saved revision remains pinned until you review and refresh it.</p></div>
        <Button asChild variant="amber" size="sm"><Link href="/history">Review changes</Link></Button>
      </aside>
      <section className="my-8 grid grid-cols-[1fr_auto] items-center gap-6 rounded-xl border border-line-strong bg-white p-6 max-sm:grid-cols-1">
        <div><p className="mb-3 font-mono text-[10px] font-extrabold tracking-wider text-jade uppercase">Your offer checkpoint</p><h2 className="font-display text-[clamp(27px,3vw,38px)] leading-tight font-bold tracking-tight">Get these answers before deciding.</h2><p className="mt-3 text-[10px] leading-relaxed text-ink-soft">These questions are ranked from this company’s local stories and comments. They are prompts for verification, not a verdict.</p></div>
        <div className="flex items-center gap-3"><Badge>{company.storyCount} reports</Badge><span>→</span><Badge tone="amber">{checkpoint.questions.length} questions</Badge></div>
      </section>
      <div className="grid grid-cols-[minmax(0,1fr)_270px] gap-8 max-lg:grid-cols-1">
        <article>
          {workArrangement && (
            <ReportedWorkArrangement record={workArrangement} />
          )}
          {checkpoint.questions.map((question, index) => (
            <section className="grid grid-cols-[34px_1fr] gap-4 border-b border-line py-5 max-sm:grid-cols-1" key={question.id}>
              <span className={`grid size-8.5 place-items-center rounded-full text-sm font-extrabold text-white ring-5 ${index === 0 ? "bg-coral ring-coral-soft" : index === 1 ? "bg-jade ring-jade-soft" : "bg-amber text-ink ring-amber-soft"}`}>{index + 1}</span>
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight">{question.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">{question.guidance}</p>
                <div className="mt-4 grid grid-cols-[90px_1fr] gap-3 rounded-lg bg-white p-3 max-sm:grid-cols-1"><span className="font-mono text-[8px] font-extrabold text-muted uppercase">Why ask this</span><p className="m-0 text-[10px] leading-relaxed text-ink-soft">{question.rationale}</p></div>
                <div className="mt-3 flex flex-wrap gap-2">{question.citations.map((citation) => <span className="rounded bg-blue-soft px-2 py-1 font-mono text-[8px] text-blue" key={citation}>{citation}</span>)}</div>
                {question.gap && <p className="mt-3 rounded-lg bg-coral-soft p-3 text-[10px] text-coral"><strong>Evidence gap:</strong> {question.gap}</p>}
              </div>
            </section>
          ))}
          <section className="mt-12">
            <p className="mb-3 font-mono text-[10px] font-extrabold tracking-wider text-jade uppercase">Verified destinations</p><h2 className="font-display text-3xl font-bold tracking-tight">Check what the company publishes</h2>
            <div className="mt-5 grid grid-cols-3 gap-3 max-md:grid-cols-1">
              {company.websiteUrl && <a className="grid gap-2 rounded-xl border border-line bg-white p-5 no-underline" href={company.websiteUrl} target="_blank"><small className="text-[9px] text-muted">Official website</small><strong className="text-xs">{new URL(company.websiteUrl).hostname}</strong><em className="text-[9px] not-italic text-jade">Verified · {company.snapshotDate}</em></a>}
              {company.linkedinUrl && <a className="grid gap-2 rounded-xl border border-line bg-white p-5 no-underline" href={company.linkedinUrl} target="_blank"><small className="text-[9px] text-muted">LinkedIn</small><strong className="text-xs">{company.name}</strong><em className="text-[9px] not-italic text-jade">Official profile</em></a>}
              {company.careersUrl && <a className="grid gap-2 rounded-xl border border-line bg-white p-5 no-underline" href={company.careersUrl} target="_blank"><small className="text-[9px] text-muted">Careers</small><strong className="text-xs">Dated hiring signals</strong><em className="text-[9px] not-italic text-jade">Availability may change</em></a>}
            </div>
          </section>
          <section className="mt-12">
            <p className="mb-3 font-mono text-[10px] font-extrabold tracking-wider text-jade uppercase">Source excerpts</p><h2 className="font-display text-3xl font-bold tracking-tight">Evidence behind the questions</h2>
            <div className="mt-5 grid gap-3">
              {stories.slice(0, 3).map((story) => <article className="rounded-xl border border-line bg-white p-5" key={story.id}><strong className="text-xs">{story.title}</strong><p className="my-2 text-[10px] leading-relaxed text-muted">{story.excerpt}</p><a className="text-[10px] font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3" href={story.sourceUrl} target="_blank">{story.role} · {story.dateLabel} · Open original</a></article>)}
            </div>
          </section>
        </article>
        <aside className="sticky top-24 grid h-fit gap-3 max-lg:static max-lg:grid-cols-2 max-sm:grid-cols-1">
          <section className="rounded-xl border border-line bg-white p-5"><h3 className="font-display text-xl font-bold">Track your answers</h3><p className="my-2 text-[10px] leading-relaxed text-muted">Record answers to the questions that matter most for this offer.</p><Button className="w-full" asChild><Link href="/answer">Record an answer</Link></Button></section>
          <section className="rounded-xl border border-line bg-white p-5"><h3 className="font-display text-xl font-bold">Ask the evidence</h3><p className="my-2 text-[10px] leading-relaxed text-muted">Receive a company-scoped cited answer or Evidence Gap.</p><Button className="w-full" asChild variant="outline"><Link href={`/ask?company=${company.slug}`}>Ask a question</Link></Button></section>
          <section className="rounded-xl border border-line bg-white p-5"><h3 className="font-display text-xl font-bold">Your private note</h3><p className="my-2 text-[10px] leading-relaxed text-muted">Confirm probation terms and reporting line before accepting.</p><Button className="w-full" asChild variant="outline"><Link href="/saved">Checkpoint saved</Link></Button></section>
          <section className="rounded-xl border border-line bg-white p-5"><h3 className="font-display text-xl font-bold">Checkpoint tools</h3><p className="my-2 text-[10px] leading-relaxed text-muted"><Link className="font-extrabold text-jade-dark underline" href="/history">Revision history</Link> · <Link className="font-extrabold text-jade-dark underline" href="/export">Export</Link></p></section>
        </aside>
      </div>
    </main>
  );
}
