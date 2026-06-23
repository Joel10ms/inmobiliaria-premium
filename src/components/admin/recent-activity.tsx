import Link from "next/link";
import { ArrowRight, Building2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, timeAgo } from "@/lib/utils";
import { mockProperties } from "@/lib/mock-data";

const MOCK_LEADS = [
  { id: "l1", name: "Carlos Mendoza",  source: "WEB",       status: "NUEVO",          createdAt: new Date("2026-06-22") },
  { id: "l2", name: "Laura Sandoval",  source: "WHATSAPP",  status: "CONTACTADO",     createdAt: new Date("2026-06-21") },
  { id: "l3", name: "Roberto Iglesias",source: "TELEFONO",  status: "EN_SEGUIMIENTO", createdAt: new Date("2026-06-20") },
  { id: "l4", name: "Ana Gutiérrez",   source: "WEB",       status: "NUEVO",          createdAt: new Date("2026-06-19") },
  { id: "l5", name: "Miguel Torres",   source: "REDES_SOCIALES", status: "CERRADO",   createdAt: new Date("2026-06-18") },
];

const statusVariant: Record<string, "crimson" | "gold" | "ivory" | "success" | "dark"> = {
  NUEVO:          "crimson",
  CONTACTADO:     "gold",
  EN_SEGUIMIENTO: "ivory",
  CERRADO:        "success",
  PERDIDO:        "dark",
};

const statusLabel: Record<string, string> = {
  NUEVO:          "Nuevo",
  CONTACTADO:     "Contactado",
  EN_SEGUIMIENTO: "Seguimiento",
  CERRADO:        "Cerrado",
  PERDIDO:        "Perdido",
};

export function RecentActivity() {
  const recentProps = mockProperties.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* ─── Recent leads ────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-obsidian-100 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-obsidian-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-crimson" />
            <h3 className="font-inter font-semibold text-body-md text-obsidian">Leads recientes</h3>
          </div>
          <Link href="/admin/leads" className="text-body-xs text-crimson hover:underline flex items-center gap-1">
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="divide-y divide-obsidian-100">
          {MOCK_LEADS.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between px-5 py-3 hover:bg-ivory transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-obsidian-100 flex items-center justify-center shrink-0">
                  <span className="text-body-xs font-bold text-obsidian-500">
                    {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-body-sm font-medium text-obsidian truncate">{lead.name}</p>
                  <p className="text-body-xs text-obsidian-400">{timeAgo(lead.createdAt)}</p>
                </div>
              </div>
              <Badge variant={statusVariant[lead.status] ?? "ivory"} size="sm">
                {statusLabel[lead.status] ?? lead.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Recent properties ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-obsidian-100 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-obsidian-100">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-crimson" />
            <h3 className="font-inter font-semibold text-body-md text-obsidian">Propiedades recientes</h3>
          </div>
          <Link href="/admin/propiedades" className="text-body-xs text-crimson hover:underline flex items-center gap-1">
            Ver todas <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="divide-y divide-obsidian-100">
          {recentProps.map((p) => (
            <Link
              key={p.id}
              href={`/admin/propiedades/${p.id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-ivory transition-colors group"
            >
              <div className="min-w-0">
                <p className="text-body-sm font-medium text-obsidian truncate group-hover:text-crimson transition-colors">
                  {p.title}
                </p>
                <p className="text-body-xs text-obsidian-400">
                  {p.zone.name} · {p.type}
                </p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="font-playfair font-semibold text-body-md text-obsidian">
                  {formatPrice(Number(p.price), p.currency)}
                </p>
                <Badge
                  variant={p.status === "ACTIVA" ? "success" : "dark"}
                  size="sm"
                >
                  {p.status === "ACTIVA" ? "Activa" : p.status}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
