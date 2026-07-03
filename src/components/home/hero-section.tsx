"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

// ─── Animation variants ───────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y:       0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const heroStats = [
  { value: "+500",   label: "Propiedades" },
  { value: "+1,200", label: "Clientes satisfechos" },
  { value: "15+",    label: "Años en el mercado" },
];

export function HeroSection() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={ref}
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: "100svh" }}
      aria-label="Hero principal"
    >
      {/* ─── Background image (parallax) ────────────────────── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imageY }}>
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90"
          alt="Prueba 1 2 3 4 5 6"
          fill
          priority
          fetchPriority="high"
          className="object-cover scale-110"
          sizes="100vw"
        />
      </motion.div>

      {/* ─── Gradient overlays ───────────────────────────────── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-obsidian/75 via-obsidian/40 to-obsidian/10" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-obsidian/80 via-transparent to-obsidian/30" />


      {/* ─── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 w-full container-luxury section-padding pt-32 pb-36">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex items-center gap-4 mb-7"
          >
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-label-sm tracking-[0.2em] uppercase">

            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="font-playfair italic font-bold text-white leading-[1.08] mb-6"
            style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)" }}
          >

            <br />
            <span className="not-italic text-gradient-gold">

            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="text-white/75 max-w-xl mb-10 leading-relaxed"
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}
          >
            We are an independent company dedicated to the the purchase and sale of luxury real estate
            with 22 years of experience in the Bay of Banderas. Our dedicated team will hold your hand
            not only during your transaction as we go over and beyond to serve our clients needs before
             and after a sale. Service, transparency, and integrity.. Viva Mexico!
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.45}
            className="flex flex-wrap gap-4 mb-14"
          >
            <Button variant="primary" size="xl" asChild>
              <Link href="/propiedades">
                Explorar propiedades
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="xl"
              asChild
              className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50"
            >
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent("Hola, me gustaría recibir asesoría personalizada sobre propiedades de lujo.")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Asesoría por WhatsApp
              </a>
            </Button>
          </motion.div>

          {/* Mini stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.6}
            className="flex flex-wrap gap-x-10 gap-y-4 pt-8 border-t border-white/15"
          >
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <p className="font-playfair font-bold text-white text-display-sm leading-none">
                  {stat.value}
                </p>
                <p className="text-white/55 text-body-xs mt-1 tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── Scroll indicator ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-label-sm tracking-[0.2em]">Descubrir</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4 text-gold" />
        </motion.div>
      </motion.div>

      {/* ─── Bottom property type tabs ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute bottom-0 right-0 z-10 hidden xl:flex"
      >
        <div className="flex">
          {[
            { label: "Casas",         href: "/propiedades?type=Casa" },
            { label: "Departamentos", href: "/propiedades?type=Departamento" },
            { label: "Penthouses",    href: "/propiedades?type=Penthouse" },
            { label: "Desarrollos",   href: "/propiedades?type=Desarrollo" },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-6 py-4 text-label-sm tracking-wider text-white/70
                border-l border-white/10
                hover:text-gold hover:bg-white/5
                transition-all duration-200
                ${i === 0 ? "bg-obsidian/50" : "bg-obsidian/30"}
              `}
              style={{ backdropFilter: "blur(8px)" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
