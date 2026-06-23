"use client";

import * as React from "react";
import { useInView } from "framer-motion";

interface Stat {
  value:    string;
  suffix?:  string;
  label:    string;
  description: string;
}

const stats: Stat[] = [
  {
    value:       "500",
    suffix:      "+",
    label:       "Propiedades en cartera",
    description: "Entre casas, departamentos, penthouses y desarrollos exclusivos",
  },
  {
    value:       "1,200",
    suffix:      "+",
    label:       "Clientes satisfechos",
    description: "Familias y empresarios que confiaron en nosotros para su inversión",
  },
  {
    value:       "$50B",
    suffix:      "",
    label:       "MXN en transacciones",
    description: "Volumen total de operaciones cerradas desde nuestra fundación",
  },
  {
    value:       "15",
    suffix:      "+",
    label:       "Años en el mercado",
    description: "Trayectoria en el segmento inmobiliario premium de México",
  },
];

// Simple number animation with IntersectionObserver
function AnimatedStat({ stat, delay = 0 }: { stat: Stat; delay?: number }) {
  const ref     = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [isInView, delay]);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      {/* Gold top accent */}
      <div className="w-8 h-0.5 bg-gold mb-6" />

      {/* Number */}
      <p className="font-playfair font-bold text-white leading-none mb-3"
         style={{ fontSize: "clamp(2.5rem, 4vw, 3.75rem)" }}>
        {stat.value}
        <span className="text-gold">{stat.suffix}</span>
      </p>

      {/* Label */}
      <p className="text-label-lg text-white tracking-wide mb-2">
        {stat.label}
      </p>

      {/* Description */}
      <p className="text-body-sm text-white/50 leading-relaxed">
        {stat.description}
      </p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="bg-obsidian section-padding relative overflow-hidden" aria-label="Estadísticas">
      {/* Decorative gold circle */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #C9A86A 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, #960018 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="container-luxury relative z-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px w-8 bg-gold" />
          <span className="text-gold text-label-sm tracking-[0.2em] uppercase">
            Trayectoria en números
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {stats.map((stat, i) => (
            <AnimatedStat key={stat.label} stat={stat} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
