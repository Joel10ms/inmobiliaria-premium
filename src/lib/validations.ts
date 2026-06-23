import { z } from "zod";

// ─── Inquiry / Contact Form ───────────────────────────────────────
export const inquirySchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido"),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]{7,20}$/, "Ingresa un teléfono válido")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje es demasiado largo")
    .optional(),
  propertyId: z.string().optional(),
  source: z
    .enum(["WEB", "WHATSAPP", "TELEFONO", "REFERIDO", "REDES_SOCIALES"])
    .default("WEB"),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

// ─── Property Form (Admin) ────────────────────────────────────────
export const propertySchema = z.object({
  title:       z.string().min(5, "El título debe tener al menos 5 caracteres").max(200),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres").max(5000),
  type:        z.enum(["Casa", "Departamento", "Penthouse", "Villa", "Desarrollo", "Oficina", "Local Comercial", "Terreno"]),
  listingType: z.enum(["VENTA", "RENTA", "VENTA_O_RENTA"]),
  price:       z.number().positive("El precio debe ser mayor a 0"),
  currency:    z.enum(["MXN", "USD"]).default("MXN"),

  zoneId:      z.string().min(1, "Selecciona una zona"),
  address:     z.string().optional(),
  latitude:    z.number().min(-90).max(90).optional(),
  longitude:   z.number().min(-180).max(180).optional(),

  totalArea:      z.number().positive().optional(),
  builtArea:      z.number().positive().optional(),
  landArea:       z.number().positive().optional(),
  bedrooms:       z.number().int().min(0).max(50).optional(),
  bathrooms:      z.number().int().min(0).max(50).optional(),
  halfBathrooms:  z.number().int().min(0).max(20).optional(),
  parkingSpaces:  z.number().int().min(0).max(20).optional(),

  isFeatured:   z.boolean().default(false),
  isNew:        z.boolean().default(false),
  isExclusive:  z.boolean().default(false),

  agentId:          z.string().min(1, "Asigna un agente"),
  featureIds:       z.array(z.string()).default([]),
  videoUrl:         z.string().url().optional().or(z.literal("")),
  virtualTourUrl:   z.string().url().optional().or(z.literal("")),

  metaTitle:        z.string().max(70).optional(),
  metaDescription:  z.string().max(160).optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

// ─── Agent Form (Admin) ───────────────────────────────────────────
export const agentSchema = z.object({
  name:      z.string().min(2).max(100),
  lastName:  z.string().min(2).max(100),
  email:     z.string().email(),
  phone:     z.string().regex(/^[\d\s\-\+\(\)]{7,20}$/),
  whatsapp:  z.string().optional(),
  bio:       z.string().max(1000).optional(),
  specialty: z.string().max(200).optional(),
});

export type AgentFormData = z.infer<typeof agentSchema>;

// ─── Property Filters ─────────────────────────────────────────────
export const propertyFiltersSchema = z.object({
  type:         z.string().optional(),
  listingType:  z.enum(["VENTA", "RENTA", "VENTA_O_RENTA"]).optional(),
  zoneId:       z.string().optional(),
  priceMin:     z.coerce.number().positive().optional(),
  priceMax:     z.coerce.number().positive().optional(),
  bedroomsMin:  z.coerce.number().int().min(0).optional(),
  areaMin:      z.coerce.number().positive().optional(),
  isFeatured:   z.coerce.boolean().optional(),
  query:        z.string().optional(),
  page:         z.coerce.number().int().positive().default(1),
  limit:        z.coerce.number().int().positive().max(48).default(12),
  sortBy:       z.enum(["price_asc", "price_desc", "date_desc", "date_asc", "area_desc"]).default("date_desc"),
});
