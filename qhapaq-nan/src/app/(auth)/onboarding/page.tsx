"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Loader2, MapPin } from "lucide-react";
import { ChakanaIcon } from "@/components/ui/ChakanaIcon";
import { createClient } from "@/lib/supabase/client";

const PROFESIONES = [
  { id: "MEDICINA", label: "Medicina", emoji: "🩺" },
  { id: "ENFERMERIA", label: "Enfermería", emoji: "💉" },
  { id: "OBSTETRICIA", label: "Obstetricia", emoji: "🫀" },
  { id: "ODONTOLOGIA", label: "Odontología", emoji: "🦷" },
  { id: "PSICOLOGIA", label: "Psicología", emoji: "🧠" },
  { id: "NUTRICION", label: "Nutrición", emoji: "🥦" },
  { id: "QUIMICO FARMACEUTICO", label: "Quím. Farmacéutico", emoji: "⚗️" },
  { id: "BIOLOGIA", label: "Biología", emoji: "🔬" },
  { id: "TRABAJO SOCIAL", label: "Trabajo Social", emoji: "🤝" },
  { id: "MEDICINA VETERINARIA", label: "Med. Veterinaria", emoji: "🐾" },
  { id: "INGENIERIA SANITARIA", label: "Ing. Sanitaria", emoji: "🏗️" },
  { id: "TM - LABORATORIO CLINICO", label: "T.M. Laboratorio", emoji: "🧪" },
  { id: "TM - TERAPIA FISICA", label: "T.M. Terapia Física", emoji: "🏃" },
  { id: "TM - RADIOLOGIA", label: "T.M. Radiología", emoji: "☢️" },
  { id: "TM - TERAPIA LENGUAJE", label: "T.M. T. Lenguaje", emoji: "💬" },
  { id: "TM - TERAPIA OCUPACIONAL", label: "T.M. T. Ocupacional", emoji: "🖐️" },
  { id: "TM - OPTOMETRIA", label: "T.M. Optometría", emoji: "👁️" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: nombre, 1: profesion, 2: done
  const [nombre, setNombre] = useState("");
  const [profesion, setProfesion] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // Pre-cargar nombre desde el perfil existente
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace("/auth/magic-link");
        return;
      }
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("nombre_publico, onboarding_completado, profesion_declarada_id")
        .eq("user_id", user.id)
        .single();

      if (perfil?.onboarding_completado) {
        router.replace("/plazas");
        return;
      }
      if (perfil?.nombre_publico && !perfil.nombre_publico.includes("@")) {
        setNombre(perfil.nombre_publico);
      }
      if (perfil?.profesion_declarada_id) {
        setProfesion(perfil.profesion_declarada_id);
      }
      setLoadingUser(false);
    });
  }, [router]);

  async function finalizarOnboarding() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const update: Record<string, unknown> = {
      onboarding_completado: true,
    };

    if (nombre.trim().length >= 2) {
      update.nombre_publico = nombre.trim();
    }
    if (profesion) {
      update.profesion_declarada_id = profesion;
      update.kind = "profesional";
      update.prof_level = "autodeclarado";
    }

    await supabase.from("perfiles").update(update).eq("user_id", user.id);
    setSaving(false);
    setStep(2);
  }

  if (loadingUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-qn-bg">
        <Loader2 size={32} className="animate-spin text-qn-text-subtle" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-qn-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-qn-ink">
            <ChakanaIcon size={26} color="var(--qn-gold)" />
          </div>
        </div>

        {/* Step 0: Nombre */}
        {step === 0 && (
          <div className="rounded-3xl border border-qn-border bg-qn-paper p-8 shadow-sm">
            <h1 className="qn-display mb-1 text-2xl text-qn-ink">¡Bienvenido!</h1>
            <p className="mb-6 text-sm text-qn-text-muted">
              Primero, ¿cómo quieres que te conozca la comunidad?
            </p>
            <label className="mb-1.5 block text-sm font-medium text-qn-text">Tu nombre</label>
            <input
              type="text"
              autoFocus
              placeholder="María García"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && nombre.trim().length >= 2 && setStep(1)}
              className="w-full rounded-xl border border-qn-border bg-qn-soft px-4 py-3 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none focus:ring-2 focus:ring-qn-terracotta/20"
            />
            <button
              onClick={() => setStep(1)}
              disabled={nombre.trim().length < 2}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-qn-ink py-3 text-sm font-medium text-qn-bg disabled:opacity-40"
            >
              Continuar <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Step 1: Profesión */}
        {step === 1 && (
          <div className="rounded-3xl border border-qn-border bg-qn-paper p-8 shadow-sm">
            <h1 className="qn-display mb-1 text-2xl text-qn-ink">¿Cuál es tu profesión?</h1>
            <p className="mb-5 text-sm text-qn-text-muted">
              Hola <strong className="text-qn-ink">{nombre.split(" ")[0]}</strong>, elige la tuya (o salta este paso).
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto qn-scroll pr-1">
              {PROFESIONES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfesion(p.id === profesion ? null : p.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    profesion === p.id
                      ? "border-qn-terracotta bg-qn-terracotta/10 text-qn-ink"
                      : "border-qn-border bg-qn-soft text-qn-text hover:border-qn-terracotta/50"
                  }`}
                >
                  <span className="text-base">{p.emoji}</span>
                  <span className="text-xs leading-tight">{p.label}</span>
                  {profesion === p.id && <Check size={11} className="ml-auto text-qn-terracotta" />}
                </button>
              ))}
            </div>
            <button
              onClick={finalizarOnboarding}
              disabled={saving}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-qn-ink py-3 text-sm font-medium text-qn-bg disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>{profesion ? "¡Listo!" : "Saltar"} <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Done */}
        {step === 2 && (
          <div className="rounded-3xl border border-qn-border bg-qn-paper p-10 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
              <Check size={28} className="text-green-600" />
            </div>
            <h1 className="qn-display mb-2 text-2xl text-qn-ink">
              ¡Ya eres parte del camino!
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-qn-text-muted">
              {nombre.split(" ")[0]}, explora las {profesion
                ? `plazas de ${PROFESIONES.find((p) => p.id === profesion)?.label ?? profesion}`
                : "16,018 plazas"
              } del padrón SERUMS 2026-I.
            </p>
            <button
              onClick={() => router.push("/plazas")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-qn-terracotta py-3 text-sm font-medium text-white hover:opacity-90"
            >
              <MapPin size={15} />
              Ir al mapa de plazas
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
