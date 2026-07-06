import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * Guard for admin API routes. Returns the session on success, or a
 * ready-to-return 401 NextResponse when the caller isn't authenticated.
 *
 *   const auth = await requireAdmin();
 *   if (auth instanceof NextResponse) return auth;
 *   // ...use auth.user
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}
