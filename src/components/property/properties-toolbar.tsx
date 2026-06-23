"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { LayoutGrid, List, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildFilterParams, SORT_OPTIONS, getActiveFilterChips } from "@/lib/filter-properties";
import type { ParsedFilters } from "@/lib/filter-properties";
import { PropertyFilters } from "@/components/property/property-filters";
import type { QueryResult } from "@/lib/filter-properties";

export type ViewMode = "grid" | "list";

interface PropertiesToolbarProps {
  total:       number;
  filters:     ParsedFilters;
  counts:      QueryResult["counts"];
  viewMode:    ViewMode;
  onViewChange:(mode: ViewMode) => void;
}

export function PropertiesToolbar({
  total,
  filters,
  counts,
  viewMode,
  onViewChange,
}: PropertiesToolbarProps) {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();

  const push = React.useCallback(
    (changes: Record<string, string | null>) => {
      const qs = buildFilterParams(searchParams, changes);
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const chips = getActiveFilterChips(filters);

  const ikonBtn = cn(
    "p-2 rounded-lg border transition-all duration-150",
  );

  return (
    <div className="mb-6 space-y-3">
      {/* ─── Main bar ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Mobile filter trigger (rendered by PropertyFilters, but placed here in layout) */}
        <div className="lg:hidden">
          <PropertyFilters filters={filters} counts={counts} />
        </div>

        {/* Result count */}
        <p className="text-body-sm text-obsidian-400 flex-1 min-w-0">
          <span className="font-playfair font-semibold text-display-sm text-obsidian mr-1 leading-none">
            {total}
          </span>
          {total === 1 ? "propiedad encontrada" : "propiedades encontradas"}
        </p>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => push({ sortBy: e.target.value })}
            className={cn(
              "h-10 pl-4 pr-9 bg-white border border-obsidian-200 rounded-lg",
              "text-body-sm text-obsidian appearance-none cursor-pointer",
              "focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/15",
              "hover:border-obsidian-300 transition-colors duration-150",
              // custom arrow
              "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235A5A5A%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E')]",
              "bg-no-repeat bg-[right_10px_center]"
            )}
            aria-label="Ordenar por"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex rounded-lg border border-obsidian-200 overflow-hidden">
          <button
            onClick={() => onViewChange("grid")}
            className={cn(
              "p-2.5 transition-colors duration-150",
              viewMode === "grid" ? "bg-obsidian text-white" : "text-obsidian-400 hover:bg-ivory"
            )}
            aria-label="Vista cuadrícula"
            title="Vista cuadrícula"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={cn(
              "p-2.5 transition-colors duration-150 border-l border-obsidian-200",
              viewMode === "list" ? "bg-obsidian text-white" : "text-obsidian-400 hover:bg-ivory"
            )}
            aria-label="Vista lista"
            title="Vista lista"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ─── Active filter chips ──────────────────────────────── */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-body-xs text-obsidian-400">Filtros activos:</span>
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => push(chip.clearParams as Record<string, null>)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
                "bg-crimson/10 text-crimson border border-crimson/20",
                "text-body-xs font-medium",
                "hover:bg-crimson hover:text-white hover:border-crimson",
                "transition-all duration-150"
              )}
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}

          {/* Clear all */}
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-body-xs text-obsidian-400 hover:text-crimson underline underline-offset-2 transition-colors ml-1"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
}
