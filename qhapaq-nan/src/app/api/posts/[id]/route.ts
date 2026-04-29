import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const EditSchema = z.object({
  cuerpo: z.string().min(10).max(5000),
  ubicacion_texto: z.string().max(200).nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = EditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
  }

  const { cuerpo, ubicacion_texto } = parsed.data;

  const { data: existing } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", params.id)
    .single();

  if (!existing) return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
  if (existing.user_id !== user.id) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { data, error } = await supabase
    .from("posts")
    .update({
      cuerpo,
      ubicacion_texto: ubicacion_texto ?? null,
      edited_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select("cuerpo, ubicacion_texto, edited_at")
    .single();

  if (error) {
    console.error("posts PATCH error:", error);
    return NextResponse.json({ error: "Error al editar" }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: existing } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", params.id)
    .single();

  if (!existing) return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
  if (existing.user_id !== user.id) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { error } = await supabase.from("posts").delete().eq("id", params.id);
  if (error) {
    console.error("posts DELETE error:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
