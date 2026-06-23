import { NextRequest, NextResponse } from "next/server";
import { ZodError }                  from "zod";
import { inquirySchema }             from "@/lib/validations";
import { createInquiry }             from "@/lib/queries/inquiries";
import { notifyNewInquiry }          from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = inquirySchema.parse(body);

    const { id } = await createInquiry({
      name:       data.name,
      email:      data.email,
      phone:      data.phone,
      message:    data.message,
      propertyId: data.propertyId,
      source:     "WEB",
    });

    // Fire-and-forget: notification never delays the response
    notifyNewInquiry({
      id:    id,
      name:  data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    }).catch((e) => console.error("[inquiry notify]", e));

    return NextResponse.json(
      { success: true, id, message: "Consulta enviada correctamente." },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos.", details: err.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("[Inquiry error]", err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
