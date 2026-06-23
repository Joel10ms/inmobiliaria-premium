"use client";

import * as React                from "react";
import { MapPin, ExternalLink, Map, Loader2 } from "lucide-react";
import { cn }                    from "@/lib/utils";
import type { Zone }             from "@/types";

interface PropertyMapProps {
  zone:       Zone;
  address?:   string | null;
  latitude?:  number | null;
  longitude?: number | null;
}

type MapState = "idle" | "loading" | "loaded";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function buildEmbedUrl(props: PropertyMapProps): string {
  const { zone, address, latitude, longitude } = props;

  if (latitude && longitude && API_KEY) {
    // Satellite view — most impressive for luxury properties
    return (
      `https://www.google.com/maps/embed/v1/view` +
      `?key=${API_KEY}` +
      `&center=${latitude},${longitude}` +
      `&zoom=16&maptype=satellite`
    );
  }

  const query = encodeURIComponent(`${address ?? zone.name}, ${zone.city}, México`);
  if (API_KEY) {
    return (
      `https://www.google.com/maps/embed/v1/place` +
      `?key=${API_KEY}` +
      `&q=${query}` +
      `&zoom=14&language=es`
    );
  }

  return "";
}

function buildDirectUrl(props: PropertyMapProps): string {
  const { zone, address, latitude, longitude } = props;
  if (latitude && longitude) {
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  }
  const query = encodeURIComponent(`${address ?? zone.name}, ${zone.city}, México`);
  return `https://maps.google.com/?q=${query}`;
}

// ─── Decorative preview (shown before user clicks "Ver mapa") ────
function MapPreview({
  zone, address, onReveal, directUrl, hasApiKey,
}: {
  zone:      Zone;
  address?:  string | null;
  onReveal:  () => void;
  directUrl: string;
  hasApiKey: boolean;
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-obsidian-100 shadow-card">
      {/* Decorative grid background */}
      <div
        className="h-64 bg-obsidian-50 flex items-center justify-center relative"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(201,168,106,0.1) 39px, rgba(201,168,106,0.1) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(201,168,106,0.1) 39px, rgba(201,168,106,0.1) 40px)
          `,
        }}
        role="img"
        aria-label={`Vista previa de ubicación en ${zone.name}`}
      >
        {/* Pin */}
        <div className="flex flex-col items-center gap-3 z-10">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-crimson/15 flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-crimson/30 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-crimson fill-crimson/20" />
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

        {/* Privacy overlay — click to load */}
        <button
          type="button"
          onClick={onReveal}
          className={cn(
            "absolute inset-0 w-full flex flex-col items-center justify-end pb-4",
            "bg-gradient-to-t from-obsidian/30 via-transparent to-transparent",
            "hover:from-obsidian/50 transition-all duration-200 group"
          )}
          aria-label="Ver mapa interactivo"
        >
          <span className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-body-sm font-medium",
            "bg-obsidian/70 group-hover:bg-obsidian/90 backdrop-blur-sm transition-all duration-200",
            "border border-white/20 shadow-md"
          )}>
            <Map className="h-4 w-4" />
            {hasApiKey ? "Ver mapa interactivo" : "Ver en Google Maps"}
          </span>
        </button>
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
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-obsidian-200 text-body-sm text-obsidian hover:bg-obsidian hover:text-white hover:border-obsidian transition-all duration-200"
        >
          Ver en Google Maps
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

// ─── Interactive map (shown after user clicks) ────────────────────
function InteractiveMap({
  embedUrl, directUrl, zone, address, state, onLoad,
}: {
  embedUrl:  string;
  directUrl: string;
  zone:      Zone;
  address?:  string | null;
  state:     MapState;
  onLoad:    () => void;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-obsidian-100 shadow-card">
      {/* iframe wrapper */}
      <div className="relative h-[420px]">
        {/* Loading spinner */}
        {state === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-obsidian-50 z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-crimson animate-spin" />
              <p className="text-body-xs text-obsidian-400">Cargando mapa…</p>
            </div>
          </div>
        )}
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          className={cn(
            "border-0 transition-opacity duration-300",
            state === "loaded" ? "opacity-100" : "opacity-0"
          )}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={onLoad}
          title={`Mapa de ${zone.name}`}
        />
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
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-obsidian-200 text-body-sm text-obsidian hover:bg-obsidian hover:text-white hover:border-obsidian transition-all duration-200"
        >
          Abrir en Google Maps
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────
export function PropertyMap({ zone, address, latitude, longitude }: PropertyMapProps) {
  const [mapState, setMapState] = React.useState<MapState>("idle");

  const embedUrl  = buildEmbedUrl({ zone, address, latitude, longitude });
  const directUrl = buildDirectUrl({ zone, address, latitude, longitude });
  const hasApiKey = Boolean(API_KEY);

  const handleReveal = () => {
    if (!hasApiKey) {
      // No API key — send user directly to Google Maps
      window.open(directUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setMapState("loading");
  };

  return (
    <div className="mt-10">
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-gold/40 to-transparent mb-8" />

      <h2 className="font-playfair font-semibold text-display-sm text-obsidian mb-5">
        Ubicación
      </h2>

      {mapState === "idle" ? (
        <MapPreview
          zone={zone}
          address={address}
          onReveal={handleReveal}
          directUrl={directUrl}
          hasApiKey={hasApiKey}
        />
      ) : (
        <InteractiveMap
          embedUrl={embedUrl}
          directUrl={directUrl}
          zone={zone}
          address={address}
          state={mapState}
          onLoad={() => setMapState("loaded")}
        />
      )}

      <p className="text-body-xs text-obsidian-300 mt-2 text-center">
        {mapState === "idle"
          ? "La ubicación exacta se revela al agendar una visita."
          : "Datos del mapa © Google Maps"}
      </p>
    </div>
  );
}
