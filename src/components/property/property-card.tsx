"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize2, Car, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatArea, buildPropertyUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  className?: string;
  priority?: boolean;
}

const listingLabel: Record<string, string> = {
  VENTA:         "En Venta",
  RENTA:         "En Renta",
  VENTA_O_RENTA: "Venta o Renta",
};

export function PropertyCard({ property, className, priority = false }: PropertyCardProps) {
  const primaryImage = property.images.find((img) => img.isPrimary) ?? property.images[0];
  const href = buildPropertyUrl(property.slug);

  return (
    <article
      className={cn(
        "group bg-white rounded-2xl overflow-hidden border border-obsidian-100",
        "shadow-card hover:shadow-card-hover",
        "transition-all duration-400 ease-luxury hover:-translate-y-1.5",
        className
      )}
    >
      {/* ─── Image ────────────────────────────────────────────── */}
      <Link href={href} className="block relative aspect-property overflow-hidden bg-obsidian-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-luxury" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Badges — top left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant="crimson" size="sm">
            {listingLabel[property.listingType]}
          </Badge>
          {property.type && (
            <Badge variant="glass-dark" size="sm">
              {property.type}
            </Badge>
          )}
        </div>

        {/* Badges — top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {property.isExclusive && (
            <Badge variant="gold" size="sm">Exclusiva</Badge>
          )}
          {property.isNew && (
            <Badge variant="crimson" size="sm">Nueva</Badge>
          )}
          {property.isFeatured && !property.isExclusive && !property.isNew && (
            <Badge variant="dark" size="sm">Destacada</Badge>
          )}
        </div>

        {/* View overlay button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="glass text-white text-label-sm px-5 py-2.5 rounded-full flex items-center gap-2">
            Ver propiedad <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>

      {/* ─── Body ─────────────────────────────────────────────── */}
      <div className="p-5">
        {/* Zone */}
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin className="h-3.5 w-3.5 text-crimson shrink-0" />
          <span className="text-body-xs text-obsidian-400 font-medium">
            {property.zone.name}, {property.zone.city}
          </span>
        </div>

        {/* Title */}
        <Link href={href}>
          <h3 className="font-playfair font-semibold text-body-xl text-obsidian line-clamp-2 hover:text-crimson transition-colors duration-200 mb-3 leading-snug">
            {property.title}
          </h3>
        </Link>

        {/* Gold divider */}
        <div className="h-px bg-gradient-to-r from-gold/40 to-transparent mb-3" />

        {/* Specs */}
        <div className="flex items-center gap-4 flex-wrap">
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
              <span>{property.parkingSpaces}</span>
            </span>
          )}
        </div>
      </div>

      {/* ─── Footer ───────────────────────────────────────────── */}
      <div className="px-5 pb-5 flex items-center justify-between border-t border-obsidian-100 pt-4">
        {/* Price */}
        <div>
          <p className="font-playfair font-bold text-display-sm text-obsidian leading-none">
            {formatPrice(Number(property.price), property.currency)}
          </p>
          {property.listingType === "RENTA" && (
            <p className="text-body-xs text-obsidian-400 mt-0.5">/mes</p>
          )}
        </div>

        {/* Agent + CTA */}
        <div className="flex items-center gap-3">
          {property.agent?.photo && (
            <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-gold/30 shrink-0">
              <Image
                src={property.agent.photo}
                alt={`${property.agent.name} ${property.agent.lastName}`}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          )}
          <Link
            href={href}
            className={cn(
              "inline-flex items-center gap-1.5 text-label-sm text-crimson",
              "border border-crimson/30 rounded-lg px-3 py-2",
              "hover:bg-crimson hover:text-white hover:border-crimson",
              "transition-all duration-200"
            )}
          >
            Ver más
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
