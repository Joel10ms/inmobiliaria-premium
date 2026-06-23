import {
  BedDouble, Bath, Maximize2, Car, Home, Layers,
  Building2, ArrowUpRight, CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatArea, formatDate, timeAgo } from "@/lib/utils";
import type { Property } from "@/types";

const listingLabel: Record<string, string> = {
  VENTA:         "En Venta",
  RENTA:         "En Renta",
  VENTA_O_RENTA: "Venta o Renta",
};

interface PropertyDetailSpecsProps {
  property: Property;
}

export function PropertyDetailSpecs({ property }: PropertyDetailSpecsProps) {
  // Build spec rows
  const specs: { icon: React.ElementType; label: string; value: string | number }[] = [];

  if (property.bedrooms   != null) specs.push({ icon: BedDouble,   label: "Recámaras",           value: property.bedrooms });
  if (property.bathrooms  != null) specs.push({ icon: Bath,        label: "Baños completos",      value: property.bathrooms });
  if (property.halfBathrooms && property.halfBathrooms > 0)
    specs.push({ icon: Bath, label: "Medios baños", value: property.halfBathrooms });
  if (property.parkingSpaces != null && property.parkingSpaces > 0)
    specs.push({ icon: Car, label: "Cajones de estacionamiento", value: property.parkingSpaces });
  if (property.totalArea  != null) specs.push({ icon: Maximize2,   label: "Superficie total",    value: formatArea(property.totalArea) });
  if (property.builtArea  != null) specs.push({ icon: Home,        label: "Superficie construida",value: formatArea(property.builtArea) });
  if (property.landArea   != null) specs.push({ icon: Layers,      label: "Superficie de terreno",value: formatArea(property.landArea) });
  if (property.pricePerM2 != null) specs.push({ icon: Building2,   label: "Precio por m²",       value: `$${Number(property.pricePerM2).toLocaleString("es-MX")} ${property.currency}` });

  return (
    <div>
      {/* Badges row */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="crimson">{listingLabel[property.listingType]}</Badge>
        <Badge variant="dark">{property.type}</Badge>
        {property.isExclusive && <Badge variant="gold">Exclusiva</Badge>}
        {property.isNew       && <Badge variant="crimson">Nueva</Badge>}
        {property.isFeatured  && !property.isExclusive && <Badge variant="ivory">Destacada</Badge>}
      </div>

      {/* Title */}
      <h1
        className="font-playfair font-bold text-obsidian leading-tight mb-3"
        style={{ fontSize: "clamp(1.875rem, 3vw, 2.75rem)" }}
      >
        {property.title}
      </h1>

      {/* Zone + address */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6">
        <div className="flex items-center gap-1.5 text-body-md text-obsidian-400">
          <Building2 className="h-4 w-4 text-crimson shrink-0" />
          <span>{property.zone.name}, {property.zone.city}</span>
        </div>
        {property.address && (
          <div className="flex items-center gap-1.5 text-body-sm text-obsidian-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{property.address}</span>
          </div>
        )}
        {property.publishedAt && (
          <div className="flex items-center gap-1.5 text-body-xs text-obsidian-300">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Publicada {timeAgo(property.publishedAt)}</span>
          </div>
        )}
      </div>

      {/* Gold accent divider */}
      <div className="h-px bg-gradient-to-r from-gold/40 to-transparent mb-8" />

      {/* Specs grid */}
      {specs.length > 0 && (
        <>
          <h2 className="font-playfair font-semibold text-display-sm text-obsidian mb-5">
            Características
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {specs.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-1.5 p-4 rounded-xl bg-ivory border border-obsidian-100 hover:border-gold/30 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-crimson shrink-0" />
                  <span className="text-body-xs text-obsidian-400 leading-tight">{label}</span>
                </div>
                <p className="font-playfair font-semibold text-display-sm text-obsidian leading-none">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Gold accent divider */}
      <div className="h-px bg-gradient-to-r from-gold/40 to-transparent mb-8" />

      {/* Description */}
      <h2 className="font-playfair font-semibold text-display-sm text-obsidian mb-4">
        Descripción
      </h2>
      <div className="prose prose-obsidian max-w-none">
        {property.description.split("\n").filter(Boolean).map((para, i) => (
          <p key={i} className="text-body-md text-obsidian-600 leading-relaxed mb-3 last:mb-0">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
