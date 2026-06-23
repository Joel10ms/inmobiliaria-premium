import type { Metadata } from "next";
import Link              from "next/link";
import { ChevronLeft }   from "lucide-react";
import { AgentForm }     from "@/components/admin/agent-form";

export const metadata: Metadata = { title: "Nuevo agente | Admin" };

export default function NuevoAgentePage() {
  return (
    <div className="p-6 max-w-2xl space-y-5">
      <Link
        href="/admin/agentes"
        className="inline-flex items-center gap-1.5 text-body-sm text-obsidian-400 hover:text-obsidian transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver a agentes
      </Link>

      <div className="pb-1">
        <h2 className="font-playfair font-bold text-display-md text-obsidian">Nuevo agente</h2>
        <p className="text-body-sm text-obsidian-400 mt-1">Registra un nuevo asesor en el equipo.</p>
      </div>

      <AgentForm mode="create" />
    </div>
  );
}
