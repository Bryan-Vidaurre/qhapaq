import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const CreateSchema = z.object({
  cuerpo: z.string().min(1).max(5000),
  parent_id: z.string().uuid().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("kawsay_respuestas")
    .select(`
      id, tema_id, parent_id, cuerpo, is_answer, created_at, user_id,
      perfiles:user_id (nombre_publico, avatar_url, prof_level)
    `)
    .eq("tema_id", params.id)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("kawsay respuestas GET error:", error);
    return NextResponse.json({ error: "Error al cargar respuestas" }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

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

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
  }

  const { cuerpo, parent_id } = parsed.data;
  const { data, error } = await supabase
    .from("kawsay_respuestas")
    .insert({ tema_id: params.id, user_id: user.id, cuerpo, parent_id: parent_id ?? null })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("kawsay respuestas POST error:", error);
    return NextResponse.json({ error: "Error al responder" }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
