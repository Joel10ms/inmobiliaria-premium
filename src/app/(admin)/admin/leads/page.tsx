import type { Metadata } from "next";
import { LeadsTable }   from "@/components/admin/leads-table";

export const metadata: Metadata = { title: "Leads | Admin" };

export default function AdminLeadsPage() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <p className="text-body-xs text-obsidian-400 mb-0.5">CRM</p>
        <h2 className="font-playfair font-bold text-display-md text-obsidian">Leads e Inquiries</h2>
        <p className="text-body-sm text-obsidian-400 mt-1">
          Gestiona y da seguimiento a todos los contactos recibidos.
        </p>
      </div>

      <LeadsTable />
    </div>
  );
}
