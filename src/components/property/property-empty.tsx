import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyEmptyProps {
  hasFilters: boolean;
  clearUrl:   string;
}

export function PropertyEmpty({ hasFilters, clearUrl }: PropertyEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-ivory flex items-center justify-center mb-6">
        <SearchX className="h-9 w-9 text-obsidian-300" />
      </div>

      {/* Gold accent */}
      <div className="h-0.5 w-10 bg-gold mb-6" />

      <h2 className="font-playfair font-semibold text-display-sm text-obsidian mb-3">
        Sin resultados
      </h2>

      <p className="text-body-lg text-obsidian-400 max-w-sm mb-8 leading-relaxed">
        {hasFilters
          ? "No encontramos propiedades con los filtros seleccionados. Intenta ampliar tu búsqueda."
          : "No hay propiedades disponibles en este momento. Vuelve pronto."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {hasFilters && (
          <Button variant="primary" size="lg" asChild>
            <Link href={clearUrl}>Limpiar filtros</Link>
          </Button>
        )}
        <Button variant="outline" size="lg" asChild>
          <Link href="/contacto">Contactar a un asesor</Link>
        </Button>
      </div>
    </div>
  );
}
