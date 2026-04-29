"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import type { Perfil } from "@/types/user";

interface Props {
  renipress: string;
  perfil: Perfil | null;
  onCreated: () => void;
}

const DIMENSIONES = [
  { key: "rating_vivienda",     label: "Vivienda",      emoji: "🏠", desc: "Calidad y disponibilidad de alojamiento" },
  { key: "rating_equipo",       label: "Equipamiento",  emoji: "🏥", desc: "Material médico y recursos del establecimiento" },
  { key: "rating_jefatura",     label: "Jefatura",      emoji: "👔", desc: "Gestión, trato y apoyo de la dirección" },
  { key: "rating_conectividad", label: "Conectividad",  emoji: "📶", desc: "Internet, señal telefónica y acceso a información" },
  { key: "rating_seguridad",    label: "Seguridad",     emoji: "🛡️", desc: "Seguridad personal y del entorno" },
  { key: "rating_carga",        label: "Carga laboral", emoji: "⚖️", desc: "Volumen de trabajo y equilibrio personal" },
] as const;

const SEMESTRES = ["2026-I", "2025-II", "2025-I", "2024-II", "2024-I", "2023-II", "2023-I"];

type DimKey = typeof DIMENSIONES[number]["key"];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="text-xl leading-none transition-transform hover:scale-110"
        >
          {(hover || value) >= n ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

export function ReviewForm({ renipress, perfil, onCreated }: Props) {
  const canReview = perfil?.prof_level === "serums_activo" || perfil?.prof_level === "perenne";
  const [open, setOpen] = useState(false);
  const [semestre, setSemestre] = useState("2026-I");
  const [ratings, setRatings] = useState<Record<DimKey, number>>({
    rating_vivienda: 0,
    rating_equipo: 0,
    rating_jefatura: 0,
    rating_conectividad: 0,
    rating_seguridad: 0,
    rating_carga: 0,
  });
  const [texto, setTexto] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!perfil) {
    return (
      <div className="mt-6 rounded-2xl border border-qn-gold/30 bg-qn-gold/5 p-5 text-center">
        <p className="text-sm font-medium text-qn-brown">Inicia sesión para ver y escribir reseñas</p>
        <a href="/auth/magic-link" className="mt-2 inline-block text-xs text-qn-terracotta hover:underline">
          Entrar · Crear cuenta →
        </a>
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-qn-border bg-qn-soft/50 p-4 text-center">
        <p className="text-xs text-qn-text-muted">
          Para escribir una reseña necesitas estar activo/a en SERUMS y verificar tu identidad.
        </p>
        <a href="/perfil/verificacion" className="mt-1 inline-block text-xs text-qn-terracotta hover:underline">
          Verificar mi nivel →
        </a>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700">
        <Check size={16} /> Reseña publicada. ¡Gracias por contribuir!
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full rounded-xl border border-dashed border-qn-terracotta/50 bg-qn-terracotta/5 py-3 text-sm font-medium text-qn-terracotta transition-colors hover:bg-qn-terracotta/10"
      >
        + Escribir mi reseña de esta plaza
      </button>
    );
  }

  const allRated = Object.values(ratings).every((v) => v > 0);
  const canSubmit = allRated && texto.trim().length >= 50 && !sending;

  async function submit() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/plazas/${renipress}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semestre_servicio: semestre,
          ...ratings,
          texto: texto.trim(),
          pros: pros.split("\n").map((s) => s.trim()).filter(Boolean),
          cons: cons.split("\n").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const { error: e } = await res.json() as { error: string };
        setError(e ?? "Error al publicar");
        return;
      }
      setDone(true);
      setOpen(false);
      onCreated();
    } finally { setSending(false); }
  }

  return (
    <div className="mt-4 rounded-2xl border border-qn-border bg-qn-paper p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-qn-ink">Tu reseña</h3>

      {/* Semestre */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-qn-text-muted">Semestre de servicio</label>
        <select
          value={semestre}
          onChange={(e) => setSemestre(e.target.value)}
          className="w-full rounded-xl border border-qn-border bg-qn-soft px-3 py-2 text-sm text-qn-ink focus:border-qn-terracotta focus:outline-none"
        >
          {SEMESTRES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Dimensiones */}
      <div className="mb-4 space-y-3">
        {DIMENSIONES.map(({ key, label, emoji, desc }) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-sm font-medium text-qn-ink">{emoji} {label}</span>
              <p className="hidden text-[10px] text-qn-text-subtle sm:block">{desc}</p>
            </div>
            <div className="shrink-0">
              <StarPicker
                value={ratings[key]}
                onChange={(v) => setRatings((prev) => ({ ...prev, [key]: v }))}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Texto */}
      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-qn-text-muted">
          Tu experiencia <span className="text-qn-text-subtle">(mín. 50 caracteres)</span>
        </label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          maxLength={4000}
          placeholder="Describe tu experiencia en esta plaza: condiciones de vida, equipamiento, relación con el equipo de salud, pacientes, comunidad..."
          className="w-full resize-none rounded-xl border border-qn-border bg-qn-soft px-3 py-2.5 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none"
        />
        <div className="mt-0.5 text-right text-[10px] text-qn-text-subtle">{texto.length}/4000</div>
      </div>

      {/* Pros y contras */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-green-700">Lo bueno (opcional)</label>
          <textarea
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            rows={2}
            placeholder={"Uno por línea\nEj: Buen equipamiento"}
            className="w-full resize-none rounded-xl border border-green-200 bg-green-50/50 px-3 py-2 text-xs text-qn-ink placeholder:text-qn-text-subtle focus:border-green-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-red-600">Lo malo (opcional)</label>
          <textarea
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            rows={2}
            placeholder={"Uno por línea\nEj: Sin agua potable"}
            className="w-full resize-none rounded-xl border border-red-200 bg-red-50/50 px-3 py-2 text-xs text-qn-ink placeholder:text-qn-text-subtle focus:border-red-300 focus:outline-none"
          />
        </div>
      </div>

      {error && <p className="mb-3 text-xs text-qn-rust">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <button onClick={() => setOpen(false)} className="text-xs text-qn-text-muted hover:text-qn-ink">
          Cancelar
        </button>
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="flex items-center gap-2 rounded-full bg-qn-ink px-5 py-2 text-sm font-medium text-qn-bg disabled:opacity-50"
        >
          {sending ? <Loader2 size={14} className="animate-spin" /> : null}
          Publicar reseña
        </button>
      </div>
    </div>
  );
}
