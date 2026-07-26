import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "jade",
  ...props
}: React.ComponentProps<"span"> & { tone?: "jade" | "amber" | "coral" | "blue" }) {
  const tones = {
    jade: "bg-jade-soft text-jade-dark",
    amber: "bg-amber-soft text-amber-dark",
    coral: "bg-coral-soft text-[#8b4046]",
    blue: "bg-blue-soft text-blue"
  };
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-[5px] px-2 py-1.25 font-mono text-[8px] leading-tight font-bold uppercase",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
