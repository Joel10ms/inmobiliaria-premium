import Image from "next/image";
import { Shield, TrendingUp, Users, Award, Clock, Lock } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const benefits = [
  {
    icon:  Shield,
    title: "Confidencialidad total",
    desc:  "Cada transacción se maneja con absoluta discreción. Sus datos y operaciones están completamente protegidos.",
  },
  {
    icon:  TrendingUp,
    title: "Máximo retorno de inversión",
    desc:  "Nuestros asesores identifican oportunidades únicas que maximizan el valor de cada peso invertido.",
  },
  {
    icon:  Users,
    title: "Atención 100% personalizada",
    desc:  "Un agente dedicado para usted. Sin call centers ni respuestas genéricas — solo asesoría de élite.",
  },
  {
    icon:  Award,
    title: "Portafolio ultra-exclusivo",
    desc:  "Acceso a propiedades off-market que no se publican en ninguna otra plataforma del país.",
  },
  {
    icon:  Clock,
    title: "Respuesta inmediata",
    desc:  "Disponibilidad 7 días a la semana. Su oportunidad no espera y nosotros tampoco.",
  },
  {
    icon:  Lock,
    title: "Asesoría legal y notarial",
    desc:  "Equipo jurídico interno que garantiza cero sorpresas en cada etapa del proceso de compraventa.",
  },
];

export function WhyUsSection() {
  return (
    <section className="section-padding bg-white overflow-hidden" aria-labelledby="why-us-heading">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ─── Left: Image composition ─────────────────────── */}
          <div className="relative order-2 lg:order-1">
            {/* Main image */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury-xl">
              <Image
                src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&q=85"
                alt="Interior de lujo"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent" />
            </div>

            {/* Floating accent card */}
            <div className="absolute -right-6 -bottom-6 bg-white rounded-2xl shadow-luxury p-5 border border-obsidian-100 max-w-[200px]">
              <p className="font-playfair font-bold text-display-md text-obsidian leading-none">15+</p>
              <p className="text-body-xs text-obsidian-400 mt-1">años de experiencia en el mercado de lujo</p>
              <div className="mt-3 h-0.5 w-8 bg-gold" />
            </div>

            {/* Gold border decoration */}
            <div className="absolute -top-4 -left-4 w-32 h-32 border-2 border-gold/30 rounded-3xl -z-10" />
            <div className="absolute -bottom-4 -right-12 w-48 h-24 border border-gold/20 rounded-2xl -z-10" />
          </div>

          {/* ─── Right: Content ───────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <SectionHeader
              id="why-us-heading"
              eyebrow="¿Por qué elegirnos?"
              title="La experiencia que su inversión merece"
              description="No somos una inmobiliaria más. Somos su aliado estratégico en el mercado de lujo."
              align="left"
              className="mb-10"
            />

            {/* Benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group flex gap-4 p-4 rounded-xl hover:bg-ivory transition-colors duration-200"
                >
                  {/* Icon */}
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-crimson/10 flex items-center justify-center group-hover:bg-crimson/15 transition-colors duration-200">
                    <Icon className="h-5 w-5 text-crimson" />
                  </div>

                  {/* Text */}
                  <div>
                    <h4 className="font-inter font-semibold text-body-md text-obsidian mb-1">
                      {title}
                    </h4>
                    <p className="text-body-sm text-obsidian-400 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
