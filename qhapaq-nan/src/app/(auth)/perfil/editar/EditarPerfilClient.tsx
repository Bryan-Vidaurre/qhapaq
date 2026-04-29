"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import type { Perfil } from "@/types/user";

const PROFESION_LABEL: Record<string, string> = {
  "MEDICINA": "Medicina",
  "ENFERMERIA": "Enfermería",
  "OBSTETRICIA": "Obstetricia",
  "ODONTOLOGIA": "Odontología",
  "PSICOLOGIA": "Psicología",
  "NUTRICION": "Nutrición",
  "QUIMICO FARMACEUTICO": "Quím. Farmacéutico",
  "BIOLOGIA": "Biología",
  "TRABAJO SOCIAL": "Trabajo Social",
  "MEDICINA VETERINARIA": "Med. Veterinaria",
  "INGENIERIA SANITARIA": "Ing. Sanitaria",
  "TM - LABORATORIO CLINICO": "T.M. Laboratorio",
  "TM - TERAPIA FISICA": "T.M. Terapia Física",
  "TM - RADIOLOGIA": "T.M. Radiología",
  "TM - TERAPIA LENGUAJE": "T.M. T. Lenguaje",
  "TM - TERAPIA OCUPACIONAL": "T.M. T. Ocupacional",
  "TM - OPTOMETRIA": "T.M. Optometría",
};

export function EditarPerfilClient() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/magic-link?from=/perfil/editar"); return; }

      const { data } = await supabase
        .from("perfiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setPerfil(data as Perfil);
        setNombre(data.nombre_publico ?? "");
        setBio(data.bio ?? "");
        setEmailNotif(data.email_notifications ?? true);
        setEmailMarketing(data.email_marketing ?? false);
      }
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await fetch("/api/me/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_publico: nombre.trim(),
        bio: bio.trim() || null,
        email_notifications: emailNotif,
        email_marketing: emailMarketing,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Error al guardar");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-qn-text-muted" size={28} />
      </div>
    );
  }

  const profesion = perfil?.profesion_declarada_id
    ? (PROFESION_LABEL[perfil.profesion_declarada_id] ?? perfil.profesion_declarada_id)
    : null;

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <Link
        href="/perfil"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-qn-text-muted hover:text-qn-ink"
      >
        <ArrowLeft size={15} /> Volver al perfil
      </Link>

      <h1 className="qn-display mb-6 text-2xl text-qn-ink">Editar perfil</h1>

      <form onSubmit={handleSave} className="space-y-5">

        {/* Nombre público */}
        <div className="rounded-2xl border border-qn-border bg-qn-paper p-5 shadow-sm">
          <label className="mb-1.5 block text-sm font-medium text-qn-ink" htmlFor="nombre">
            Nombre público
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={80}
            required
            placeholder="Tu nombre visible en la plataforma"
            className="w-full rounded-xl border border-qn-border bg-qn-bg px-3.5 py-2.5 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-ink focus:outline-none"
          />
          <p className="mt-1 text-xs text-qn-text-subtle">{nombre.length}/80 caracteres</p>
        </div>

        {/* Bio */}
        <div className="rounded-2xl border border-qn-border bg-qn-paper p-5 shadow-sm">
          <label className="mb-1.5 block text-sm font-medium text-qn-ink" htmlFor="bio">
            Biografía <span className="font-normal text-qn-text-subtle">(opcional)</span>
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Cuéntale a la comunidad quién eres..."
            className="w-full resize-none rounded-xl border border-qn-border bg-qn-bg px-3.5 py-2.5 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-ink focus:outline-none"
          />
          <p className="mt-1 text-xs text-qn-text-subtle">{bio.length}/300 caracteres</p>
        </div>

        {/* Profesión (solo lectura — cambiarla requiere revalidación) */}
        {profesion && (
          <div className="rounded-2xl border border-qn-border bg-qn-paper p-5 shadow-sm">
            <p className="mb-1 text-sm font-medium text-qn-ink">Profesión</p>
            <p className="text-sm text-qn-text-muted">{profesion}</p>
            <p className="mt-1 text-xs text-qn-text-subtle">
              Para cambiar tu profesión, contacta al equipo en{" "}
              <a href="mailto:hola@qhapaqnan.pe" className="underline hover:text-qn-ink">
                hola@qhapaqnan.pe
              </a>
            </p>
          </div>
        )}

        {/* Notificaciones */}
        <div className="rounded-2xl border border-qn-border bg-qn-paper p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-qn-ink">Comunicaciones</h2>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm text-qn-ink">Notificaciones por email</p>
                <p className="text-xs text-qn-text-subtle">
                  Alertas de verificación, respuestas y actualizaciones importantes
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotif(!emailNotif)}
                className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                  emailNotif ? "bg-qn-ink" : "bg-qn-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    emailNotif ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm text-qn-ink">Contenido editorial</p>
                <p className="text-xs text-qn-text-subtle">
                  Novedades sobre plazas, convocatorias y recursos SERUMS
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEmailMarketing(!emailMarketing)}
                className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                  emailMarketing ? "bg-qn-ink" : "bg-qn-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    emailMarketing ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-xl border border-qn-rust/30 bg-qn-rust/5 px-4 py-3 text-sm text-qn-rust">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={saving || nombre.trim().length < 2}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-qn-ink py-3 text-sm font-semibold text-qn-gold disabled:opacity-60"
        >
          {saving ? (
            <><Loader2 size={15} className="animate-spin" /> Guardando…</>
          ) : saved ? (
            <><Check size={15} /> ¡Guardado!</>
          ) : (
            "Guardar cambios"
          )}
        </button>
      </form>
    </main>
  );
}
