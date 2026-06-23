export const siteConfig = {
  name: "Élite Propiedades",
  tagline: "Donde el lujo encuentra su hogar",
  description:
    "Inmobiliaria premium especializada en propiedades exclusivas. Ofrecemos residencias de lujo, departamentos premium y propiedades comerciales de alto standing.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://elitepropiedades.com",
  ogImage: "/images/og-default.jpg",

  contact: {
    phone:    "+52 55 0000 0000",
    whatsapp: "+5215500000000",
    email:    "contacto@elitepropiedades.com",
    address:  "Av. Presidente Masaryk 123, Polanco, Ciudad de México, 11560",
  },

  social: {
    instagram: "https://instagram.com/elitepropiedades",
    facebook:  "https://facebook.com/elitepropiedades",
    linkedin:  "https://linkedin.com/company/elitepropiedades",
    youtube:   "https://youtube.com/@elitepropiedades",
  },

  nav: {
    main: [
      { label: "Propiedades",  href: "/propiedades" },
      { label: "En Venta",     href: "/propiedades?tipo=venta" },
      { label: "En Renta",     href: "/propiedades?tipo=renta" },
      { label: "Desarrollos",  href: "/propiedades?categoria=desarrollo" },
      { label: "Agentes",      href: "/agentes" },
      { label: "Nosotros",     href: "/nosotros" },
      { label: "Contacto",     href: "/contacto" },
    ],
  },

  propertyTypes: [
    "Casa",
    "Departamento",
    "Penthouse",
    "Villa",
    "Desarrollo",
    "Oficina",
    "Local Comercial",
    "Terreno",
  ] as const,

  amenities: [
    "Alberca",
    "Gimnasio",
    "Roof Garden",
    "Estacionamiento",
    "Bodega",
    "Seguridad 24h",
    "Concierge",
    "Spa",
    "Sala de Cine",
    "Jardín",
    "Terraza",
    "Vista al Mar",
    "Vista a la Ciudad",
    "Elevador",
    "Área de Juegos",
    "Salón de Eventos",
    "Cancha de Tenis",
    "Co-working",
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
