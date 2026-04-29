import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/posts
 * Parámetros opcionales:
 *   tipo     reflexion | pregunta | guia
 *   sort     reciente (default) | popular
 *   page     default 1
 *   pageSize default 20, máx 50
 */
const QuerySchema = z.object({
  tipo: z.enum(["reflexion", "pregunta", "guia"]).optional(),
  sort: z.enum(["reciente", "popular"]).default("reciente"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = QuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  const { tipo, sort, page, pageSize } = parsed.data;
  const supabase = createClient();

  // Determine if user is authenticated to include has_liked
  const { data: { user } } = await supabase.auth.getUser();

  const orderCol = sort === "popular" ? "likes_count" : "created_at";
  let query = supabase
    .from("posts_publicos")
    .select("*")
    .order(orderCol, { ascending: false });

  if (tipo) query = query.eq("tipo", tipo);

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data: posts, error } = await query;
  if (error) {
    console.error("posts GET error:", error);
    return NextResponse.json({ error: "Error al cargar posts" }, { status: 500 });
  }

  // Add has_liked field if authenticated
  let postsWithLike = posts ?? [];
  if (user && postsWithLike.length > 0) {
    const ids = postsWithLike.map((p) => p.id);
    const { data: likes } = await supabase
      .from("post_reactions")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", ids);

    const likedSet = new Set((likes ?? []).map((l) => l.post_id));
    postsWithLike = postsWithLike.map((p) => ({
      ...p,
      has_liked: likedSet.has(p.id),
      is_own: p.user_id === user.id,
    }));
  } else {
    postsWithLike = postsWithLike.map((p) => ({ ...p, has_liked: false, is_own: false }));
  }

  return NextResponse.json({ data: postsWithLike, page, pageSize });
}

/**
 * POST /api/posts
 * Body: { tipo, cuerpo, plaza_id?, ubicacion_texto?, media? }
 *
 * Regla de media:
 *   - imágenes: hasta 4, todos los usuarios autenticados
 *   - vídeo: hasta 1, solo usuarios con prof_level > autodeclarado
 */
const MediaItemSchema = z.object({
  url:  z.string().url(),
  tipo: z.enum(["imagen", "video"]),
  mime: z.string().max(50),
});

const NIVELES_VIDEO = ["estudiante", "egresado", "colegiado", "serums_activo", "perenne"] as const;

const CreateSchema = z.object({
  tipo: z.enum(["reflexion", "pregunta", "guia"]).default("reflexion"),
  cuerpo: z.string().min(10).max(5000),
  plaza_id: z.string().uuid().optional(),
  ubicacion_texto: z.string().max(200).optional(),
  media: z.array(MediaItemSchema).max(4).default([]),
});

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
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { tipo, cuerpo, plaza_id, ubicacion_texto, media } = parsed.data;

  // Validate video permission server-side
  const hasVideo = media.some((m) => m.tipo === "video");
  if (hasVideo) {
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("prof_level")
      .eq("user_id", user.id)
      .single();

    const level = perfil?.prof_level as string | null;
    if (!level || !NIVELES_VIDEO.includes(level as typeof NIVELES_VIDEO[number])) {
      return NextResponse.json(
        { error: "Videos solo disponibles para usuarios verificados" },
        { status: 403 },
      );
    }
    // Only one video allowed
    if (media.filter((m) => m.tipo === "video").length > 1) {
      return NextResponse.json({ error: "Solo se permite un vídeo por post" }, { status: 400 });
    }
    // No images when there's a video
    if (media.some((m) => m.tipo === "imagen")) {
      return NextResponse.json({ error: "No se pueden mezclar fotos y vídeo" }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, tipo, cuerpo, plaza_id, ubicacion_texto, media })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("posts POST error:", error);
    return NextResponse.json({ error: "Error al publicar" }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
