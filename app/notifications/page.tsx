import Link from "next/link";
import { Bell, CheckCircle2 } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  [
    "TechnoNext Ltd has new evidence",
    "4 new reports and one hiring-status change are available. Your saved revision is unchanged.",
    "/history",
    "Review changes"
  ],
  [
    "BJIT checkpoint refreshed",
    "Revision 4 was created from snapshot 2026-07-22. Two answers were carried forward.",
    "/history",
    "View revision"
  ],
  [
    "Weekly email digest is off",
    "In-app evidence updates remain available. Enable the optional digest in Account.",
    "/account",
    "Notification settings"
  ]
];

export default function NotificationsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-290 py-14 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-24">
        <PageHead
          eyebrow="Nothing changes without you"
          title="Evidence updates."
          copy="New source material never silently replaces a saved checkpoint."
          actions={
            <Button variant="ghost" size="sm">
              Mark all read
            </Button>
          }
        />
        <section className="grid gap-3" aria-label="Evidence notifications">
          {items.map(([title, copy, href, label], index) => (
            <Card key={title}>
              <CardContent className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-4 p-5 max-sm:grid-cols-[40px_minmax(0,1fr)]">
                <span
                  className={`grid size-10 place-items-center rounded-full ${
                    index === 0 ? "bg-coral-soft text-coral" : "bg-jade-soft text-jade"
                  } [&_svg]:size-4.5`}
                >
                  {index === 0 ? <Bell aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-extrabold text-ink">{title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">{copy}</p>
                </div>
                <Button
                  asChild
                  className="max-sm:col-span-2 max-sm:mt-1 max-sm:ml-14 max-sm:justify-self-start"
                  variant="outline"
                  size="sm"
                >
                  <Link href={href}>{label}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </>
  );
}
