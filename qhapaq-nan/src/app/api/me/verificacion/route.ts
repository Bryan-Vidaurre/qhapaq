import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  nivel_solicitado: z.enum([
    "autodeclarado",
    "estudiante",
    "egresado",
    "colegiado",
    "serums_activo",
    "perenne",
  ]),
  documentos: z
    .array(
      z.object({
        tipo: z.string(),
        url: z.string().url().optional(),
        descripcion: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
  datos_declarados: z
    .object({
      colegio_numero: z.string().optional(),
      universidad: z.string().optional(),
      ano_egreso: z.number().optional(),
      plaza_codigo: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 422 },
    );
  }

  // Verificar que no haya una solicitud pendiente/en revisión activa
  const { data: activa } = await supabase
    .from("verificacion_solicitudes")
    .select("id, status")
    .eq("user_id", user.id)
    .in("status", ["pendiente", "en_revision"])
    .limit(1)
    .single();

  if (activa) {
    return NextResponse.json(
      { error: "Ya tienes una solicitud en revisión. Espera a que sea procesada." },
      { status: 409 },
    );
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("verificacion_solicitudes")
    .insert({
      user_id: user.id,
      nivel_solicitado: parsed.data.nivel_solicitado,
      documentos: parsed.data.documentos,
      datos_extraidos: parsed.data.datos_declarados ?? null,
      status: "pendiente",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ solicitud: data }, { status: 201 });
}

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("verificacion_solicitudes")
    .select("id, nivel_solicitado, status, notas_publicas, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ solicitudes: data });
}
