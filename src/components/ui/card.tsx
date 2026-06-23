import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Base Card ────────────────────────────────────────────────────
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  noPad?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, noPad = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl border border-obsidian-100",
        "shadow-card",
        hover && "transition-all duration-400 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer",
        !noPad && "p-6",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 pb-4", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-playfair text-display-sm font-semibold text-obsidian", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-body-sm text-obsidian-400", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 pt-4 border-t border-obsidian-100 mt-4", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// ─── Stat Card ────────────────────────────────────────────────────
interface StatCardProps {
  value:    string | number;
  label:    string;
  icon?:    React.ReactNode;
  trend?:   { value: number; label: string };
  className?: string;
}

function StatCard({ value, label, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label-sm text-obsidian-400 mb-1">{label}</p>
          <p className="font-playfair text-display-md font-bold text-obsidian">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-body-xs mt-1",
                trend.value >= 0 ? "text-emerald-600" : "text-red-600"
              )}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-crimson/10 rounded-lg text-crimson">{icon}</div>
        )}
      </div>
    </Card>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard };
