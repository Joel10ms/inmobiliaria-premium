import type { Metadata }             from "next";
import { PageHero }                   from "@/components/shared/page-hero";
import { PropertyFilters }            from "@/components/property/property-filters";
import { PropertyResults }            from "@/components/property/property-results";
import { JsonLd }                     from "@/components/seo/json-ld";
import { buildPropertyListSchema, buildBreadcrumbSchema } from "@/lib/seo/schemas";
import { getProperties }              from "@/lib/queries/properties";
import { parseSearchParams }          from "@/lib/filter-properties";
import { siteConfig }                 from "@/config/site";

// ─── Dynamic metadata ─────────────────────────────────────────────
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params  = await searchParams;
  const filters = parseSearchParams(params);

  const parts: string[] = [];
  if (filters.listingType === "VENTA")      parts.push("En Venta");
  else if (filters.listingType === "RENTA") parts.push("En Renta");
  if (filters.type)    parts.push(filters.type);
  if (filters.zoneSlug) {
    const zones: Record<string, string> = {
      "polanco": "Polanco", "santa-fe": "Santa Fe",
      "lomas-de-chapultepec": "Lomas de Chapultepec",
      "condesa": "Condesa", "roma-norte": "Roma Norte",
    };
    parts.push(`en ${zones[filters.zoneSlug] ?? filters.zoneSlug}`);
  }

  const titleSuffix = parts.length ? ` — ${parts.join(", ")}` : "";
  const title       = `Propiedades${titleSuffix} | ${siteConfig.name}`;
  const description = `Explora nuestro portafolio exclusivo${titleSuffix}. Residencias de lujo, departamentos premium y villas de alto standing en Ciudad de México.`;
  const canonical   = parts.length
    ? `${siteConfig.url}/propiedades?${new URLSearchParams(
        Object.fromEntries(parts.map((_, i) => [["listingType","type","zone"][i] ?? "q", parts[i]]))
      )}`
    : `${siteConfig.url}/propiedades`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title, description,
      url:   `${siteConfig.url}/propiedades`,
      type:  "website",
      images: [{ url: `${siteConfig.url}${siteConfig.ogImage}`, width: 1200, height: 630 }],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────
export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const result = await getProperties(params);
  const filters = result.filters;

  const isFiltered = !!(
    filters.listingType || filters.type || filters.zoneSlug ||
    filters.priceMin != null || filters.bedroomsMin != null
  );

  const buildPageUrl = (page: number) => {
    const current = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v ?? ""])
      )
    );
    current.set("page", page.toString());
    return `/propiedades?${current.toString()}`;
  };

  return (
    <>
      {/* ─── Structured data ──────────────────────────────────── */}
      <JsonLd schema={buildBreadcrumbSchema([
        { name: "Inicio",       href: "/" },
        { name: "Propiedades",  href: "/propiedades" },
      ])} />
      <JsonLd schema={buildPropertyListSchema(result.properties)} />

      {/* Page hero */}
      <PageHero
        title="Propiedades"
        description={
          isFiltered
            ? `${result.total} propiedades encontradas con los filtros seleccionados.`
            : "Descubre nuestro portafolio exclusivo de propiedades de lujo en México."
        }
        breadcrumbs={[
          { label: "Inicio",       href: "/" },
          { label: "Propiedades" },
        ]}
      />

      {/* Listing layout */}
      <section className="section-padding bg-ivory min-h-[60vh]">
        <div className="container-luxury">
          <div className="flex flex-col lg:flex-row gap-8">

            <div className="w-full lg:w-72 xl:w-80 shrink-0">
              <PropertyFilters filters={filters} counts={result.counts} />
            </div>

            <PropertyResults
              properties={result.properties}
              total={result.total}
              totalPages={result.totalPages}
              page={result.page}
              filters={filters}
              counts={result.counts}
              buildPageUrl={buildPageUrl}
            />
          </div>
        </div>
      </section>
    </>
  );
}
