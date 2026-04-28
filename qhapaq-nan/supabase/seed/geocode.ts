/**
 * geocode.ts — Geocodifica todos los distritos únicos del padrón SERUMS
 * usando Nominatim (OpenStreetMap, sin API key).
 *
 * Lee los distritos desde padron_2026_i.json directamente (sin límites del API REST).
 * Luego actualiza la tabla plazas en Supabase con lat/lng.
 *
 * Uso:
 *   node --env-file=.env.local ./node_modules/tsx/dist/cli.mjs supabase/seed/geocode.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Faltan variables de entorno");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function nominatim(q: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=pe`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "QhapaqNan/1.0 (contact: bryan.vidaurre@unmsm.edu.pe)" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data.length || !data[0]) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch { return null; }
}

async function geocode(d: string, p: string, dep: string) {
  let c = await nominatim(`${d}, ${p}, ${dep}, Peru`);
  if (c) return c;
  await sleep(250);
  c = await nominatim(`${d}, ${dep}, Peru`);
  if (c) return c;
  await sleep(250);
  c = await nominatim(`${p}, ${dep}, Peru`);
  if (c) return c;
  await sleep(250);
  return nominatim(`${dep}, Peru`);
}

async function main() {
  console.log("📍 Geocodificando distritos del padrón SERUMS 2026-I...\n");

  // Leer todos los distritos únicos desde el JSON fuente
  const padron = JSON.parse(
    readFileSync(join(__dirname, "padron_2026_i.json"), "utf-8"),
  ) as Array<{ departamento: string; provincia: string; distrito: string }>;

  const seen = new Set<string>();
  const locations: Array<{ departamento: string; provincia: string; distrito: string }> = [];
  for (const r of padron) {
    const key = `${r.departamento}|${r.provincia}|${r.distrito}`;
    if (!seen.has(key)) {
      seen.add(key);
      locations.push({ departamento: r.departamento, provincia: r.provincia, distrito: r.distrito });
    }
  }

  console.log(`📊 ${padron.length} plazas → ${locations.length} distritos únicos a geocodificar\n`);

  const cache = new Map<string, { lat: number; lng: number } | null>();
  let success = 0, failed = 0;

  for (let i = 0; i < locations.length; i++) {
    const loc = locations[i];
    if (!loc) continue;
    const { departamento, provincia, distrito } = loc;
    const key = `${departamento}|${provincia}|${distrito}`;

    if (cache.has(key)) continue;

    const coords = await geocode(distrito, provincia, departamento);
    cache.set(key, coords);

    if (coords) {
      await supabase
        .from("plazas")
        .update({ lat: coords.lat, lng: coords.lng })
        .eq("departamento", departamento)
        .eq("provincia", provincia)
        .eq("distrito", distrito)
        .is("lat", null);
      success++;
    } else {
      failed++;
      console.warn(`\n✗ Sin resultado: ${distrito}, ${provincia}, ${departamento}`);
    }

    const pct = Math.round(((i + 1) / locations.length) * 100);
    process.stdout.write(`\r[${pct}%] ${i + 1}/${locations.length}  dist=${distrito.substring(0, 20).padEnd(20)}`);

    await sleep(220);
  }

  console.log(`\n\n✅ Listo: ${success} exitosos, ${failed} fallidos`);
}

main().catch(console.error);
