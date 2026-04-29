import Link from "next/link";
import { MessageSquare, CheckCircle2, TrendingUp, BookOpen, ShoppingBag, Leaf, MapPin } from "lucide-react";

export const CATEGORIAS = {
  consulta_clinica:   { label: "Consulta Clínica",   emoji: "🩺", color: "#1d4ed8", bg: "#eff6ff" },
  preparacion_serums: { label: "Preparación SERUMS", emoji: "📋", color: "#1F3F26", bg: "#E1F5EE" },
  mi_plaza:           { label: "Mi Plaza",            emoji: "🏥", color: "#8E3F11", bg: "#FBF4E4" },
  derechos_sueldo:    { label: "Derechos y Sueldo",  emoji: "⚖️", color: "#7e22ce", bg: "#f5f3ff" },
  vida_bienestar:     { label: "Vida y Bienestar",    emoji: "🌿", color: "#0f766e", bg: "#f0fdfa" },
  off_topic:          { label: "Off-topic",           emoji: "💬", color: "#6b7280", bg: "#f9fafb" },
} as const;

export type CategoriaKey = keyof typeof CATEGORIAS;

const RULES = [
  "Sé respetuoso y constructivo con tus colegas.",
  "No compartas información falsa o sin fuente.",
  "Para consultas clínicas, incluye contexto suficiente.",
  "Los casos reales de pacientes deben ser anonimizados.",
  "El foro es para profesionales de salud y estudiantes.",
];

interface Props {
  activeCategoria?: CategoriaKey | null;
}

export function KawsayLeftSidebar({ activeCategoria }: Props) {
  return (
    <div className="sticky top-20 space-y-3">
      {/* Categorías */}
      <div className="rounded-2xl border border-qn-border bg-qn-paper p-3 shadow-sm">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-qn-text-subtle">Categorías</p>
        <nav className="space-y-0.5">
          <Link href="/kawsay"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              !activeCategoria
                ? "bg-qn-ink/5 font-medium text-qn-ink"
                : "text-qn-text-muted hover:bg-qn-soft hover:text-qn-ink"
            }`}
          >
            <MessageSquare size={14} className="text-qn-text-subtle" />
            Todos los temas
          </Link>
          {(Object.entries(CATEGORIAS) as [CategoriaKey, typeof CATEGORIAS[CategoriaKey]][]).map(([key, cat]) => (
            <Link key={key} href={`/kawsay?cat=${key}`}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                activeCategoria === key
                  ? "bg-qn-ink/5 font-medium text-qn-ink"
                  : "text-qn-text-muted hover:bg-qn-soft hover:text-qn-ink"
              }`}
            >
              <span className="text-base leading-none">{cat.emoji}</span>
              <span className="truncate">{cat.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Reglas */}
      <div className="rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-qn-terracotta" />
          <h2 className="text-sm font-semibold text-qn-ink">Reglas de Kawsay</h2>
        </div>
        <ol className="space-y-2">
          {RULES.map((r, i) => (
            <li key={i} className="flex gap-2 text-[11px] leading-snug text-qn-text-muted">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-qn-soft text-[9px] font-bold text-qn-brown">{i + 1}</span>
              {r}
            </li>
          ))}
        </ol>
      </div>

      {/* Nav rápida */}
      <div className="rounded-2xl border border-qn-border bg-qn-paper p-3 shadow-sm">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-qn-text-subtle">Explorar</p>
        <nav className="space-y-0.5">
          {[
            { href: "/plazas",  label: "Mapa de plazas", icon: MapPin },
            { href: "/yachay",  label: "Yachay · Feed",  icon: BookOpen },
            { href: "/qhatus",  label: "Qhatus · Mercado", icon: ShoppingBag },
            { href: "/kawsay",  label: "Kawsay · Foro",  icon: Leaf, active: true },
          ].map(({ href, label, icon: Icon, active }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors ${
                active ? "text-qn-ink font-medium" : "text-qn-text-muted hover:bg-qn-soft hover:text-qn-ink"
              }`}
            >
              <Icon size={13} className={active ? "text-qn-terracotta" : "text-qn-text-subtle"} />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
