import { NextRequest, NextResponse } from "next/server";
import { requireAuth }               from "@/lib/auth-helpers";
import { getInquiries }              from "@/lib/queries/inquiries";

// ─── GET /api/admin/leads ─────────────────────────────────────────
export async function GET(_req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const rows = await getInquiries();

    // Map DB fields to the shape LeadsTable expects
    const leads = rows.map((row) => ({
      id:            row.id,
      name:          row.name,
      email:         row.email,
      phone:         row.phone ?? "",
      message:       row.message ?? "",
      status:        row.status,
      source:        row.source,
      propertyTitle: (row as any).property?.title ?? undefined,
      agentName:     (row as any).agent
        ? `${(row as any).agent.name} ${(row as any).agent.lastName}`
        : undefined,
      createdAt: row.createdAt,
      notes: ((row as any).notes ?? []).map((n: any) => ({
        id:        n.id,
        text:      n.content,   // schema uses "content"; UI expects "text"
        createdAt: n.createdAt,
      })),
    }));

    return NextResponse.json(leads);
  } catch (err) {
    console.error("[GET /api/admin/leads]", err);
    return NextResponse.json({ error: "Error al obtener leads." }, { status: 500 });
  }
}
