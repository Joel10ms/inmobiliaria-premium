import type { Property } from "@/types";
import { mockProperties } from "@/lib/mock-data";

// ─── Filter params (parsed from URL searchParams) ─────────────────
export interface ParsedFilters {
  listingType?: string;
  type?:        string;
  zoneSlug?:    string;
  priceMin?:    number;
  priceMax?:    number;
  bedroomsMin?: number;
  areaMin?:     number;
  isExclusive?: boolean;
  isNew?:       boolean;
  isFeatured?:  boolean;
  query?:       string;
  sortBy:       string;
  page:         number;
  limit:        number;
}

const ITEMS_PER_PAGE = 12;

// ─── Parse raw searchParams into typed filters ────────────────────
export function parseSearchParams(
  params: Record<string, string | string[] | undefined>
): ParsedFilters {
  const str = (key: string) => {
    const v = params[key];
    return typeof v === "string" && v.length > 0 ? v : undefined;
  };
  const num = (key: string) => {
    const v = str(key);
    const n = v ? parseInt(v, 10) : NaN;
    return isNaN(n) ? undefined : n;
  };
  const bool = (key: string) => str(key) === "true" ? true : undefined;

  return {
    listingType:  str("listingType"),
    type:         str("type"),
    zoneSlug:     str("zone"),
    priceMin:     num("priceMin"),
    priceMax:     num("priceMax"),
    bedroomsMin:  num("bedroomsMin"),
    areaMin:      num("areaMin"),
    isExclusive:  bool("isExclusive"),
    isNew:        bool("isNew"),
    isFeatured:   bool("isFeatured"),
    query:        str("q"),
    sortBy:       str("sortBy") ?? "date_desc",
    page:         Math.max(1, num("page") ?? 1),
    limit:        ITEMS_PER_PAGE,
  };
}

// ─── Apply filters to property array ─────────────────────────────
function applyFilters(properties: Property[], f: ParsedFilters): Property[] {
  return properties.filter((p) => {
    if (p.status !== "ACTIVA") return false;
    if (f.listingType && p.listingType !== f.listingType) return false;
    if (f.type        && p.type        !== f.type)        return false;
    if (f.zoneSlug    && p.zone.slug   !== f.zoneSlug)    return false;
    if (f.isExclusive && !p.isExclusive) return false;
    if (f.isNew       && !p.isNew)       return false;
    if (f.isFeatured  && !p.isFeatured)  return false;

    const price = Number(p.price);
    if (f.priceMin != null && price < f.priceMin) return false;
    if (f.priceMax != null && price > f.priceMax) return false;

    const beds = p.bedrooms ?? 0;
    if (f.bedroomsMin != null && beds < f.bedroomsMin) return false;

    const area = p.builtArea ?? p.totalArea ?? 0;
    if (f.areaMin != null && area < f.areaMin) return false;

    if (f.query) {
      const q = f.query.toLowerCase();
      const inTitle = p.title.toLowerCase().includes(q);
      const inDesc  = p.description.toLowerCase().includes(q);
      const inZone  = p.zone.name.toLowerCase().includes(q);
      if (!inTitle && !inDesc && !inZone) return false;
    }

    return true;
  });
}

// ─── Sort ─────────────────────────────────────────────────────────
function applySort(properties: Property[], sortBy: string): Property[] {
  return [...properties].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":  return Number(a.price)  - Number(b.price);
      case "price_desc": return Number(b.price)  - Number(a.price);
      case "area_desc": {
        const aA = a.builtArea ?? a.totalArea ?? 0;
        const bA = b.builtArea ?? b.totalArea ?? 0;
        return bA - aA;
      }
      case "date_asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default: // date_desc
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}

// ─── Main query function ──────────────────────────────────────────
export interface QueryResult {
  properties: Property[];
  total:      number;
  totalPages: number;
  page:       number;
  limit:      number;
  counts:     {
    byType:        Record<string, number>;
    byZone:        Record<string, number>;
    byListingType: Record<string, number>;
  };
}

export function queryProperties(filters: ParsedFilters): QueryResult {
  // Compute counts from full dataset (for sidebar facets)
  const counts = computeCounts(mockProperties);

  // Apply filters
  const filtered = applyFilters(mockProperties, filters);
  const sorted   = applySort(filtered, filters.sortBy);

  // Paginate
  const total      = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.limit));
  const page       = Math.min(filters.page, totalPages);
  const start      = (page - 1) * filters.limit;
  const properties = sorted.slice(start, start + filters.limit);

  return { properties, total, totalPages, page, limit: filters.limit, counts };
}

// ─── Compute facet counts ─────────────────────────────────────────
function computeCounts(properties: Property[]) {
  const active = properties.filter((p) => p.status === "ACTIVA");

  const byType:        Record<string, number> = {};
  const byZone:        Record<string, number> = {};
  const byListingType: Record<string, number> = {};

  for (const p of active) {
    byType[p.type]              = (byType[p.type]              ?? 0) + 1;
    byZone[p.zone.slug]         = (byZone[p.zone.slug]         ?? 0) + 1;
    byListingType[p.listingType]= (byListingType[p.listingType]?? 0) + 1;
  }

  return { byType, byZone, byListingType };
}

// ─── Build URL param string from filter object ────────────────────
export function buildFilterParams(
  current: URLSearchParams,
  changes: Record<string, string | null>
): string {
  const params = new URLSearchParams(current.toString());
  for (const [key, value] of Object.entries(changes)) {
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  params.delete("page"); // always reset to page 1 on filter change
  return params.toString();
}

// ─── Zone display names ───────────────────────────────────────────
export const ZONES = [
  { slug: "polanco",              name: "Polanco" },
  { slug: "santa-fe",             name: "Santa Fe" },
  { slug: "lomas-de-chapultepec", name: "Lomas de Chapultepec" },
  { slug: "condesa",              name: "Condesa" },
  { slug: "roma-norte",           name: "Roma Norte" },
  { slug: "interlomas",           name: "Interlomas" },
  { slug: "pedregal",             name: "Pedregal" },
] as const;

// ─── Sort options ─────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: "date_desc",  label: "Más recientes" },
  { value: "date_asc",   label: "Más antiguos" },
  { value: "price_desc", label: "Mayor precio" },
  { value: "price_asc",  label: "Menor precio" },
  { value: "area_desc",  label: "Mayor superficie" },
] as const;

// ─── Active filter labels (for chips) ────────────────────────────
export function getActiveFilterChips(
  filters: ParsedFilters
): { key: string; label: string; clearParams: Record<string, null> }[] {
  const chips = [];

  if (filters.listingType) {
    const map: Record<string, string> = { VENTA: "En Venta", RENTA: "En Renta", VENTA_O_RENTA: "Venta o Renta" };
    chips.push({ key: "listingType", label: map[filters.listingType] ?? filters.listingType, clearParams: { listingType: null } });
  }
  if (filters.type) {
    chips.push({ key: "type", label: filters.type, clearParams: { type: null } });
  }
  if (filters.zoneSlug) {
    const z = ZONES.find((z) => z.slug === filters.zoneSlug);
    chips.push({ key: "zone", label: z?.name ?? filters.zoneSlug, clearParams: { zone: null } });
  }
  if (filters.priceMin != null || filters.priceMax != null) {
    const min = filters.priceMin ? `$${(filters.priceMin / 1_000_000).toFixed(0)}M` : "";
    const max = filters.priceMax ? `$${(filters.priceMax / 1_000_000).toFixed(0)}M` : "";
    const label = min && max ? `${min} – ${max}` : min ? `Desde ${min}` : `Hasta ${max}`;
    chips.push({ key: "price", label, clearParams: { priceMin: null, priceMax: null } });
  }
  if (filters.bedroomsMin != null) {
    chips.push({ key: "bedroomsMin", label: `${filters.bedroomsMin}+ Rec.`, clearParams: { bedroomsMin: null } });
  }
  if (filters.areaMin != null) {
    chips.push({ key: "areaMin", label: `+${filters.areaMin} m²`, clearParams: { areaMin: null } });
  }
  if (filters.isExclusive) {
    chips.push({ key: "isExclusive", label: "Exclusivas", clearParams: { isExclusive: null } });
  }
  if (filters.isNew) {
    chips.push({ key: "isNew", label: "Nuevas", clearParams: { isNew: null } });
  }
  if (filters.isFeatured) {
    chips.push({ key: "isFeatured", label: "Destacadas", clearParams: { isFeatured: null } });
  }
  if (filters.query) {
    chips.push({ key: "q", label: `"${filters.query}"`, clearParams: { q: null } });
  }

  return chips;
}
