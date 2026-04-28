import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  reason: z.string().max(500).nullable().optional(),
});

/**
 * POST /api/me/delete
 *
 * Solicitud de eliminación de cuenta (derecho de cancelación ARCO).
 * Crea registro en `account_deletions` con 30 días de gracia.
 * Un cron procesa los registros vencidos para hacer el delete físico.
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const admin = createAdminClient();

  // ¿Ya hay una solicitud activa?
  const { data: existing } = await admin
    .from("account_deletions")
    .select("id")
    .eq("user_id", user.id)
    .is("completed_at", null)
    .is("cancelled_at", null)
    .limit(1)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Ya tienes una solicitud de eliminación activa." },
      { status: 409 },
    );
  }

  const scheduledFor = new Date();
  scheduledFor.setDate(scheduledFor.getDate() + 30);

  const { error } = await admin.from("account_deletions").insert({
    user_id: user.id,
    scheduled_for: scheduledFor.toISOString(),
    reason: parsed.data.reason || null,
  });

  if (error) {
    console.error("delete request error:", error);
    return NextResponse.json({ error: "Error al procesar solicitud" }, { status: 500 });
  }

  // Auditar
  await admin
    .rpc("log_event", {
      p_event_type: "account_deletion_requested",
      p_entity_type: "user",
      p_entity_id: user.id,
    })
    .then(
      () => {},
      () => {},
    );

  return NextResponse.json({
    ok: true,
    scheduled_for: scheduledFor.toISOString(),
  });
}
