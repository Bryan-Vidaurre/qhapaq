import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

/**
 * GET /api/me/export
 *
 * Derecho de acceso ARCO (Ley 29733). Devuelve todos los datos personales
 * del usuario en formato JSON portable.
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Service role para acceder a tablas con RLS estricta
  const admin = createAdminClient();

  const [
    { data: perfil },
    { data: sensibles },
    { data: verificaciones },
    { data: logros },
    { data: reviews },
  ] = await Promise.all([
    admin.from("perfiles").select("*").eq("user_id", user.id).single(),
    admin.from("perfiles_sensibles").select("*").eq("user_id", user.id).single(),
    admin.from("verificacion_solicitudes").select("*").eq("user_id", user.id),
    admin.from("logros_usuario").select("*").eq("user_id", user.id),
    admin.from("reviews").select("*").eq("user_id", user.id),
  ]);

  // Sanitizar campos cifrados sensibles antes de exportar
  const sensiblesSanitized = sensibles
    ? {
        ...sensibles,
        // Hashes y URLs internas no se exportan
        dni_hash: sensibles.dni_hash ? "[redacted]" : null,
        selfie_hash: sensibles.selfie_hash ? "[redacted]" : null,
        resolucion_url: sensibles.resolucion_url ? "[redacted-internal-url]" : null,
        diploma_url: sensibles.diploma_url ? "[redacted-internal-url]" : null,
        constancia_url: sensibles.constancia_url ? "[redacted-internal-url]" : null,
      }
    : null;

  // Auditar la exportación
  await admin.rpc("log_event", {
    p_event_type: "data_export",
    p_entity_type: "user",
    p_entity_id: user.id,
  }).then(() => {}, () => {});  // Best effort

  const payload = {
    exportado_el: new Date().toISOString(),
    aviso:
      "Este archivo contiene tus datos personales en Qhapaq Ñan, según el derecho de acceso de la Ley 29733.",
    cuenta: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at,
    },
    perfil_publico: perfil,
    perfil_sensible: sensiblesSanitized,
    solicitudes_verificacion: verificaciones,
    logros: logros,
    reseñas: reviews,
  };

  const fileName = `qhapaq-nan-mis-datos-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
