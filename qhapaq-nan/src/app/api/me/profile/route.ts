"use server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  nombre_publico: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(80, "Máximo 80 caracteres")
    .trim()
    .optional(),
  bio: z.string().max(300, "Máximo 300 caracteres").trim().nullable().optional(),
  email_notifications: z.boolean().optional(),
  email_marketing: z.boolean().optional(),
});

export async function PUT(req: Request) {
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

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (parsed.data.nombre_publico !== undefined) updates.nombre_publico = parsed.data.nombre_publico;
  if (parsed.data.bio !== undefined) updates.bio = parsed.data.bio;
  if (parsed.data.email_notifications !== undefined)
    updates.email_notifications = parsed.data.email_notifications;
  if (parsed.data.email_marketing !== undefined)
    updates.email_marketing = parsed.data.email_marketing;

  const { data, error } = await supabase
    .from("perfiles")
    .update(updates)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ perfil: data });
}
