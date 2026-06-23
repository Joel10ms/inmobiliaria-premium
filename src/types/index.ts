// ─── Property Types ───────────────────────────────────────────────
export type PropertyStatus = "ACTIVA" | "VENDIDA" | "RENTADA" | "EN_NEGOCIACION" | "PAUSADA";
export type PropertyType   = "Casa" | "Departamento" | "Penthouse" | "Villa" | "Desarrollo" | "Oficina" | "Local Comercial" | "Terreno";
export type ListingType    = "VENTA" | "RENTA" | "VENTA_O_RENTA";
export type Currency       = "MXN" | "USD";

export interface PropertyImage {
  id:        string;
  url:       string;
  alt:       string;
  isPrimary: boolean;
  order:     number;
}

export interface PropertyFeature {
  id:       string;
  name:     string;
  icon?:    string;
  category: "interior" | "exterior" | "amenidad" | "seguridad";
}

export interface Agent {
  id:          string;
  name:        string;
  lastName:    string;
  email:       string;
  phone:       string;
  whatsapp?:   string;
  photo?:      string;
  bio?:        string;
  specialty?:  string;
  properties?: number;
  slug:        string;
  isActive:    boolean;
}

export interface Zone {
  id:       string;
  name:     string;
  city:     string;
  state:    string;
  country:  string;
  slug:     string;
}

export interface Property {
  id:              string;
  title:           string;
  slug:            string;
  description:     string;
  status:          PropertyStatus;
  type:            PropertyType;
  listingType:     ListingType;
  price:           number;
  currency:        Currency;
  pricePerM2?:     number;

  // Location
  address?:        string;
  zone:            Zone;
  latitude?:       number;
  longitude?:      number;

  // Dimensions
  totalArea?:      number;
  builtArea?:      number;
  landArea?:       number;

  // Rooms
  bedrooms?:       number;
  bathrooms?:      number;
  halfBathrooms?:  number;
  parkingSpaces?:  number;

  // Media
  images:          PropertyImage[];
  videoUrl?:       string;
  virtualTourUrl?: string;

  // Relations
  features:        PropertyFeature[];
  agent:           Agent;

  // Flags
  isFeatured:      boolean;
  isNew:           boolean;
  isExclusive:     boolean;

  // SEO
  metaTitle?:      string;
  metaDescription?:string;

  // Timestamps
  createdAt:       Date;
  updatedAt:       Date;
  publishedAt?:    Date;
}

// ─── Inquiry Types ────────────────────────────────────────────────
export type InquiryStatus = "NUEVO" | "CONTACTADO" | "EN_SEGUIMIENTO" | "CERRADO" | "PERDIDO";
export type InquirySource = "WEB" | "WHATSAPP" | "TELEFONO" | "REFERIDO" | "REDES_SOCIALES";

export interface Inquiry {
  id:           string;
  name:         string;
  email:        string;
  phone?:       string;
  message?:     string;
  status:       InquiryStatus;
  source:       InquirySource;
  propertyId?:  string;
  property?:    Pick<Property, "id" | "title" | "slug">;
  agentId?:     string;
  agent?:       Pick<Agent, "id" | "name" | "lastName">;
  createdAt:    Date;
  updatedAt:    Date;
}

// ─── Filter Types ─────────────────────────────────────────────────
export interface PropertyFilters {
  type?:         PropertyType;
  listingType?:  ListingType;
  zoneId?:       string;
  priceMin?:     number;
  priceMax?:     number;
  bedroomsMin?:  number;
  bathroomsMin?: number;
  areaMin?:      number;
  isFeatured?:   boolean;
  query?:        string;
  page?:         number;
  limit?:        number;
  sortBy?:       "price_asc" | "price_desc" | "date_desc" | "date_asc" | "area_desc";
}

// ─── API Response Types ───────────────────────────────────────────
export interface PaginatedResponse<T> {
  data:       T[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?:   string;
  field?:  string;
}

// ─── User/Auth Types ──────────────────────────────────────────────
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "AGENTE" | "CLIENTE";

export interface User {
  id:        string;
  name?:     string;
  email:     string;
  role:      UserRole;
  agentId?:  string;
  createdAt: Date;
}
