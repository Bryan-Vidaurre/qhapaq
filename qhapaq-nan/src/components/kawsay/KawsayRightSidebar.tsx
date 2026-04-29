"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Loader2, Users, Lightbulb } from "lucide-react";
import { CATEGORIAS, type CategoriaKey } from "./KawsayLeftSidebar";

interface TopTema { id: string; titulo: string; votes_count: number; categoria: CategoriaKey }

const TIPS = [
  "Incluye el nombre de tu plaza y región para contexto.",
  "Las consultas clínicas con caso clínico completo reciben mejores respuestas.",
  "Marca tu tema como ✓ Resuelto cuando obtengas la respuesta que buscabas.",
  "Si respondes, cita fuentes cuando puedas (guías, protocolos MINSA).",
];

export function KawsayRightSidebar() {
  const [topTemas, setTopTemas] = useState<TopTema[]>([]);
  const [loading, setLoading]   = useState(true);
  const tipIdx = Math.floor(Date.now() / 86400000) % TIPS.length; // cambia cada día

  useEffect(() => {
    fetch("/api/kawsay/temas?sort=popular&pageSize=4")
      .then((r) => r.json())
      .then(({ data }) => setTopTemas(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="sticky top-20 space-y-3">
      {/* Temas más votados */}
      <div className="rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-qn-terracotta" />
          <h2 className="text-sm font-semibold text-qn-ink">Temas destacados</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-3"><Loader2 size={16} className="animate-spin text-qn-text-subtle" /></div>
        ) : topTemas.length === 0 ? (
          <p className="py-2 text-center text-xs text-qn-text-subtle">Sé el primero en publicar</p>
        ) : (
          <div className="space-y-2">
            {topTemas.map((t) => {
              const cat = CATEGORIAS[t.categoria];
              return (
                <Link key={t.id} href={`/kawsay/${t.id}`}
                  className="block rounded-xl border border-qn-border-soft p-2.5 transition-colors hover:border-qn-terracotta/40 hover:bg-qn-soft"
                >
                  <p className="mb-1.5 line-clamp-2 text-xs leading-snug text-qn-ink">{t.titulo}</p>
                  <div className="flex items-center justify-between">
                    <span style={{ color: cat.color, background: cat.bg }}
                      className="rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                    >
                      {cat.emoji} {cat.label}
                    </span>
                    <span className="text-[10px] text-qn-text-subtle">▲ {t.votes_count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Comunidad */}
      <div className="rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Users size={14} className="text-qn-terracotta" />
          <h2 className="text-sm font-semibold text-qn-ink">Acerca de Kawsay</h2>
        </div>
        <p className="text-[11px] leading-relaxed text-qn-text-muted">
          Foro de la comunidad serumista. Debate, consulta y aprende de colegas que
          vivieron o están viviendo la experiencia SERUMS en todo el Perú.
        </p>
      </div>

      {/* Tip del día */}
      <div className="rounded-2xl border border-qn-gold/30 bg-qn-gold/5 p-3.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Lightbulb size={13} className="text-qn-brown" />
          <p className="text-xs font-semibold text-qn-brown">Consejo del foro</p>
        </div>
        <p className="text-[11px] leading-relaxed text-qn-text-muted">{TIPS[tipIdx]}</p>
      </div>
    </div>
  );
}
