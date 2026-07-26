import Link from "next/link";

export function Brand() {
  return (
    <Link
      aria-label="b4join home"
      className="inline-flex items-center gap-2.5 justify-self-start text-ink no-underline"
      href="/"
    >
      <span className="grid size-9 place-items-center rounded-[9px] bg-jade text-white" aria-hidden="true">
        <svg className="size-6 fill-none stroke-current stroke-[1.8]" viewBox="0 0 32 32">
          <path d="M8 7.5h10.5a5.5 5.5 0 0 1 0 11H13" />
          <path d="M8 7.5v17M8 24.5h8" />
          <path d="m20 22 2.5 2.5L27 19" />
        </svg>
      </span>
      <span className="font-display text-[21px] leading-none font-bold tracking-[-.025em]">b4join</span>
    </Link>
  );
}
