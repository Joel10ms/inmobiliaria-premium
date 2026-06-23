import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function CtaSection() {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent("Hola, me gustaría agendar una visita a una propiedad de interés.")}`;

  return (
    <section className="relative overflow-hidden" aria-label="Contacto y asesoría">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85"
          alt="Propiedad de lujo"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-obsidian/85" />
      </div>

      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold z-10" />

      {/* Content */}
      <div className="relative z-10 section-padding container-luxury text-center py-24">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-7">
          <div className="h-px w-10 bg-gold" />
          <span className="text-gold text-label-sm tracking-[0.2em] uppercase">
            Comience hoy
          </span>
          <div className="h-px w-10 bg-gold" />
        </div>

        {/* Title */}
        <h2
          className="font-playfair italic font-bold text-white mb-6 max-w-3xl mx-auto"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          ¿Listo para encontrar{" "}
          <span className="text-gradient-gold not-italic">
            su propiedad ideal?
          </span>
        </h2>

        {/* Description */}
        <p className="text-white/65 text-body-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Nuestros asesores están disponibles para acompañarlo en cada paso.
          Agenda una consulta privada sin compromiso y descubra propiedades
          que no encontrará en ningún otro lado.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button variant="primary" size="xl" asChild>
            <Link href="/contacto">
              Agendar consulta privada
              <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </Button>
          <Button
            variant="gold"
            size="xl"
            asChild
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Escribir por WhatsApp
            </a>
          </Button>
        </div>

        {/* Contact info row */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-white/40 text-body-sm">
          <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-gold transition-colors">
            {siteConfig.contact.phone}
          </a>
          <span className="hidden sm:inline">·</span>
          <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-gold transition-colors">
            {siteConfig.contact.email}
          </a>
          <span className="hidden sm:inline">·</span>
          <span>{siteConfig.contact.address}</span>
        </div>
      </div>
    </section>
  );
}
