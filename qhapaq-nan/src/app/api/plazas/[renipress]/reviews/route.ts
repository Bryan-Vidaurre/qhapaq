import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const CreateSchema = z.object({
  semestre_servicio: z.string().regex(/^\d{4}-[I|II]+$/, "Formato: YYYY-I o YYYY-II"),
  rating_vivienda:    z.number().int().min(1).max(5),
  rating_equipo:      z.number().int().min(1).max(5),
  rating_jefatura:    z.number().int().min(1).max(5),
  rating_conectividad: z.number().int().min(1).max(5),
  rating_seguridad:   z.number().int().min(1).max(5),
  rating_carga:       z.number().int().min(1).max(5),
  texto: z.string().min(50).max(4000),
  pros: z.array(z.string().max(200)).max(5).default([]),
  cons: z.array(z.string().max(200)).max(5).default([]),
  conflicto_declarado: z.string().max(500).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { renipress: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get plaza IDs for this RENIPRESS
  const { data: plazas } = await supabase
    .from("plazas")
    .select("id")
    .eq("renipress", params.renipress);

  if (!plazas || plazas.length === 0) {
    return NextResponse.json({ data: [] });
  }

  const plazaIds = plazas.map((p) => p.id);

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`
      id, plaza_id, semestre_servicio,
      rating_vivienda, rating_equipo, rating_jefatura,
      rating_conectividad, rating_seguridad, rating_carga, rating_general,
      texto, pros, cons, conflicto_declarado,
      helpful_count, edited_at, created_at, user_id,
      perfiles:user_id (nombre_publico, avatar_url, prof_level)
    `)
    .in("plaza_id", plazaIds)
    .eq("status", "visible")
    .order("helpful_count", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("reviews GET error:", error);
    return NextResponse.json({ error: "Error al cargar reseñas" }, { status: 500 });
  }

  // Add has_marked_helpful and is_own for authenticated users
  let result = reviews ?? [];
  if (user && result.length > 0) {
    const ids = result.map((r) => r.id);
    const { data: helpful } = await supabase
      .from("review_helpful")
      .select("review_id")
      .eq("user_id", user.id)
      .in("review_id", ids);

    const helpfulSet = new Set((helpful ?? []).map((h) => h.review_id));
    result = result.map((r) => ({
      ...r,
      has_marked_helpful: helpfulSet.has(r.id),
      is_own: r.user_id === user.id,
    }));
  } else {
    result = result.map((r) => ({ ...r, has_marked_helpful: false, is_own: false }));
  }

  return NextResponse.json({ data: result });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { renipress: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Check permission
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("prof_level")
    .eq("user_id", user.id)
    .single();

  if (!perfil || !["serums_activo", "perenne"].includes(perfil.prof_level ?? "")) {
    return NextResponse.json(
      { error: "Solo serumistas activos o graduados pueden escribir reseñas" },
      { status: 403 },
    );
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
  }

  // Find plaza UUID for this RENIPRESS
  const { data: plazas } = await supabase
    .from("plazas")
    .select("id")
    .eq("renipress", params.renipress)
    .limit(1)
    .single();

  if (!plazas) return NextResponse.json({ error: "Establecimiento no encontrado" }, { status: 404 });

  const { semestre_servicio, rating_vivienda, rating_equipo, rating_jefatura,
    rating_conectividad, rating_seguridad, rating_carga,
    texto, pros, cons, conflicto_declarado } = parsed.data;

  // Calculate weighted average
  const dims = [rating_vivienda, rating_equipo, rating_jefatura, rating_conectividad, rating_seguridad, rating_carga];
  const rating_general = Number((dims.reduce((a, b) => a + b, 0) / dims.length).toFixed(2));

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      user_id: user.id,
      plaza_id: plazas.id,
      semestre_servicio,
      rating_vivienda, rating_equipo, rating_jefatura,
      rating_conectividad, rating_seguridad, rating_carga,
      rating_general,
      texto,
      pros: pros.filter(Boolean),
      cons: cons.filter(Boolean),
      conflicto_declarado: conflicto_declarado ?? null,
    })
    .select("id, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ya tienes una reseña para este establecimiento" }, { status: 409 });
    }
    console.error("review POST error:", error);
    return NextResponse.json({ error: "Error al publicar reseña" }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
