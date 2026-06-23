"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MoreHorizontal, Eye, Pencil, Trash2, Plus,
  ArrowUpDown, Search, CheckSquare,
} from "lucide-react";
import { cn, formatPrice, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property, PropertyStatus } from "@/types";

// ─── Status config ────────────────────────────────────────────────
const STATUS_CONFIG: Record<PropertyStatus, { label: string; variant: "success" | "gold" | "crimson" | "dark" | "ivory" }> = {
  ACTIVA:         { label: "Activa",         variant: "success" },
  EN_NEGOCIACION: { label: "En negociación", variant: "gold"    },
  VENDIDA:        { label: "Vendida",        variant: "dark"    },
  RENTADA:        { label: "Rentada",        variant: "crimson" },
  PAUSADA:        { label: "Pausada",        variant: "ivory"   },
};

const LISTING_LABEL: Record<string, string> = {
  VENTA:         "Venta",
  RENTA:         "Renta",
  VENTA_O_RENTA: "Ambas",
};

// ─── Actions dropdown ─────────────────────────────────────────────
function ActionsDropdown({
  property,
  onStatusChange,
  onDelete,
}: {
  property:       Property;
  onStatusChange: (id: string, status: PropertyStatus) => void;
  onDelete:       (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const statuses: PropertyStatus[] = ["ACTIVA", "EN_NEGOCIACION", "PAUSADA", "VENDIDA", "RENTADA"];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-obsidian-400 hover:bg-ivory hover:text-obsidian transition-colors"
        aria-label="Acciones"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 bg-white rounded-xl border border-obsidian-100 shadow-luxury w-52 py-1.5 overflow-hidden">
          {/* View on site */}
          <Link
            href={`/propiedades/${property.slug}`}
            target="_blank"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-body-sm text-obsidian hover:bg-ivory transition-colors"
          >
            <Eye className="h-4 w-4 text-obsidian-400" />
            Ver en sitio
          </Link>

          {/* Edit */}
          <Link
            href={`/admin/propiedades/${property.id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-body-sm text-obsidian hover:bg-ivory transition-colors"
          >
            <Pencil className="h-4 w-4 text-obsidian-400" />
            Editar
          </Link>

          {/* Status submenu */}
          <div className="border-t border-obsidian-100 mt-1 pt-1">
            <p className="px-4 py-1.5 text-body-xs text-obsidian-400 font-medium tracking-wide">
              Cambiar estado
            </p>
            {statuses
              .filter((s) => s !== property.status)
              .map((s) => (
                <button
                  key={s}
                  onClick={() => { onStatusChange(property.id, s); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-body-sm text-obsidian hover:bg-ivory transition-colors"
                >
                  <span className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    s === "ACTIVA"         ? "bg-emerald-500" :
                    s === "EN_NEGOCIACION" ? "bg-gold" :
                    s === "VENDIDA"        ? "bg-obsidian-400" :
                    s === "RENTADA"        ? "bg-crimson" :
                    "bg-obsidian-200"
                  )} />
                  {STATUS_CONFIG[s].label}
                </button>
              ))
            }
          </div>

          {/* Delete */}
          <div className="border-t border-obsidian-100 mt-1 pt-1">
            <button
              onClick={() => { onDelete(property.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-body-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main table component ─────────────────────────────────────────
interface PropertiesTableProps {
  initialProperties: Property[];
}

export function PropertiesTable({ initialProperties }: PropertiesTableProps) {
  const [properties, setProperties] = React.useState(initialProperties);
  const [search,     setSearch]     = React.useState("");
  const [filterType, setFilterType] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [selected,   setSelected]   = React.useState<Set<string>>(new Set());
  const [sortField,  setSortField]  = React.useState<"title" | "price" | "createdAt">("createdAt");
  const [sortDir,    setSortDir]    = React.useState<"asc" | "desc">("desc");

  // Filter + sort
  const filtered = React.useMemo(() => {
    let list = properties;
    if (search)      list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.zone.name.toLowerCase().includes(search.toLowerCase()));
    if (filterType)  list = list.filter((p) => p.type === filterType);
    if (filterStatus)list = list.filter((p) => p.status === filterStatus);

    return [...list].sort((a, b) => {
      let va: string | number, vb: string | number;
      if (sortField === "price")     { va = Number(a.price);  vb = Number(b.price); }
      else if (sortField === "title"){ va = a.title;          vb = b.title; }
      else                           { va = new Date(a.createdAt).getTime(); vb = new Date(b.createdAt).getTime(); }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
  }, [properties, search, filterType, filterStatus, sortField, sortDir]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleStatusChange = async (id: string, status: PropertyStatus) => {
    // Optimistic update
    setProperties((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    try {
      await fetch(`/api/admin/properties/${id}/status`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
    } catch {
      // Roll back on failure
      setProperties((prev) => prev.map((p) => p.id === id ? { ...p, status: initialProperties.find((x) => x.id === id)?.status ?? p.status } : p));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta propiedad? Esta acción no se puede deshacer.")) return;
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSelected((prev) => { const s = new Set(prev); s.delete(id); return s; });
    try {
      await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    } catch {
      // Re-fetch on failure to restore state
      const res = await fetch("/api/admin/properties").catch(() => null);
      if (res?.ok) setProperties(await res.json());
    }
  };

  const toggleSelect  = (id: string) => setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll     = () => setSelected((prev) => prev.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id)));

  const SortBtn = ({ field }: { field: typeof sortField }) => (
    <button onClick={() => handleSort(field)} className="ml-1 text-obsidian-300 hover:text-obsidian transition-colors">
      <ArrowUpDown className="h-3.5 w-3.5" />
    </button>
  );

  return (
    <div className="bg-white rounded-xl border border-obsidian-100 shadow-card overflow-hidden">

      {/* ─── Toolbar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-obsidian-100">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-obsidian-300 pointer-events-none" />
          <input
            type="search"
            placeholder="Buscar propiedad o zona…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-ivory border border-obsidian-200 rounded-lg text-body-sm text-obsidian placeholder:text-obsidian-300 focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/20 transition-colors"
          />
        </div>

        {/* Filters */}
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="h-9 px-3 bg-ivory border border-obsidian-200 rounded-lg text-body-sm text-obsidian focus:outline-none focus:border-crimson transition-colors">
          <option value="">Todos los tipos</option>
          {["Casa","Departamento","Penthouse","Villa","Desarrollo","Oficina","Terreno"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 bg-ivory border border-obsidian-200 rounded-lg text-body-sm text-obsidian focus:outline-none focus:border-crimson transition-colors">
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-body-xs text-obsidian-400">{selected.size} seleccionadas</span>
            <button
              onClick={async () => {
                if (!confirm(`¿Eliminar ${selected.size} propiedades? Esta acción no se puede deshacer.`)) return;
                const ids = Array.from(selected);
                setProperties((p) => p.filter((x) => !ids.includes(x.id)));
                setSelected(new Set());
                await Promise.allSettled(
                  ids.map((id) => fetch(`/api/admin/properties/${id}`, { method: "DELETE" }))
                );
              }}
              className="px-3 py-1.5 text-body-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Eliminar selección
            </button>
          </div>
        )}

        <Button variant="primary" size="sm" asChild className="ml-auto">
          <Link href="/admin/propiedades/nueva">
            <Plus className="h-4 w-4 shrink-0" />
            Nueva
          </Link>
        </Button>
      </div>

      {/* ─── Table ───────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-obsidian-100 bg-ivory">
              {/* Select all */}
              <th className="w-10 px-4 py-3 text-left">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll}
                  className="rounded border-obsidian-300 text-crimson focus:ring-crimson" />
              </th>
              <th className="px-4 py-3 text-left text-label-sm text-obsidian-400 tracking-wide font-semibold w-12">Foto</th>
              <th className="px-4 py-3 text-left text-label-sm text-obsidian-400 tracking-wide font-semibold">
                <span className="flex items-center">Propiedad <SortBtn field="title" /></span>
              </th>
              <th className="px-4 py-3 text-left text-label-sm text-obsidian-400 tracking-wide font-semibold">Tipo</th>
              <th className="px-4 py-3 text-left text-label-sm text-obsidian-400 tracking-wide font-semibold">
                <span className="flex items-center">Precio <SortBtn field="price" /></span>
              </th>
              <th className="px-4 py-3 text-left text-label-sm text-obsidian-400 tracking-wide font-semibold">Estado</th>
              <th className="px-4 py-3 text-left text-label-sm text-obsidian-400 tracking-wide font-semibold">Agente</th>
              <th className="px-4 py-3 text-left text-label-sm text-obsidian-400 tracking-wide font-semibold">
                <span className="flex items-center">Fecha <SortBtn field="createdAt" /></span>
              </th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center text-obsidian-400 text-body-sm">
                  No se encontraron propiedades con los filtros aplicados.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const img    = p.images.find((i) => i.isPrimary) ?? p.images[0];
                const status = STATUS_CONFIG[p.status] ?? { label: p.status, variant: "ivory" as const };

                return (
                  <tr
                    key={p.id}
                    className={cn(
                      "hover:bg-ivory/60 transition-colors group",
                      selected.has(p.id) && "bg-crimson/5"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)}
                        className="rounded border-obsidian-300 text-crimson focus:ring-crimson" />
                    </td>

                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="relative h-10 w-14 rounded-lg overflow-hidden bg-obsidian-100 shrink-0">
                        {img ? (
                          <Image src={img.url} alt={p.title} fill className="object-cover" sizes="56px" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-luxury" />
                        )}
                      </div>
                    </td>

                    {/* Title + zone */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <Link href={`/admin/propiedades/${p.id}`} className="font-medium text-body-sm text-obsidian hover:text-crimson transition-colors line-clamp-1 group-hover:text-crimson">
                        {p.title}
                      </Link>
                      <p className="text-body-xs text-obsidian-400 mt-0.5">{p.zone.name} · {LISTING_LABEL[p.listingType]}</p>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      <span className="text-body-xs text-obsidian-600 bg-ivory px-2 py-1 rounded-md border border-obsidian-100">{p.type}</span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <p className="font-playfair font-semibold text-body-md text-obsidian">
                        {formatPrice(Number(p.price), p.currency)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge variant={status.variant} size="sm">{status.label}</Badge>
                    </td>

                    {/* Agent */}
                    <td className="px-4 py-3">
                      <p className="text-body-sm text-obsidian truncate max-w-[120px]">
                        {p.agent?.name} {p.agent?.lastName}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <p className="text-body-xs text-obsidian-400">{timeAgo(p.createdAt)}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <ActionsDropdown
                        property={p}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="px-5 py-3 border-t border-obsidian-100 flex items-center justify-between">
        <p className="text-body-xs text-obsidian-400">
          {filtered.length} de {properties.length} propiedades
        </p>
        {selected.size > 0 && (
          <p className="text-body-xs text-crimson font-medium">{selected.size} seleccionadas</p>
        )}
      </div>
    </div>
  );
}
