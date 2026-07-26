import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "min-h-11.25 w-full rounded-lg border border-line-strong bg-[#fbfdfc] px-3 text-ink outline-none placeholder:text-muted focus:border-jade focus:ring-3 focus:ring-jade/10",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-27.5 w-full resize-y rounded-lg border border-line-strong bg-[#fbfdfc] p-3 leading-relaxed text-ink outline-none placeholder:text-muted focus:border-jade focus:ring-3 focus:ring-jade/10",
        className
      )}
      {...props}
    />
  );
}
