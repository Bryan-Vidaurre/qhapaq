"use client";

import { useState } from "react";

export function DeleteAccountForm() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/me/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() || null }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Error al solicitar eliminación.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Sin conexión. Reintenta.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-qn-forest/30 bg-qn-forest/5 p-4">
        <p className="text-sm text-qn-forest-dark">
          Solicitud recibida. Tu cuenta se eliminará en 30 días. Puedes cancelarla iniciando
          sesión antes de esa fecha.
        </p>
      </div>
    );
  }

  if (!confirming) {
    return (
      <>
        <p className="text-sm text-qn-text-muted">
          Tu cuenta se programará para eliminación en 30 días. Durante ese plazo puedes cancelar
          la solicitud iniciando sesión. Al completarse, eliminamos perfil, contenido publicado
          (reseñas, posts) y datos sensibles.
        </p>
        <button
          onClick={() => setConfirming(true)}
          className="mt-3 rounded-full border border-qn-rust px-4 py-2 text-xs text-qn-rust hover:bg-qn-rust hover:text-qn-bg"
        >
          Quiero eliminar mi cuenta
        </button>
      </>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm text-qn-text">
        ¿Algo que nos ayude a mejorar? (opcional)
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, 500))}
          placeholder="Por qué te vas..."
          rows={3}
          className="mt-2 w-full rounded-xl border border-qn-border bg-qn-soft px-3 py-2 text-sm focus:border-qn-terracotta focus:outline-none"
        />
      </label>

      {error && <p className="text-xs text-qn-rust">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-full bg-qn-rust px-4 py-2 text-xs text-qn-bg hover:bg-qn-rust/90 disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Confirmar eliminación"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="rounded-full border border-qn-border px-4 py-2 text-xs text-qn-text-muted"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
