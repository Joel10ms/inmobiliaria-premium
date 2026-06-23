"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildFilterParams, ZONES } from "@/lib/filter-properties";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import type { ParsedFilters, QueryResult } from "@/lib/filter-properties";

interface PropertyFiltersProps {
  filters: ParsedFilters;
  counts:  QueryResult["counts"];
}

// ─── Pill button (for single-select options) ──────────────────────
function Pill({
  active,
  children,
  onClick,
  className,
}: {
  active:    boolean;
  children:  React.ReactNode;
  onClick:   () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-body-xs font-medium border transition-all duration-150",
        active
          ? "bg-crimson text-white border-crimson shadow-sm"
          : "bg-white text-obsidian-600 border-obsidian-200 hover:border-crimson/50 hover:text-crimson",
        className
      )}
    >
      {children}
    </button>
  );
}

// ─── Section divider ──────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-obsidian-100 last:border-b-0">
      <p className="text-label-sm text-obsidian-400 tracking-widest mb-3">{title}</p>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
export function PropertyFilters({ filters, counts }: PropertyFiltersProps) {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const push = React.useCallback(
    (changes: Record<string, string | null>) => {
      const qs = buildFilterParams(searchParams, changes);
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const toggle = (key: string, value: string) => {
    const current = searchParams.get(key);
    push({ [key]: current === value ? null : value });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const hasFilters =
    !!filters.listingType || !!filters.type || !!filters.zoneSlug ||
    filters.priceMin != null || filters.priceMax != null ||
    filters.bedroomsMin != null || filters.areaMin != null ||
    filters.isExclusive || filters.isNew || filters.isFeatured;

  const filtersContent = (
    <div className="flex flex-col divide-y-0">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-1">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-obsidian-400" />
          <span className="font-inter font-semibold text-body-md text-obsidian">Filtros</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-body-xs text-crimson hover:underline transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Operación */}
      <FilterSection title="Operación">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "",             label: "Todas" },
            { value: "VENTA",        label: "En Venta" },
            { value: "RENTA",        label: "En Renta" },
          ].map(({ value, label }) => (
            <Pill
              key={value}
              active={(filters.listingType ?? "") === value}
              onClick={() => push({ listingType: value || null })}
            >
              {label}
              {value && counts.byListingType[value] != null && (
                <span className="ml-1 opacity-70">({counts.byListingType[value]})</span>
              )}
            </Pill>
          ))}
        </div>
      </FilterSection>

      {/* Tipo */}
      <FilterSection title="Tipo de propiedad">
        <div className="flex flex-wrap gap-2">
          {siteConfig.propertyTypes.map((t) => {
            const count = counts.byType[t] ?? 0;
            if (count === 0) return null;
            return (
              <Pill
                key={t}
                active={filters.type === t}
                onClick={() => toggle("type", t)}
              >
                {t}
                <span className="ml-1 opacity-70">({count})</span>
              </Pill>
            );
          })}
        </div>
      </FilterSection>

      {/* Zona */}
      <FilterSection title="Zona">
        <div className="space-y-2">
          {ZONES.map(({ slug, name }) => {
            const count = counts.byZone[slug] ?? 0;
            if (count === 0) return null;
            const isChecked = filters.zoneSlug === slug;
            return (
              <label
                key={slug}
                className={cn(
                  "flex items-center justify-between gap-3 cursor-pointer group py-1 px-2 rounded-lg transition-colors",
                  isChecked ? "bg-crimson/5" : "hover:bg-ivory"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150",
                      isChecked ? "bg-crimson border-crimson" : "border-obsidian-300 group-hover:border-crimson/50"
                    )}
                    onClick={() => toggle("zone", slug)}
                  >
                    {isChecked && (
                      <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 12 12">
                        <path d="M1 6l4 4 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span
                    className={cn("text-body-sm transition-colors", isChecked ? "text-crimson font-medium" : "text-obsidian group-hover:text-obsidian")}
                    onClick={() => toggle("zone", slug)}
                  >
                    {name}
                  </span>
                </div>
                <span className="text-body-xs text-obsidian-400 tabular-nums">{count}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Precio */}
      <FilterSection title="Rango de precio">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-body-xs text-obsidian-400 mb-1 block">Mínimo ($MXN)</label>
              <PriceInput
                placeholder="Sin mínimo"
                value={filters.priceMin?.toString() ?? ""}
                onChange={(v) => push({ priceMin: v || null })}
              />
            </div>
            <div className="text-obsidian-300 mt-5">—</div>
            <div className="flex-1">
              <label className="text-body-xs text-obsidian-400 mb-1 block">Máximo ($MXN)</label>
              <PriceInput
                placeholder="Sin máximo"
                value={filters.priceMax?.toString() ?? ""}
                onChange={(v) => push({ priceMax: v || null })}
              />
            </div>
          </div>

          {/* Quick price ranges */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "< 5M",    priceMin: null, priceMax: "5000000" },
              { label: "5–15M",   priceMin: "5000000",  priceMax: "15000000" },
              { label: "15–35M",  priceMin: "15000000", priceMax: "35000000" },
              { label: "35–70M",  priceMin: "35000000", priceMax: "70000000" },
              { label: "+70M",    priceMin: "70000000", priceMax: null },
            ].map(({ label, priceMin, priceMax }) => {
              const active =
                (filters.priceMin?.toString() ?? null) === priceMin &&
                (filters.priceMax?.toString() ?? null) === priceMax;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => push({ priceMin, priceMax })}
                  className={cn(
                    "px-2.5 py-1 rounded text-body-xs border transition-all duration-150",
                    active
                      ? "bg-crimson text-white border-crimson"
                      : "text-obsidian-500 border-obsidian-200 hover:border-crimson/40 hover:text-crimson"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </FilterSection>

      {/* Recámaras */}
      <FilterSection title="Recámaras (mínimo)">
        <div className="flex gap-2">
          {[
            { label: "Todas", value: null },
            { label: "1+",    value: "1" },
            { label: "2+",    value: "2" },
            { label: "3+",    value: "3" },
            { label: "4+",    value: "4" },
            { label: "5+",    value: "5" },
          ].map(({ label, value }) => (
            <Pill
              key={label}
              active={(filters.bedroomsMin?.toString() ?? null) === value}
              onClick={() => push({ bedroomsMin: value })}
              className="px-2.5"
            >
              {label}
            </Pill>
          ))}
        </div>
      </FilterSection>

      {/* Área mínima */}
      <FilterSection title="Área construida mínima">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Todas",  value: null },
            { label: "100 m²", value: "100" },
            { label: "200 m²", value: "200" },
            { label: "300 m²", value: "300" },
            { label: "500 m²", value: "500" },
          ].map(({ label, value }) => (
            <Pill
              key={label}
              active={(filters.areaMin?.toString() ?? null) === value}
              onClick={() => push({ areaMin: value })}
            >
              {label}
            </Pill>
          ))}
        </div>
      </FilterSection>

      {/* Especiales */}
      <FilterSection title="Características">
        <div className="space-y-2">
          {[
            { key: "isExclusive", label: "Exclusivas", active: !!filters.isExclusive },
            { key: "isNew",       label: "Nuevas",     active: !!filters.isNew },
            { key: "isFeatured",  label: "Destacadas", active: !!filters.isFeatured },
          ].map(({ key, label, active }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                  active ? "bg-crimson border-crimson" : "border-obsidian-300 group-hover:border-crimson/50"
                )}
                onClick={() => push({ [key]: active ? null : "true" })}
              >
                {active && (
                  <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 12 12">
                    <path d="M1 6l4 4 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span
                className={cn("text-body-sm", active ? "text-crimson font-medium" : "text-obsidian")}
                onClick={() => push({ [key]: active ? null : "true" })}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* ─── Desktop sidebar ─────────────────────────────── */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 bg-white rounded-2xl border border-obsidian-100 shadow-card p-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {filtersContent}
        </div>
      </aside>

      {/* ─── Mobile: trigger button ──────────────────────── */}
      <Button
        variant="outline"
        size="md"
        leftIcon={<SlidersHorizontal className="h-4 w-4" />}
        onClick={() => setIsOpen(true)}
        className="lg:hidden"
      >
        Filtros
        {hasFilters && (
          <span className="ml-1 h-5 w-5 rounded-full bg-crimson text-white text-[10px] font-bold flex items-center justify-center">
            {[
              filters.listingType, filters.type, filters.zoneSlug,
              filters.priceMin, filters.bedroomsMin, filters.areaMin,
              filters.isExclusive, filters.isNew, filters.isFeatured,
            ].filter(Boolean).length}
          </span>
        )}
      </Button>

      {/* ─── Mobile: slide-over drawer ───────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute top-0 bottom-0 right-0 w-full max-w-sm bg-white overflow-y-auto shadow-luxury-xl">
            <div className="p-5">
              {/* Drawer header */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-playfair font-semibold text-body-xl text-obsidian">
                  Filtrar propiedades
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-obsidian-400 hover:bg-ivory hover:text-obsidian transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {filtersContent}

              {/* Drawer footer */}
              <div className="pt-4 mt-2 border-t border-obsidian-100">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Ver resultados
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Controlled price input with debounce ─────────────────────────
function PriceInput({
  value,
  placeholder,
  onChange,
}: {
  value:       string;
  placeholder: string;
  onChange:    (v: string) => void;
}) {
  const [local, setLocal] = React.useState(value);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => { setLocal(value); }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "");
    setLocal(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), 700);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={local}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn(
        "w-full h-9 px-3 bg-white border border-obsidian-200 rounded-lg",
        "text-body-xs text-obsidian placeholder:text-obsidian-300",
        "focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/20",
        "transition-colors duration-150"
      )}
    />
  );
}
