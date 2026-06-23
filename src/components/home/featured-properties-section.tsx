import Link                        from "next/link";
import { ArrowRight }              from "lucide-react";
import { SectionHeader }           from "@/components/shared/section-header";
import { PropertyCard }            from "@/components/property/property-card";
import { Button }                  from "@/components/ui/button";
import { getFeaturedProperties }   from "@/lib/queries/properties";

// Server component — data fetched at render time
export async function FeaturedPropertiesSection() {
  const properties = await getFeaturedProperties(3);

  return (
    <section className="section-padding bg-ivory" aria-labelledby="featured-heading">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="Propiedades seleccionadas"
            title="Lo más exclusivo del mercado"
            description="Una curaduría de propiedades premium elegidas por nuestros expertos."
            align="left"
            className="max-w-xl"
          />
          <Button variant="outline" size="md" asChild className="shrink-0">
            <Link href="/propiedades">
              Ver todas las propiedades
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {properties.map((property, i) => (
            <PropertyCard
              key={property.id}
              property={property}
              priority={i < 3}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center md:hidden">
          <Button variant="primary" size="lg" asChild>
            <Link href="/propiedades">
              Ver todas las propiedades
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
