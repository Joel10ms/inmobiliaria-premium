import type { Metadata } from "next";
import Image             from "next/image";
import Link              from "next/link";
import { Suspense }      from "react";
import { LoginForm }     from "@/components/auth/login-form";
import { siteConfig }    from "@/config/site";

export const metadata: Metadata = {
  title: "Iniciar sesión | Panel administrativo",
  robots: { index: false, follow: false },
};

// ─── Left decorative panel ────────────────────────────────────────
function HeroPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-[58%] xl:w-[60%] flex-col overflow-hidden bg-obsidian">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1400&q=85"
        alt="Propiedad de lujo"
        fill
        className="object-cover opacity-50"
        priority
        sizes="60vw"
      />

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-obsidian/80 via-obsidian/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-70" />

      {/* Gold vertical accent */}
      <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-12 xl:p-16">
        {/* Top: logo */}
        <Link href="/" className="flex items-center gap-3 group w-fit">
          <div className="h-8 w-8 rounded-lg bg-crimson flex items-center justify-center shrink-0">
            <span className="font-playfair italic font-bold text-white text-sm">É</span>
          </div>
          <span className="font-playfair italic font-bold text-white text-xl group-hover:text-gold transition-colors">
            {siteConfig.name}
          </span>
        </Link>

        {/* Center: tagline */}
        <div className="flex-1 flex flex-col justify-center max-w-md">
          <div className="w-12 h-px bg-gold mb-8" />
          <h1 className="font-playfair font-bold text-display-md text-white leading-tight mb-5">
            El portal de gestión para propiedades de lujo
          </h1>
          <p className="text-body-md text-white/60 leading-relaxed">
            Administra tu portafolio exclusivo, da seguimiento a leads y gestiona a tu equipo desde un solo lugar.
          </p>
        </div>

        {/* Bottom: stats */}
        <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
          {[
            { value: "24",    label: "Propiedades activas" },
            { value: "47",    label: "Leads este mes" },
            { value: "$2.5B", label: "Portafolio MXN" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-playfair font-bold text-display-sm text-white">{s.value}</p>
              <p className="text-body-xs text-white/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <HeroPanel />

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col min-h-screen bg-ivory">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 p-6 border-b border-obsidian-100">
          <div className="h-8 w-8 rounded-lg bg-crimson flex items-center justify-center shrink-0">
            <span className="font-playfair italic font-bold text-white text-sm">É</span>
          </div>
          <span className="font-playfair italic font-bold text-obsidian text-xl">
            {siteConfig.name}
          </span>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[380px]">

            {/* Heading */}
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-[0.15em] text-crimson uppercase mb-3">
                Panel administrativo
              </p>
              <h2 className="font-playfair font-bold text-display-sm text-obsidian leading-tight">
                Bienvenido de vuelta
              </h2>
              <p className="text-sm text-obsidian-400 mt-2">
                Ingresa tus credenciales para continuar.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-obsidian-100" />
              <div className="h-1 w-1 rounded-full bg-gold" />
              <div className="flex-1 h-px bg-obsidian-100" />
            </div>

            {/* Form (Suspense required for useSearchParams) */}
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-obsidian-100 flex items-center justify-between text-xs text-obsidian-300">
          <span>© {new Date().getFullYear()} {siteConfig.name}</span>
          <Link href="/" className="hover:text-obsidian transition-colors">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
