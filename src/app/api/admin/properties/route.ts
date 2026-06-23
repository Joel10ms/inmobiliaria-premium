import { NextRequest, NextResponse } from "next/server";
import { z }                         from "zod";
import { requireAuth }               from "@/lib/auth-helpers";
import { getAdminProperties, createProperty } from "@/lib/queries/properties";

// ─── Shared schema ────────────────────────────────────────────────
const imageSchema = z.object({
  id:        z.string(),
  url:       z.string().url(),
  publicId:  z.string().optional(),
  alt:       z.string().optional(),
  isPrimary: z.boolean(),
  order:     z.number().int(),
});

export const propertyBodySchema = z.object({
  title:           z.string().min(5).max(200),
  description:     z.string().min(20).max(5000),
  type:            z.string().min(1),
  listingType:     z.enum(["VENTA", "RENTA", "VENTA_O_RENTA"]),
  price:           z.number().positive(),
  currency:        z.enum(["MXN", "USD"]).default("MXN"),
  zoneSlug:        z.string().min(1, "Selecciona una zona"),
  address:         z.string().optional(),
  bedrooms:        z.number().int().min(0).optional(),
  bathrooms:       z.number().int().min(0).optional(),
  halfBathrooms:   z.number().int().min(0).optional(),
  parkingSpaces:   z.number().int().min(0).optional(),
  totalArea:       z.number().positive().optional(),
  builtArea:       z.number().positive().optional(),
  landArea:        z.number().positive().optional(),
  agentId:         z.string().min(1, "Selecciona un asesor"),
  status:          z.string().min(1),
  isFeatured:      z.boolean().default(false),
  isNew:           z.boolean().default(false),
  isExclusive:     z.boolean().default(false),
  videoUrl:        z.string().url().optional().or(z.literal("")),
  virtualTourUrl:  z.string().url().optional().or(z.literal("")),
  metaTitle:       z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  images:          z.array(imageSchema).default([]),
});

// ─── GET /api/admin/properties ────────────────────────────────────
export async function GET(_req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const properties = await getAdminProperties();
    return NextResponse.json(properties);
  } catch {
    return NextResponse.json({ error: "Error al obtener propiedades." }, { status: 500 });
  }
}

// ─── POST /api/admin/properties ───────────────────────────────────
export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body     = await req.json();
    const data     = propertyBodySchema.parse(body);
    const property = await createProperty(data);
    return NextResponse.json(property, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: err.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("[POST /api/admin/properties]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al crear la propiedad." },
      { status: 500 }
    );
  }
}
