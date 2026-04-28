"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

const EmailSchema = z.string().email({ message: "Ingresa un correo válido" });

export function MagicLinkForm() {
  const params = useSearchParams();
  const from = params.get("from") || "/";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error" | "rate_limited">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = EmailSchema.safeParse(email.trim().toLowerCase());
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0]?.message ?? "Correo inválido");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: validation.data, redirectTo: from }),
      });

      if (res.status === 429) {
        setStatus("rate_limited");
        setErrorMsg("Demasiados intentos. Espera 15 minutos.");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(body.error || "No pudimos enviar el enlace. Reintenta.");
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorMsg("Sin conexión. Reintenta.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-qn-forest/30 bg-qn-forest/5 p-8 text-center">
        <h2 className="qn-display mb-3 text-2xl text-qn-ink">Revisa tu correo</h2>
        <p className="text-sm leading-relaxed text-qn-text-muted">
          Te enviamos un enlace a <strong className="text-qn-ink">{email}</strong>. Funciona una
          sola vez y caduca en 10 minutos.
        </p>
        <p className="mt-4 text-xs text-qn-text-subtle">
          ¿No lo encuentras? Revisa la carpeta de spam o promociones.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-qn-text">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          disabled={status === "loading"}
          className="w-full rounded-xl border border-qn-border bg-qn-paper px-4 py-3 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none focus:ring-2 focus:ring-qn-terracotta/20 disabled:opacity-60"
          placeholder="tu@correo.pe"
        />
        {errorMsg && (
          <p className="mt-2 text-xs text-qn-rust" role="alert">
            {errorMsg}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-qn-ink py-3 text-sm font-medium text-qn-bg transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {status === "loading" ? "Enviando enlace..." : "Enviarme un enlace para entrar"}
      </button>

      <p className="text-xs leading-relaxed text-qn-text-subtle">
        Sin contraseña. Recibes un enlace en tu correo y entras de un click. Al continuar,
        aceptas nuestra{" "}
        <a href="/privacidad" className="underline hover:text-qn-ink">
          política de privacidad
        </a>{" "}
        y{" "}
        <a href="/terminos" className="underline hover:text-qn-ink">
          términos de uso
        </a>
        .
      </p>
    </form>
  );
}
