"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { VerificationBadge } from "@/components/perfil/VerificationBadge";
import {
  ArrowLeft, ChevronRight, Shield, GraduationCap, Award,
  BookOpen, Stethoscope, Star, Loader2, CheckCircle2, Clock, XCircle,
} from "lucide-react";
import type { Perfil, ProfLevel } from "@/types/user";

const LEVELS: Array<{
  level: ProfLevel;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  what_you_need: string;
  unlocks: string[];
}> = [
  {
    level: "autodeclarado",
    icon: <Shield size={20} />,
    title: "Autodeclarado",
    subtitle: "Punto de partida. Declaraste tu profesión sin evidencia.",
    what_you_need: "Solo crear tu cuenta.",
    unlocks: ["Explorar el mapa de plazas", "Guardar plazas favoritas", "Participar en el foro"],
  },
  {
    level: "estudiante",
    icon: <BookOpen size={20} />,
    title: "Estudiante",
    subtitle: "Eres estudiante universitario de una carrera de salud.",
    what_you_need: "Constancia de matrícula o carnet universitario vigente (imagen o PDF).",
    unlocks: ["Todo lo anterior", "Acceso al Mercado de recursos SERUMS", "Badge distintivo en tus publicaciones"],
  },
  {
    level: "egresado",
    icon: <GraduationCap size={20} />,
    title: "Egresado",
    subtitle: "Completaste la carrera. Tienes bachillerato o título en trámite.",
    what_you_need: "Constancia de egreso o acta de bachillerato.",
    unlocks: ["Todo lo anterior", "Acceso a guías y recursos exclusivos para egresados"],
  },
  {
    level: "colegiado",
    icon: <Award size={20} />,
    title: "Colegiado",
    subtitle: "Estás habilitado para ejercer. Tienes número de colegiatura.",
    what_you_need: "Número de colegiatura + constancia del colegio profesional correspondiente.",
    unlocks: ["Todo lo anterior", "Validar la identidad de otros profesionales", "Mayor visibilidad en el ranking"],
  },
  {
    level: "serums_activo",
    icon: <Stethoscope size={20} />,
    title: "SERUMS Activo",
    subtitle: "Estás haciendo el SERUMS este año. Cruzamos tu plaza con el padrón MINSA.",
    what_you_need: "Resolución ministerial de adjudicación o constancia de inicio de plaza.",
    unlocks: [
      "Todo lo anterior",
      "Escribir reseñas de tu plaza actual",
      "Badge premium 'SERUMS 2026' en tu perfil",
      "Acceso al foro exclusivo de serumistas activos",
    ],
  },
  {
    level: "perenne",
    icon: <Star size={20} />,
    title: "Perenne",
    subtitle: "Completaste el SERUMS. Formas parte del legado.",
    what_you_need: "Constancia de término de SERUMS o resolución de conclusión.",
    unlocks: [
      "Todo lo anterior",
      "Reseñar cualquier plaza donde hayas servido",
      "Acceso a herramientas de moderación",
      "Insignia de honor permanente en tu perfil",
    ],
  },
];

const STATUS_CONFIG = {
  pendiente:   { label: "En espera",   icon: Clock,        color: "text-amber-600" },
  en_revision: { label: "En revisión", icon: Clock,        color: "text-blue-600"  },
  aprobada:    { label: "Aprobada",    icon: CheckCircle2, color: "text-green-600" },
  rechazada:   { label: "Rechazada",   icon: XCircle,      color: "text-red-600"   },
  cancelada:   { label: "Cancelada",   icon: XCircle,      color: "text-qn-text-subtle" },
};

interface Solicitud {
  id: string;
  nivel_solicitado: ProfLevel;
  status: keyof typeof STATUS_CONFIG;
  notas_publicas: string | null;
  created_at: string;
}

export function VerificacionClient() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<ProfLevel | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/magic-link?from=/perfil/verificacion"); return; }

      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from("perfiles").select("*").eq("user_id", user.id).single(),
        fetch("/api/me/verificacion").then((r) => r.json()),
      ]);

      if (p) setPerfil(p as Perfil);
      if (s?.solicitudes) setSolicitudes(s.solicitudes as Solicitud[]);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  const currentLevelIndex = LEVELS.findIndex((l) => l.level === (perfil?.prof_level ?? "autodeclarado"));
  const activeSolicitud = solicitudes.find((s) => s.status === "pendiente" || s.status === "en_revision");

  async function handleSubmit() {
    if (!selectedLevel) return;
    setSubmitting(true);
    setSubmitError(null);
    const res = await fetch("/api/me/verificacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nivel_solicitado: selectedLevel }),
    });
    const json = await res.json();
    if (!res.ok) {
      setSubmitError(json.error ?? "Error al enviar");
      setSubmitting(false);
      return;
    }
    setSolicitudes((prev) => [json.solicitud, ...prev]);
    setSelectedLevel(null);
    setSubmitted(true);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-qn-text-muted" size={28} />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/perfil" className="mb-6 inline-flex items-center gap-1.5 text-sm text-qn-text-muted hover:text-qn-ink">
        <ArrowLeft size={15} /> Volver al perfil
      </Link>

      <h1 className="qn-display mb-1 text-2xl text-qn-ink">Verificación de identidad</h1>
      <p className="mb-6 text-sm text-qn-text-muted">Sube de nivel para acceder a más funciones de la comunidad.</p>

      {perfil?.prof_level && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-xs text-qn-text-subtle">Nivel actual:</span>
          <VerificationBadge level={perfil.prof_level} size="md" />
        </div>
      )}

      {activeSolicitud && !submitted && (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm">
          <p className="font-semibold text-blue-700">Solicitud en proceso</p>
          <p className="mt-0.5 text-blue-600">
            Tu solicitud para el nivel{" "}
            <strong>{LEVELS.find((l) => l.level === activeSolicitud.nivel_solicitado)?.title}</strong>{" "}
            está siendo revisada. Te notificaremos por email.
          </p>
        </div>
      )}

      {submitted && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm">
          <p className="font-semibold text-green-700">Solicitud enviada</p>
          <p className="mt-0.5 text-green-600">Revisaremos tu solicitud en 24–48 horas. Te avisaremos por email.</p>
        </div>
      )}

      <div className="mb-6 space-y-3">
        {LEVELS.map((l, idx) => {
          const isCurrentLevel = idx === currentLevelIndex;
          const isPast = idx < currentLevelIndex;
          const isFuture = idx > currentLevelIndex;
          const isNext = idx === currentLevelIndex + 1;
          const isSelected = selectedLevel === l.level;

          return (
            <div key={l.level}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isCurrentLevel ? "border-qn-terracotta/40 bg-qn-paper shadow-sm"
                  : isPast ? "border-green-200 bg-green-50/50"
                  : isSelected ? "border-qn-ink bg-qn-paper shadow-md"
                  : "border-qn-border bg-qn-paper"
              }`}
            >
              <button type="button"
                disabled={isPast || isCurrentLevel || !!activeSolicitud || submitted}
                onClick={() => setSelectedLevel(isSelected ? null : l.level)}
                className="flex w-full items-center gap-3 p-4 text-left disabled:cursor-default"
              >
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                  isPast ? "bg-green-100 text-green-600"
                    : isCurrentLevel ? "bg-qn-terracotta/10 text-qn-terracotta"
                    : "bg-qn-border/40 text-qn-text-subtle"
                }`}>
                  {isPast ? <CheckCircle2 size={18} /> : l.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isPast ? "text-green-700" : "text-qn-ink"}`}>{l.title}</span>
                    <VerificationBadge level={l.level} size="sm" showDot={false} />
                    {isCurrentLevel && (
                      <span className="rounded-full bg-qn-terracotta/10 px-2 py-0.5 text-[10px] font-medium text-qn-terracotta">Tu nivel actual</span>
                    )}
                    {isNext && !activeSolicitud && !submitted && (
                      <span className="rounded-full bg-qn-ink/5 px-2 py-0.5 text-[10px] font-medium text-qn-ink">Siguiente paso</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-qn-text-muted">{l.subtitle}</p>
                </div>
                {isFuture && !activeSolicitud && !submitted && (
                  <ChevronRight size={16} className={`flex-shrink-0 text-qn-text-subtle transition-transform ${isSelected ? "rotate-90" : ""}`} />
                )}
              </button>

              {isSelected && (
                <div className="border-t border-qn-border-soft px-4 pb-4 pt-3">
                  <div className="mb-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-qn-text-subtle">Qué necesitas</p>
                    <p className="text-sm text-qn-ink">{l.what_you_need}</p>
                  </div>
                  <div className="mb-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-qn-text-subtle">Qué desbloqueas</p>
                    <ul className="space-y-1">
                      {l.unlocks.map((u) => (
                        <li key={u} className="flex items-start gap-2 text-sm text-qn-ink">
                          <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-green-500" /> {u}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {submitError && (
                    <p className="mb-3 rounded-xl border border-qn-rust/30 bg-qn-rust/5 px-3 py-2 text-xs text-qn-rust">{submitError}</p>
                  )}
                  <div className="flex gap-2">
                    <button type="button" onClick={handleSubmit} disabled={submitting}
                      className="flex items-center gap-1.5 rounded-full bg-qn-ink px-5 py-2 text-sm font-semibold text-qn-gold disabled:opacity-60"
                    >
                      {submitting ? <><Loader2 size={13} className="animate-spin" /> Enviando…</> : "Solicitar verificación"}
                    </button>
                    <button type="button" onClick={() => setSelectedLevel(null)}
                      className="rounded-full border border-qn-border px-4 py-2 text-sm text-qn-text-muted hover:border-qn-ink"
                    >
                      Cancelar
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-qn-text-subtle">
                    El equipo revisará tu solicitud en 24–48 horas. Si tienes documentos, escríbenos a{" "}
                    <a href="mailto:verificacion@qhapaqnan.pe" className="underline hover:text-qn-ink">verificacion@qhapaqnan.pe</a>
                  </p>
                </div>
              )}

              {(() => {
                const rejected = solicitudes.find((s) => s.nivel_solicitado === l.level && s.status === "rechazada");
                if (!rejected) return null;
                return (
                  <div className="border-t border-red-100 bg-red-50/50 px-4 py-3">
                    <p className="text-xs font-medium text-red-600">Solicitud rechazada</p>
                    {rejected.notas_publicas && <p className="mt-0.5 text-xs text-red-500">{rejected.notas_publicas}</p>}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {solicitudes.length > 0 && (
        <div className="rounded-2xl border border-qn-border bg-qn-paper p-5 shadow-sm">
          <h2 className="qn-display mb-3 text-base text-qn-ink">Historial de solicitudes</h2>
          <div className="space-y-2">
            {solicitudes.map((s) => {
              const cfg = STATUS_CONFIG[s.status];
              const StatusIcon = cfg.icon;
              const levelTitle = LEVELS.find((l) => l.level === s.nivel_solicitado)?.title ?? s.nivel_solicitado;
              return (
                <div key={s.id} className="flex items-center gap-3 rounded-xl bg-qn-bg px-3 py-2.5">
                  <StatusIcon size={15} className={`flex-shrink-0 ${cfg.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-qn-ink">Nivel {levelTitle}</p>
                    <p className="text-xs text-qn-text-subtle">
                      {new Date(s.created_at).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
