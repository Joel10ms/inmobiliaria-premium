import { notFound }               from "next/navigation";
import type { Metadata }           from "next";
import { PageHero }                from "@/components/shared/page-hero";
import { PropertyGallery }         from "@/components/property/property-gallery";
import { PropertyDetailSpecs }     from "@/components/property/property-detail-specs";
import { PropertyFeaturesGrid }    from "@/components/property/property-features-grid";
import { PropertyMap }             from "@/components/property/property-map";
import { PropertyPriceCard }       from "@/components/property/property-price-card";
import { PropertyAgentSidebar }    from "@/components/property/property-agent-sidebar";
import { PropertyContactForm }     from "@/components/property/property-contact-form";
import { RelatedProperties }       from "@/components/property/related-properties";
import { JsonLd }                  from "@/components/seo/json-ld";
import { buildPropertySchema, buildBreadcrumbSchema } from "@/lib/seo/schemas";
import { getPropertyBySlug, getRelatedProperties, getAllPropertySlugs } from "@/lib/queries/properties";
import { siteConfig }              from "@/config/site";
import { formatPrice }             from "@/lib/utils";

// ─── Static params for pre-rendering ─────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

// ─── Dynamic metadata ─────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Propiedad no encontrada" };

  const title       = property.metaTitle ?? `${property.title} | ${siteConfig.name}`;
  const description = property.metaDescription ??
    `${property.type} en ${property.zone.name}. ` +
    `${property.bedrooms    ? `${property.bedrooms} recámaras, ` : ""}` +
    `${property.bathrooms   ? `${property.bathrooms} baños, `    : ""}` +
    `${property.totalArea   ? `${property.totalArea} m². `       : ""}` +
    formatPrice(property.price, property.currency) + ".";

  const ogImages = property.images.slice(0, 3).map((img) => ({
    url:    img.url,
    width:  1200,
    height: 800,
    alt:    img.alt || property.title,
  }));

  const canonical = `${siteConfig.url}/propiedades/${property.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title, description,
      url:    canonical,
      type:   "article",
      locale: "es_MX",
      images: ogImages.length ? ogImages : undefined,
      siteName: siteConfig.name,
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      ogImages.length ? [ogImages[0].url] : undefined,
    },
    // Granular robots for sold/rented properties
    robots: property.status !== "ACTIVA"
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// ─── Page ─────────────────────────────────────────────────────────
export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const related = await getRelatedProperties(property.zone.id, property.id, 3);

  return (
    <>
      {/* ─── Structured data ──────────────────────────────────── */}
      <JsonLd schema={buildBreadcrumbSchema([
        { name: "Inicio",             href: "/" },
        { name: "Propiedades",        href: "/propiedades" },
        { name: property.zone.name,   href: `/propiedades?zone=${property.zone.slug}` },
        { name: property.title },
      ])} />
      <JsonLd schema={buildPropertySchema(property)} />

      {/* Page hero */}
      <PageHero
        title={property.zone.name}
        compact
        breadcrumbs={[
          { label: "Inicio",          href: "/" },
          { label: "Propiedades",     href: "/propiedades" },
          { label: property.zone.name,href: `/propiedades?zone=${property.zone.slug}` },
          { label: property.type },
        ]}
      />

      {/* Main content */}
      <div className="bg-white">
        <div className="container-luxury section-padding py-10">

          {/* Gallery */}
          <div className="mb-10">
            <PropertyGallery images={property.images} title={property.title} />
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">

            {/* ─── Left column ─────────────────────────────── */}
            <div className="flex-1 min-w-0">
              <PropertyDetailSpecs  property={property} />
              <PropertyFeaturesGrid features={property.features} />
              <PropertyMap
                zone={property.zone}
                address={property.address}
                latitude={(property as any).latitude}
                longitude={(property as any).longitude}
              />
            </div>

            {/* ─── Right column (sticky sidebar) ───────────── */}
            <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0">
              <div className="lg:sticky lg:top-28 space-y-5">
                <PropertyPriceCard    property={property} />
                <PropertyAgentSidebar agent={property.agent} />
                <PropertyContactForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related properties */}
      <RelatedProperties properties={related} currentZone={property.zone.name} />
    </>
  );
}
