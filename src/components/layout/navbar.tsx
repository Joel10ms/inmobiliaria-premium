"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen]         = React.useState(false);
  const [scrolled, setScrolled]     = React.useState(false);
  const [propertiesOpen, setPropertiesOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => { setIsOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white border-b border-obsidian-100"
            : "bg-transparent"
        )}
      >
        <div className="container-luxury px-6 md:px-10 lg:px-16 py-0">
          <div className={cn(
            "flex items-center justify-between transition-all duration-300",
            scrolled ? "h-[4.5rem]" : "h-[5.2rem]"
          )}>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label={siteConfig.name}
            >
              <span
                className={cn(
                  "font-playfair italic font-bold tracking-tight transition-colors duration-300 text-2xl",
                  scrolled ? "text-obsidian" : "text-white"
                )}
              >
                {siteConfig.name}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Propiedades dropdown */}
              <div className="relative group">
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5",
                    "text-label-sm transition-colors duration-200",
                    scrolled
                      ? "text-obsidian hover:text-crimson"
                      : "text-white/90 hover:text-white",
                    pathname.startsWith("/propiedades") &&
                      (scrolled ? "text-crimson" : "text-white font-semibold")
                  )}
                  onMouseEnter={() => setPropertiesOpen(true)}
                  onMouseLeave={() => setPropertiesOpen(false)}
                >
                  Propiedades
                  <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Dropdown */}
                <div
                  className={cn(
                    "absolute top-full left-0 pt-2 transition-all duration-200",
                    propertiesOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                  )}
                  onMouseEnter={() => setPropertiesOpen(true)}
                  onMouseLeave={() => setPropertiesOpen(false)}
                >
                  <div className="bg-white rounded-xl shadow-luxury border border-obsidian-100 p-1 min-w-[200px]">
                    {[
                      { label: "Todas las propiedades", href: "/propiedades" },
                      { label: "En Venta",              href: "/propiedades?listingType=VENTA" },
                      { label: "En Renta",              href: "/propiedades?listingType=RENTA" },
                      { label: "Destacadas",            href: "/propiedades?isFeatured=true" },
                      { label: "Desarrollos",           href: "/propiedades?type=Desarrollo" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-1.5 rounded-lg text-body-sm",
                          "text-obsidian hover:text-crimson",
                          "transition-colors duration-150"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Other links */}
              {[
                { label: "Agentes",  href: "/agentes" },
                { label: "Nosotros", href: "/nosotros" },
                { label: "Contacto", href: "/contacto" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-label-sm transition-colors duration-200",
                    scrolled
                      ? "text-obsidian hover:text-crimson"
                      : "text-white/90 hover:text-white",
                    isActive(item.href) &&
                      (scrolled ? "text-crimson font-semibold" : "text-white font-semibold")
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="primary" size="sm" asChild>
                <Link href="/contacto">Agendar visita</Link>
              </Button>
            </div>

            {/* Mobile burger */}
            <button
              className={cn(
                "lg:hidden p-2 rounded-md transition-colors",
                scrolled ? "text-obsidian hover:bg-ivory-200" : "text-white hover:bg-white/10"
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menú"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          isOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-obsidian/70 backdrop-blur-sm transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-72 bg-white shadow-luxury-xl",
            "transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Logo in drawer */}
          <div className="p-6 border-b border-obsidian-100">
            <Link href="/" className="block">
              <span className="font-playfair italic font-bold text-xl text-obsidian">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          {/* Links */}
          <nav className="p-4 flex flex-col gap-1">
            {[
              { label: "Inicio",         href: "/" },
              { label: "Propiedades",    href: "/propiedades" },
              { label: "En Venta",       href: "/propiedades?listingType=VENTA" },
              { label: "En Renta",       href: "/propiedades?listingType=RENTA" },
              { label: "Agentes",        href: "/agentes" },
              { label: "Nosotros",       href: "/nosotros" },
              { label: "Contacto",       href: "/contacto" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-3 rounded-lg text-body-md",
                  "transition-colors duration-150",
                  isActive(item.href)
                    ? "bg-crimson/10 text-crimson font-semibold"
                    : "text-obsidian hover:bg-ivory-200 hover:text-crimson"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Mobile */}
          <div className="p-4 mt-auto border-t border-obsidian-100">
            <Button variant="primary" size="lg" className="w-full" asChild>
              <Link href="/contacto">Agendar visita</Link>
            </Button>
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center justify-center gap-2 mt-3 text-body-sm text-obsidian-400 hover:text-crimson transition-colors"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
