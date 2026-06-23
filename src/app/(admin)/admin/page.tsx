import type { Metadata }       from "next";
import Link                    from "next/link";
import { Plus }                from "lucide-react";
import { DashboardStats }      from "@/components/admin/dashboard-stats";
import { RecentActivity }      from "@/components/admin/recent-activity";
import { Button }              from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard | Admin" };

export default function AdminDashboardPage() {
  const now = new Date().toLocaleDateString("es-MX", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="p-6 space-y-7">

      {/* ─── Page header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-body-xs text-obsidian-400 capitalize">{now}</p>
          <h2 className="font-playfair font-bold text-display-md text-obsidian mt-0.5">
            Bienvenido de vuelta
          </h2>
        </div>
        <Button variant="primary" size="md" asChild>
          <Link href="/admin/propiedades/nueva">
            <Plus className="h-4 w-4 shrink-0" />
            Nueva propiedad
          </Link>
        </Button>
      </div>

      {/* ─── Stats ──────────────────────────────────────────── */}
      <DashboardStats />

      {/* ─── Quick access cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Leads nuevos sin atender", value: "5", href: "/admin/leads?status=NUEVO",         accent: "border-l-crimson" },
          { label: "Propiedades sin publicar",  value: "2", href: "/admin/propiedades?status=PAUSADA", accent: "border-l-gold" },
          { label: "Propiedades en negociación",value: "3", href: "/admin/propiedades?status=EN_NEGOCIACION", accent: "border-l-obsidian-400" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`bg-white rounded-xl border border-obsidian-100 shadow-card p-4 border-l-4 ${item.accent} hover:shadow-card-hover transition-shadow duration-200 group`}
          >
            <p className="text-body-xs text-obsidian-400 mb-1">{item.label}</p>
            <p className="font-playfair font-bold text-display-md text-obsidian group-hover:text-crimson transition-colors">
              {item.value}
            </p>
          </Link>
        ))}
      </div>

      {/* ─── Recent activity ────────────────────────────────── */}
      <div>
        <h3 className="font-inter font-semibold text-body-lg text-obsidian mb-4">
          Actividad reciente
        </h3>
        <RecentActivity />
      </div>
    </div>
  );
}
