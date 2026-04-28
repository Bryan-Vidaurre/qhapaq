import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback de magic link.
 *
 * Intercambia el code por una sesión, luego:
 * - Si el perfil no tiene onboarding completado → /onboarding
 * - Si hay profesion_id en metadata y no estaba en perfil → lo guarda automáticamente
 * - Caso normal → next o /plazas
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/plazas";
  const errorParam = searchParams.get("error");

  if (errorParam) {
    return NextResponse.redirect(new URL("/auth/magic-link?error=" + errorParam, origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/auth/magic-link", origin));
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/auth/magic-link?error=expired", origin));
  }

  const user = data.session?.user;
  if (!user) {
    return NextResponse.redirect(new URL("/auth/magic-link", origin));
  }

  // Verificar si el perfil tiene onboarding completado
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("onboarding_completado, profesion_declarada_id")
    .eq("user_id", user.id)
    .single();

  // Si vienen datos de profesion en metadata y el perfil no los tiene, aplicarlos
  const metaProfesion = user.user_metadata?.profesion_id as string | undefined;
  if (metaProfesion && !perfil?.profesion_declarada_id) {
    await supabase
      .from("perfiles")
      .update({
        profesion_declarada_id: metaProfesion,
        kind: "profesional",
        prof_level: "autodeclarado",
      })
      .eq("user_id", user.id);
  }

  // Redirigir a onboarding si no lo ha completado
  if (perfil && !perfil.onboarding_completado) {
    return NextResponse.redirect(new URL("/onboarding", origin));
  }

  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/plazas";
  return NextResponse.redirect(new URL(safeNext, origin));
}
