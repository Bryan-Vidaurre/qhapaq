import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tema, error } = await supabase
    .from("kawsay_temas_publicos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !tema) return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });

  let hasVoted = false;
  if (user) {
    const { data } = await supabase
      .from("kawsay_votos")
      .select("tema_id")
      .eq("tema_id", params.id)
      .eq("user_id", user.id)
      .maybeSingle();
    hasVoted = !!data;
  }

  return NextResponse.json({
    data: { ...tema, has_voted: hasVoted, is_own: user ? tema.user_id === user.id : false },
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: existing } = await supabase
    .from("kawsay_temas").select("user_id").eq("id", params.id).single();

  if (!existing) return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });
  if (existing.user_id !== user.id) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { error } = await supabase.from("kawsay_temas").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });

  return new NextResponse(null, { status: 204 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: existing } = await supabase
    .from("kawsay_temas").select("user_id").eq("id", params.id).single();

  if (!existing) return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 });
  if (existing.user_id !== user.id) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json() as { is_solved?: boolean };
  const { error } = await supabase
    .from("kawsay_temas")
    .update({ is_solved: body.is_solved ?? false })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
