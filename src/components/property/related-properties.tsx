import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { PropertyCard }  from "@/components/property/property-card";
import { Button }        from "@/components/ui/button";
import type { Property } from "@/types";

interface RelatedPropertiesProps {
  properties:  Property[];
  currentZone: string;
}

export function RelatedProperties({ properties, currentZone }: RelatedPropertiesProps) {
  if (properties.length === 0) return null;

  return (
    <section className="section-padding bg-ivory" aria-labelledby="related-heading">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <SectionHeader
            id="related-heading"
            eyebrow="También le puede interesar"
            title={`Más propiedades en ${currentZone}`}
            align="left"
            className="max-w-lg"
          />
          <Button variant="outline" size="md" asChild className="shrink-0">
            <Link href="/propiedades">
              Ver todas
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 3).map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
