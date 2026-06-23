import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize2, Car, MapPin, ArrowRight } from "lucide-react";
import { cn, formatPrice, formatArea, buildPropertyUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/types";

const listingLabel: Record<string, string> = {
  VENTA:         "En Venta",
  RENTA:         "En Renta",
  VENTA_O_RENTA: "Venta o Renta",
};

export function PropertyListItem({ property }: { property: Property }) {
  const primaryImage = property.images.find((i) => i.isPrimary) ?? property.images[0];
  const href         = buildPropertyUrl(property.slug);

  return (
    <article
      className={cn(
        "group bg-white rounded-2xl overflow-hidden border border-obsidian-100 shadow-card",
        "hover:shadow-card-hover transition-all duration-400 ease-luxury",
        "flex flex-col sm:flex-row"
      )}
    >
      {/* Image */}
      <Link href={href} className="relative w-full sm:w-64 lg:w-72 shrink-0 overflow-hidden bg-obsidian-100">
        <div className="aspect-[4/3] sm:aspect-auto sm:h-full relative">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || property.title}
              fill
              sizes="(max-width: 640px) 100vw, 300px"
              className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-luxury" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge variant="crimson" size="sm">{listingLabel[property.listingType]}</Badge>
            {property.isExclusive && <Badge variant="gold" size="sm">Exclusiva</Badge>}
            {property.isNew       && <Badge variant="crimson" size="sm">Nueva</Badge>}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div>
          {/* Zone */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <MapPin className="h-3.5 w-3.5 text-crimson shrink-0" />
            <span className="text-body-xs text-obsidian-400">
              {property.zone.name}, {property.zone.city}
            </span>
          </div>

          {/* Title */}
          <Link href={href}>
            <h3 className="font-playfair font-semibold text-display-sm text-obsidian line-clamp-2 hover:text-crimson transition-colors duration-200 mb-2 leading-snug">
              {property.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-body-sm text-obsidian-400 line-clamp-2 leading-relaxed mb-4">
            {property.description}
          </p>

          {/* Gold divider */}
          <div className="h-px bg-gradient-to-r from-gold/30 to-transparent mb-4" />

          {/* Specs */}
          <div className="flex flex-wrap gap-4">
            {property.bedrooms != null && (
              <span className="stat-item">
                <BedDouble className="h-4 w-4 text-obsidian-400" />
                <span>{property.bedrooms} Rec.</span>
              </span>
            )}
            {property.bathrooms != null && (
              <span className="stat-item">
                <Bath className="h-4 w-4 text-obsidian-400" />
                <span>{property.bathrooms} Baños</span>
              </span>
            )}
            {(property.builtArea ?? property.totalArea) != null && (
              <span className="stat-item">
                <Maximize2 className="h-4 w-4 text-obsidian-400" />
                <span>{formatArea((property.builtArea ?? property.totalArea)!)}</span>
              </span>
            )}
            {property.parkingSpaces != null && property.parkingSpaces > 0 && (
              <span className="stat-item">
                <Car className="h-4 w-4 text-obsidian-400" />
                <span>{property.parkingSpaces} Est.</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-obsidian-100">
          <div>
            <p className="font-playfair font-bold text-display-sm text-obsidian leading-none">
              {formatPrice(Number(property.price), property.currency)}
            </p>
            {property.listingType === "RENTA" && (
              <p className="text-body-xs text-obsidian-400 mt-0.5">/mes</p>
            )}
            {property.pricePerM2 && (
              <p className="text-body-xs text-obsidian-400 mt-0.5">
                {formatPrice(Number(property.pricePerM2), property.currency)} /m²
              </p>
            )}
          </div>

          <Link
            href={href}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg",
              "text-label-sm text-crimson border border-crimson/30",
              "hover:bg-crimson hover:text-white hover:border-crimson",
              "transition-all duration-200"
            )}
          >
            Ver propiedad
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
