import { NextRequest, NextResponse }    from "next/server";
import { z }                            from "zod";
import { requireAuth }                  from "@/lib/auth-helpers";
import { updateProperty, deleteProperty } from "@/lib/queries/properties";
import { propertyBodySchema }           from "@/app/api/admin/properties/route";

interface Params { params: Promise<{ id: string }> }

// ─── PUT /api/admin/properties/[id] ──────────────────────────────
export async function PUT(req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const body     = await req.json();
    const data     = propertyBodySchema.parse(body);
    const property = await updateProperty(id, data);
    return NextResponse.json(property);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: err.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("[PUT /api/admin/properties/[id]]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al actualizar la propiedad." },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/admin/properties/[id] ───────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    await deleteProperty(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/admin/properties/[id]]", err);
    return NextResponse.json({ error: "Error al eliminar la propiedad." }, { status: 500 });
  }
}
