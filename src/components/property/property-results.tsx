"use client";

import * as React from "react";
import { PropertyCard }     from "@/components/property/property-card";
import { PropertyListItem } from "@/components/property/property-list-item";
import { PropertyEmpty }    from "@/components/property/property-empty";
import { PropertiesToolbar, type ViewMode } from "@/components/property/properties-toolbar";
import { Pagination }       from "@/components/ui/pagination";
import type { Property }    from "@/types";
import type { ParsedFilters, QueryResult } from "@/lib/filter-properties";

interface PropertyResultsProps {
  properties: Property[];
  total:      number;
  totalPages: number;
  page:       number;
  filters:    ParsedFilters;
  counts:     QueryResult["counts"];
  buildPageUrl: (page: number) => string;
}

export function PropertyResults({
  properties,
  total,
  totalPages,
  page,
  filters,
  counts,
  buildPageUrl,
}: PropertyResultsProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");

  const hasFilters = !!(
    filters.listingType || filters.type || filters.zoneSlug ||
    filters.priceMin != null || filters.priceMax != null ||
    filters.bedroomsMin != null || filters.areaMin != null ||
    filters.isExclusive || filters.isNew || filters.isFeatured || filters.query
  );

  return (
    <div className="flex-1 min-w-0">
      {/* Toolbar: count + chips + sort + view toggle */}
      <PropertiesToolbar
        total={total}
        filters={filters}
        counts={counts}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {/* Results */}
      {properties.length === 0 ? (
        <PropertyEmpty hasFilters={hasFilters} clearUrl="/propiedades" />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} property={p} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {properties.map((p) => (
            <PropertyListItem key={p.id} property={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          buildUrl={buildPageUrl}
        />
      )}
    </div>
  );
}
