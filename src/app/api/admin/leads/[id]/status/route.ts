import { NextRequest, NextResponse } from "next/server";
import { requireAuth }               from "@/lib/auth-helpers";
import { updateInquiryStatus }       from "@/lib/queries/inquiries";
import type { Inquiry }              from "@/types";

interface Params { params: Promise<{ id: string }> }

type InquiryStatus = Inquiry["status"];
const VALID: InquiryStatus[] = [
  "NUEVO", "CONTACTADO", "EN_SEGUIMIENTO", "CERRADO", "PERDIDO",
];

// ─── PATCH /api/admin/leads/[id]/status ──────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id }     = await params;
  const body       = await req.json().catch(() => ({}));
  const { status } = body as { status?: string };

  if (!status || !VALID.includes(status as InquiryStatus)) {
    return NextResponse.json(
      { error: `Estado inválido. Valores permitidos: ${VALID.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    await updateInquiryStatus(id, status as InquiryStatus);
    return NextResponse.json({ id, status });
  } catch (err) {
    console.error("[PATCH /api/admin/leads/[id]/status]", err);
    return NextResponse.json({ error: "Error al cambiar el estado del lead." }, { status: 500 });
  }
}
