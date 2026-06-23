import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-inter font-semibold tracking-wider uppercase",
  {
    variants: {
      variant: {
        crimson:  "bg-crimson text-white",
        gold:     "bg-gold text-obsidian",
        dark:     "bg-obsidian text-white",
        outline:  "border border-obsidian-200 text-obsidian bg-transparent",
        success:  "bg-emerald-100 text-emerald-800",
        warning:  "bg-amber-100 text-amber-800",
        error:    "bg-red-100 text-red-700",
        ivory:    "bg-ivory-200 text-obsidian-600",
        "glass-dark": "glass-dark text-white border-white/10",
      },
      size: {
        sm:   "text-[10px] px-2    py-0.5 rounded",
        md:   "text-xs     px-2.5  py-1   rounded-md",
        lg:   "text-xs     px-3    py-1.5 rounded-md",
      },
    },
    defaultVariants: {
      variant: "crimson",
      size:    "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
