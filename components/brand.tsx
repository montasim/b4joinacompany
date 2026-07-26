import Link from "next/link";

export function Brand({ purpose = "Decision checkpoint" }: { purpose?: string }) {
  return (
    <Link className="inline-flex items-center gap-2.5 justify-self-start no-underline" href="/">
      <span className="grid size-9.25 place-items-center rounded-[9px] bg-jade text-white shadow-[inset_0_-3px_0_rgb(0_0_0/10%)]" aria-hidden>
        <svg className="size-6.25 fill-none stroke-current stroke-[1.8]" viewBox="0 0 32 32">
          <path d="M8 7.5h10.5a5.5 5.5 0 0 1 0 11H13" />
          <path d="M8 7.5v17M8 24.5h8" />
          <path d="m20 22 2.5 2.5L27 19" />
        </svg>
      </span>
      <span className="font-display text-xl leading-none font-bold tracking-tight">b4join</span>
      <span className="translate-y-0.5 border-l border-line pl-2.5 font-mono text-[9px] leading-tight font-bold tracking-[.05em] text-muted uppercase max-sm:hidden">{purpose}</span>
    </Link>
  );
}
