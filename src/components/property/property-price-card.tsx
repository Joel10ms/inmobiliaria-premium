import Link from "next/link";
import { Phone, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, buildPropertyWhatsAppUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { Property } from "@/types";

interface PropertyPriceCardProps {
  property: Property;
}

export function PropertyPriceCard({ property }: PropertyPriceCardProps) {
  const price    = Number(property.price);
  const currency = property.currency;
  const isRenta  = property.listingType === "RENTA";

  const propertyUrl  = `${siteConfig.url}/propiedades/${property.slug}`;
  const agentPhone   = property.agent?.whatsapp ?? property.agent?.phone ?? siteConfig.contact.whatsapp;
  const whatsappUrl  = buildPropertyWhatsAppUrl(agentPhone, property.title, propertyUrl);

  return (
    <div className="bg-white rounded-2xl border border-obsidian-100 shadow-card overflow-hidden">
      {/* Gold top accent */}
      <div className="h-1 bg-gradient-gold" />

      <div className="p-6">
        {/* Price */}
        <div className="mb-5">
          <p className="text-label-sm text-obsidian-400 mb-1">
            {isRenta ? "Precio mensual" : "Precio de venta"}
          </p>
          <p className="font-playfair font-bold text-obsidian leading-none"
             style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}>
            {formatPrice(price, currency)}
          </p>
          {isRenta && (
            <p className="text-body-xs text-obsidian-400 mt-1">por mes + servicios</p>
          )}
          {property.pricePerM2 && (
            <p className="text-body-xs text-obsidian-400 mt-1">
              {formatPrice(Number(property.pricePerM2), currency)} / m²
            </p>
          )}
        </div>

        {/* Gold divider */}
        <div className="h-px bg-gradient-to-r from-gold/40 to-transparent mb-5" />

        {/* Primary CTAs */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" className="w-full" asChild>
            <Link href="/contacto">
              Agendar visita
            </Link>
          </Button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-lg bg-emerald-600 text-white text-label-sm font-medium hover:bg-emerald-700 transition-colors duration-200"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Consultar por WhatsApp
          </a>
        </div>

        {/* Gold divider */}
        <div className="h-px bg-obsidian-100 my-5" />

        {/* Secondary actions */}
        <div className="flex gap-3">
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-obsidian-200 text-body-sm text-obsidian hover:border-obsidian hover:bg-obsidian hover:text-white transition-all duration-200"
          >
            <Phone className="h-4 w-4" />
            Llamar
          </a>

          {/* Share button */}
          <ShareButton title={property.title} url={propertyUrl} />

          {/* Favorite button (Phase 8) */}
          <button
            title="Guardar en favoritos"
            className="flex items-center justify-center h-10 w-10 rounded-lg border border-obsidian-200 text-obsidian-400 hover:border-crimson/50 hover:text-crimson transition-all duration-200"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Reference number */}
        <p className="text-body-xs text-obsidian-300 mt-4 text-center">
          Ref: <span className="font-mono">{property.id.toUpperCase().slice(0, 8)}</span>
        </p>
      </div>
    </div>
  );
}

// ─── Share button (client feature) ───────────────────────────────
function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Enlace copiado al portapapeles.");
      }
    } catch {
      // User cancelled
    }
  };

  return (
    <button
      onClick={handleShare}
      title="Compartir propiedad"
      className="flex items-center justify-center h-10 w-10 rounded-lg border border-obsidian-200 text-obsidian-400 hover:border-obsidian hover:text-obsidian transition-all duration-200"
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}
