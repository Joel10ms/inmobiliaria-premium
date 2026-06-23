import type { Metadata }        from "next";
import Link                     from "next/link";
import { notFound }             from "next/navigation";
import { ChevronLeft }          from "lucide-react";
import { PropertyForm }         from "@/components/admin/property-form";
import { getPropertyBySlug, getAllPropertySlugs } from "@/lib/queries/properties";
import { getAdminProperties }   from "@/lib/queries/properties";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const properties = await getAdminProperties();
  const prop = properties.find((p) => p.id === id);
  return { title: prop ? `Editar: ${prop.title} | Admin` : "Propiedad | Admin" };
}

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map(({ slug }) => ({ id: slug })); // admin uses IDs but we pre-render by slug equivalence
}

export const dynamic = "force-dynamic"; // IDs change frequently; skip static generation in production

export default async function EditarPropiedadPage({ params }: Props) {
  const { id } = await params;
  const properties = await getAdminProperties();
  // Support lookup by both id and slug for flexibility
  const property = properties.find((p) => p.id === id || p.slug === id);
  if (!property) notFound();

  const defaults = {
    title:          property.title,
    description:    property.description ?? "",
    type:           property.type,
    listingType:    property.listingType,
    price:          Number(property.price),
    currency:       property.currency as "MXN" | "USD",
    zoneSlug:       property.zone.slug,
    address:        property.address ?? "",
    bedrooms:       property.bedrooms     ?? undefined,
    bathrooms:      property.bathrooms    ?? undefined,
    halfBathrooms:  property.halfBathrooms ?? undefined,
    parkingSpaces:  property.parkingSpaces ?? undefined,
    totalArea:      property.totalArea ? Number(property.totalArea) : undefined,
    builtArea:      property.builtArea ? Number(property.builtArea) : undefined,
    agentId:        property.agent?.id ?? "",
    status:         property.status,
    isFeatured:     property.isFeatured ?? false,
    isNew:          property.isNew       ?? false,
    isExclusive:    property.isExclusive ?? false,
    videoUrl:       property.videoUrl       ?? "",
    virtualTourUrl: property.virtualTourUrl ?? "",
  };

  return (
    <div className="p-6 max-w-3xl space-y-5">
      <Link
        href="/admin/propiedades"
        className="inline-flex items-center gap-1.5 text-body-sm text-obsidian-400 hover:text-obsidian transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver a propiedades
      </Link>

      <div className="pb-1">
        <h2 className="font-playfair font-bold text-display-md text-obsidian line-clamp-1">
          {property.title}
        </h2>
        <p className="text-body-sm text-obsidian-400 mt-1">
          Editar propiedad · ID: <code className="font-mono text-obsidian-500">{property.id}</code>
        </p>
      </div>

      <PropertyForm mode="edit" propertyId={property.id} defaultValues={defaults} />
    </div>
  );
}
