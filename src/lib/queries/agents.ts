import { db }          from "@/lib/db";
import { mockAgents }   from "@/lib/mock-data";
import type { Agent }   from "@/types";

const DB_AVAILABLE = Boolean(process.env.DATABASE_URL);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAgent(a: any): Agent {
  return {
    id:         a.id,
    name:       a.name,
    lastName:   a.lastName,
    email:      a.email,
    phone:      a.phone,
    whatsapp:   a.whatsapp   ?? undefined,
    photo:      a.photo      ?? undefined,
    bio:        a.bio        ?? undefined,
    specialty:  a.specialty  ?? undefined,
    properties: a._count?.properties ?? a.properties ?? undefined,
    slug:       a.slug,
    isActive:   a.isActive,
  };
}

export async function getAgents(): Promise<Agent[]> {
  if (!DB_AVAILABLE) return mockAgents;
  try {
    const rows = await db.agent.findMany({
      where:   { isActive: true },
      orderBy: { lastName: "asc" },
      include: { _count: { select: { properties: true } } },
    });
    return rows.map(mapAgent);
  } catch {
    return mockAgents;
  }
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  if (!DB_AVAILABLE) return mockAgents.find((a) => a.slug === slug) ?? null;
  try {
    const row = await db.agent.findUnique({
      where:   { slug },
      include: { _count: { select: { properties: true } } },
    });
    return row ? mapAgent(row) : null;
  } catch {
    return mockAgents.find((a) => a.slug === slug) ?? null;
  }
}

/** All agent slugs for sitemap */
export async function getAllAgentSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  if (!DB_AVAILABLE) {
    return mockAgents.map((a) => ({ slug: a.slug, updatedAt: new Date() }));
  }
  try {
    return await db.agent.findMany({
      where:  { isActive: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    return mockAgents.map((a) => ({ slug: a.slug, updatedAt: new Date() }));
  }
}
