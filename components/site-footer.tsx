import Link from "next/link";

import { Brand } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="shrink-0 border-t border-line bg-white py-9.5">
      <div className="mx-auto flex w-[calc(100%_-_40px)] max-w-280 items-center justify-between gap-8 max-sm:w-[calc(100%_-_28px)] max-sm:flex-col max-sm:items-start">
        <div>
          <Brand />
          <p className="mt-3 text-[10px] leading-relaxed text-muted">
            Company research for better questions—not automatic verdicts.
          </p>
        </div>
        <nav className="flex flex-wrap gap-5" aria-label="Footer navigation">
          <Link
            className="text-[10px] font-bold text-ink-soft no-underline hover:text-jade-dark"
            href="/method"
          >
            How evidence works
          </Link>
          <Link
            className="text-[10px] font-bold text-ink-soft no-underline hover:text-jade-dark"
            href="/support"
          >
            Support &amp; corrections
          </Link>
        </nav>
      </div>
    </footer>
  );
}
