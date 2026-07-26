import { ChevronDown, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CompanySalaryEvidence } from "@/lib/contracts";

const bdt = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export function ReportedSalaryEvidence({
  records,
}: {
  records: CompanySalaryEvidence[];
}) {
  if (records.length === 0) return null;

  const source = records[0];
  const contributors = records.reduce(
    (total, record) => total + (record.sampleSize ?? 0),
    0,
  );

  return (
    <details
      className="group mt-4 overflow-hidden rounded-xl border border-line-strong bg-white"
      open
    >
      <summary className="grid cursor-pointer list-none gap-3 bg-amber-soft p-5 marker:hidden sm:grid-cols-[1fr_auto] sm:items-start [&::-webkit-details-marker]:hidden">
        <div>
          <p className="font-mono text-[10px] font-extrabold tracking-wider text-amber-dark uppercase">
            Community-reported salary context
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
            Role-level ranges reported by contributors
          </h2>
          <p className="mt-2 max-w-2xl text-[10px] leading-relaxed text-ink-soft">
            {records.length} role {records.length === 1 ? "range" : "ranges"}
            {contributors > 0
              ? ` based on ${contributors.toLocaleString()} submitted records`
              : ""}
            . The source does not specify a pay period, so these values are not
            labeled monthly or annual.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone="amber">Not verified</Badge>
          <ChevronDown className="size-4 text-amber-dark transition-transform group-open:rotate-180" />
        </div>
      </summary>

      <div className="grid border-t border-line sm:grid-cols-2">
          {records.map((record) => (
            <article
              className="grid gap-2 border-b border-line p-5 odd:sm:border-r"
              key={record.id}
            >
              <strong className="text-xs">{record.role}</strong>
              <span className="font-display text-xl font-bold text-ink">
                {bdt.format(record.salaryRange.minimumBdt)}–
                {bdt.format(record.salaryRange.maximumBdt)}
              </span>
              <small className="text-[9px] leading-relaxed text-muted">
                {record.sampleSize
                  ? `Based on ${record.sampleSize.toLocaleString()} contributor${record.sampleSize === 1 ? "" : "s"}`
                  : "Contributor count unavailable"}
                {record.bonus
                  ? ` · ${record.bonus.reportedCount} of ${record.bonus.answeredCount} reported a bonus`
                  : ""}
              </small>
            </article>
          ))}
      </div>

      <footer className="grid gap-2 border-t border-line bg-coral-soft p-5 text-[9px] leading-relaxed text-coral sm:grid-cols-[1fr_auto] sm:items-center">
        <p>
          <strong>Not verified.</strong> Community-submitted estimates are not
          confirmed company policy. Verify the role, pay period, benefits, and
          total compensation directly with the company.
        </p>
        <a
          className="inline-flex items-center gap-1 font-extrabold text-coral underline underline-offset-3"
          href={source.sourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          Open source <ExternalLink className="size-3" />
        </a>
      </footer>
    </details>
  );
}
