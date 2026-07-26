import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const revisions = [
  ["Revision 3 · Current checkpoint", "Snapshot 2026-07-24 · 3 questions · 1 answer recorded · private note retained"],
  ["Revision 2", "Snapshot 2026-07-18 · Salary question added after careers-page evidence changed."],
  ["Revision 1 · Checkpoint created", "Snapshot 2026-07-12 · Applying · Software Engineer · Priority: job stability"]
];

export default function HistoryPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-290 py-14 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-24">
        <PageHead
          eyebrow="Pinned evidence"
          title="Checkpoint history."
          copy="Refresh creates a new immutable revision. Your previous context and answers remain inspectable."
        />
        <section className="grid gap-3" aria-label="Checkpoint revisions">
          {revisions.map(([name, copy], index) => (
            <Card key={name}>
              <CardContent className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-4 p-5 max-sm:grid-cols-[44px_minmax(0,1fr)]">
                <span
                  className={`grid size-12 place-items-center rounded-xl font-mono text-[11px] font-extrabold max-sm:size-11 ${
                    index === 0 ? "bg-jade-soft text-jade-dark" : "bg-mist-deep text-ink-soft"
                  }`}
                >
                  R{3 - index}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl leading-tight font-bold tracking-[-.015em] text-ink">{name}</h2>
                    {index === 0 && <Badge>Current</Badge>}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{copy}</p>
                </div>
                <Button
                  asChild
                  className="max-sm:col-span-2 max-sm:mt-1 max-sm:ml-15 max-sm:justify-self-start"
                  size="sm"
                  variant={index ? "outline" : "default"}
                >
                  <Link href="/company/technonext-ltd">{index ? "Inspect" : "Open current"}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </>
  );
}
