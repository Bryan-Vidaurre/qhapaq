"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { ChakanaIcon } from "@/components/ui/ChakanaIcon";
import { z } from "zod";

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
  { id: "TM - TERAPIA LENGUAJE", label: "T.M. Terapia Lenguaje", emoji: "💬" },
  { id: "TM - TERAPIA OCUPACIONAL", label: "T.M. T. Ocupacional", emoji: "🖐️" },
  { id: "TM - OPTOMETRIA", label: "T.M. Optometría", emoji: "👁️" },
];

const STEPS = ["¿Quién eres?", "Tu profesión", "Revisa tu correo"];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [profesion, setProfesion] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmitIdentidad(e: React.FormEvent) {
    e.preventDefault();
    const trimmedNombre = nombre.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedNombre.length < 2) {
      setErrorMsg("Ingresa tu nombre completo");
      return;
    }
    const emailResult = z.string().email().safeParse(trimmedEmail);
    if (!emailResult.success) {
      setErrorMsg("Ingresa un correo válido");
      return;
    }
    setErrorMsg("");
    setStep(1);
  }

  async function handleEnviarEnlace() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nombre: nombre.trim(),
          profesion_id: profesion,
          redirectTo: "/onboarding",
        }),
      });
      if (res.status === 429) {
        setErrorMsg("Demasiados intentos. Espera 15 minutos.");
        setStatus("error");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body.error ?? "No pudimos enviar el enlace. Reintenta.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      setStep(2);
    } catch {
      setErrorMsg("Sin conexión. Reintenta.");
      setStatus("error");
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-qn-bg">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-qn-ink">
            <ChakanaIcon size={14} color="var(--qn-gold)" />
          </div>
          <span className="qn-display-italic text-lg leading-none text-qn-ink">qhapaq ñan</span>
        </Link>
        <Link href="/auth/magic-link" className="text-sm text-qn-text-muted hover:text-qn-ink">
          Ya tengo cuenta
        </Link>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 py-4">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                i < step
                  ? "bg-qn-terracotta text-white"
                  : i === step
                    ? "bg-qn-ink text-qn-bg"
                    : "bg-qn-soft text-qn-text-subtle"
              }`}
            >
              {i < step ? <Check size={13} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 ${i < step ? "bg-qn-terracotta" : "bg-qn-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="mx-auto mt-4 w-full max-w-md flex-1 px-4">
        {/* Step 0: Identidad */}
        {step === 0 && (
          <form onSubmit={handleSubmitIdentidad} className="rounded-3xl border border-qn-border bg-qn-paper p-8 shadow-sm">
            <h1 className="qn-display mb-1 text-3xl text-qn-ink">Únete a la comunidad</h1>
            <p className="mb-7 text-sm text-qn-text-muted">
              El mapa colaborativo del SERUMS peruano. Gratis, sin contraseñas.
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-qn-text">
                  Tu nombre
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  autoFocus
                  placeholder="María García"
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); setErrorMsg(""); }}
                  className="w-full rounded-xl border border-qn-border bg-qn-soft px-4 py-3 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none focus:ring-2 focus:ring-qn-terracotta/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-qn-text">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="maria@correo.pe"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                  className="w-full rounded-xl border border-qn-border bg-qn-soft px-4 py-3 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none focus:ring-2 focus:ring-qn-terracotta/20"
                />
              </div>
              {errorMsg && <p className="text-xs text-qn-rust">{errorMsg}</p>}
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-qn-ink py-3 text-sm font-medium text-qn-bg hover:opacity-90"
            >
              Continuar <ArrowRight size={15} />
            </button>

            <p className="mt-4 text-center text-xs text-qn-text-subtle">
              Al continuar aceptas nuestra{" "}
              <Link href="/privacidad" className="underline">privacidad</Link> y{" "}
              <Link href="/terminos" className="underline">términos</Link>.
            </p>
          </form>
        )}

        {/* Step 1: Profesión */}
        {step === 1 && (
          <div className="rounded-3xl border border-qn-border bg-qn-paper p-8 shadow-sm">
            <button onClick={() => setStep(0)} className="mb-5 flex items-center gap-1 text-sm text-qn-text-muted hover:text-qn-ink">
              <ArrowLeft size={14} /> Atrás
            </button>
            <h1 className="qn-display mb-1 text-2xl text-qn-ink">¿Cuál es tu profesión?</h1>
            <p className="mb-5 text-sm text-qn-text-muted">
              Hola, <strong className="text-qn-ink">{nombre.split(" ")[0]}</strong>. Esto personaliza tu experiencia en el mapa.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {PROFESIONES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfesion(p.id === profesion ? null : p.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                    profesion === p.id
                      ? "border-qn-terracotta bg-qn-terracotta/10 text-qn-ink"
                      : "border-qn-border bg-qn-soft text-qn-text hover:border-qn-terracotta/50"
                  }`}
                >
                  <span className="text-base">{p.emoji}</span>
                  <span className="text-xs leading-tight">{p.label}</span>
                  {profesion === p.id && <Check size={12} className="ml-auto text-qn-terracotta" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setProfesion(null); handleEnviarEnlace(); }}
              className="mt-4 w-full text-center text-sm text-qn-text-subtle hover:text-qn-ink"
            >
              No soy profesional de salud, continuar igualmente
            </button>

            {errorMsg && <p className="mt-2 text-xs text-qn-rust">{errorMsg}</p>}

            <button
              onClick={handleEnviarEnlace}
              disabled={status === "loading"}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-qn-ink py-3 text-sm font-medium text-qn-bg hover:opacity-90 disabled:opacity-60"
            >
              {status === "loading" ? (
                <><Loader2 size={15} className="animate-spin" /> Enviando enlace...</>
              ) : (
                <>{profesion ? "¡Listo! Enviarme el enlace" : "Continuar sin profesión"} <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Confirmar */}
        {step === 2 && (
          <div className="rounded-3xl border border-qn-forest/30 bg-qn-forest/5 p-8 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-qn-ink mx-auto">
              <ChakanaIcon size={28} color="var(--qn-gold)" />
            </div>
            <h1 className="qn-display mb-2 text-2xl text-qn-ink">Revisa tu correo</h1>
            <p className="text-sm leading-relaxed text-qn-text-muted">
              Enviamos un enlace a <strong className="text-qn-ink">{email}</strong>.
              Haz click en él para entrar — funciona una sola vez y caduca en 10 minutos.
            </p>
            <p className="mt-4 text-xs text-qn-text-subtle">
              ¿No lo encuentras? Revisa spam o{" "}
              <button
                className="underline hover:text-qn-ink"
                onClick={() => { setStep(1); setStatus("idle"); }}
              >
                reenviar enlace
              </button>.
            </p>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div className="py-8 text-center text-xs text-qn-text-subtle">
        <span>¿Eres docente o estudiante? </span>
        <Link href="/plazas" className="underline">Explora el mapa sin cuenta</Link>
      </div>
    </main>
  );
}
