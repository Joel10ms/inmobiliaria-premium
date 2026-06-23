import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Currency } from "@/types";

// ─── Class Utility ────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Price Formatting ─────────────────────────────────────────────
export function formatPrice(amount: number, currency: Currency = "MXN"): string {
  const locales: Record<Currency, string> = {
    MXN: "es-MX",
    USD: "en-US",
  };

  return new Intl.NumberFormat(locales[currency], {
    style:               "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceCompact(amount: number, currency: Currency = "MXN"): string {
  if (amount >= 1_000_000) {
    const value = (amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1);
    return `${currency === "MXN" ? "$" : "USD "} ${value}M`;
  }
  if (amount >= 1_000) {
    const value = (amount / 1_000).toFixed(0);
    return `${currency === "MXN" ? "$" : "USD "} ${value}K`;
  }
  return formatPrice(amount, currency);
}

// ─── Area Formatting ──────────────────────────────────────────────
export function formatArea(m2: number): string {
  return `${new Intl.NumberFormat("es-MX").format(m2)} m²`;
}

// ─── Slug Generation ──────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ─── URL Helpers ──────────────────────────────────────────────────
export function buildPropertyUrl(slug: string): string {
  return `/propiedades/${slug}`;
}

export function buildAgentUrl(slug: string): string {
  return `/agentes/${slug}`;
}

// ─── WhatsApp Link ────────────────────────────────────────────────
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

export function buildPropertyWhatsAppUrl(
  phone: string,
  propertyTitle: string,
  propertyUrl: string
): string {
  const message = `Hola, me interesa la propiedad "${propertyTitle}". La vi en ${propertyUrl} y me gustaría recibir más información.`;
  return buildWhatsAppUrl(phone, message);
}

// ─── Date Formatting ──────────────────────────────────────────────
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-MX", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  }).format(new Date(date));
}

export function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86_400_000);

  if (days === 0)  return "Hoy";
  if (days === 1)  return "Hace 1 día";
  if (days < 7)   return `Hace ${days} días`;
  if (days < 30)  return `Hace ${Math.floor(days / 7)} semanas`;
  if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
  return `Hace ${Math.floor(days / 365)} años`;
}

// ─── Truncate ─────────────────────────────────────────────────────
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

// ─── Cloudinary URL Builder ───────────────────────────────────────
export function buildCloudinaryUrl(
  publicId: string,
  opts: { width?: number; height?: number; quality?: number; format?: string } = {}
): string {
  const { width = 800, quality = 80, format = "auto" } = opts;
  const transforms = [
    `q_${quality}`,
    `f_${format}`,
    width ? `w_${width}` : "",
    opts.height ? `h_${opts.height}` : "",
    "c_fill",
  ]
    .filter(Boolean)
    .join(",");
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
