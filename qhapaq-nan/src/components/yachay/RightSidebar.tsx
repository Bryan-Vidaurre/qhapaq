"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart, Loader2, TrendingUp, Users, MapPin,
  BookOpen, ShoppingBag, Leaf, Sparkles,
} from "lucide-react";

interface TopPost {
  id: string;
  cuerpo: string;
  likes_count: number;
  nombre_publico: string;
  ubicacion_texto: string | null;
}

const PRONTO = [
  { icon: ShoppingBag, label: "Qhatus",  desc: "Mercado de recursos SERUMS" },
  { icon: Leaf,        label: "Kawsay",  desc: "Foro de debates y comunidad" },
  { icon: MapPin,      label: "Reseñas", desc: "Plazas calificadas por serumistas" },
];

export function RightSidebar() {
  const [topGuias, setTopGuias] = useState<TopPost[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch("/api/posts?tipo=guia&sort=popular&pageSize=4")
      .then((r) => r.json())
      .then(({ data }) => setTopGuias(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="sticky top-20 space-y-3">
      {/* Top guías */}
      <div className="rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-qn-terracotta" />
          <h2 className="text-sm font-semibold text-qn-ink">Guías más útiles</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 size={16} className="animate-spin text-qn-text-subtle" />
          </div>
        ) : topGuias.length === 0 ? (
          <div className="py-3 text-center">
            <BookOpen size={20} className="mx-auto mb-1.5 text-qn-text-subtle" />
            <p className="text-xs text-qn-text-subtle">Sé el primero en publicar una guía</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topGuias.map((p) => (
              <a
                key={p.id}
                href={`/yachay#post-${p.id}`}
                className="block rounded-xl border border-qn-border-soft p-2.5 transition-colors hover:border-qn-terracotta/40 hover:bg-qn-soft"
              >
                <p className="mb-1.5 line-clamp-2 text-xs leading-snug text-qn-ink">{p.cuerpo}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-qn-text-subtle truncate max-w-[100px]">{p.nombre_publico}</span>
                  <span className="flex shrink-0 items-center gap-1 text-[10px] text-qn-text-subtle">
                    <Heart size={9} className="text-qn-rust" /> {p.likes_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Comunidad */}
      <div className="rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Users size={14} className="text-qn-terracotta" />
          <h2 className="text-sm font-semibold text-qn-ink">Comunidad</h2>
        </div>
        <div className="space-y-2 text-[11px] leading-relaxed text-qn-text-muted">
          <p>
            🩺 Médicos, enfermeros, obstetras y otros profesionales de salud compartiendo
            experiencias reales del SERUMS.
          </p>
          <p>
            📍 Plazas en todo el Perú — desde Loreto hasta Puno.
          </p>
          <p>
            🤝 Una comunidad construida por y para quienes recorren el camino.
          </p>
        </div>
        <Link
          href="/plazas"
          className="mt-3 block text-center text-xs font-medium text-qn-terracotta hover:underline"
        >
          Explorar el mapa de plazas →
        </Link>
      </div>

      {/* Próximamente */}
      <div className="rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-qn-terracotta" />
          <h2 className="text-sm font-semibold text-qn-ink">Próximamente</h2>
        </div>
        <ul className="space-y-2.5">
          {PRONTO.map(({ icon: Icon, label, desc }) => (
            <li key={label} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-qn-soft">
                <Icon size={12} className="text-qn-brown" />
              </div>
              <div>
                <p className="text-xs font-medium text-qn-ink">{label}</p>
                <p className="text-[10px] text-qn-text-subtle">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
