import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page:       number;
  totalPages: number;
  total:      number;
  buildUrl:   (page: number) => string;
}

function pageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const left  = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  const pages: (number | "…")[] = [1];

  if (left > 2) pages.push("…");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}

export function Pagination({ page, totalPages, total, buildUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages  = pageRange(page, totalPages);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const baseBtn = cn(
    "inline-flex items-center justify-center h-10 w-10 rounded-lg",
    "font-inter text-body-sm font-medium transition-all duration-200"
  );

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-obsidian-100"
    >
      {/* Count label */}
      <p className="text-body-sm text-obsidian-400">
        Página <span className="font-semibold text-obsidian">{page}</span> de{" "}
        <span className="font-semibold text-obsidian">{totalPages}</span> —{" "}
        <span className="font-semibold text-obsidian">{total}</span> propiedades
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        {hasPrev ? (
          <Link
            href={buildUrl(page - 1)}
            className={cn(baseBtn, "text-obsidian-400 hover:bg-ivory hover:text-obsidian")}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span className={cn(baseBtn, "text-obsidian-200 cursor-not-allowed")} aria-disabled>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className={cn(baseBtn, "text-obsidian-300 cursor-default pointer-events-none")}
            >
              …
            </span>
          ) : (
            <Link
              key={p}
              href={buildUrl(p)}
              className={cn(
                baseBtn,
                p === page
                  ? "bg-crimson text-white shadow-crimson/30 shadow-sm"
                  : "text-obsidian hover:bg-ivory hover:text-crimson"
              )}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Link>
          )
        )}

        {/* Next */}
        {hasNext ? (
          <Link
            href={buildUrl(page + 1)}
            className={cn(baseBtn, "text-obsidian-400 hover:bg-ivory hover:text-obsidian")}
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className={cn(baseBtn, "text-obsidian-200 cursor-not-allowed")} aria-disabled>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
