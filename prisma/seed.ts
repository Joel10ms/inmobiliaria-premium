import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Zones ────────────────────────────────────────────────────
  const zones = await Promise.all([
    prisma.zone.upsert({
      where:  { slug: "polanco" },
      update: {},
      create: { name: "Polanco", city: "Ciudad de México", state: "CDMX", slug: "polanco" },
    }),
    prisma.zone.upsert({
      where:  { slug: "santa-fe" },
      update: {},
      create: { name: "Santa Fe", city: "Ciudad de México", state: "CDMX", slug: "santa-fe" },
    }),
    prisma.zone.upsert({
      where:  { slug: "lomas-de-chapultepec" },
      update: {},
      create: { name: "Lomas de Chapultepec", city: "Ciudad de México", state: "CDMX", slug: "lomas-de-chapultepec" },
    }),
    prisma.zone.upsert({
      where:  { slug: "condesa" },
      update: {},
      create: { name: "Condesa", city: "Ciudad de México", state: "CDMX", slug: "condesa" },
    }),
    prisma.zone.upsert({
      where:  { slug: "roma-norte" },
      update: {},
      create: { name: "Roma Norte", city: "Ciudad de México", state: "CDMX", slug: "roma-norte" },
    }),
  ]);

  // ─── Features ─────────────────────────────────────────────────
  const featureData = [
    { name: "Alberca",          icon: "pool",         category: "amenidad"  as const },
    { name: "Gimnasio",         icon: "dumbbell",     category: "amenidad"  as const },
    { name: "Roof Garden",      icon: "building",     category: "exterior"  as const },
    { name: "Seguridad 24h",    icon: "shield",       category: "seguridad" as const },
    { name: "Concierge",        icon: "concierge",    category: "amenidad"  as const },
    { name: "Estacionamiento",  icon: "car",          category: "interior"  as const },
    { name: "Bodega",           icon: "box",          category: "interior"  as const },
    { name: "Vista a la Ciudad",icon: "eye",          category: "exterior"  as const },
    { name: "Jardín",           icon: "leaf",         category: "exterior"  as const },
    { name: "Terraza",          icon: "sun",          category: "exterior"  as const },
    { name: "Elevador",         icon: "arrow-up",     category: "amenidad"  as const },
    { name: "Sala de Cine",     icon: "film",         category: "amenidad"  as const },
  ];

  for (const feat of featureData) {
    await prisma.propertyFeature.upsert({
      where:  { name: feat.name },
      update: {},
      create: feat,
    });
  }

  // ─── Admin User ───────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Admin@1234!", 12);
  await prisma.user.upsert({
    where:  { email: "admin@elitepropiedades.com" },
    update: {},
    create: {
      email:    "admin@elitepropiedades.com",
      name:     "Administrador",
      password: hashedPassword,
      role:     "SUPER_ADMIN",
    },
  });

  // ─── Sample Agent ─────────────────────────────────────────────
  await prisma.agent.upsert({
    where:  { slug: "alejandro-garcia" },
    update: {},
    create: {
      name:      "Alejandro",
      lastName:  "García",
      email:     "alejandro@elitepropiedades.com",
      phone:     "+52 55 1234 5678",
      whatsapp:  "+525512345678",
      bio:       "Especialista en propiedades de lujo con más de 10 años de experiencia en el mercado inmobiliario premium de la Ciudad de México.",
      specialty: "Propiedades de Lujo en Polanco y Lomas",
      slug:      "alejandro-garcia",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("\n📋 Admin credentials:");
  console.log("   Email:    admin@elitepropiedades.com");
  console.log("   Password: Admin@1234!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
