import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { LogoutButton } from "@/components/perfil/LogoutButton";
import { DeleteAccountForm } from "@/components/perfil/DeleteAccountForm";
import { VerificationBadge } from "@/components/perfil/VerificationBadge";
import {
  ShieldCheck, Pencil, Download, ChevronRight,
  MapPin, Star, Calendar, ExternalLink,
} from "lucide-react";

export const metadata = { title: "Mi perfil · Qhapaq Ñan" };

const PROFESION_LABEL: Record<string, string> = {
  "MEDICINA": "Medicina", "ENFERMERIA": "Enfermería", "OBSTETRICIA": "Obstetricia",
  "ODONTOLOGIA": "Odontología", "PSICOLOGIA": "Psicología", "NUTRICION": "Nutrición",
  "QUIMICO FARMACEUTICO": "Quím. Farmacéutico", "BIOLOGIA": "Biología",
  "TRABAJO SOCIAL": "Trabajo Social", "MEDICINA VETERINARIA": "Med. Veterinaria",
  "INGENIERIA SANITARIA": "Ing. Sanitaria", "TM - LABORATORIO CLINICO": "T.M. Laboratorio",
  "TM - TERAPIA FISICA": "T.M. Terapia Física", "TM - RADIOLOGIA": "T.M. Radiología",
  "TM - TERAPIA LENGUAJE": "T.M. T. Lenguaje", "TM - TERAPIA OCUPACIONAL": "T.M. T. Ocupacional",
  "TM - OPTOMETRIA": "T.M. Optometría",
};

export default async function PerfilPage() {
  const perfil = await getProfile();
  if (!perfil) redirect("/auth/magic-link?from=/perfil");

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const iniciales = perfil.nombre_publico
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const profesion = perfil.profesion_declarada_id
    ? (PROFESION_LABEL[perfil.profesion_declarada_id] ?? perfil.profesion_declarada_id)
    : null;

  const miembroDesde = new Date(perfil.created_at).toLocaleDateString("es-PE", {
    month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-8">

        {/* ── Tarjeta de identidad ── */}
        <div className="mb-4 overflow-hidden rounded-3xl border border-qn-border bg-qn-paper shadow-sm">
          {/* Franja decorativa */}
          <div className="h-20 bg-gradient-to-r from-qn-ink via-qn-brown to-qn-terracotta" />

          <div className="px-6 pb-6">
            {/* Avatar + botón editar */}
            <div className="flex items-end justify-between">
              <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-qn-paper bg-qn-ink text-2xl font-semibold text-qn-gold">
                {iniciales}
              </div>
              <Link
                href="/perfil/editar"
                className="flex items-center gap-1.5 rounded-full border border-qn-border px-4 py-2 text-sm text-qn-ink hover:border-qn-terracotta"
              >
                <Pencil size={13} /> Editar
              </Link>
            </div>

            {/* Nombre + profesión + badge */}
            <div className="mt-3">
              <div className="flex items-start justify-between gap-2">
                <h1 className="qn-display text-2xl leading-tight text-qn-ink">
                  {perfil.nombre_publico}
                </h1>
                <Link
                  href={`/u/${perfil.user_id}`}
                  className="flex shrink-0 items-center gap-1 text-[11px] text-qn-text-subtle hover:text-qn-terracotta"
                  title="Ver perfil público"
                >
                  <ExternalLink size={11} /> Ver perfil público
                </Link>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {profesion && (
                  <span className="text-sm text-qn-text-muted">{profesion}</span>
                )}
                {perfil.prof_level && (
                  <VerificationBadge level={perfil.prof_level} size="sm" />
                )}
                {!perfil.prof_level && (
                  <span className="rounded-full border border-qn-border px-2 py-0.5 text-[10px] text-qn-text-subtle">
                    Sin verificar
                  </span>
                )}
              </div>
              {perfil.bio && (
                <p className="mt-2 text-sm leading-relaxed text-qn-text-muted">{perfil.bio}</p>
              )}
            </div>

            {/* Stats rápidos */}
            <div className="mt-4 flex flex-wrap gap-4 border-t border-qn-border-soft pt-4 text-xs text-qn-text-subtle">
              <span className="flex items-center gap-1">
                <Star size={12} className="text-qn-gold" />
                {perfil.yachay} Yachay
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Desde {miembroDesde}
              </span>
              {user?.email && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {user.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Verificación de identidad ── */}
        <Link
          href="/perfil/verificacion"
          className="mb-4 flex items-center justify-between rounded-2xl border border-qn-border bg-qn-paper p-5 shadow-sm hover:border-qn-terracotta transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-qn-ink">
              <ShieldCheck size={18} color="var(--qn-gold)" />
            </div>
            <div>
              <div className="text-sm font-semibold text-qn-ink">Verificación de identidad</div>
              <div className="text-xs text-qn-text-muted">
                {perfil.prof_level === "autodeclarado" || !perfil.prof_level
                  ? "Sube tu nivel — desbloquea reseñas y más funciones"
                  : perfil.prof_level === "serums_activo" || perfil.prof_level === "perenne"
                    ? "Nivel máximo alcanzado · Puedes reseñar plazas"
                    : "Continúa verificando para acceder a todas las funciones"}
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-qn-text-subtle" />
        </Link>

        {/* ── Mis datos (ARCO) ── */}
        <div className="mb-4 rounded-2xl border border-qn-border bg-qn-paper p-5 shadow-sm">
          <h2 className="qn-display mb-3 text-lg text-qn-ink">Mis datos</h2>
          <p className="mb-3 text-sm text-qn-text-muted">
            Bajo la Ley 29733 tienes derecho a acceder, rectificar, cancelar y oponerte al
            tratamiento de tus datos personales (derechos ARCO).
          </p>
          <a
            href="/api/me/export"
            download
            className="inline-flex items-center gap-2 rounded-full border border-qn-border px-4 py-2 text-xs text-qn-ink hover:border-qn-terracotta"
          >
            <Download size={13} /> Descargar mis datos (JSON)
          </a>
        </div>

        {/* ── Zona peligrosa ── */}
        <div className="mb-4 rounded-2xl border border-qn-rust/30 bg-qn-paper p-5 shadow-sm">
          <h2 className="qn-display mb-3 text-lg text-qn-ink">Eliminar cuenta</h2>
          <DeleteAccountForm />
        </div>

        {/* ── Cerrar sesión ── */}
        <div className="rounded-2xl border border-qn-border bg-qn-paper p-5 shadow-sm">
          <h2 className="qn-display mb-3 text-lg text-qn-ink">Cerrar sesión</h2>
          <LogoutButton />
        </div>
      </main>
    </div>
  );
}
