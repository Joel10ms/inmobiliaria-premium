"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, Phone, Mail, Star, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockAgents } from "@/lib/mock-data";

// Augment mock agents with mock stats
const agentsWithStats = mockAgents.map((a, i) => ({
  ...a,
  totalProperties: [6, 4, 3][i] ?? 2,
  activeProperties: [4, 2, 3][i] ?? 1,
  totalSales:  [8, 5, 3][i] ?? 0,
  rating:      [4.9, 4.7, 4.8][i] ?? 4.5,
  isActive:    true,
}));

interface AgentRowProps {
  agent:    typeof agentsWithStats[number];
  onDelete: (id: string) => void;
}

function AgentRow({ agent, onDelete }: AgentRowProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <tr className="hover:bg-ivory/60 transition-colors group border-b border-obsidian-100">
        {/* Photo + name */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-obsidian-100 ring-2 ring-gold/30 shrink-0">
              {agent.photo ? (
                <Image src={agent.photo} alt={agent.name} fill className="object-cover" sizes="40px" />
              ) : (
                <div className="absolute inset-0 bg-gradient-luxury flex items-center justify-center text-white font-bold">
                  {agent.name[0]}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-body-md text-obsidian">
                {agent.name} {agent.lastName}
              </p>
              <p className="text-body-xs text-obsidian-400">{agent.specialty ?? "Asesor de lujo"}</p>
            </div>
          </div>
        </td>

        {/* Contact */}
        <td className="px-5 py-4">
          <a href={`mailto:${agent.email}`} className="flex items-center gap-1.5 text-body-xs text-obsidian-400 hover:text-crimson transition-colors mb-1">
            <Mail className="h-3.5 w-3.5" />{agent.email}
          </a>
          <a href={`tel:${agent.phone}`} className="flex items-center gap-1.5 text-body-xs text-obsidian-400 hover:text-crimson transition-colors">
            <Phone className="h-3.5 w-3.5" />{agent.phone}
          </a>
        </td>

        {/* Properties */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-obsidian-300" />
            <span className="text-body-sm text-obsidian">
              <span className="font-semibold">{agent.activeProperties}</span>
              <span className="text-obsidian-400"> activas</span>
            </span>
          </div>
          <p className="text-body-xs text-obsidian-400 mt-0.5">{agent.totalProperties} total</p>
        </td>

        {/* Sales */}
        <td className="px-5 py-4">
          <p className="font-playfair font-bold text-body-xl text-obsidian">{agent.totalSales}</p>
          <p className="text-body-xs text-obsidian-400">ventas/rentas</p>
        </td>

        {/* Rating */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-gold fill-gold" />
            <span className="font-semibold text-body-md text-obsidian">{agent.rating}</span>
          </div>
        </td>

        {/* Status */}
        <td className="px-5 py-4">
          <Badge variant={agent.isActive ? "success" : "dark"} size="sm">
            {agent.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </td>

        {/* Actions */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian hover:bg-ivory transition-colors text-body-xs"
              title="Ver bio"
            >
              ···
            </button>
            <Link
              href={`/admin/agentes/${agent.id}`}
              className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian hover:bg-ivory transition-colors"
              title="Editar"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                if (confirm(`¿Eliminar a ${agent.name} ${agent.lastName}?`)) onDelete(agent.id);
              }}
              className="p-1.5 rounded-lg text-obsidian-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Expandable bio row */}
      {expanded && (
        <tr className="bg-ivory border-b border-obsidian-100">
          <td colSpan={7} className="px-5 py-4">
            <p className="text-body-xs font-medium text-obsidian-400 mb-1 uppercase tracking-wide">Biografía</p>
            <p className="text-body-sm text-obsidian max-w-2xl">
              {agent.bio ?? "Sin biografía disponible. Edita este agente para agregar una."}
            </p>
          </td>
        </tr>
      )}
    </>
  );
}

export function AgentsTable() {
  const [agents, setAgents] = React.useState(agentsWithStats);

  const handleDelete = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border border-obsidian-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-obsidian-100">
        <div>
          <p className="text-body-sm font-medium text-obsidian">{agents.length} agentes registrados</p>
          <p className="text-body-xs text-obsidian-400 mt-0.5">
            {agents.filter((a) => a.isActive).length} activos · {agents.filter((a) => !a.isActive).length} inactivos
          </p>
        </div>
        <Button variant="primary" size="sm" asChild>
          <Link href="/admin/agentes/nuevo">
            <Plus className="h-4 w-4 shrink-0" />
            Nuevo agente
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-obsidian-100 bg-ivory">
              {["Agente", "Contacto", "Propiedades", "Ventas", "Rating", "Estado", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-label-sm text-obsidian-400 tracking-wide font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <AgentRow key={agent.id} agent={agent} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-3 divide-x divide-obsidian-100 border-t border-obsidian-100">
        {[
          { label: "Total propiedades",  value: agents.reduce((s, a) => s + a.totalProperties, 0) },
          { label: "Ventas combinadas",  value: agents.reduce((s, a) => s + a.totalSales, 0) },
          { label: "Rating promedio",    value: (agents.reduce((s, a) => s + a.rating, 0) / agents.length).toFixed(1) },
        ].map((item) => (
          <div key={item.label} className="px-5 py-4 text-center">
            <p className="font-playfair font-bold text-display-sm text-obsidian">{item.value}</p>
            <p className="text-body-xs text-obsidian-400 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
