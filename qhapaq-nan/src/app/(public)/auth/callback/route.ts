import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback de magic link.
 *
 * Supabase redirige aquí con un `code` query param. Lo intercambiamos
 * por una sesión y redirigimos al destino original (`next` o `/`).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const errorParam = searchParams.get("error");

  if (errorParam) {
    const url = new URL("/auth/magic-link", origin);
    url.searchParams.set("error", errorParam);
    return NextResponse.redirect(url);
  }

  if (!code) {
    return NextResponse.redirect(new URL("/auth/magic-link", origin));
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const url = new URL("/auth/magic-link", origin);
    url.searchParams.set("error", "expired");
    return NextResponse.redirect(url);
  }

  // Sanitizar el redirect: solo paths internos
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  return NextResponse.redirect(new URL(safeNext, origin));
}
