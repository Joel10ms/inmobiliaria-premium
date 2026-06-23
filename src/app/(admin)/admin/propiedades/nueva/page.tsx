import type { Metadata }   from "next";
import Link               from "next/link";
import { ChevronLeft }    from "lucide-react";
import { PropertyForm }   from "@/components/admin/property-form";

export const metadata: Metadata = { title: "Nueva propiedad | Admin" };

export default function NuevaPropiedadPage() {
  return (
    <div className="p-6 max-w-3xl space-y-5">
      {/* Back link */}
      <Link
        href="/admin/propiedades"
        className="inline-flex items-center gap-1.5 text-body-sm text-obsidian-400 hover:text-obsidian transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver a propiedades
      </Link>

      {/* Header */}
      <div className="pb-1">
        <h2 className="font-playfair font-bold text-display-md text-obsidian">Nueva propiedad</h2>
        <p className="text-body-sm text-obsidian-400 mt-1">
          Completa los campos para publicar una nueva propiedad en el portal.
        </p>
      </div>

      {/* Form */}
      <PropertyForm mode="create" />
    </div>
  );
}
