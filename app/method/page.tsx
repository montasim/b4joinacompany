import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const evidenceSteps = [
  {
    label: "Source",
    title: "Workplace reports and official pages",
    copy: "Anonymous experiences remain attributed reports; official destinations are checked separately.",
    dot: "bg-coral ring-coral"
  },
  {
    label: "Pattern",
    title: "Recurring topic across roles and dates",
    copy: "Retrieval groups management, feedback, and stability excerpts without converting them into facts.",
    dot: "bg-jade ring-jade"
  },
  {
    label: "Decision action",
    title: "A question you can ask directly",
    copy: "Guidance includes citations, snapshot date, and explicit evidence gaps.",
    dot: "bg-amber ring-amber"
  }
] as const;

const boundaries = [
  {
    title: "Stories remain reports",
    copy: "Workplace accounts are unverified experiences, not established facts."
  },
  {
    title: "Sources stay visible",
    copy: "Short excerpts link to original Deshi Mula stories."
  },
  {
    title: "No company score",
    copy: "Questions expose unknowns without choosing a winner."
  }
] as const;

export default function MethodPage() {
  return (
    <>
      <SiteHeader active="Research" mode="public" />
      <main className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-195 pt-15.5 pb-22.5 max-sm:w-[calc(100%_-_28px)] max-sm:pt-9.5 max-sm:pb-15.5">
        <PageHead
          eyebrow="Inspectable by design"
          title="How evidence becomes a question."
          copy="b4join converts source material into things a candidate can verify. It does not decide whether a company is good or bad."
        />

        <Card className="overflow-hidden rounded-[14px] border-line-strong bg-mist shadow-[0_18px_45px_rgb(18_53_60_/_8%)]">
          <CardHeader className="bg-white px-5.5 py-5">
            <p className="mb-1.5 font-mono text-[9px] leading-tight font-bold tracking-[.06em] text-jade uppercase">
              One checkpoint question
            </p>
            <h3 className="max-w-90 font-display text-[21px] leading-[1.18] font-bold tracking-[-.03em] text-ink">
              “How are performance decisions documented?”
            </h3>
          </CardHeader>
          <CardContent className="relative px-5.5 py-2 before:absolute before:top-8.5 before:bottom-9.25 before:left-[31px] before:w-px before:bg-line-strong">
            {evidenceSteps.map(({ label, title, copy, dot }) => (
              <div
                className="relative grid grid-cols-[20px_minmax(0,1fr)] gap-2.75 py-4 [&+&]:border-t [&+&]:border-line"
                key={label}
              >
                <span
                  aria-hidden="true"
                  className={`z-1 mt-0.5 size-3.25 rounded-full border-3 border-mist ring-2 ${dot}`}
                />
                <div>
                  <small className="block font-mono text-[8px] leading-tight font-bold tracking-[.04em] text-muted uppercase">
                    {label}
                  </small>
                  <strong className="mt-1.25 block text-xs text-ink">{title}</strong>
                  <p className="mt-1 text-[10px] leading-normal text-muted">{copy}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <section className="mt-14">
          <p className="mb-2.75 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">
            What you can trust
          </p>
          <h2 className="font-display text-[clamp(27px,3vw,38px)] leading-[1.1] font-bold tracking-[-.03em] text-ink">
            Clear boundaries.
          </h2>
          <div className="mt-7 grid grid-cols-3 gap-2.75 max-[740px]:grid-cols-1">
            {boundaries.map(({ title, copy }) => (
              <Card className="rounded-[10px]" key={title}>
                <CardContent className="p-5">
                  <h3 className="text-[13px] font-bold tracking-normal text-ink">{title}</h3>
                  <p className="mt-1.75 text-[11px] leading-[1.55] text-muted">{copy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
