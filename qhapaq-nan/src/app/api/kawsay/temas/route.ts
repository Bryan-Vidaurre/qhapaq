import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const QuerySchema = z.object({
  categoria: z.enum([
    "consulta_clinica", "preparacion_serums", "mi_plaza",
    "derechos_sueldo", "vida_bienestar", "off_topic",
  ]).optional(),
  sort: z.enum(["reciente", "popular", "activo", "sin_respuesta"]).default("reciente"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(25),
});

const CreateSchema = z.object({
  categoria: z.enum([
    "consulta_clinica", "preparacion_serums", "mi_plaza",
    "derechos_sueldo", "vida_bienestar", "off_topic",
  ]),
  titulo: z.string().min(5).max(200),
  cuerpo: z.string().min(1).max(10000).optional(),
});

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = QuerySchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });

  const { categoria, sort, page, pageSize } = parsed.data;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const orderCol =
    sort === "popular"       ? "votes_count"   :
    sort === "activo"        ? "last_reply_at" :
    "created_at";

  let query = supabase
    .from("kawsay_temas_publicos")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order(orderCol, { ascending: false });

  if (categoria) query = query.eq("categoria", categoria);
  if (sort === "sin_respuesta") query = query.eq("replies_count", 0);

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data: temas, error } = await query;
  if (error) {
    console.error("kawsay temas GET error:", error);
    return NextResponse.json({ error: "Error al cargar temas" }, { status: 500 });
  }

  // Add has_voted if authenticated
  let result = temas ?? [];
  if (user && result.length > 0) {
    const ids = result.map((t) => t.id);
    const { data: votos } = await supabase
      .from("kawsay_votos")
      .select("tema_id")
      .eq("user_id", user.id)
      .in("tema_id", ids);
    const votedSet = new Set((votos ?? []).map((v) => v.tema_id));
    result = result.map((t) => ({ ...t, has_voted: votedSet.has(t.id), is_own: t.user_id === user.id }));
  } else {
    result = result.map((t) => ({ ...t, has_voted: false, is_own: false }));
  }

  return NextResponse.json({ data: result, page, pageSize });
}

export async function POST(request: NextRequest) {
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

  const { categoria, titulo, cuerpo } = parsed.data;
  const { data, error } = await supabase
    .from("kawsay_temas")
    .insert({ user_id: user.id, categoria, titulo, cuerpo })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("kawsay temas POST error:", error);
    return NextResponse.json({ error: "Error al publicar" }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
