import Link from "next/link";
import {
  BriefcaseBusiness,
  ExternalLink,
  MessageSquareText,
  MonitorSmartphone,
  Search
} from "lucide-react";

import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Recognize the company",
    copy: "Recognize the company shown on Deshi Mula and open its matching research record."
  },
  {
    icon: BriefcaseBusiness,
    title: "Check jobs and signals",
    copy: "Open official websites, LinkedIn pages, career destinations, and current hiring evidence."
  },
  {
    icon: MessageSquareText,
    title: "Ask from the evidence",
    copy: "Retrieve relevant story excerpts and get a cited answer without leaving the company page."
  }
];

export default function ExtensionPage() {
  return (
    <>
      <SiteHeader active="Extension" mode="public" />
      <main className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-290 py-15.5 pb-22.5 max-sm:w-[calc(100%_-_28px)] max-sm:py-8 max-sm:pb-24">
        <PageHead
          eyebrow="Research where the decision starts"
          title="b4join, directly inside Deshi Mula."
          copy="Deshi Mula Extended adds a focused research panel to company pages. It works from published b4join evidence without requiring an account."
          actions={
            <Button asChild>
              <a href="https://deshimula.com" target="_blank" rel="noreferrer">
                Open Deshi Mula <ExternalLink aria-hidden="true" className="size-4" />
              </a>
            </Button>
          }
        />

        <section
          className="grid grid-cols-[minmax(0,1.15fr)_minmax(280px,.85fr)] items-start gap-4.5 max-md:grid-cols-1"
          aria-label="Extension overview"
        >
          <Card className="overflow-hidden border-line-strong shadow-panel">
            <CardHeader className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3.5 px-5.5 py-5 max-sm:grid-cols-[48px_minmax(0,1fr)]">
              <span className="grid size-12 place-items-center rounded-[10px] bg-ink text-white [&_svg]:size-6">
                <MonitorSmartphone aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="mb-1 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">
                  Deshi Mula Extended
                </p>
                <h2 className="font-display text-2xl leading-tight font-bold tracking-[-.025em] text-ink">
                  One clean research workflow.
                </h2>
              </div>
              <Badge className="max-sm:col-span-2 max-sm:ml-15 max-sm:justify-self-start">Independent</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <ol className="m-0 list-none p-0">
                {[
                  [
                    "Open a company on Deshi Mula",
                    "The extension recognizes the current company automatically."
                  ],
                  [
                    "Choose Brief, Stories, Jobs & salary, or Ask",
                    "Each tab draws from the same published b4join evidence."
                  ],
                  [
                    "Continue without signing in",
                    "No b4join account, pairing code, or private workspace is required."
                  ]
                ].map(([title, copy], index) => (
                  <li
                    className="grid grid-cols-[32px_minmax(0,1fr)] gap-3.5 border-b border-line px-5.5 py-4.5 last:border-b-0"
                    key={title}
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-jade-soft font-mono text-[10px] font-extrabold text-jade-dark">
                      {index + 1}
                    </span>
                    <div>
                      <strong className="block text-xs leading-relaxed text-ink">{title}</strong>
                      <p className="mt-1 text-[10px] leading-relaxed text-muted">{copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5.5">
              <p className="mb-2.5 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">
                Clear boundary
              </p>
              <h2 className="font-display text-[clamp(27px,3vw,38px)] leading-[1.08] font-bold tracking-[-.03em] text-ink">
                The extension stands on its own.
              </h2>
            </CardHeader>
            <CardContent className="grid justify-items-start gap-4 p-5.5">
              <p className="text-xs leading-[1.7] text-ink-soft">
                Use company research, stories, jobs, salary guidance, and cited Ask without signing in. A
                b4join account is only needed for private website features such as saved checkpoints.
              </p>
              <Badge>No account required</Badge>
              <Button asChild variant="outline">
                <Link href="/method">See how evidence is prepared</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="mt-14" aria-labelledby="install-extension">
          <p className="mb-2.75 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">
            Local installation
          </p>
          <h2 id="install-extension" className="font-display text-[clamp(27px,3vw,38px)] leading-[1.08] font-bold tracking-[-.03em] text-ink">
            Install the extension in a few minutes.
          </h2>
          <Card className="mt-4.5 border-line-strong">
            <CardContent className="grid gap-4 p-5.5 md:grid-cols-2">
              <ol className="m-0 grid list-none gap-4 p-0">
                {[
                  ["Run b4join locally", "From the b4join app folder, run pnpm dev. Keep it available at http://localhost:3000."],
                  ["Build the extension", "From the deshi-mula-extended folder, run pnpm install, then pnpm build."],
                  ["Load the unpacked folder", "Open brave://extensions or chrome://extensions, enable Developer mode, choose Load unpacked, and select dist/extension."],
                  ["Open Deshi Mula", "Visit deshimula.com and refresh the page. The research button will appear beside recognized companies."]
                ].map(([title, copy], index) => (
                  <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-3" key={title}>
                    <span className="grid size-8 place-items-center rounded-full bg-jade-soft font-mono text-[10px] font-extrabold text-jade-dark">{index + 1}</span>
                    <div><strong className="block text-xs leading-relaxed text-ink">{title}</strong><p className="mt-1 text-[10px] leading-relaxed text-muted">{copy}</p></div>
                  </li>
                ))}
              </ol>
              <div className="rounded-lg bg-ink p-5 text-white">
                <p className="mb-2 font-mono text-[9px] font-extrabold tracking-[.08em] text-jade-soft uppercase">Default local endpoint</p>
                <code className="block rounded bg-white/10 px-3 py-2 text-[11px] text-white">http://localhost:3000/api/v1/extension</code>
                <p className="mt-3 text-[10px] leading-relaxed text-white/70">If the extension was previously installed, click Reload after rebuilding. The extension does not require a b4join account.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-14">
          <p className="mb-2.75 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">
            What it adds
          </p>
          <h2 className="font-display text-[clamp(27px,3vw,38px)] leading-[1.08] font-bold tracking-[-.03em] text-ink">
            An edge without extra complexity.
          </h2>
          <div className="mt-4.5 grid grid-cols-3 gap-2.5 max-md:grid-cols-1">
            {features.map(({ icon: Icon, title, copy }) => (
              <Card key={title}>
                <CardContent className="p-5">
                  <span className="mb-4 grid size-10 place-items-center rounded-lg bg-jade-soft text-jade-dark [&_svg]:size-5">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl leading-tight font-bold tracking-[-.02em] text-ink">{title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">{copy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
