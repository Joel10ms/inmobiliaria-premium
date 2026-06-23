/**
 * Property data access layer.
 *
 * When DATABASE_URL is configured, every function runs a Prisma query.
 * When it is absent (local dev without DB), the functions fall back to
 * the in-memory mock dataset so the app stays fully functional.
 */

import slugify                          from "slugify";
import { db }                           from "@/lib/db";
import { mockProperties, mockFeaturedProperties } from "@/lib/mock-data";
import { queryProperties, parseSearchParams }      from "@/lib/filter-properties";
import type { Property, PropertyStatus } from "@/types";

// ─── DB availability flag ─────────────────────────────────────────
const DB_AVAILABLE = Boolean(process.env.DATABASE_URL);

// ─── Prisma → domain mapper ───────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProperty(p: any): Property {
  return {
    id:              p.id,
    title:           p.title,
    slug:            p.slug,
    description:     p.description,
    status:          p.status          as Property["status"],
    type:            p.type            as Property["type"],
    listingType:     p.listingType     as Property["listingType"],
    price:           typeof p.price === "object" ? p.price.toNumber() : Number(p.price),
    currency:        p.currency        as Property["currency"],
    pricePerM2:      p.pricePerM2      ? (typeof p.pricePerM2 === "object" ? p.pricePerM2.toNumber() : Number(p.pricePerM2)) : undefined,
    address:         p.address         ?? undefined,
    latitude:        p.latitude        ?? undefined,
    longitude:       p.longitude       ?? undefined,
    totalArea:       p.totalArea       ? (typeof p.totalArea === "object"  ? p.totalArea.toNumber()  : Number(p.totalArea))  : undefined,
    builtArea:       p.builtArea       ? (typeof p.builtArea === "object"  ? p.builtArea.toNumber()  : Number(p.builtArea))  : undefined,
    landArea:        p.landArea        ? (typeof p.landArea === "object"   ? p.landArea.toNumber()   : Number(p.landArea))   : undefined,
    bedrooms:        p.bedrooms        ?? undefined,
    bathrooms:       p.bathrooms       ?? undefined,
    halfBathrooms:   p.halfBathrooms   ?? undefined,
    parkingSpaces:   p.parkingSpaces   ?? undefined,
    isFeatured:      p.isFeatured      ?? false,
    isNew:           p.isNew           ?? false,
    isExclusive:     p.isExclusive     ?? false,
    videoUrl:        p.videoUrl        ?? undefined,
    virtualTourUrl:  p.virtualTourUrl  ?? undefined,
    metaTitle:       p.metaTitle       ?? undefined,
    metaDescription: p.metaDescription ?? undefined,
    createdAt:       p.createdAt,
    updatedAt:       p.updatedAt,
    publishedAt:     p.publishedAt     ?? undefined,

    zone: {
      id:      p.zone.id,
      name:    p.zone.name,
      city:    p.zone.city,
      state:   p.zone.state,
      country: p.zone.country,
      slug:    p.zone.slug,
    },

    agent: p.agent
      ? {
          id:         p.agent.id,
          name:       p.agent.name,
          lastName:   p.agent.lastName,
          email:      p.agent.email,
          phone:      p.agent.phone,
          whatsapp:   p.agent.whatsapp   ?? undefined,
          photo:      p.agent.photo      ?? undefined,
          bio:        p.agent.bio        ?? undefined,
          specialty:  p.agent.specialty  ?? undefined,
          slug:       p.agent.slug,
          isActive:   p.agent.isActive,
        }
      : (mockProperties[0].agent), // guaranteed non-null by type

    images: (p.images ?? []).map((img: any) => ({
      id:        img.id,
      url:       img.url,
      alt:       img.alt,
      isPrimary: img.isPrimary,
      order:     img.order,
    })),

    features: (p.features ?? []).map((pf: any) => {
      const f = pf.feature ?? pf;
      return {
        id:       f.id,
        name:     f.name,
        icon:     f.icon    ?? undefined,
        category: f.category as PropertyFeature["category"],
      };
    }),
  };
}

// Silence the linter for the import we only need in the mapper
type PropertyFeature = Property["features"][number];

// ─── Prisma include config (reused across queries) ────────────────
const PROPERTY_INCLUDE = {
  zone:     true,
  agent:    true,
  images:   { orderBy: { order: "asc" } },
  features: { include: { feature: true } },
} as const;

// ─── Public API ───────────────────────────────────────────────────

/** All active featured properties for the home section */
export async function getFeaturedProperties(limit = 3): Promise<Property[]> {
  if (!DB_AVAILABLE) return mockFeaturedProperties.slice(0, limit);
  try {
    const rows = await db.property.findMany({
      where:   { status: "ACTIVA", isFeatured: true },
      take:    limit,
      orderBy: { createdAt: "desc" },
      include: PROPERTY_INCLUDE,
    });
    return rows.map(mapProperty);
  } catch {
    return mockFeaturedProperties.slice(0, limit);
  }
}

/** Paginated + filtered property list for the listing page */
export async function getProperties(
  rawParams: Record<string, string | string[] | undefined>
) {
  if (!DB_AVAILABLE) {
    const filters = parseSearchParams(rawParams);
    return queryProperties(filters);
  }
  try {
    const filters = parseSearchParams(rawParams);
    const { page, limit, sortBy, listingType, type, zoneSlug, priceMin, priceMax,
            bedroomsMin, areaMin, isExclusive, isNew, isFeatured, query } = filters;

    const where: Record<string, unknown> = { status: "ACTIVA" };
    if (listingType) where.listingType = listingType;
    if (type)        where.type        = type;
    if (zoneSlug)    where.zone        = { slug: zoneSlug };
    if (priceMin || priceMax) where.price = { gte: priceMin, lte: priceMax };
    if (bedroomsMin) where.bedrooms    = { gte: bedroomsMin };
    if (areaMin)     where.totalArea   = { gte: areaMin };
    if (isExclusive) where.isExclusive = true;
    if (isNew)       where.isNew       = true;
    if (isFeatured)  where.isFeatured  = true;
    if (query)       where.title       = { contains: query, mode: "insensitive" };

    const orderMap: Record<string, object> = {
      price_asc:  { price: "asc"  },
      price_desc: { price: "desc" },
      date_asc:   { createdAt: "asc"  },
      date_desc:  { createdAt: "desc" },
      area_desc:  { totalArea: "desc" },
    };
    const orderBy = orderMap[sortBy] ?? { createdAt: "desc" };

    const [total, rows] = await Promise.all([
      db.property.count({ where }),
      db.property.findMany({
        where, orderBy,
        skip:    (page - 1) * limit,
        take:    limit,
        include: PROPERTY_INCLUDE,
      }),
    ]);

    return {
      properties:  rows.map(mapProperty),
      total,
      page,
      limit,
      totalPages:  Math.ceil(total / limit),
      filters,
    };
  } catch {
    const filters = parseSearchParams(rawParams);
    return queryProperties(filters);
  }
}

/** Single property by slug for the detail page */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!DB_AVAILABLE) {
    return mockProperties.find((p) => p.slug === slug) ?? null;
  }
  try {
    const row = await db.property.findUnique({
      where:   { slug },
      include: PROPERTY_INCLUDE,
    });
    return row ? mapProperty(row) : null;
  } catch {
    return mockProperties.find((p) => p.slug === slug) ?? null;
  }
}

/** All property slugs + updatedAt for the sitemap */
export async function getAllPropertySlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  if (!DB_AVAILABLE) {
    return mockProperties
      .filter((p) => p.status === "ACTIVA")
      .map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
  }
  try {
    return await db.property.findMany({
      where:  { status: "ACTIVA" },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    return mockProperties
      .filter((p) => p.status === "ACTIVA")
      .map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
  }
}

/** Related properties in the same zone, excluding current */
export async function getRelatedProperties(
  zoneId: string,
  excludeId: string,
  limit = 3
): Promise<Property[]> {
  if (!DB_AVAILABLE) {
    return mockProperties
      .filter((p) => p.zone.id === zoneId && p.id !== excludeId && p.status === "ACTIVA")
      .slice(0, limit);
  }
  try {
    const rows = await db.property.findMany({
      where:   { status: "ACTIVA", zone: { id: zoneId }, id: { not: excludeId } },
      take:    limit,
      orderBy: { isFeatured: "desc" },
      include: PROPERTY_INCLUDE,
    });
    return rows.map(mapProperty);
  } catch {
    return mockProperties
      .filter((p) => p.zone.id === zoneId && p.id !== excludeId && p.status === "ACTIVA")
      .slice(0, limit);
  }
}

/** Admin: all properties regardless of status */
export async function getAdminProperties(): Promise<Property[]> {
  if (!DB_AVAILABLE) return mockProperties;
  try {
    const rows = await db.property.findMany({
      orderBy: { updatedAt: "desc" },
      include: PROPERTY_INCLUDE,
    });
    return rows.map(mapProperty);
  } catch {
    return mockProperties;
  }
}

/** Admin: update property status */
export async function updatePropertyStatus(
  id: string,
  status: PropertyStatus
): Promise<void> {
  if (!DB_AVAILABLE) return;
  await db.property.update({ where: { id }, data: { status } });
}

/** Admin: delete property */
export async function deleteProperty(id: string): Promise<void> {
  if (!DB_AVAILABLE) return;
  await db.property.delete({ where: { id } });
}

// ─── Shared input type used by create + update ────────────────────
export interface PropertyInput {
  title:           string;
  description:     string;
  type:            string;
  listingType:     string;
  price:           number;
  currency:        string;
  zoneSlug:        string;
  address?:        string;
  bedrooms?:       number;
  bathrooms?:      number;
  halfBathrooms?:  number;
  parkingSpaces?:  number;
  totalArea?:      number;
  builtArea?:      number;
  landArea?:       number;
  agentId:         string;
  status:          string;
  isFeatured:      boolean;
  isNew:           boolean;
  isExclusive:     boolean;
  videoUrl?:       string;
  virtualTourUrl?: string;
  metaTitle?:      string;
  metaDescription?:string;
  images?: {
    url:       string;
    publicId?: string;
    alt?:      string;
    isPrimary: boolean;
    order:     number;
  }[];
}

async function generateUniqueSlug(title: string): Promise<string> {
  const base   = slugify(title, { lower: true, strict: true, locale: "es" });
  let slug     = base;
  let suffix   = 2;
  while (await db.property.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

/** Admin: create a new property */
export async function createProperty(data: PropertyInput): Promise<Property> {
  if (!DB_AVAILABLE) {
    console.log("[property] DB not available — would have created:", data.title);
    return {
      ...mockProperties[0],
      id:    `mock-${Date.now()}`,
      slug:  slugify(data.title, { lower: true, strict: true }),
      title: data.title,
    };
  }

  // Resolve zone ID from slug
  const zone = await db.zone.findUnique({ where: { slug: data.zoneSlug } });
  if (!zone) throw new Error(`Zona no encontrada: ${data.zoneSlug}`);

  const slug = await generateUniqueSlug(data.title);

  const row = await db.property.create({
    data: {
      title:           data.title,
      slug,
      description:     data.description,
      type:            data.type,
      listingType:     data.listingType as "VENTA" | "RENTA" | "VENTA_O_RENTA",
      price:           data.price,
      currency:        data.currency as "MXN" | "USD",
      address:         data.address   || undefined,
      bedrooms:        data.bedrooms,
      bathrooms:       data.bathrooms,
      halfBathrooms:   data.halfBathrooms,
      parkingSpaces:   data.parkingSpaces,
      totalArea:       data.totalArea,
      builtArea:       data.builtArea,
      landArea:        data.landArea,
      status:          data.status as PropertyStatus,
      isFeatured:      data.isFeatured,
      isNew:           data.isNew,
      isExclusive:     data.isExclusive,
      videoUrl:        data.videoUrl        || undefined,
      virtualTourUrl:  data.virtualTourUrl  || undefined,
      metaTitle:       data.metaTitle       || undefined,
      metaDescription: data.metaDescription || undefined,
      publishedAt:     data.status === "ACTIVA" ? new Date() : undefined,
      zone:    { connect: { id: zone.id } },
      agent:   { connect: { id: data.agentId } },
      images:  data.images?.length
        ? {
            create: data.images.map((img) => ({
              url:       img.url,
              publicId:  img.publicId,
              alt:       img.alt || data.title,
              isPrimary: img.isPrimary,
              order:     img.order,
            })),
          }
        : undefined,
    },
    include: PROPERTY_INCLUDE,
  });

  return mapProperty(row);
}

/** Admin: update an existing property */
export async function updateProperty(id: string, data: PropertyInput): Promise<Property> {
  if (!DB_AVAILABLE) {
    console.log("[property] DB not available — would have updated:", id);
    const existing = mockProperties.find((p) => p.id === id) ?? mockProperties[0];
    return { ...existing, title: data.title };
  }

  const zone = await db.zone.findUnique({ where: { slug: data.zoneSlug } });
  if (!zone) throw new Error(`Zona no encontrada: ${data.zoneSlug}`);

  const row = await db.property.update({
    where: { id },
    data: {
      title:           data.title,
      description:     data.description,
      type:            data.type,
      listingType:     data.listingType as "VENTA" | "RENTA" | "VENTA_O_RENTA",
      price:           data.price,
      currency:        data.currency as "MXN" | "USD",
      address:         data.address        || null,
      bedrooms:        data.bedrooms       ?? null,
      bathrooms:       data.bathrooms      ?? null,
      halfBathrooms:   data.halfBathrooms  ?? null,
      parkingSpaces:   data.parkingSpaces  ?? null,
      totalArea:       data.totalArea      ?? null,
      builtArea:       data.builtArea      ?? null,
      landArea:        data.landArea       ?? null,
      status:          data.status as PropertyStatus,
      isFeatured:      data.isFeatured,
      isNew:           data.isNew,
      isExclusive:     data.isExclusive,
      videoUrl:        data.videoUrl        || null,
      virtualTourUrl:  data.virtualTourUrl  || null,
      metaTitle:       data.metaTitle       || null,
      metaDescription: data.metaDescription || null,
      zone:  { connect: { id: zone.id } },
      agent: { connect: { id: data.agentId } },
      // Replace all images (delete old → create new)
      ...(data.images
        ? {
            images: {
              deleteMany: {},
              create: data.images.map((img) => ({
                url:       img.url,
                publicId:  img.publicId,
                alt:       img.alt || data.title,
                isPrimary: img.isPrimary,
                order:     img.order,
              })),
            },
          }
        : {}),
    },
    include: PROPERTY_INCLUDE,
  });

  return mapProperty(row);
}
