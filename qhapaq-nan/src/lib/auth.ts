import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Perfil } from "@/types/user";

/**
 * Devuelve el usuario autenticado o redirige a login.
 * Usar en Server Components que requieren sesión.
 */
export async function requireAuth() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/magic-link");
  }

  return user;
}

/**
 * Devuelve el perfil del usuario autenticado o null si no hay sesión.
 */
export async function getProfile(): Promise<Perfil | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return perfil as Perfil | null;
}

/**
 * Helper para verificar permisos según el modelo de cuenta.
 */
export function hasPermission(
  perfil: Perfil | null,
  action: "review" | "sell" | "moderate" | "validate_peers",
): boolean {
  if (!perfil || perfil.is_suspended) return false;

  switch (action) {
    case "review":
      return perfil.prof_level === "serums_activo" || perfil.prof_level === "perenne";
    case "sell":
      return (
        perfil.kind === "profesional" &&
        perfil.prof_level !== null &&
        perfil.prof_level !== "autodeclarado"
      );
    case "moderate":
      return perfil.prof_level === "perenne";
    case "validate_peers":
      return (
        perfil.prof_level === "colegiado" ||
        perfil.prof_level === "serums_activo" ||
        perfil.prof_level === "perenne"
      );
    default:
      return false;
  }
}
