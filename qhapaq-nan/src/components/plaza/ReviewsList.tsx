"use client";

import { useState, useEffect, useCallback } from "react";
import { ThumbsUp, Loader2, ChevronDown } from "lucide-react";
import { VerificationBadge } from "@/components/perfil/VerificationBadge";
import type { ProfLevel } from "@/types/user";

interface Review {
  id: string;
  user_id: string;
  semestre_servicio: string;
  rating_vivienda: number;
  rating_equipo: number;
  rating_jefatura: number;
  rating_conectividad: number;
  rating_seguridad: number;
  rating_carga: number;
  rating_general: number;
  texto: string;
  pros: string[];
  cons: string[];
  helpful_count: number;
  created_at: string;
  edited_at: string | null;
  has_marked_helpful: boolean;
  is_own: boolean;
  perfiles: {
    nombre_publico: string;
    avatar_url: string | null;
    prof_level: ProfLevel | null;
  } | null;
}

const DIMS = [
  { key: "rating_vivienda",     label: "Vivienda",      emoji: "🏠" },
  { key: "rating_equipo",       label: "Equipamiento",  emoji: "🏥" },
  { key: "rating_jefatura",     label: "Jefatura",      emoji: "👔" },
  { key: "rating_conectividad", label: "Conectividad",  emoji: "📶" },
  { key: "rating_seguridad",    label: "Seguridad",     emoji: "🛡️" },
  { key: "rating_carga",        label: "Carga laboral", emoji: "⚖️" },
] as const;

function StarDisplay({ value }: { value: number }) {
  return (
    <span className="text-sm leading-none text-qn-gold">
      {"★".repeat(Math.round(value))}{"☆".repeat(5 - Math.round(value))}
    </span>
  );
}

function RatingBar({ value }: { value: number }) {
  const pct = (value / 5) * 100;
  const color = value >= 4 ? "#2D5938" : value >= 3 ? "#D9A02D" : "#B85820";
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-qn-border">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] font-medium text-qn-text-muted">{value.toFixed(1)}</span>
    </div>
  );
}

function relTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 86400) return "hoy";
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
}

function ReviewCard({ review, onHelpful }: { review: Review; onHelpful: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const profile = review.perfiles;
  const needsExpand = review.texto.length > 250;

  return (
    <div className="rounded-2xl border border-qn-border bg-qn-paper p-5 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-qn-ink text-[10px] font-bold text-qn-gold">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" className="h-8 w-8 object-cover" />
              : (profile?.nombre_publico ?? "?").charAt(0).toUpperCase()
            }
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-qn-ink">{profile?.nombre_publico}</span>
              {profile?.prof_level && <VerificationBadge level={profile.prof_level} size="sm" showDot={false} />}
            </div>
            <div className="text-[10px] text-qn-text-subtle">
              SERUMS {review.semestre_servicio} · {relTime(review.created_at)}
              {review.edited_at && " · editado"}
            </div>
          </div>
        </div>
        {/* General rating */}
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <StarDisplay value={review.rating_general} />
          </div>
          <div className="text-xs text-qn-text-subtle">{review.rating_general.toFixed(1)}/5</div>
        </div>
      </div>

      {/* Dimension ratings */}
      <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-xl bg-qn-soft p-3 sm:grid-cols-3">
        {DIMS.map(({ key, label, emoji }) => (
          <div key={key} className="flex items-center justify-between gap-1.5">
            <span className="text-[10px] text-qn-text-muted">{emoji} {label}</span>
            <RatingBar value={review[key as keyof Review] as number} />
          </div>
        ))}
      </div>

      {/* Texto */}
      <p className={`mb-2 text-sm leading-relaxed text-qn-ink ${!expanded && needsExpand ? "line-clamp-4" : ""}`}>
        {review.texto}
      </p>
      {needsExpand && (
        <button onClick={() => setExpanded(!expanded)} className="mb-2 flex items-center gap-1 text-xs text-qn-terracotta hover:underline">
          <ChevronDown size={12} className={expanded ? "rotate-180" : ""} />
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      )}

      {/* Pros y cons */}
      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="mb-3 grid grid-cols-2 gap-3">
          {review.pros.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-green-700">Lo bueno</p>
              <ul className="space-y-0.5">
                {review.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1 text-[11px] text-qn-text-muted">
                    <span className="mt-0.5 text-green-600">+</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-red-600">Lo malo</p>
              <ul className="space-y-0.5">
                {review.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1 text-[11px] text-qn-text-muted">
                    <span className="mt-0.5 text-red-500">−</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Helpful */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onHelpful(review.id)}
          disabled={review.is_own}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors disabled:cursor-default ${
            review.has_marked_helpful
              ? "bg-qn-ink/8 text-qn-ink"
              : "text-qn-text-subtle hover:bg-qn-soft hover:text-qn-ink disabled:hover:bg-transparent"
          }`}
        >
          <ThumbsUp size={11} className={review.has_marked_helpful ? "fill-current" : ""} />
          Útil{review.helpful_count > 0 ? ` · ${review.helpful_count}` : ""}
        </button>
      </div>
    </div>
  );
}

export function ReviewsList({ renipress, refreshKey }: { renipress: string; refreshKey: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/plazas/${renipress}/reviews`)
      .then((r) => r.json())
      .then(({ data }) => setReviews(data ?? []))
      .finally(() => setLoading(false));
  }, [renipress]);

  useEffect(() => { load(); }, [load, refreshKey]);

  async function handleHelpful(reviewId: string) {
    await fetch(`/api/plazas/${renipress}/reviews/${reviewId}/helpful`, { method: "POST" });
    setReviews((prev) => prev.map((r) =>
      r.id === reviewId
        ? {
          ...r,
          has_marked_helpful: !r.has_marked_helpful,
          helpful_count: r.has_marked_helpful ? r.helpful_count - 1 : r.helpful_count + 1,
        }
        : r,
    ));
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-qn-border bg-qn-soft p-5">
            <div className="mb-3 h-4 w-1/3 rounded-full bg-qn-border" />
            <div className="mb-2 h-3 w-full rounded-full bg-qn-border" />
            <div className="h-3 w-4/5 rounded-full bg-qn-border" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-qn-border bg-qn-soft/50 p-8 text-center">
        <p className="text-sm text-qn-text-muted">Sin reseñas todavía.</p>
        <p className="mt-1 text-xs text-qn-text-subtle">Sé el primero en compartir tu experiencia.</p>
      </div>
    );
  }

  // Summary stats
  const avgGeneral = reviews.reduce((s, r) => s + r.rating_general, 0) / reviews.length;

  return (
    <div>
      {/* Summary bar */}
      <div className="mb-4 flex items-center gap-4 rounded-xl bg-qn-soft p-4">
        <div className="text-center">
          <div className="qn-display text-3xl text-qn-ink">{avgGeneral.toFixed(1)}</div>
          <StarDisplay value={avgGeneral} />
          <div className="mt-0.5 text-[10px] text-qn-text-subtle">{reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {DIMS.map(({ key, label, emoji }) => {
            const avg = reviews.reduce((s, r) => s + (r[key as keyof Review] as number), 0) / reviews.length;
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="w-28 text-[10px] text-qn-text-muted shrink-0">{emoji} {label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-qn-border">
                  <div
                    className="h-full rounded-full bg-qn-terracotta/70 transition-all"
                    style={{ width: `${(avg / 5) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-[10px] text-qn-text-muted shrink-0">{avg.toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} onHelpful={handleHelpful} />
        ))}
      </div>
    </div>
  );
}
