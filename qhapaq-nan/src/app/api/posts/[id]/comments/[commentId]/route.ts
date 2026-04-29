import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; commentId: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: existing } = await supabase
    .from("post_comments")
    .select("user_id")
    .eq("id", params.commentId)
    .eq("post_id", params.id)
    .single();

  if (!existing) return NextResponse.json({ error: "Comentario no encontrado" }, { status: 404 });
  if (existing.user_id !== user.id) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { error } = await supabase
    .from("post_comments")
    .delete()
    .eq("id", params.commentId);

  if (error) {
    console.error("comment DELETE error:", error);
    return NextResponse.json({ error: "Error al eliminar comentario" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
