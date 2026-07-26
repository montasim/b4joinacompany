import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="shrink-0 border-t border-line bg-white">
      <div className="mx-auto flex min-h-27 w-[calc(100%_-_40px)] max-w-290 items-center justify-between gap-5 max-sm:w-[calc(100%_-_28px)] max-sm:flex-col max-sm:items-start max-sm:py-6">
        <p className="text-[10px] leading-relaxed text-muted">b4join turns reported experiences into questions.<br />It does not verify claims or rate companies.</p>
        <nav className="flex flex-wrap gap-4">
          <Link className="text-[10px] font-bold text-ink-soft no-underline" href="/method">Sources</Link>
          <Link className="text-[10px] font-bold text-ink-soft no-underline" href="/support">Support</Link>
          <Link className="text-[10px] font-bold text-ink-soft no-underline" href="/extension">Extension</Link>
          <Link className="text-[10px] font-bold text-ink-soft no-underline" href="/states">Fallback states</Link>
          <Link className="text-[10px] font-bold text-ink-soft no-underline" href="/account#privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
