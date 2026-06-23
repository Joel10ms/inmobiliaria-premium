import { NextRequest, NextResponse } from "next/server";
import { z }                         from "zod";
import { requireAuth }               from "@/lib/auth-helpers";
import { updatePropertyStatus }      from "@/lib/queries/properties";
import type { PropertyStatus }       from "@/types";

interface Params { params: Promise<{ id: string }> }

const VALID_STATUSES: PropertyStatus[] = [
  "ACTIVA", "EN_NEGOCIACION", "VENDIDA", "RENTADA", "PAUSADA",
];

// ─── PATCH /api/admin/properties/[id]/status ──────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id }     = await params;
  const body       = await req.json().catch(() => ({}));
  const { status } = body as { status?: string };

  if (!status || !VALID_STATUSES.includes(status as PropertyStatus)) {
    return NextResponse.json(
      { error: `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    await updatePropertyStatus(id, status as PropertyStatus);
    return NextResponse.json({ id, status });
  } catch (err) {
    console.error("[PATCH /api/admin/properties/[id]/status]", err);
    return NextResponse.json({ error: "Error al cambiar el estado." }, { status: 500 });
  }
}
