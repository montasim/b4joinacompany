"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10.5 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-extrabold no-underline transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-jade/30 disabled:pointer-events-none disabled:opacity-50",
  {
  variants: {
    variant: {
      default: "border-jade bg-jade text-white hover:bg-jade-dark",
      outline: "border-line-strong bg-white text-ink hover:border-jade hover:bg-jade-soft hover:text-jade-dark",
      amber: "border-amber bg-amber text-ink hover:bg-[#d99429]",
      ghost: "border-transparent bg-transparent text-ink-soft hover:border-jade hover:bg-jade-soft hover:text-jade-dark"
    },
    size: {
      default: "",
      sm: "min-h-8.75 px-3 py-2 text-[11px]",
      lg: "min-h-12 px-4.5 py-3"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
});

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
