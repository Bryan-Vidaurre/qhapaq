/**
 * Seed inicial de Qhapaq Ñan.
 *
 * Carga:
 *   1. Familias profesionales (12)
 *   2. Profesiones (17 — incluye 6 sub-especialidades de Tecnología Médica)
 *   3. Padrón SERUMS 2026-I (16,018 ofertas)
 *   4. Catálogo de logros (~115)
 *
 * Uso:
 *   npm run seed
 *
 * Requiere variables de entorno:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (NO la anon key — necesita bypass de RLS)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error(
    "❌ Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en .env.local",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function loadJson<T>(filename: string): T {
  const path = join(__dirname, filename);
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

async function seedFamilias() {
  console.log("→ Cargando familias profesionales...");
  const data = loadJson<Array<{ id: string; nombre: string; orden: number }>>(
    "familias_profesionales.json",
  );
  const { error } = await supabase.from("familias_profesionales").upsert(data);
  if (error) throw error;
  console.log(`  ✓ ${data.length} familias`);
}

async function seedProfesiones() {
  console.log("→ Cargando profesiones...");
  const data = loadJson<
    Array<{ id: string; nombre: string; familia: string; orden: number }>
  >("profesiones.json");
  const { error } = await supabase.from("profesiones").upsert(data);
  if (error) throw error;
  console.log(`  ✓ ${data.length} profesiones`);
}

async function seedPadron() {
  console.log("→ Cargando padrón SERUMS 2026-I...");
  type RawPlaza = {
    institucion_ofertante: string;
    profesion: string;
    sede_adjudicacion: string;
    n_plazas: number;
    diresa: string;
    institucion: string;
    departamento: string;
    provincia: string;
    distrito: string;
    gd: string;
    renipress: string;
    establecimiento: string;
    categoria: string;
    presupuesto: string;
    zaf: boolean;
    ze: boolean;
    modalidad: "remunerada" | "equivalente";
    semestre: string;
  };

  const raw = loadJson<RawPlaza[]>("padron_2026_i.json");
  console.log(`  ${raw.length} ofertas en archivo`);

  // Mapear al schema de la DB
  const rows = raw.map((p) => ({
    semestre: p.semestre || "2026-I",
    modalidad: p.modalidad,
    institucion_ofertante: p.institucion_ofertante,
    diresa: p.diresa || null,
    institucion: p.institucion || null,
    sede_adjudicacion: p.sede_adjudicacion || null,
    presupuesto: p.presupuesto || null,
    departamento: p.departamento,
    provincia: p.provincia,
    distrito: p.distrito,
    renipress: p.renipress,
    establecimiento: p.establecimiento,
    categoria: p.categoria || null,
    profesion_id: p.profesion,
    n_plazas: p.n_plazas || 1,
    gd: p.gd,
    zaf: p.zaf,
    ze: p.ze,
  }));

  // Insertar por lotes (Supabase tiene límite por request)
  const BATCH_SIZE = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("plazas").upsert(batch, {
      onConflict: "semestre,renipress,profesion_id",
    });
    if (error) {
      console.error(`  ❌ Error en lote ${i}-${i + batch.length}:`, error.message);
      throw error;
    }
    inserted += batch.length;
    process.stdout.write(`\r  → ${inserted}/${rows.length} cargadas`);
  }
  console.log(`\n  ✓ ${inserted} ofertas en padrón`);
}

async function seedLogros() {
  console.log("→ Cargando catálogo de logros...");
  const raw = loadJson<
    Array<{
      id: string;
      nombre: string;
      descripcion: string;
      alcance: string;
      familia_profesional?: string;
      profesion_id?: string;
      evidencia: string;
      yachay: number;
      rareza: string;
      icono: string;
    }>
  >("logros.json");

  const { error } = await supabase.from("logros").upsert(raw);
  if (error) throw error;
  console.log(`  ✓ ${raw.length} logros`);

  const aspiracionales = raw.filter((l) => l.yachay === 0).length;
  const validados = raw.filter((l) => l.yachay > 0).length;
  console.log(`    ${aspiracionales} aspiracionales, ${validados} validados`);
}

async function main() {
  console.log("\n  Qhapaq Ñan — Seed inicial");
  console.log("  ──────────────────────────\n");

  try {
    await seedFamilias();
    await seedProfesiones();
    await seedPadron();
    await seedLogros();
    console.log("\n✓ Seed completado.\n");
  } catch (err) {
    console.error("\n❌ Seed falló:", err);
    process.exit(1);
  }
}

main();
