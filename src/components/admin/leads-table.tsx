"use client";

import * as React from "react";
import { MoreHorizontal, Search, MessageSquare, Phone, Mail, StickyNote, X, Send } from "lucide-react";
import { cn, timeAgo, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// ─── Types ────────────────────────────────────────────────────────
type InquiryStatus = "NUEVO" | "CONTACTADO" | "EN_SEGUIMIENTO" | "CERRADO" | "PERDIDO";
type InquirySource = "WEB" | "WHATSAPP" | "TELEFONO" | "REFERIDO" | "REDES_SOCIALES";

interface Lead {
  id:            string;
  name:          string;
  email:         string;
  phone:         string;
  message:       string;
  status:        InquiryStatus;
  source:        InquirySource;
  propertyTitle?: string;
  agentName?:    string;
  createdAt:     Date;
  notes:         { id: string; text: string; createdAt: Date }[];
}

// ─── Mock leads ───────────────────────────────────────────────────
const INITIAL_LEADS: Lead[] = [
  { id: "l1", name: "Carlos Mendoza",   email: "carlos.m@gmail.com",    phone: "+52 55 1234 5678", message: "Me interesa el penthouse en Polanco, ¿podemos agendar una visita esta semana?", status: "NUEVO",          source: "WEB",           propertyTitle: "Penthouse Residencial Polanco",   agentName: "Alejandro García", createdAt: new Date("2026-06-22"), notes: [] },
  { id: "l2", name: "Laura Sandoval",   email: "l.sandoval@empresa.com", phone: "+52 55 9876 5432", message: "Quisiera información sobre la casa en Lomas, disponibilidad y precio de contado.", status: "CONTACTADO",     source: "WHATSAPP",      propertyTitle: "Casa en Lomas de Chapultepec",   agentName: "Alejandro García", createdAt: new Date("2026-06-21"), notes: [{ id: "n1", text: "Llamada realizada el 21 Jun. Interesada en visita presencial.", createdAt: new Date("2026-06-21") }] },
  { id: "l3", name: "Roberto Iglesias", email: "r.iglesias@mail.com",   phone: "+52 55 5555 4321", message: "Tengo presupuesto de 8M USD. Busco villa o casa de lujo con jardín grande.", status: "EN_SEGUIMIENTO", source: "TELEFONO",      propertyTitle: undefined,                        agentName: "Sofía Reyes",      createdAt: new Date("2026-06-20"), notes: [{ id: "n2", text: "Perfil de alto valor. Enviadas 3 propiedades por WhatsApp.", createdAt: new Date("2026-06-20") }] },
  { id: "l4", name: "Ana Gutiérrez",    email: "ana.g@correo.com",      phone: "+52 55 7777 8888", message: "Busco departamento de 2 recámaras en Condesa o Roma para renta. Presupuesto $25,000/mes.", status: "NUEVO",          source: "WEB",           propertyTitle: "Departamento Moderno en Condesa", agentName: "Carlos Vega",      createdAt: new Date("2026-06-19"), notes: [] },
  { id: "l5", name: "Miguel Torres",    email: "m.torres@biz.com",      phone: "+52 55 3333 2222", message: "Concretamos la operación de la Villa en Santa Fe. Excelente experiencia.", status: "CERRADO",        source: "REFERIDO",      propertyTitle: "Villa Exclusiva Santa Fe",        agentName: "Sofía Reyes",      createdAt: new Date("2026-06-15"), notes: [{ id: "n3", text: "Operación cerrada. Valor: $12.5M MXN.", createdAt: new Date("2026-06-15") }] },
  { id: "l6", name: "Patricia Solano",  email: "p.solano@email.mx",     phone: "+52 55 6666 9999", message: "Solo curiosidad. No voy a comprar pronto.", status: "PERDIDO",        source: "REDES_SOCIALES", propertyTitle: undefined,                        agentName: undefined,          createdAt: new Date("2026-06-10"), notes: [] },
  { id: "l7", name: "Daniel Herrera",   email: "dh@inversionista.com",  phone: "+52 55 4444 1111", message: "Inversionista, busco departamentos para renta en Roma Norte. Mín. 3 unidades.", status: "EN_SEGUIMIENTO", source: "WEB",           propertyTitle: "Suite Art Déco Roma Norte",       agentName: "Carlos Vega",      createdAt: new Date("2026-06-09"), notes: [] },
];

// ─── Config maps ──────────────────────────────────────────────────
const STATUS_CONFIG: Record<InquiryStatus, { label: string; variant: "crimson" | "gold" | "ivory" | "success" | "dark" }> = {
  NUEVO:          { label: "Nuevo",          variant: "crimson" },
  CONTACTADO:     { label: "Contactado",     variant: "gold"    },
  EN_SEGUIMIENTO: { label: "Seguimiento",    variant: "ivory"   },
  CERRADO:        { label: "Cerrado",        variant: "success" },
  PERDIDO:        { label: "Perdido",        variant: "dark"    },
};

const SOURCE_LABEL: Record<InquirySource, string> = {
  WEB:            "Web",
  WHATSAPP:       "WhatsApp",
  TELEFONO:       "Teléfono",
  REFERIDO:       "Referido",
  REDES_SOCIALES: "Redes",
};

// ─── Notes modal ──────────────────────────────────────────────────
function NotesModal({ lead, onClose, onAddNote }: {
  lead:      Lead;
  onClose:   () => void;
  onAddNote: (leadId: string, text: string) => void;
}) {
  const [text, setText] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddNote(lead.id, text.trim());
    setText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-obsidian/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-luxury-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-obsidian-100">
          <div>
            <h3 className="font-playfair font-bold text-body-xl text-obsidian">{lead.name}</h3>
            <p className="text-body-xs text-obsidian-400 mt-0.5">{lead.email} · {lead.phone}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian hover:bg-ivory transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message */}
        <div className="p-5 border-b border-obsidian-100 bg-ivory">
          <p className="text-body-xs text-obsidian-400 mb-1 font-medium tracking-wide uppercase">Mensaje original</p>
          <p className="text-body-sm text-obsidian">{lead.message}</p>
          {lead.propertyTitle && (
            <p className="text-body-xs text-crimson mt-2">🏠 {lead.propertyTitle}</p>
          )}
        </div>

        {/* Notes */}
        <div className="p-5 max-h-52 overflow-y-auto space-y-3">
          {lead.notes.length === 0 ? (
            <p className="text-body-sm text-obsidian-400 text-center py-4">Sin notas aún</p>
          ) : (
            lead.notes.map((note) => (
              <div key={note.id} className="bg-gold/10 border border-gold/20 rounded-lg p-3">
                <p className="text-body-sm text-obsidian">{note.text}</p>
                <p className="text-body-xs text-obsidian-400 mt-1">{formatDate(note.createdAt)}</p>
              </div>
            ))
          )}
        </div>

        {/* Add note */}
        <form onSubmit={handleSubmit} className="p-5 border-t border-obsidian-100 flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Agregar nota de seguimiento…"
            className="flex-1 px-3 py-2 text-body-sm border border-obsidian-200 rounded-lg focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/20 transition-colors bg-ivory"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-2 rounded-lg bg-crimson text-white disabled:opacity-40 hover:bg-crimson-600 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Row actions ──────────────────────────────────────────────────
function RowActions({ lead, onStatusChange, onOpenNotes }: {
  lead:           Lead;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onOpenNotes:    (lead: Lead) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const statuses: InquiryStatus[] = ["NUEVO","CONTACTADO","EN_SEGUIMIENTO","CERRADO","PERDIDO"];

  return (
    <div ref={ref} className="flex items-center gap-1">
      <button
        onClick={() => onOpenNotes(lead)}
        className="relative p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian hover:bg-ivory transition-colors"
        title="Notas"
      >
        <StickyNote className="h-4 w-4" />
        {lead.notes.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-gold text-[9px] font-bold text-obsidian flex items-center justify-center">
            {lead.notes.length}
          </span>
        )}
      </button>

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian hover:bg-ivory transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {open && (
          <div className="absolute right-0 top-8 z-20 bg-white rounded-xl border border-obsidian-100 shadow-luxury w-44 py-1.5">
            <p className="px-4 py-1 text-body-xs text-obsidian-400 font-medium tracking-wide">Cambiar estado</p>
            {statuses.filter((s) => s !== lead.status).map((s) => (
              <button
                key={s}
                onClick={() => { onStatusChange(lead.id, s); setOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-body-sm text-obsidian hover:bg-ivory transition-colors"
              >
                <Badge variant={STATUS_CONFIG[s].variant} size="sm">{STATUS_CONFIG[s].label}</Badge>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
export function LeadsTable() {
  const [leads,       setLeads]       = React.useState<Lead[]>(INITIAL_LEADS);
  const [search,      setSearch]      = React.useState("");
  const [filterStatus,setFilterStatus]= React.useState("");
  const [filterSource,setFilterSource]= React.useState("");
  const [notesLead,   setNotesLead]   = React.useState<Lead | null>(null);

  const filtered = React.useMemo(() => {
    let list = leads;
    if (search)       list = list.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus) list = list.filter((l) => l.status === filterStatus);
    if (filterSource) list = list.filter((l) => l.source === filterSource);
    return list;
  }, [leads, search, filterStatus, filterSource]);

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    // Optimistic update
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    try {
      await fetch(`/api/admin/leads/${id}/status`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
    } catch {
      console.error("Error al actualizar estado del lead");
    }
  };

  const handleAddNote = async (leadId: string, text: string) => {
    // Optimistic note with a temporary ID
    const tempId  = `n${Date.now()}`;
    const newNote = { id: tempId, text, createdAt: new Date() };

    const applyNote = (note: typeof newNote) => {
      setLeads((prev) => prev.map((l) =>
        l.id !== leadId ? l : { ...l, notes: [...l.notes, note] }
      ));
      setNotesLead((prev) => prev?.id === leadId
        ? { ...prev, notes: [...prev.notes, note] }
        : prev
      );
    };

    applyNote(newNote);

    try {
      const res  = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text }),
      });
      if (res.ok) {
        const saved = await res.json() as { id: string; text: string; createdAt: string };
        // Replace temp note with the persisted one (real ID)
        const realNote = { id: saved.id, text: saved.text, createdAt: new Date(saved.createdAt) };
        setLeads((prev) => prev.map((l) =>
          l.id !== leadId ? l : {
            ...l,
            notes: l.notes.map((n) => n.id === tempId ? realNote : n),
          }
        ));
        setNotesLead((prev) => prev?.id === leadId
          ? { ...prev, notes: prev.notes.map((n) => n.id === tempId ? realNote : n) }
          : prev
        );
      }
    } catch {
      console.error("Error al guardar la nota");
    }
  };

  const statusCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => { counts[l.status] = (counts[l.status] ?? 0) + 1; });
    return counts;
  }, [leads]);

  return (
    <>
      <div className="bg-white rounded-xl border border-obsidian-100 shadow-card overflow-hidden">

        {/* ─── Status filter pills ─────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 p-4 border-b border-obsidian-100">
          {[{ value: "", label: "Todos", count: leads.length }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label, count: statusCounts[k] ?? 0 }))].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilterStatus(item.value)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-xs font-medium transition-all duration-150 border",
                filterStatus === item.value
                  ? "bg-crimson text-white border-crimson shadow-sm"
                  : "bg-ivory text-obsidian-500 border-obsidian-200 hover:border-obsidian hover:text-obsidian"
              )}
            >
              {item.label}
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center",
                filterStatus === item.value ? "bg-white/20 text-white" : "bg-obsidian-100 text-obsidian-400"
              )}>{item.count}</span>
            </button>
          ))}
        </div>

        {/* ─── Search + source filter ──────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-obsidian-100">
          <div className="relative flex-1 min-w-44">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-obsidian-300 pointer-events-none" />
            <input
              type="search" placeholder="Buscar por nombre o email…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-ivory border border-obsidian-200 rounded-lg text-body-sm text-obsidian placeholder:text-obsidian-300 focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/20 transition-colors"
            />
          </div>
          <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}
            className="h-9 px-3 bg-ivory border border-obsidian-200 rounded-lg text-body-sm text-obsidian focus:outline-none focus:border-crimson transition-colors">
            <option value="">Todas las fuentes</option>
            {Object.entries(SOURCE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        {/* ─── Table ──────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-obsidian-100 bg-ivory">
                {["Contacto", "Fuente", "Propiedad / Asesor", "Mensaje", "Estado", "Fecha", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-label-sm text-obsidian-400 tracking-wide font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-14 text-center text-obsidian-400 text-body-sm">No se encontraron leads con estos filtros.</td></tr>
              ) : filtered.map((lead) => {
                const statusCfg = STATUS_CONFIG[lead.status];
                return (
                  <tr key={lead.id} className="hover:bg-ivory/60 transition-colors group">
                    {/* Contact */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-obsidian-100 flex items-center justify-center shrink-0 text-body-xs font-bold text-obsidian-500">
                          {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-body-sm font-medium text-obsidian truncate">{lead.name}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <a href={`mailto:${lead.email}`} className="text-body-xs text-obsidian-400 hover:text-crimson flex items-center gap-1 transition-colors">
                              <Mail className="h-3 w-3" />{lead.email}
                            </a>
                          </div>
                          <a href={`tel:${lead.phone}`} className="text-body-xs text-obsidian-400 hover:text-crimson flex items-center gap-1 mt-0.5 transition-colors">
                            <Phone className="h-3 w-3" />{lead.phone}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-4 py-3">
                      <span className="text-body-xs text-obsidian-600 bg-ivory px-2 py-1 rounded-md border border-obsidian-100">
                        {SOURCE_LABEL[lead.source]}
                      </span>
                    </td>

                    {/* Property + agent */}
                    <td className="px-4 py-3 max-w-[160px]">
                      {lead.propertyTitle && (
                        <p className="text-body-xs font-medium text-obsidian line-clamp-1">{lead.propertyTitle}</p>
                      )}
                      {lead.agentName && (
                        <p className="text-body-xs text-obsidian-400 mt-0.5 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-obsidian-300 inline-block" />
                          {lead.agentName}
                        </p>
                      )}
                      {!lead.propertyTitle && !lead.agentName && (
                        <span className="text-body-xs text-obsidian-300">—</span>
                      )}
                    </td>

                    {/* Message preview */}
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="text-body-xs text-obsidian-500 line-clamp-2">{lead.message}</p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge variant={statusCfg.variant} size="sm">{statusCfg.label}</Badge>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <p className="text-body-xs text-obsidian-400">{timeAgo(lead.createdAt)}</p>
                      <p className="text-body-xs text-obsidian-300">{formatDate(lead.createdAt)}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <RowActions
                        lead={lead}
                        onStatusChange={handleStatusChange}
                        onOpenNotes={setNotesLead}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-obsidian-100">
          <p className="text-body-xs text-obsidian-400">{filtered.length} de {leads.length} leads</p>
        </div>
      </div>

      {/* Notes modal */}
      {notesLead && (
        <NotesModal
          lead={notesLead}
          onClose={() => setNotesLead(null)}
          onAddNote={handleAddNote}
        />
      )}
    </>
  );
}
