import Link from "next/link";
import { Check } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SupportCorrectionForm } from "@/components/support-correction-form";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata("support");

const supportPaths = [
  {
    mark: "C",
    eyebrow: "Correct company information",
    title: "Prepare a source-backed correction note",
    action: "Start ↓",
    href: "#correction-note",
    accent: "before:bg-jade",
    markStyle: "bg-jade-soft text-jade-dark",
  },
  {
    mark: "E",
    eyebrow: "Question how evidence is used",
    title: "Read the method and evidence boundaries",
    action: "Method →",
    href: "/method",
    accent: "before:bg-blue",
    markStyle: "bg-blue-soft text-blue",
  },
  {
    mark: "T",
    eyebrow: "Something on b4joinacompany broke",
    title: "Prepare a technical-support email",
    action: "Email →",
    href: "mailto:montasimmamun@gmail.com?subject=b4joinacompany%20website%20problem",
    accent: "before:bg-coral",
    markStyle: "bg-coral-soft text-coral",
  },
  {
    mark: "S",
    eyebrow: "Support the independent project",
    title: "Continue to SupportKori",
    action: "External ↗",
    href: "https://www.supportkori.com/montasim",
    accent: "before:bg-amber",
    markStyle: "bg-amber-soft text-amber-dark",
    external: true,
  },
] as const;

export default function SupportPage() {
  return (
    <>
      <SiteHeader active="Support" />
      <main
        className="relative min-h-[calc(100vh-68px)] overflow-hidden bg-[linear-gradient(rgb(20_120_110_/_4%)_1px,transparent_1px),linear-gradient(90deg,rgb(20_120_110_/_4%)_1px,transparent_1px)] bg-size-[32px_32px] py-14.5 pb-20 before:absolute before:top-11 before:left-[max(-230px,calc((100vw-1120px)/2-320px))] before:size-127.5 before:rounded-full before:border before:border-jade/15 before:content-[''] max-sm:min-h-0 max-sm:py-9.5 max-sm:pb-14 max-sm:before:hidden"
        id="main"
      >
        <div className="relative mx-auto grid w-[calc(100%_-_40px)] max-w-280 grid-cols-[minmax(360px,.88fr)_minmax(520px,1.12fr)] items-start gap-14.5 max-lg:grid-cols-1 max-lg:gap-9.5 max-sm:w-[calc(100%_-_28px)] max-sm:gap-7.5">
          <section className="pt-3 max-lg:max-w-180 max-sm:pt-0">
            <p className="font-mono text-[10px] font-extrabold tracking-[.08em] text-jade uppercase">
              Corrections, questions & support
            </p>
            <h1 className="mt-3 mb-5 max-w-137.5 font-display text-[clamp(49px,5.2vw,67px)] leading-[.98] font-bold tracking-[-.045em] max-sm:text-[clamp(42px,13vw,55px)]">
              Every brief should lead{" "}
              <em className="text-jade not-italic underline decoration-amber decoration-6 underline-offset-5">
                back to its source.
              </em>
            </h1>
            <p className="max-w-135 text-[15px] leading-relaxed text-ink-soft max-sm:text-sm">
              Flag a wrong company destination, identity, evidence label, or
              salary source. Nothing changes a published snapshot until it is
              reviewed.
            </p>

            <nav
              aria-label="Choose a support path"
              className="mt-7 overflow-hidden rounded-[13px] border border-line-strong bg-white/90 shadow-[0_12px_35px_rgb(22_56_61_/_5%)]"
            >
              {supportPaths.map((path) => {
                const classes = `relative grid min-h-18 grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line py-3 pr-4 pl-4.5 no-underline transition-colors before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:content-[''] last:border-b-0 hover:bg-jade-soft max-sm:min-h-17 max-sm:grid-cols-[32px_minmax(0,1fr)] max-sm:gap-2.5 max-sm:py-3 max-sm:pr-3 max-sm:pl-4 ${path.accent}`;
                const content = (
                  <>
                    <span
                      aria-hidden="true"
                      className={`grid size-7.5 place-items-center rounded-lg font-mono text-[10px] font-extrabold ${path.markStyle}`}
                    >
                      {path.mark}
                    </span>
                    <span>
                      <small className="block font-mono text-[8px] leading-snug font-extrabold tracking-[.04em] text-muted uppercase">
                        {path.eyebrow}
                      </small>
                      <strong className="mt-1 block text-[11px] leading-snug">
                        {path.title}
                      </strong>
                    </span>
                    <em className="text-[9px] font-extrabold text-jade-dark not-italic whitespace-nowrap max-sm:col-start-2 max-sm:-mt-1">
                      {path.action}
                    </em>
                  </>
                );
                return path.href.startsWith("/") ? (
                  <Link className={classes} href={path.href} key={path.mark}>
                    {content}
                  </Link>
                ) : (
                  <a
                    className={classes}
                    href={path.href}
                    key={path.mark}
                    rel={
                      "external" in path && path.external
                        ? "noopener noreferrer"
                        : undefined
                    }
                    target={
                      "external" in path && path.external
                        ? "_blank"
                        : undefined
                    }
                  >
                    {content}
                  </a>
                );
              })}
            </nav>

            <aside className="mt-4 grid grid-cols-[auto_1fr] gap-2.5 rounded-xl border border-line bg-white/60 p-3.5">
              <span className="grid size-5.25 place-items-center rounded-full bg-jade-soft text-jade-dark">
                <Check className="size-3" />
              </span>
              <p className="text-[9px] leading-relaxed text-muted">
                <strong className="mb-0.5 block text-ink">
                  No account is required.
                </strong>
                Never send passwords, Google credentials, private saved notes,
                or confidential workplace details.
              </p>
            </aside>
          </section>

          <SupportCorrectionForm />
        </div>
      </main>
    </>
  );
}
