"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Calendar, BookOpen, MessageSquare, ArrowLeft } from "lucide-react";
import { VerificationBadge } from "@/components/perfil/VerificationBadge";
import { CATEGORIAS, type CategoriaKey } from "@/components/kawsay/KawsayLeftSidebar";
import type { ProfLevel } from "@/types/user";

const PROFESION_LABEL: Record<string, string> = {
  "MEDICINA": "Medicina", "ENFERMERIA": "Enfermería", "OBSTETRICIA": "Obstetricia",
  "ODONTOLOGIA": "Odontología", "PSICOLOGIA": "Psicología", "NUTRICION": "Nutrición",
  "QUIMICO FARMACEUTICO": "Quím. Farmacéutico", "BIOLOGIA": "Biología",
  "TRABAJO SOCIAL": "Trabajo Social", "MEDICINA VETERINARIA": "Med. Veterinaria",
  "INGENIERIA SANITARIA": "Ing. Sanitaria", "TM - LABORATORIO CLINICO": "T.M. Laboratorio",
  "TM - TERAPIA FISICA": "T.M. Terapia Física", "TM - RADIOLOGIA": "T.M. Radiología",
  "TM - TERAPIA LENGUAJE": "T.M. T. Lenguaje", "TM - TERAPIA OCUPACIONAL": "T.M. T. Ocupacional",
  "TM - OPTOMETRIA": "T.M. Optometría",
};

interface PublicPerfil {
  user_id: string;
  nombre_publico: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  prof_level: ProfLevel | null;
  profesion_declarada_id: string | null;
  yachay: number;
  created_at: string;
}

interface Post {
  id: string;
  tipo: string;
  cuerpo: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Tema {
  id: string;
  categoria: CategoriaKey;
  titulo: string;
  votes_count: number;
  replies_count: number;
  created_at: string;
}

function relTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 86400) return "hoy";
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

export function PublicProfile({ userId }: { userId: string }) {
  const [perfil, setPerfil] = useState<PublicPerfil | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/u/${userId}`).then((r) => r.json()),
      fetch(`/api/posts?user_id=${userId}&pageSize=6`).then((r) => r.json()),
      fetch(`/api/kawsay/temas?user_id=${userId}&pageSize=6`).then((r) => r.json()),
    ]).then(([profileRes, postsRes, temasRes]) => {
      if (!profileRes.data) { setNotFound(true); return; }
      setPerfil(profileRes.data);
      setPosts(postsRes.data ?? []);
      setTemas(temasRes.data ?? []);
    }).finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse space-y-4 px-4 py-10">
        <div className="h-24 w-24 rounded-full bg-qn-soft" />
        <div className="h-6 w-1/3 rounded-full bg-qn-soft" />
        <div className="h-4 w-2/3 rounded-full bg-qn-soft" />
      </div>
    );
  }

  if (notFound || !perfil) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-sm text-qn-text-muted">Perfil no encontrado.</p>
        <Link href="/" className="mt-3 inline-block text-xs text-qn-terracotta hover:underline">← Inicio</Link>
      </div>
    );
  }

  const iniciales = perfil.nombre_publico.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  const profesion = perfil.profesion_declarada_id ? (PROFESION_LABEL[perfil.profesion_declarada_id] ?? perfil.profesion_declarada_id) : null;
  const miembroDesde = new Date(perfil.created_at).toLocaleDateString("es-PE", { month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/plazas" className="mb-6 inline-flex items-center gap-1.5 text-xs text-qn-text-muted hover:text-qn-ink">
        <ArrowLeft size={13} /> Explorar plazas
      </Link>

      {/* Tarjeta de perfil */}
      <div className="mb-6 overflow-hidden rounded-3xl border border-qn-border bg-qn-paper shadow-sm">
        <div className="h-16 bg-gradient-to-r from-qn-ink via-qn-brown to-qn-terracotta" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between">
            <div className="-mt-9 flex h-18 w-18 items-center justify-center overflow-hidden rounded-full border-4 border-qn-paper bg-qn-ink" style={{ height: 72, width: 72 }}>
              {perfil.avatar_url
                ? <img src={perfil.avatar_url} alt={perfil.nombre_publico} className="h-full w-full object-cover" />
                : <span className="text-xl font-semibold text-qn-gold">{iniciales}</span>
              }
            </div>
          </div>
          <div className="mt-3">
            <h1 className="qn-display text-2xl leading-tight text-qn-ink">{perfil.nombre_publico}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {profesion && <span className="text-sm text-qn-text-muted">{profesion}</span>}
              {perfil.prof_level && <VerificationBadge level={perfil.prof_level} size="sm" />}
            </div>
            {perfil.bio && (
              <p className="mt-2 text-sm leading-relaxed text-qn-text-muted">{perfil.bio}</p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-qn-border-soft pt-4 text-xs text-qn-text-subtle">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-qn-gold" />
              {perfil.yachay} Yachay
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Miembro desde {miembroDesde}
            </span>
          </div>
        </div>
      </div>

      {/* Últimos posts en Yachay */}
      {posts.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen size={14} className="text-qn-text-subtle" />
            <h2 className="text-sm font-semibold text-qn-ink">Publicaciones en Yachay</h2>
          </div>
          <div className="space-y-2">
            {posts.map((p) => (
              <div key={p.id} className="rounded-xl border border-qn-border-soft bg-qn-paper px-4 py-3">
                <p className="line-clamp-2 text-sm text-qn-ink">{p.cuerpo}</p>
                <div className="mt-1 flex gap-3 text-[10px] text-qn-text-subtle">
                  <span>♥ {p.likes_count}</span>
                  <span>💬 {p.comments_count}</span>
                  <span>{relTime(p.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Últimos temas en Kawsay */}
      {temas.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare size={14} className="text-qn-text-subtle" />
            <h2 className="text-sm font-semibold text-qn-ink">Temas en Kawsay</h2>
          </div>
          <div className="space-y-2">
            {temas.map((t) => {
              const cat = CATEGORIAS[t.categoria];
              return (
                <Link key={t.id} href={`/kawsay/${t.id}`}
                  className="block rounded-xl border border-qn-border-soft bg-qn-paper px-4 py-3 hover:border-qn-terracotta/40"
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    <span style={{ color: cat.color, background: cat.bg }}
                      className="rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                    >
                      {cat.emoji} {cat.label}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm font-medium text-qn-ink">{t.titulo}</p>
                  <div className="mt-1 flex gap-3 text-[10px] text-qn-text-subtle">
                    <span>▲ {t.votes_count}</span>
                    <span>💬 {t.replies_count}</span>
                    <span>{relTime(t.created_at)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {posts.length === 0 && temas.length === 0 && (
        <div className="rounded-2xl border border-dashed border-qn-border p-8 text-center">
          <p className="text-sm text-qn-text-muted">Este usuario aún no ha publicado nada.</p>
        </div>
      )}
    </div>
  );
}
