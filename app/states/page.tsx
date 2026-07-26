import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const states = [
  [
    "○",
    "No decisions in progress",
    "Check a company, add your context, and save the questions you want to verify.",
    "Check a company",
    "/"
  ],
  [
    "?",
    "Company not found",
    "Try another spelling or submit a company identity for review.",
    "Search again",
    "/"
  ],
  [
    "→",
    "Finding what to verify",
    "Retrieving the active snapshot and relevant evidence excerpts.",
    "Please wait",
    "/states"
  ],
  [
    "!",
    "The checkpoint could not be updated",
    "Your current revision is safe. Try the refresh again later.",
    "Retry",
    "/company/technonext-ltd"
  ],
  [
    "?",
    "Not enough evidence",
    "b4join found too little relevant material for a responsible answer.",
    "Open sources",
    "/method"
  ],
  [
    "5",
    "Today’s AI allowance is used",
    "Cited deterministic retrieval is still available; generated prose resets tomorrow.",
    "View evidence",
    "/ask"
  ],
  [
    "S",
    "Generated prose is unavailable",
    "The provider failed, so b4join returned a cited deterministic summary.",
    "Continue",
    "/ask"
  ],
  [
    "⇄",
    "This answer changed elsewhere",
    "Reload the latest revision before saving so neither answer is silently overwritten.",
    "Reload",
    "/history"
  ],
  [
    "↓",
    "Saved for later sync",
    "The extension queued this change and will retry when the API is available.",
    "View saved",
    "/saved"
  ],
  [
    "↗",
    "Sign in to save this decision",
    "Public research remains available. An account is required only for private workspace features.",
    "Sign in",
    "/auth/sign-in"
  ]
] as const;

export default function StatesPage() {
  return (
    <>
      <SiteHeader mode="public" />
      <main className="mx-auto min-h-[calc(100vh-68px)] w-[calc(100%_-_40px)] max-w-260 pt-15.5 pb-22.5 max-sm:w-[calc(100%_-_28px)] max-sm:pt-9.5 max-sm:pb-24">
        <PageHead
          eyebrow="Prototype reference"
          title="Essential checkpoint states."
          copy="Every interruption explains what happened and gives one useful next action."
        />

        <section
          aria-label="Essential checkpoint states"
          className="mt-7 grid grid-cols-2 gap-3.25 max-sm:grid-cols-1"
        >
          {states.map(([icon, title, copy, label, href], index) => {
            const isError = index === 3 || index === 7;
            const titleId = `state-title-${index + 1}`;

            return (
              <Card
                aria-labelledby={titleId}
                className="min-h-67.5 rounded-[11px]"
                key={title}
              >
                <CardContent className="grid h-full content-center justify-items-center p-7 text-center">
                  <span
                    aria-hidden="true"
                    className={`mb-4 grid size-11.5 place-items-center rounded-full text-[19px] ${
                      isError
                        ? "bg-coral-soft text-[#843f44]"
                        : "bg-jade-soft text-jade-dark"
                    }`}
                  >
                    {icon}
                  </span>
                  <h2
                    className="font-display text-[22px] leading-[1.18] font-bold tracking-[-.03em] text-ink"
                    id={titleId}
                  >
                    {title}
                  </h2>
                  <p className="mt-2 mb-4.25 max-w-82.5 text-[11px] leading-[1.55] text-muted">
                    {copy}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant={index === 0 ? "default" : "outline"}
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>
    </>
  );
}
