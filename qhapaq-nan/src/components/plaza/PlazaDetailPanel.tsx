"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  MapPin,
  Mountain,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import type { PlazaPublica } from "@/types/padron";
import { Star5 } from "@/components/ui/Star5";
import { createClient } from "@/lib/supabase/client";

interface PlazaDetailPanelProps {
  plaza: PlazaPublica;
  onClose: () => void;
}

export function PlazaDetailPanel({ plaza, onClose }: PlazaDetailPanelProps) {
  const gdNum = plaza.gd.split("-")[1];
  const [adjudicando, setAdjudicando] = useState(false);
  const [adjudicada, setAdjudicada] = useState(false);
  const [adjError, setAdjError] = useState<string | null>(null);

  async function handleAdjudicar() {
    setAdjudicando(true);
    setAdjError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAdjError("Necesitas iniciar sesión para registrar tu adjudicación.");
      setAdjudicando(false);
      return;
    }
    const { error } = await supabase
      .from("plaza_seleccion")
      .upsert(
        { plaza_id: plaza.id, user_id: user.id, semestre: "2026-I", tipo: "adjudicada" },
        { onConflict: "user_id,semestre" },
      );
    if (error) {
      setAdjError("Error al registrar. Intenta de nuevo.");
    } else {
      setAdjudicada(true);
    }
    setAdjudicando(false);
  }

  return (
    // z-[1000] supera los controles de Leaflet (z-index 800) y tiles (< 500)
    <div className="qn-scroll absolute right-4 top-4 z-[1000] max-h-[calc(100%-32px)] w-[420px] animate-qn-slide-in-right overflow-y-auto rounded-2xl border border-qn-border bg-qn-paper shadow-xl">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-qn-border-soft bg-qn-paper/95 px-6 py-4 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className={`mb-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium qn-gd-${gdNum}`}>
              {plaza.gd}
            </span>
            {plaza.modalidad === "equivalente" && (
              <span className="ml-1.5 inline-block rounded bg-qn-ink/10 px-1.5 py-0.5 text-[10px] text-qn-text-muted">
                Equivalente
              </span>
            )}
            <h2 className="qn-display leading-tight text-qn-ink" style={{ fontSize: 22 }}>
              {plaza.establecimiento}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-1.5 text-qn-text-muted hover:bg-qn-soft hover:text-qn-ink"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-qn-text-muted">
          <MapPin size={13} />
          {plaza.distrito} · {plaza.provincia}, {plaza.departamento}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        {/* Rating */}
        {plaza.total_reviews > 0 && plaza.avg_rating ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-qn-soft p-3">
            <Star5 value={plaza.avg_rating} size={16} />
            <span className="text-sm font-medium text-qn-ink">
              {plaza.avg_rating.toFixed(1)}
            </span>
            <span className="text-xs text-qn-text-muted">
              ({plaza.total_reviews} {plaza.total_reviews === 1 ? "reseña" : "reseñas"})
            </span>
          </div>
        ) : (
          <div className="mb-4 rounded-xl border border-dashed border-qn-border bg-qn-warm p-3 text-xs text-qn-text-muted">
            Aún no hay reseñas. ¿Ya serviste aquí? ¡Sé el primero en reseñar!
          </div>
        )}

        {/* Datos */}
        <div className="space-y-3 text-sm">
          <DataRow label="Profesión" value={plaza.profesion_nombre} />
          <DataRow label="Plazas ofertadas" value={String(plaza.n_plazas)} />
          {plaza.categoria && <DataRow label="Categoría" value={plaza.categoria} />}
          <DataRow label="Modalidad" value={plaza.modalidad === "remunerada" ? "Remunerada" : "Equivalente"} />
          {plaza.diresa && <DataRow label="DIRESA" value={plaza.diresa} />}
          {plaza.institucion_ofertante && (
            <DataRow label="Institución" value={plaza.institucion_ofertante} />
          )}
          <DataRow label="RENIPRESS" value={plaza.renipress} />
          {plaza.presupuesto && <DataRow label="Presupuesto" value={plaza.presupuesto} />}

          {/* Bonos */}
          {(plaza.zaf || plaza.ze) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {plaza.zaf && (
                <div className="flex items-center gap-1.5 rounded-full bg-qn-terracotta/10 px-3 py-1 text-xs text-qn-terracotta-dark">
                  <Mountain size={12} />
                  Bono ZAF (zona alejada)
                </div>
              )}
              {plaza.ze && (
                <div className="flex items-center gap-1.5 rounded-full bg-qn-rust/10 px-3 py-1 text-xs text-qn-rust">
                  <ShieldAlert size={12} />
                  Bono ZE (VRAEM)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón adjudicar */}
        <div className="mt-5 border-t border-qn-border-soft pt-4">
          {adjudicada ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 size={16} />
              ¡Adjudicación registrada! Aparecerás en el mapa en vivo.
            </div>
          ) : (
            <button
              onClick={handleAdjudicar}
              disabled={adjudicando}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-qn-terracotta px-4 py-2.5 text-sm text-white hover:bg-qn-terracotta-dark disabled:opacity-60"
            >
              {adjudicando ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <CheckCircle2 size={15} />
              )}
              Me adjudiqué esta plaza
            </button>
          )}
          {adjError && (
            <p className="mt-2 text-center text-xs text-qn-rust">{adjError}</p>
          )}
          <p className="mt-2 text-center text-[10px] text-qn-text-subtle">
            Solo para el proceso SERUMS 2026-I · Actualiza el mapa en tiempo real
          </p>
        </div>

        {/* Link a página de detalle */}
        <Link
          href={`/plazas/${plaza.renipress}`}
          className="mt-3 flex items-center justify-center gap-1 rounded-full border border-qn-border py-2.5 text-sm text-qn-ink hover:bg-qn-soft"
        >
          Ver ficha completa <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-qn-border-soft pb-2 last:border-0">
      <span className="text-xs uppercase tracking-qn-wide text-qn-text-subtle">{label}</span>
      <span className="text-right text-sm text-qn-ink">{value}</span>
    </div>
  );
}
