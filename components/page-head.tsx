import type { ReactNode } from "react";

export function PageHead({
  eyebrow,
  title,
  copy,
  actions
}: {
  eyebrow: string;
  title: string;
  copy: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8.5 flex max-w-190 items-end justify-between gap-6 max-sm:flex-col max-sm:items-start">
      <div className="max-w-190">
        <p className="mb-2.75 font-mono text-[10px] leading-tight font-extrabold tracking-[.08em] text-jade uppercase">{eyebrow}</p>
        <h1 className="font-display text-[clamp(40px,5.6vw,64px)] leading-[.99] font-bold tracking-[-.03em] text-ink">{title}</h1>
        <p className="mt-4 max-w-162.5 text-[15px] leading-[1.7] text-ink-soft">{copy}</p>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}
