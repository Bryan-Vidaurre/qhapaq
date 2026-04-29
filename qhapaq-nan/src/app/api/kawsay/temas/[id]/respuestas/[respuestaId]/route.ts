import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; respuestaId: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: existing } = await supabase
    .from("kawsay_respuestas")
    .select("user_id")
    .eq("id", params.respuestaId)
    .eq("tema_id", params.id)
    .single();

  if (!existing) return NextResponse.json({ error: "Respuesta no encontrada" }, { status: 404 });
  if (existing.user_id !== user.id) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { error } = await supabase.from("kawsay_respuestas").delete().eq("id", params.respuestaId);
  if (error) return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });

  return new NextResponse(null, { status: 204 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; respuestaId: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Only the tema owner can mark a reply as accepted answer
  const { data: tema } = await supabase
    .from("kawsay_temas")
    .select("user_id")
    .eq("id", params.id)
    .single();

  if (!tema) return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });
  if (tema.user_id !== user.id) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json() as { is_answer?: boolean };
  const { error } = await supabase
    .from("kawsay_respuestas")
    .update({ is_answer: body.is_answer ?? false })
    .eq("id", params.respuestaId)
    .eq("tema_id", params.id);

  if (error) return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
