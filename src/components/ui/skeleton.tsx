import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-obsidian-100 shimmer overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-obsidian-100 shadow-card overflow-hidden">
      <Skeleton className="aspect-property w-full" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4 pt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-obsidian-100">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export { Skeleton, PropertyCardSkeleton };
