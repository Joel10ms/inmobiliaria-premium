import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary }          from "cloudinary";
import { auth }                       from "@/auth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

/**
 * POST /api/upload
 *
 * Called by the CldUploadWidget (next-cloudinary) to get a signature
 * for a secure, server-authenticated upload.
 *
 * Body:  { paramsToSign: Record<string, string> }
 * Reply: { signature: string }
 */
export async function POST(req: NextRequest) {
  // Only authenticated users can upload
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret || !process.env.CLOUDINARY_API_KEY || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json(
      { error: "Cloudinary no está configurado en este entorno." },
      { status: 503 }
    );
  }

  try {
    const body                         = await req.json();
    const { paramsToSign }             = body as { paramsToSign: Record<string, string> };
    const signature                    = cloudinary.utils.api_sign_request(paramsToSign, secret);
    return NextResponse.json({ signature });
  } catch {
    return NextResponse.json({ error: "Error al generar firma de carga." }, { status: 500 });
  }
}
