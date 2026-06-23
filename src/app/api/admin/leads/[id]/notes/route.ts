import { NextRequest, NextResponse } from "next/server";
import { z }                         from "zod";
import { requireAuth }               from "@/lib/auth-helpers";
import { addInquiryNote }            from "@/lib/queries/inquiries";

interface Params { params: Promise<{ id: string }> }

const noteSchema = z.object({
  text: z.string().min(1).max(2000),
});

// ─── POST /api/admin/leads/[id]/notes ────────────────────────────
export async function POST(req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const body       = await req.json();
    const { text }   = noteSchema.parse(body);
    const note       = await addInquiryNote(id, text);
    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: err.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("[POST /api/admin/leads/[id]/notes]", err);
    return NextResponse.json({ error: "Error al agregar la nota." }, { status: 500 });
  }
}
