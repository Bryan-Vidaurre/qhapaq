import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Building2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Star5 } from "@/components/ui/Star5";
import { createClient } from "@/lib/supabase/server";
import type { PlazaPublica } from "@/types/padron";

interface PageProps {
  params: { renipress: string };
}

export async function generateMetadata({ params }: PageProps) {
  const supabase = createClient();
  const { data } = await supabase
    .from("plazas_publicas")
    .select("establecimiento, distrito, provincia, departamento")
    .eq("renipress", params.renipress)
    .limit(1)
    .single();

  if (!data) return { title: "Plaza no encontrada" };

  return {
    title: `${data.establecimiento} · SERUMS`,
    description: `Plaza SERUMS en ${data.establecimiento}, ${data.distrito}, ${data.provincia}, ${data.departamento}.`,
  };
}

export default async function PlazaDetailPage({ params }: PageProps) {
  const supabase = createClient();

  const { data: plazas } = await supabase
    .from("plazas_publicas")
    .select("*")
    .eq("renipress", params.renipress);

  if (!plazas || plazas.length === 0) notFound();

  const principal = plazas[0] as PlazaPublica;
  const totalPlazas = plazas.reduce((sum, p) => sum + (p as PlazaPublica).n_plazas, 0);

  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/plazas"
          className="mb-6 inline-flex items-center gap-2 text-sm text-qn-text-muted hover:text-qn-ink"
        >
          <ArrowLeft size={14} /> Volver al mapa
        </Link>

        <div className="rounded-2xl border border-qn-border bg-qn-paper p-8">
          <div className="mb-6">
            <div className="mb-2 text-[10px] uppercase tracking-qn-extra text-qn-text-subtle">
              RENIPRESS · {principal.renipress}
            </div>
            <h1 className="qn-display mb-3 leading-tight text-qn-ink" style={{ fontSize: 36 }}>
              {principal.establecimiento}
            </h1>
            <div className="flex items-center gap-2 text-sm text-qn-text-muted">
              <MapPin size={14} />
              {principal.distrito}, {principal.provincia}, {principal.departamento}
            </div>
          </div>

          {/* Datos generales */}
          <div className="grid grid-cols-2 gap-4 border-y border-qn-border-soft py-6">
            <Stat label="Plazas en este centro" value={String(totalPlazas)} />
            <Stat label="Profesiones requeridas" value={String(plazas.length)} />
            <Stat label="Categoría" value={principal.categoria ?? "—"} />
            <Stat label="Modalidad" value={principal.modalidad} />
          </div>

          {/* Lista de profesiones ofertadas */}
          <div className="mt-6">
            <h2 className="qn-display mb-4 text-qn-ink" style={{ fontSize: 20 }}>
              Plazas ofertadas
            </h2>
            <div className="space-y-2">
              {plazas.map((p) => {
                const plaza = p as PlazaPublica;
                const gdNum = plaza.gd.split("-")[1];
                return (
                  <div
                    key={plaza.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-qn-border-soft bg-qn-soft px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-qn-ink">{plaza.profesion_nombre}</div>
                      <div className="mt-1 text-xs text-qn-text-muted">
                        {plaza.n_plazas} {plaza.n_plazas === 1 ? "plaza" : "plazas"} ·{" "}
                        {plaza.modalidad}
                        {plaza.zaf && " · ZAF"}
                        {plaza.ze && " · VRAEM"}
                      </div>
                    </div>
                    <span className={`rounded px-2 py-1 text-xs qn-gd-${gdNum}`}>{plaza.gd}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reseñas — placeholder en v0.1 */}
          {principal.total_reviews > 0 && principal.avg_rating ? (
            <div className="mt-6 rounded-xl bg-qn-soft p-5">
              <div className="flex items-center gap-2">
                <Star5 value={principal.avg_rating} size={16} />
                <span className="text-sm font-medium text-qn-ink">
                  {principal.avg_rating.toFixed(1)}
                </span>
                <span className="text-xs text-qn-text-muted">
                  ({principal.total_reviews}{" "}
                  {principal.total_reviews === 1 ? "reseña" : "reseñas"})
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-qn-border bg-qn-warm p-5 text-sm text-qn-text-muted">
              Aún no hay reseñas verificadas para este establecimiento. El sistema de reseñas
              entra en v0.2.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-qn-wide text-qn-text-subtle">{label}</div>
      <div className="mt-1 text-sm text-qn-ink">{value}</div>
    </div>
  );
}
