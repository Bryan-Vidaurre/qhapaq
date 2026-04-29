import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * GET  /api/posts/[id]/comments  — list comments (oldest first, max 100)
 * POST /api/posts/[id]/comments  — add comment
 */

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("post_comments")
    .select(`
      id,
      cuerpo,
      created_at,
      user_id,
      perfiles ( nombre_publico, avatar_url, prof_level )
    `)
    .eq("post_id", params.id)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) return NextResponse.json({ error: "Error" }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

const CommentSchema = z.object({
  cuerpo: z.string().min(1).max(1000),
});

export async function POST(
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

  const parsed = CommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Comentario inválido" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("post_comments")
    .insert({ post_id: params.id, user_id: user.id, cuerpo: parsed.data.cuerpo })
    .select("id, created_at")
    .single();

  if (error) return NextResponse.json({ error: "Error al comentar" }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
