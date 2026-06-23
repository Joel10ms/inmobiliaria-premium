import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-obsidian text-white">
      {/* Gold accent top */}
      <div className="h-px bg-gradient-gold" />

      {/* Main footer content */}
      <div className="container-luxury section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-4">
              <span className="font-playfair italic font-bold text-2xl text-white">
                {siteConfig.name}
              </span>
              <p className="text-[10px] tracking-[0.25em] uppercase text-gold mt-0.5">
                Propiedades de lujo
              </p>
            </Link>
            <p className="text-body-sm text-white/60 leading-relaxed mb-6">
              {siteConfig.description}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { href: siteConfig.social.instagram, icon: Instagram, label: "Instagram" },
                { href: siteConfig.social.facebook,  icon: Facebook,  label: "Facebook" },
                { href: siteConfig.social.linkedin,  icon: Linkedin,  label: "LinkedIn" },
                { href: siteConfig.social.youtube,   icon: Youtube,   label: "YouTube" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg text-white/50 border border-white/10 hover:text-gold hover:border-gold/40 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Propiedades */}
          <div>
            <h4 className="font-playfair text-base font-semibold text-white mb-5">
              Propiedades
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Todas las propiedades",    href: "/propiedades" },
                { label: "En Venta",                  href: "/propiedades?listingType=VENTA" },
                { label: "En Renta",                  href: "/propiedades?listingType=RENTA" },
                { label: "Casas",                     href: "/propiedades?type=Casa" },
                { label: "Departamentos",             href: "/propiedades?type=Departamento" },
                { label: "Penthouses",                href: "/propiedades?type=Penthouse" },
                { label: "Propiedades Destacadas",    href: "/propiedades?isFeatured=true" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-white/60 hover:text-gold transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-playfair text-base font-semibold text-white mb-5">
              Empresa
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Nosotros",          href: "/nosotros" },
                { label: "Nuestros Agentes",  href: "/agentes" },
                { label: "Blog Inmobiliario", href: "/blog" },
                { label: "Trabaja con nosotros", href: "/careers" },
                { label: "Aviso de Privacidad",  href: "/privacidad" },
                { label: "Términos y Condiciones", href: "/terminos" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-white/60 hover:text-gold transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-playfair text-base font-semibold text-white mb-5">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex items-start gap-3 text-body-sm text-white/60 hover:text-gold transition-colors duration-150"
                >
                  <Phone className="h-4 w-4 shrink-0 mt-0.5 text-gold/60" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-start gap-3 text-body-sm text-white/60 hover:text-gold transition-colors duration-150"
                >
                  <Mail className="h-4 w-4 shrink-0 mt-0.5 text-gold/60" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-body-sm text-white/60">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-gold/60" />
                  {siteConfig.contact.address}
                </div>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gold/30 text-gold text-body-sm hover:bg-gold/10 transition-all duration-200 w-fit"
            >
              {/* WhatsApp icon SVG */}
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-luxury section-padding py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-body-xs text-white/40">
              © {year} {siteConfig.name}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacidad" className="text-body-xs text-white/40 hover:text-white/70 transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="text-body-xs text-white/40 hover:text-white/70 transition-colors">
                Términos
              </Link>
              <Link href="/sitemap.xml" className="text-body-xs text-white/40 hover:text-white/70 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
