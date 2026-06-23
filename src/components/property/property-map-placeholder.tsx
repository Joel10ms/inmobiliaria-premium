import { MapPin, ExternalLink } from "lucide-react";
import type { Zone } from "@/types";

interface PropertyMapPlaceholderProps {
  zone:    Zone;
  address?: string;
}

export function PropertyMapPlaceholder({ zone, address }: PropertyMapPlaceholderProps) {
  const query   = encodeURIComponent(`${address ?? zone.name}, ${zone.city}, México`);
  const mapsUrl = `https://maps.google.com/?q=${query}`;

  return (
    <div className="mt-10">
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-gold/40 to-transparent mb-8" />

      <h2 className="font-playfair font-semibold text-display-sm text-obsidian mb-5">
        Ubicación
      </h2>

      {/* Map placeholder */}
      <div className="relative rounded-2xl overflow-hidden border border-obsidian-100 shadow-card">
        {/* Decorative map background */}
        <div
          className="h-64 bg-obsidian-100 flex items-center justify-center"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(201,168,106,0.08) 39px, rgba(201,168,106,0.08) 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(201,168,106,0.08) 39px, rgba(201,168,106,0.08) 40px)
            `,
          }}
          role="img"
          aria-label={`Mapa de ${zone.name}`}
        >
          {/* Center pin */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-crimson/15 flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 rounded-full bg-crimson/30 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-crimson fill-crimson/30" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-card px-4 py-2 text-center">
              <p className="font-playfair font-semibold text-body-md text-obsidian">
                {zone.name}
              </p>
              <p className="text-body-xs text-obsidian-400">{zone.city}, {zone.state}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-white px-5 py-4 flex items-center justify-between border-t border-obsidian-100">
          <div>
            <p className="text-body-sm font-medium text-obsidian">
              {address ?? zone.name}
            </p>
            <p className="text-body-xs text-obsidian-400">{zone.city}, México</p>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-obsidian-200 text-body-sm text-obsidian hover:bg-obsidian hover:text-white hover:border-obsidian transition-all duration-200"
          >
            Ver en Google Maps
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <p className="text-body-xs text-obsidian-300 mt-2 text-center">
        La ubicación exacta se revela al agendar una visita.
      </p>
    </div>
  );
}
