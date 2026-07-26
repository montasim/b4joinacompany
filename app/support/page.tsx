import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";

export default function SupportPage() {
  return (
    <>
      <SiteHeader active="Support" mode="public" />
      <main className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-290 py-15.5 pb-22.5 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-24">
        <PageHead
          eyebrow="Evidence should be inspectable"
          title="Questions about a source or company?"
          copy="Understand the method, report an incorrect destination, or contact the project about private workspace data."
        />

        <div className="mt-4.5 grid grid-cols-3 gap-2.5 max-md:grid-cols-1" aria-label="Support topics">
          <Card>
            <CardContent>
              <h3 className="font-display text-xl leading-[1.18] font-bold tracking-[-.03em] text-ink">
                How reports become questions
              </h3>
              <p className="mt-2 mb-3 text-[11px] leading-relaxed text-muted">
                See retrieval, citations, snapshot rules, and evidence boundaries.
              </p>
              <a
                className="text-xs font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3"
                href="/method"
              >
                Read the method
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="font-display text-xl leading-[1.18] font-bold tracking-[-.03em] text-ink">
                Correct a company link
              </h3>
              <p className="mt-2 mb-3 text-[11px] leading-relaxed text-muted">
                Submit an official website, LinkedIn, careers link, or identity correction for review.
              </p>
              <a
                className="text-xs font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3"
                href="#contact"
              >
                Report a correction
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="font-display text-xl leading-[1.18] font-bold tracking-[-.03em] text-ink">
                Private decision data
              </h3>
              <p className="mt-2 mb-3 text-[11px] leading-relaxed text-muted">
                Notes, answers, and saved contexts are not part of the public dataset.
              </p>
              <a
                className="text-xs font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3"
                href="/saved"
              >
                Open private workspace
              </a>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-11" id="contact" aria-labelledby="contact-title">
          <CardContent className="grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] gap-9 p-7 max-md:grid-cols-1 max-sm:p-5">
            <div>
              <p className="mb-2.75 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">
                Contact
              </p>
              <h2
                className="font-display text-[clamp(27px,3vw,38px)] leading-[1.08] font-bold tracking-[-.03em] text-ink"
                id="contact-title"
              >
                Send what needs attention
              </h2>
              <p className="mt-2.5 text-xs leading-relaxed text-muted">
                Include the company name, source, or page you were viewing. For a correction, share the official
                destination we should verify.
              </p>
              <p className="mt-2.5 text-xs leading-relaxed text-muted">
                Prototype contact:{" "}
                <a
                  className="font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3"
                  href="mailto:montasimmamun@gmail.com"
                >
                  montasimmamun@gmail.com
                </a>
              </p>
            </div>

            <form className="grid gap-3.25">
              <label className="grid gap-1.5 text-[10px] font-extrabold text-ink">
                Topic
                <select
                  className="min-h-11 w-full rounded-lg border border-line-strong bg-white px-3 text-xs font-bold text-ink outline-none focus:border-jade focus:ring-3 focus:ring-jade/10"
                  defaultValue="Evidence question"
                >
                  <option>Evidence question</option>
                  <option>Company information correction</option>
                  <option>Privacy question</option>
                  <option>Report a problem</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-[10px] font-extrabold text-ink">
                Email
                <Input className="text-xs" type="email" placeholder="you@example.com" />
              </label>
              <label className="grid gap-1.5 text-[10px] font-extrabold text-ink">
                Company
                <Input className="text-xs" type="text" placeholder="Company name or b4join page" />
              </label>
              <label className="grid gap-1.5 text-[10px] font-extrabold text-ink">
                Source to verify
                <Input
                  className="text-xs"
                  type="url"
                  placeholder="Website, LinkedIn, careers, or story URL"
                />
              </label>
              <label className="grid gap-1.5 text-[10px] font-extrabold text-ink">
                Message
                <Textarea className="min-h-25 text-xs" placeholder="Tell us what needs attention" />
              </label>
              <Button type="submit">Send message</Button>
              <p className="mt-1 text-center text-[10px] leading-relaxed text-muted">
                Correction reports enter a verification queue. They never change a published company record directly.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
