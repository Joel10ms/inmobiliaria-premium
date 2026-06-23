import { auth }         from "@/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

type AuthResult =
  | { session: Session; error: null        }
  | { session: null;    error: NextResponse };

/**
 * Validates that the incoming request comes from a logged-in user.
 *
 * API routes under /api/admin/* are NOT covered by the middleware matcher
 * ("/admin/:path*"), so each route must call this explicitly.
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      session: null,
      error:   NextResponse.json({ error: "No autorizado." }, { status: 401 }),
    };
  }
  return { session, error: null };
}
