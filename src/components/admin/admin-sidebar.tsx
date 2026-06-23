"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Building2, Users, MessageSquare,
  Settings, LogOut, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { AdminUser } from "./admin-shell";

// ─── Role label map ───────────────────────────────────────────────
const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN:       "Administrador",
  AGENTE:      "Asesor",
  CLIENTE:     "Cliente",
};

// ─── Nav config ───────────────────────────────────────────────────
const navItems = [
  {
    label: "GENERAL",
    items: [
      { href: "/admin",             icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/propiedades", icon: Building2,       label: "Propiedades", badge: 6  },
      { href: "/admin/agentes",     icon: Users,           label: "Agentes",     badge: 3  },
      { href: "/admin/leads",       icon: MessageSquare,   label: "Leads",       badge: 12, badgeVariant: "crimson" as const },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      { href: "/admin/configuracion", icon: Settings, label: "Configuración" },
    ],
  },
];

function getInitials(name?: string | null): string {
  if (!name) return "A";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

interface AdminSidebarProps {
  user:          AdminUser;
  collapsed:     boolean;
  onToggle:      () => void;
  mobileOpen:    boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ user, collapsed, onToggle, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const initials  = getInitials(user.name);
  const roleLabel = ROLE_LABEL[user.role ?? ""] ?? user.role ?? "Admin";

  const handleSignOut = () => signOut({ callbackUrl: "/login" });

  const content = (
    <div className="flex flex-col h-full">

      {/* ─── Brand ───────────────────────────────────────── */}
      <div className={cn(
        "flex items-center border-b border-white/10 shrink-0",
        collapsed ? "justify-center px-3 h-16" : "justify-between px-5 h-16"
      )}>
        {!collapsed && (
          <Link href="/" target="_blank" className="flex flex-col leading-none group">
            <span className="font-playfair italic font-bold text-white text-lg group-hover:text-gold transition-colors">
              {siteConfig.name}
            </span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-gold/60 mt-0.5">
              Panel administrativo
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" target="_blank"
            className="font-playfair italic font-bold text-white text-xl hover:text-gold transition-colors">
            É
          </Link>
        )}

        <button
          onClick={onToggle}
          className="hidden lg:flex h-7 w-7 rounded-md items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all shrink-0"
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <button
          onClick={onMobileClose}
          className="lg:hidden h-7 w-7 rounded-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ─── Nav ─────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-5">
        {navItems.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold tracking-[0.15em] text-white/30 px-3 mb-2">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label, badge, badgeVariant }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-all group",
                      active
                        ? "bg-crimson text-white shadow-sm shadow-crimson/30"
                        : "text-white/60 hover:bg-white/8 hover:text-white"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-white" : "text-white/50 group-hover:text-white"
                    )} />

                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{label}</span>
                        {badge != null && (
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                            active
                              ? "bg-white/20 text-white"
                              : badgeVariant === "crimson"
                                ? "bg-crimson/80 text-white"
                                : "bg-white/10 text-white/60"
                          )}>
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ─── User footer ─────────────────────────────────── */}
      <div className={cn(
        "border-t border-white/10 p-3 shrink-0",
        collapsed && "flex flex-col items-center gap-2"
      )}>
        {collapsed ? (
          <>
            <div className="h-8 w-8 rounded-full bg-crimson flex items-center justify-center text-white text-body-xs font-bold overflow-hidden shrink-0">
              {user.image
                ? <Image src={user.image} alt={user.name ?? ""} width={32} height={32} className="object-cover" />
                : initials
              }
            </div>
            <button
              onClick={handleSignOut}
              title="Cerrar sesión"
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 px-1">
            <div className="h-8 w-8 rounded-full bg-crimson flex items-center justify-center shrink-0 text-white text-body-xs font-bold overflow-hidden">
              {user.image
                ? <Image src={user.image} alt={user.name ?? ""} width={32} height={32} className="object-cover" />
                : initials
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-xs font-medium text-white truncate">{user.name ?? "Usuario"}</p>
              <p className="text-[10px] text-white/40 truncate">{roleLabel}</p>
            </div>
            <button
              onClick={handleSignOut}
              title="Cerrar sesión"
              className="p-1.5 rounded-md text-white/30 hover:text-white hover:bg-white/10 transition-all shrink-0"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-obsidian border-r border-white/8",
        "transition-all duration-300 ease-luxury shrink-0",
        collapsed ? "w-16" : "w-60"
      )}>
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute top-0 bottom-0 left-0 w-64 bg-obsidian border-r border-white/8 flex flex-col shadow-luxury-xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
