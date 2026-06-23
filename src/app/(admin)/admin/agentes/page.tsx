import type { Metadata } from "next";
import { AgentsTable }  from "@/components/admin/agents-table";

export const metadata: Metadata = { title: "Agentes | Admin" };

export default function AdminAgentesPage() {
  return (
    <div className="p-6 space-y-5">
      <div>
        <p className="text-body-xs text-obsidian-400 mb-0.5">Gestión</p>
        <h2 className="font-playfair font-bold text-display-md text-obsidian">Agentes</h2>
        <p className="text-body-sm text-obsidian-400 mt-1">
          Administra el equipo de asesores inmobiliarios.
        </p>
      </div>

      <AgentsTable />
    </div>
  );
}
