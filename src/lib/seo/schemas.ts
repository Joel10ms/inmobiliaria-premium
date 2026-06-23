/**
 * Schema.org JSON-LD builder functions.
 * All functions return plain objects — no React. Inject with <JsonLd>.
 */

import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import type { Property, Agent } from "@/types";

const BASE_URL = siteConfig.url;

// ─── Organization + LocalBusiness ────────────────────────────────
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":    ["Organization", "RealEstateAgent"],
        "@id":      `${BASE_URL}/#organization`,
        name:       siteConfig.name,
        url:        BASE_URL,
        logo: {
          "@type": "ImageObject",
          "@id":   `${BASE_URL}/#logo`,
          url:     `${BASE_URL}/images/logo.png`,
          width:   200,
          height:  60,
          caption: siteConfig.name,
        },
        image:        `${BASE_URL}/images/og-default.jpg`,
        description:  siteConfig.description,
        telephone:    siteConfig.contact.phone,
        email:        siteConfig.contact.email,
        address: {
          "@type":           "PostalAddress",
          streetAddress:     "Av. Presidente Masaryk 123, Piso 3",
          addressLocality:   "Polanco",
          addressRegion:     "Ciudad de México",
          postalCode:        "11560",
          addressCountry:    "MX",
        },
        geo: {
          "@type":    "GeoCoordinates",
          latitude:   19.4326,
          longitude:  -99.1900,
        },
        openingHoursSpecification: [
          {
            "@type":    "OpeningHoursSpecification",
            dayOfWeek:  ["Monday","Tuesday","Wednesday","Thursday","Friday"],
            opens:      "09:00",
            closes:     "19:00",
          },
          {
            "@type":    "OpeningHoursSpecification",
            dayOfWeek:  "Saturday",
            opens:      "10:00",
            closes:     "15:00",
          },
        ],
        areaServed: {
          "@type": "City",
          name:    "Ciudad de México",
          sameAs:  "https://www.wikidata.org/wiki/Q1489",
        },
        sameAs: Object.values(siteConfig.social),
        priceRange: "$$$",
      },
      {
        "@type":     "WebSite",
        "@id":       `${BASE_URL}/#website`,
        url:         BASE_URL,
        name:        siteConfig.name,
        description: siteConfig.tagline,
        publisher:   { "@id": `${BASE_URL}/#organization` },
        inLanguage:  "es-MX",
        potentialAction: {
          "@type":  "SearchAction",
          target: {
            "@type":       "EntryPoint",
            urlTemplate:   `${BASE_URL}/propiedades?query={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

// ─── Property detail (RealEstateListing) ──────────────────────────
export function buildPropertySchema(property: Property) {
  const url         = `${BASE_URL}/propiedades/${property.slug}`;
  const primaryImg  = property.images.find((i) => i.isPrimary) ?? property.images[0];
  const imageUrls   = property.images.map((i) => i.url);
  const isForSale   = property.listingType !== "RENTA";
  const offerType   = isForSale ? "https://schema.org/ForSale" : "https://schema.org/ForRent";

  return {
    "@context": "https://schema.org",
    "@type":    "RealEstateListing",
    "@id":      `${url}#listing`,
    name:        property.title,
    description: property.description,
    url,
    datePosted:  property.publishedAt?.toISOString() ?? property.createdAt.toISOString(),
    image:       imageUrls.length ? imageUrls : (primaryImg ? [primaryImg.url] : []),

    offers: {
      "@type":        "Offer",
      price:          property.price,
      priceCurrency:  property.currency,
      availability:   property.status === "ACTIVA"
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      priceSpecification: {
        "@type":       "PriceSpecification",
        price:         property.price,
        priceCurrency: property.currency,
        description:   formatPrice(property.price, property.currency),
      },
      businessFunction: offerType,
    },

    address: {
      "@type":         "PostalAddress",
      addressLocality: property.zone.name,
      addressRegion:   property.zone.city,
      addressCountry:  "MX",
      ...(property.address ? { streetAddress: property.address } : {}),
    },

    ...(property.latitude && property.longitude ? {
      geo: {
        "@type":    "GeoCoordinates",
        latitude:   property.latitude,
        longitude:  property.longitude,
      },
    } : {}),

    ...(property.totalArea ? {
      floorSize: {
        "@type":   "QuantitativeValue",
        value:     property.totalArea,
        unitCode:  "MTK",
        unitText:  "m²",
      },
    } : {}),

    ...(property.bedrooms    ? { numberOfRooms:          property.bedrooms }    : {}),
    ...(property.bathrooms   ? { numberOfBathroomsTotal: property.bathrooms }   : {}),
    ...(property.parkingSpaces ? { numberOfParkingSpaces: property.parkingSpaces } : {}),

    ...(property.agent ? {
      broker: {
        "@type":    "RealEstateAgent",
        "@id":      `${BASE_URL}/agentes/${property.agent.slug}`,
        name:       `${property.agent.name} ${property.agent.lastName}`,
        telephone:  property.agent.phone,
        ...(property.agent.email ? { email: property.agent.email } : {}),
        ...(property.agent.photo ? { image: property.agent.photo } : {}),
        worksFor:   { "@id": `${BASE_URL}/#organization` },
      },
    } : {}),

    // Amenity features
    amenityFeature: property.features.map((f) => ({
      "@type":       "LocationFeatureSpecification",
      name:          f.name,
      value:         true,
    })),

    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

// ─── BreadcrumbList ───────────────────────────────────────────────
export type BreadcrumbItem = { name: string; href?: string };

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       item.name,
      ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
    })),
  };
}

// ─── ItemList (listing page) ──────────────────────────────────────
export function buildPropertyListSchema(properties: Property[]) {
  return {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    name:       `Propiedades en venta y renta — ${siteConfig.name}`,
    url:        `${BASE_URL}/propiedades`,
    numberOfItems: properties.length,
    itemListElement: properties.map((p, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      url:        `${BASE_URL}/propiedades/${p.slug}`,
      name:       p.title,
    })),
  };
}

// ─── RealEstateAgent (agent page) ────────────────────────────────
export function buildAgentSchema(agent: Agent) {
  return {
    "@context": "https://schema.org",
    "@type":    ["Person", "RealEstateAgent"],
    "@id":      `${BASE_URL}/agentes/${agent.slug}`,
    name:       `${agent.name} ${agent.lastName}`,
    email:      agent.email,
    telephone:  agent.phone,
    ...(agent.photo ? { image: agent.photo } : {}),
    ...(agent.bio   ? { description: agent.bio } : {}),
    ...(agent.specialty ? { hasOccupation: { "@type": "Occupation", name: agent.specialty } } : {}),
    worksFor:   { "@id": `${BASE_URL}/#organization` },
    url:        `${BASE_URL}/agentes/${agent.slug}`,
  };
}
