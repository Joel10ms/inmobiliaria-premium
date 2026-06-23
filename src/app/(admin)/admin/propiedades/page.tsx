import type { Metadata }      from "next";
import { PropertiesTable }    from "@/components/admin/properties-table";
import { getAdminProperties } from "@/lib/queries/properties";

export const metadata: Metadata = { title: "Propiedades | Admin" };

export default async function AdminPropiedadesPage() {
  const properties = await getAdminProperties();

  return (
    <div className="p-6 space-y-5">
      <div>
        <p className="text-body-xs text-obsidian-400 mb-0.5">Gestión</p>
        <h2 className="font-playfair font-bold text-display-md text-obsidian">Propiedades</h2>
      </div>

      <PropertiesTable initialProperties={properties} />
    </div>
  );
}
