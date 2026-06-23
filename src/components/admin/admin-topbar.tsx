"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, Bell, ExternalLink, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { AdminUser } from "./admin-shell";

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN:       "Administrador",
  AGENTE:      "Asesor",
};

const routeLabels: Record<string, string> = {
  "/admin":                        "Dashboard",
  "/admin/propiedades":            "Propiedades",
  "/admin/propiedades/nueva":      "Nueva propiedad",
  "/admin/agentes":                "Agentes",
  "/admin/agentes/nuevo":          "Nuevo agente",
  "/admin/leads":                  "Leads",
  "/admin/configuracion":          "Configuración",
};

function getInitials(name?: string | null): string {
  if (!name) return "A";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

interface AdminTopbarProps {
  user:               AdminUser;
  onMobileMenuOpen:   () => void;
}

export function AdminTopbar({ user, onMobileMenuOpen }: AdminTopbarProps) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getTitle = () => {
    if (routeLabels[pathname]) return routeLabels[pathname];
    if (pathname.includes("/propiedades/") && pathname.includes("/editar")) return "Editar propiedad";
    if (pathname.startsWith("/admin/propiedades/")) return "Editar propiedad";
    if (pathname.startsWith("/admin/agentes/"))     return "Editar agente";
    return "Panel administrativo";
  };

  const initials  = getInitials(user.name);
  const roleLabel = ROLE_LABEL[user.role ?? ""] ?? "Usuario";

  return (
    <header className="h-14 shrink-0 bg-white border-b border-obsidian-100 flex items-center px-4 lg:px-6 gap-4">

      {/* Mobile menu */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-lg text-obsidian-400 hover:bg-ivory hover:text-obsidian transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <h1 className="font-playfair font-semibold text-body-xl text-obsidian flex-1 truncate">
        {getTitle()}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* View site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-obsidian-200 text-body-xs text-obsidian-500 hover:border-obsidian hover:text-obsidian transition-all"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Ver sitio
        </Link>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-obsidian-400 hover:bg-ivory hover:text-obsidian transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-crimson ring-2 ring-white" />
        </button>

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg border transition-all",
              userMenuOpen
                ? "border-obsidian-200 bg-ivory"
                : "border-transparent hover:border-obsidian-200 hover:bg-ivory"
            )}
          >
            {/* Avatar */}
            <div className="h-7 w-7 rounded-full bg-crimson flex items-center justify-center text-white text-[11px] font-bold overflow-hidden shrink-0">
              {user.image
                ? <Image src={user.image} alt={user.name ?? ""} width={28} height={28} className="object-cover" />
                : initials
              }
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-body-xs font-medium text-obsidian leading-none">{user.name}</p>
              <p className="text-[10px] text-obsidian-400 leading-none mt-0.5">{roleLabel}</p>
            </div>
            <ChevronDown className={cn(
              "h-3.5 w-3.5 text-obsidian-400 hidden sm:block transition-transform duration-150",
              userMenuOpen && "rotate-180"
            )} />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 top-11 z-30 w-52 bg-white rounded-xl border border-obsidian-100 shadow-luxury py-1.5 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3 border-b border-obsidian-100">
                <p className="text-body-sm font-medium text-obsidian">{user.name}</p>
                <p className="text-body-xs text-obsidian-400 mt-0.5 truncate">{user.email}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-crimson/10 text-crimson">
                  {roleLabel}
                </span>
              </div>

              {/* Links */}
              <Link
                href="/admin/configuracion"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-body-sm text-obsidian hover:bg-ivory transition-colors"
              >
                <User className="h-4 w-4 text-obsidian-400" />
                Mi perfil
              </Link>
              <Link
                href="/"
                target="_blank"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-body-sm text-obsidian hover:bg-ivory transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-obsidian-400" />
                Ver {siteConfig.name}
              </Link>

              {/* Sign out */}
              <div className="border-t border-obsidian-100 mt-1 pt-1">
                <button
                  onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/login" }); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-body-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
