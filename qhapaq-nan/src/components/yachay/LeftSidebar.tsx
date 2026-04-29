import Link from "next/link";
import { MapPin, BookOpen, ShoppingBag, Leaf, UserCircle, Settings, Shield } from "lucide-react";
import { VerificationBadge } from "@/components/perfil/VerificationBadge";
import type { Perfil } from "@/types/user";

const PROFESION_SHORT: Record<string, string> = {
  "MEDICINA": "Medicina",
  "ENFERMERIA": "Enfermería",
  "OBSTETRICIA": "Obstetricia",
  "ODONTOLOGIA": "Odontología",
  "PSICOLOGIA": "Psicología",
  "NUTRICION": "Nutrición",
  "QUIMICO FARMACEUTICO": "Q. Farmacéutico",
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

const NIVEL_LABEL: Record<string, string> = {
  autodeclarado: "Autodeclarado",
  estudiante:    "Estudiante",
  egresado:      "Egresado",
  colegiado:     "Colegiado",
  serums_activo: "SERUMS Activo",
  perenne:       "Perenne",
};

const NAV_LINKS = [
  { href: "/plazas",  label: "Mapa de plazas", icon: MapPin },
  { href: "/yachay",  label: "Yachay",          icon: BookOpen,    active: true },
  { href: "/qhatus",  label: "Qhatus",           icon: ShoppingBag },
  { href: "/kawsay",  label: "Kawsay",           icon: Leaf },
];

export function LeftSidebar({ perfil }: { perfil: Perfil }) {
  const profesion = perfil.profesion_declarada_id
    ? (PROFESION_SHORT[perfil.profesion_declarada_id] ?? perfil.profesion_declarada_id)
    : null;
  const nivel = perfil.prof_level ?? "autodeclarado";
  const needsVerification = !perfil.prof_level || perfil.prof_level === "autodeclarado";

  return (
    <div className="sticky top-20 space-y-3">
      {/* Profile card */}
      <div className="rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
        <div className="mb-3 flex flex-col items-center text-center">
          <div className="mb-2.5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-qn-ink text-xl font-semibold text-qn-gold">
            {perfil.avatar_url
              ? <img src={perfil.avatar_url} alt={perfil.nombre_publico} className="h-16 w-16 object-cover" />
              : perfil.nombre_publico.charAt(0).toUpperCase()
            }
          </div>
          <p className="text-sm font-semibold text-qn-ink leading-tight">{perfil.nombre_publico}</p>
          {profesion && <p className="mt-0.5 text-xs text-qn-text-muted">{profesion}</p>}
          <div className="mt-2">
            <VerificationBadge level={nivel} size="md" />
          </div>
          {perfil.bio && (
            <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-qn-text-subtle">{perfil.bio}</p>
          )}
          {perfil.yachay > 0 && (
            <div className="mt-2 flex items-center gap-1.5 rounded-full bg-qn-gold/15 px-2.5 py-1">
              <span className="text-[10px] font-semibold text-qn-brown">{perfil.yachay} pts Yachay</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link href="/perfil"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-qn-border py-1.5 text-xs text-qn-text-muted transition-colors hover:border-qn-ink hover:text-qn-ink"
          >
            <UserCircle size={12} /> Perfil
          </Link>
          <Link href="/perfil/editar"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-qn-border py-1.5 text-xs text-qn-text-muted transition-colors hover:border-qn-ink hover:text-qn-ink"
          >
            <Settings size={12} /> Editar
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="rounded-2xl border border-qn-border bg-qn-paper p-3 shadow-sm">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-qn-text-subtle">Navegación</p>
        <nav className="space-y-0.5">
          {NAV_LINKS.map(({ href, label, icon: Icon, active }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-qn-ink/5 font-medium text-qn-ink"
                  : "text-qn-text-muted hover:bg-qn-soft hover:text-qn-ink"
              }`}
            >
              <Icon size={15} className={active ? "text-qn-terracotta" : "text-qn-text-subtle"} />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Verification nudge */}
      {needsVerification && (
        <div className="rounded-2xl border border-qn-gold/30 bg-qn-gold/5 p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Shield size={13} className="text-qn-brown" />
            <p className="text-xs font-semibold text-qn-brown">Verifica tu identidad</p>
          </div>
          <p className="mb-2.5 text-[11px] leading-relaxed text-qn-text-muted">
            Sube de nivel <strong className="text-qn-ink">{NIVEL_LABEL[nivel]} → Estudiante</strong> para acceder
            al mercado de recursos y mayor visibilidad en el feed.
          </p>
          <Link href="/perfil/verificacion"
            className="flex items-center justify-center rounded-full bg-qn-ink px-3 py-1.5 text-xs font-medium text-qn-gold"
          >
            Subir de nivel →
          </Link>
        </div>
      )}
    </div>
  );
}
