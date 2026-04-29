"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ChevronUp, Eye, EyeOff, Loader2 } from "lucide-react";
import { ChakanaIcon } from "@/components/ui/ChakanaIcon";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

const PROFESIONES = [
  { id: "MEDICINA", label: "Medicina", emoji: "🩺" },
  { id: "ENFERMERIA", label: "Enfermería", emoji: "💉" },
  { id: "OBSTETRICIA", label: "Obstetricia", emoji: "🫀" },
  { id: "ODONTOLOGIA", label: "Odontología", emoji: "🦷" },
  { id: "PSICOLOGIA", label: "Psicología", emoji: "🧠" },
  { id: "NUTRICION", label: "Nutrición", emoji: "🥦" },
  { id: "QUIMICO FARMACEUTICO", label: "Quím. Farm.", emoji: "⚗️" },
  { id: "BIOLOGIA", label: "Biología", emoji: "🔬" },
  { id: "TRABAJO SOCIAL", label: "T. Social", emoji: "🤝" },
  { id: "MEDICINA VETERINARIA", label: "Med. Vet.", emoji: "🐾" },
  { id: "INGENIERIA SANITARIA", label: "Ing. Sanit.", emoji: "🏗️" },
  { id: "TM - LABORATORIO CLINICO", label: "Lab. Clínico", emoji: "🧪" },
  { id: "TM - TERAPIA FISICA", label: "T. Física", emoji: "🏃" },
  { id: "TM - RADIOLOGIA", label: "Radiología", emoji: "☢️" },
  { id: "TM - TERAPIA LENGUAJE", label: "T. Lenguaje", emoji: "💬" },
  { id: "TM - TERAPIA OCUPACIONAL", label: "T. Ocup.", emoji: "🖐️" },
  { id: "TM - OPTOMETRIA", label: "Optometría", emoji: "👁️" },
];

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [profesion, setProfesion] = useState<string | null>(null);
  const [showProfesiones, setShowProfesiones] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function switchMode(next: "signup" | "login") {
    setMode(next);
    setErrorMsg("");
    setShowProfesiones(false);
    setPassword("");
  }

  // ── Entrar con contraseña ───────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!z.string().email().safeParse(email.trim()).success) {
      setErrorMsg("Correo inválido");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("La contraseña es demasiado corta");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setErrorMsg(
        error.message.includes("Invalid login")
          ? "Correo o contraseña incorrectos"
          : error.message,
      );
      setStatus("error");
      return;
    }

    // Verificar onboarding
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("onboarding_completado")
        .eq("user_id", user.id)
        .single();
      router.push(perfil?.onboarding_completado ? "/plazas" : "/onboarding");
      router.refresh();
    }
  }

  // ── Crear cuenta con magic link ─────────────────────────────────────────
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!z.string().email().safeParse(trimmedEmail).success) {
      setErrorMsg("Ingresa un correo válido");
      return;
    }
    if (nombre.trim().length < 2) {
      setErrorMsg("Ingresa tu nombre (mínimo 2 letras)");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
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
    } catch {
      setErrorMsg("Sin conexión. Reintenta.");
      setStatus("error");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-qn-bg px-4 py-12">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-qn-ink">
          <ChakanaIcon size={24} color="var(--qn-gold)" />
        </div>
        <div>
          <div className="qn-display-italic leading-none text-qn-ink" style={{ fontSize: 26 }}>
            qhapaq ñan
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-qn-extra text-qn-text-subtle">
            SERUMS · El gran camino
          </div>
        </div>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl border border-qn-border bg-qn-paper p-8 shadow-sm">

        {/* ── Pantalla de confirmación magic link ── */}
        {status === "sent" ? (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-qn-ink">
              <ChakanaIcon size={28} color="var(--qn-gold)" />
            </div>
            <h2 className="qn-display mb-2 text-2xl text-qn-ink">Revisa tu correo</h2>
            <p className="text-sm leading-relaxed text-qn-text-muted">
              Enviamos un enlace a{" "}
              <strong className="text-qn-ink">{email}</strong>.
              Haz clic para entrar — caduca en 10&nbsp;minutos.
            </p>
            <p className="mt-4 text-xs text-qn-text-subtle">
              ¿No llega? Revisa spam o{" "}
              <button type="button" className="underline hover:text-qn-ink"
                onClick={() => setStatus("idle")}>
                reenviar
              </button>.
            </p>
          </div>
        ) : (
          <>
            <h1 className="qn-display mb-1 text-2xl text-qn-ink">Bienvenido</h1>
            <p className="mb-6 text-sm text-qn-text-muted">
              El mapa colaborativo del SERUMS peruano.
            </p>

            {/* ── Tabs ── */}
            <div className="mb-6 flex rounded-2xl border border-qn-border bg-qn-soft p-1">
              <button type="button" onClick={() => switchMode("signup")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
                  mode === "signup" ? "bg-qn-ink text-qn-bg shadow-sm" : "text-qn-text-muted hover:text-qn-ink"
                }`}>
                Crear cuenta
              </button>
              <button type="button" onClick={() => switchMode("login")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
                  mode === "login" ? "bg-qn-ink text-qn-bg shadow-sm" : "text-qn-text-muted hover:text-qn-ink"
                }`}>
                Entrar
              </button>
            </div>

            {/* ── LOGIN: email + contraseña ── */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-qn-ink" htmlFor="login-email">
                    Correo electrónico
                  </label>
                  <input id="login-email" type="email" autoComplete="email" inputMode="email"
                    placeholder="tu@correo.pe" value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                    className="w-full rounded-xl border border-qn-border bg-qn-bg px-4 py-3 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-ink focus:outline-none" />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-qn-ink" htmlFor="login-pass">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input id="login-pass" type={showPass ? "text" : "password"}
                      autoComplete="current-password" placeholder="••••••••"
                      value={password} onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                      className="w-full rounded-xl border border-qn-border bg-qn-bg px-4 py-3 pr-11 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-ink focus:outline-none" />
                    <button type="button" onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-qn-text-subtle hover:text-qn-ink">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {errorMsg && <p className="text-xs text-qn-rust">{errorMsg}</p>}

                <button type="submit" disabled={status === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-qn-ink py-3 text-sm font-semibold text-qn-bg disabled:opacity-60">
                  {status === "loading"
                    ? <><Loader2 size={15} className="animate-spin" /> Entrando…</>
                    : <>Entrar <ArrowRight size={15} /></>}
                </button>

                <p className="text-center text-xs text-qn-text-subtle">
                  ¿Olvidaste tu contraseña?{" "}
                  <button type="button" onClick={() => switchMode("signup")}
                    className="underline hover:text-qn-ink">
                    Usa enlace mágico
                  </button>
                </p>
              </form>
            )}

            {/* ── SIGNUP: nombre + email + profesión + magic link ── */}
            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-qn-ink" htmlFor="signup-nombre">
                    Tu nombre
                  </label>
                  <input id="signup-nombre" type="text" autoComplete="name"
                    placeholder="María García" value={nombre}
                    onChange={(e) => { setNombre(e.target.value); setErrorMsg(""); }}
                    className="w-full rounded-xl border border-qn-border bg-qn-bg px-4 py-3 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-ink focus:outline-none" />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-qn-ink" htmlFor="signup-email">
                    Correo electrónico
                  </label>
                  <input id="signup-email" type="email" autoComplete="email" inputMode="email"
                    placeholder="tu@correo.pe" value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                    className="w-full rounded-xl border border-qn-border bg-qn-bg px-4 py-3 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-ink focus:outline-none" />
                </div>

                {/* Profesión opcional */}
                <div>
                  <button type="button" onClick={() => setShowProfesiones((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl border border-qn-border bg-qn-bg px-4 py-3 text-left text-sm hover:border-qn-ink">
                    <span className={profesion ? "text-qn-ink" : "text-qn-text-muted"}>
                      {profesion
                        ? `${PROFESIONES.find((p) => p.id === profesion)?.emoji} ${PROFESIONES.find((p) => p.id === profesion)?.label}`
                        : "Soy profesional de salud (opcional)"}
                    </span>
                    {showProfesiones
                      ? <ChevronUp size={15} className="flex-shrink-0 text-qn-text-subtle" />
                      : <ChevronDown size={15} className="flex-shrink-0 text-qn-text-subtle" />}
                  </button>

                  {showProfesiones && (
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      {PROFESIONES.map((p) => (
                        <button key={p.id} type="button"
                          onClick={() => { setProfesion(p.id === profesion ? null : p.id); setShowProfesiones(false); }}
                          className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-center text-xs transition-colors ${
                            profesion === p.id
                              ? "border-qn-terracotta bg-qn-terracotta/10 text-qn-ink"
                              : "border-qn-border bg-qn-bg text-qn-text-muted hover:border-qn-terracotta/50"
                          }`}>
                          <span className="text-base">{p.emoji}</span>
                          <span className="leading-tight">{p.label}</span>
                          {profesion === p.id && <Check size={10} className="text-qn-terracotta" />}
                        </button>
                      ))}
                      <button type="button"
                        onClick={() => { setProfesion(null); setShowProfesiones(false); }}
                        className="col-span-3 rounded-xl border border-dashed border-qn-border px-3 py-2 text-xs text-qn-text-subtle hover:border-qn-ink hover:text-qn-ink">
                        No soy profesional de salud
                      </button>
                    </div>
                  )}
                </div>

                {errorMsg && <p className="text-xs text-qn-rust">{errorMsg}</p>}

                <button type="submit" disabled={status === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-qn-ink py-3 text-sm font-semibold text-qn-bg disabled:opacity-60">
                  {status === "loading"
                    ? <><Loader2 size={15} className="animate-spin" /> Enviando…</>
                    : <>Crear cuenta <ArrowRight size={15} /></>}
                </button>

                <p className="text-center text-xs leading-relaxed text-qn-text-subtle">
                  Te enviamos un enlace seguro por correo. Al continuar aceptas la{" "}
                  <Link href="/privacidad" className="underline hover:text-qn-ink">privacidad</Link>.
                </p>

                <p className="text-center text-xs">
                  <Link href="/plazas" className="text-qn-text-subtle underline hover:text-qn-ink">
                    Explorar el mapa sin registrarme
                  </Link>
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </main>
  );
}
