import type { EvidenceCoverage } from "@/lib/contracts";
import { cn } from "@/lib/utils";

export const evidenceCoverageCopy: Record<
  EvidenceCoverage,
  { label: string; shortLabel: string; description: string }
> = {
  both: {
    label: "Both sources",
    shortLabel: "Both",
    description: "Matched workplace stories and salary evidence",
  },
  deshimula_only: {
    label: "Deshi Mula only",
    shortLabel: "Deshi only",
    description: "Workplace stories with no accepted salary match",
  },
  betonkemon_only: {
    label: "Beton Kemon only",
    shortLabel: "Beton only",
    description: "Salary evidence with no accepted workplace-story match",
  },
  review: {
    label: "Match needs review",
    shortLabel: "Review",
    description: "Workplace stories with possible, unconfirmed salary matches",
  },
};

export function EvidenceCoverageMark({
  coverage,
  compact = false,
  className,
}: {
  coverage: EvidenceCoverage;
  compact?: boolean;
  className?: string;
}) {
  const hasDeshimula = coverage !== "betonkemon_only";
  const hasBetonkemon = coverage === "both" || coverage === "betonkemon_only";
  const needsReview = coverage === "review";

  return (
    <span
      className={cn("inline-flex items-center", compact ? "gap-1" : "gap-1.5", className)}
      title={evidenceCoverageCopy[coverage].description}
      aria-label={evidenceCoverageCopy[coverage].label}
    >
      <span
        className={cn(
          "grid place-items-center rounded-sm border font-mono font-extrabold",
          compact ? "size-5 text-[7px]" : "h-6 min-w-7 px-1 text-[8px]",
          hasDeshimula
            ? "border-jade bg-jade text-white"
            : "border-line-strong bg-white text-muted",
        )}
        aria-hidden
      >
        DM
      </span>
      <span
        className={cn(
          "h-px",
          compact ? "w-2" : "w-3",
          needsReview
            ? "border-t border-dashed border-amber"
            : coverage === "both"
              ? "bg-jade"
              : "bg-line-strong",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "grid place-items-center rounded-sm border font-mono font-extrabold",
          compact ? "size-5 text-[7px]" : "h-6 min-w-7 px-1 text-[8px]",
          hasBetonkemon
            ? "border-amber bg-amber text-ink"
            : needsReview
              ? "border-dashed border-amber bg-amber-soft text-ink"
              : "border-line-strong bg-white text-muted",
        )}
        aria-hidden
      >
        BK
      </span>
    </span>
  );
}
