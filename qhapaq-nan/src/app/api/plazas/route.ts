import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/plazas
 *
 * Parámetros (todos opcionales):
 *   q          texto libre (FTS sobre establecimiento + ubicación + profesión)
 *   profesion  ID exacto de profesión
 *   familia    ID de familia profesional
 *   gd         GD-1..GD-5
 *   zaf        true/false
 *   ze         true/false
 *   modalidad  remunerada/equivalente
 *   departamento, provincia, distrito
 *   semestre   default '2026-I'
 *   bbox       'south,west,north,east' para filtrar por viewport del mapa
 *   page       default 1
 *   pageSize   default 50, máx 200
 */

const QuerySchema = z.object({
  q: z.string().max(200).optional(),
  profesion: z.string().max(80).optional(),
  familia: z.string().max(80).optional(),
  gd: z.enum(["GD-1", "GD-2", "GD-3", "GD-4", "GD-5"]).optional(),
  zaf: z.preprocess((v) => v === "true", z.boolean()).optional(),
  ze: z.preprocess((v) => v === "true", z.boolean()).optional(),
  modalidad: z.enum(["remunerada", "equivalente"]).optional(),
  departamento: z.string().max(80).optional(),
  provincia: z.string().max(80).optional(),
  distrito: z.string().max(80).optional(),
  semestre: z.string().max(20).default("2026-I"),
  bbox: z
    .string()
    .regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/)
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
});

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = QuerySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parámetros inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const f = parsed.data;
  const supabase = createClient();

  let query = supabase
    .from("plazas_publicas")
    .select("*", { count: "exact" })
    .eq("semestre", f.semestre);

  if (f.profesion) query = query.eq("profesion_id", f.profesion);
  if (f.familia) query = query.eq("profesion_familia", f.familia);
  if (f.gd) query = query.eq("gd", f.gd);
  if (f.modalidad) query = query.eq("modalidad", f.modalidad);
  if (f.zaf !== undefined) query = query.eq("zaf", f.zaf);
  if (f.ze !== undefined) query = query.eq("ze", f.ze);
  if (f.departamento) query = query.eq("departamento", f.departamento);
  if (f.provincia) query = query.eq("provincia", f.provincia);
  if (f.distrito) query = query.eq("distrito", f.distrito);

  // Búsqueda full-text
  if (f.q) {
    // websearch_to_tsquery acepta sintaxis natural ("ayabaca alta")
    query = query.textSearch("search_vector", f.q, {
      config: "spanish",
      type: "websearch",
    });
  }

  // Bounding box (mapa)
  if (f.bbox) {
    const [s, w, n, e] = f.bbox.split(",").map(Number) as [number, number, number, number];
    query = query
      .gte("lat", s)
      .lte("lat", n)
      .gte("lng", w)
      .lte("lng", e);
  }

  // Paginación
  const from = (f.page - 1) * f.pageSize;
  const to = from + f.pageSize - 1;
  query = query.range(from, to).order("renipress");

  const { data, error, count } = await query;

  if (error) {
    console.error("plazas query error:", error);
    return NextResponse.json({ error: "Error al consultar plazas" }, { status: 500 });
  }

  return NextResponse.json(
    {
      data,
      pagination: {
        page: f.page,
        pageSize: f.pageSize,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / f.pageSize),
      },
    },
    {
      headers: {
        // Cache moderado — el padrón cambia 2 veces al año
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
