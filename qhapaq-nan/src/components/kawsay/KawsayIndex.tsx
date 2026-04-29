"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronUp, MessageSquare, CheckCircle2, Pin, Loader2,
  PenLine, X, ChevronDown,
} from "lucide-react";
import { VerificationBadge } from "@/components/perfil/VerificationBadge";
import { CATEGORIAS, type CategoriaKey } from "./KawsayLeftSidebar";
import type { Perfil, ProfLevel } from "@/types/user";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Tema {
  id: string;
  user_id: string;
  categoria: CategoriaKey;
  titulo: string;
  cuerpo: string | null;
  votes_count: number;
  replies_count: number;
  is_solved: boolean;
  is_pinned: boolean;
  created_at: string;
  last_reply_at: string | null;
  nombre_publico: string;
  avatar_url: string | null;
  prof_level: ProfLevel | null;
  has_voted: boolean;
  is_own: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function relTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "ahora";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
function TemaSkeleton() {
  return (
    <div className="animate-pulse flex gap-3 rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
      <div className="flex w-10 shrink-0 flex-col items-center gap-1 pt-1">
        <div className="h-5 w-5 rounded bg-qn-soft" />
        <div className="h-3 w-6 rounded bg-qn-soft" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded-full bg-qn-soft" />
        <div className="h-3 w-full rounded-full bg-qn-soft" />
        <div className="flex gap-2">
          <div className="h-4 w-20 rounded-full bg-qn-soft" />
          <div className="h-4 w-16 rounded-full bg-qn-soft" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tema card (Reddit-style: vote column left, content right)
// ---------------------------------------------------------------------------
function TemaCard({
  tema, perfil,
  onVote,
}: {
  tema: Tema; perfil: Perfil | null;
  onVote: (id: string, voted: boolean) => void;
}) {
  const [voting, setVoting] = useState(false);
  const cat = CATEGORIAS[tema.categoria];

  async function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    if (!perfil || voting) return;
    setVoting(true);
    onVote(tema.id, !tema.has_voted);
    try { await fetch(`/api/kawsay/temas/${tema.id}/vote`, { method: "POST" }); }
    finally { setVoting(false); }
  }

  return (
    <Link href={`/kawsay/${tema.id}`}
      className="group flex gap-0 overflow-hidden rounded-2xl border border-qn-border bg-qn-paper shadow-sm transition-colors hover:border-qn-terracotta/50"
    >
      {/* Vote column — Reddit style */}
      <div className="flex w-12 shrink-0 flex-col items-center gap-0.5 border-r border-qn-border-soft bg-qn-soft/50 px-1.5 py-4">
        <button
          onClick={handleVote}
          disabled={!perfil || voting}
          className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors disabled:cursor-default ${
            tema.has_voted
              ? "bg-qn-terracotta/15 text-qn-terracotta"
              : "text-qn-text-subtle hover:bg-qn-terracotta/10 hover:text-qn-terracotta"
          }`}
          aria-label="Votar"
        >
          <ChevronUp size={18} strokeWidth={2.5} />
        </button>
        <span className={`text-xs font-semibold ${tema.has_voted ? "text-qn-terracotta" : "text-qn-text-muted"}`}>
          {tema.votes_count}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-3.5">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          {tema.is_pinned && (
            <span className="flex items-center gap-0.5 rounded-full bg-qn-ink/8 px-1.5 py-0.5 text-[9px] font-medium text-qn-ink">
              <Pin size={8} /> Fijado
            </span>
          )}
          <span style={{ color: cat.color, background: cat.bg }}
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
          >
            {cat.emoji} {cat.label}
          </span>
          {tema.is_solved && (
            <span className="flex items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-medium text-green-700">
              <CheckCircle2 size={9} /> Resuelto
            </span>
          )}
        </div>

        <h2 className="mb-1 text-sm font-semibold leading-snug text-qn-ink group-hover:text-qn-terracotta line-clamp-2">
          {tema.titulo}
        </h2>

        {tema.cuerpo && (
          <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-qn-text-muted">{tema.cuerpo}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 text-[10px] text-qn-text-subtle">
          <div className="flex items-center gap-1">
            <div className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-full bg-qn-ink text-[8px] font-bold text-qn-gold">
              {tema.avatar_url
                ? <img src={tema.avatar_url} alt="" className="h-4 w-4 object-cover" />
                : tema.nombre_publico.charAt(0).toUpperCase()
              }
            </div>
            <span>{tema.nombre_publico}</span>
            {tema.prof_level && <VerificationBadge level={tema.prof_level} size="sm" showDot={false} />}
          </div>
          <span>·</span>
          <span title={new Date(tema.created_at).toLocaleString("es-PE")}>{relTime(tema.created_at)}</span>
          <span>·</span>
          <span className="flex items-center gap-0.5">
            <MessageSquare size={10} /> {tema.replies_count} {tema.replies_count === 1 ? "respuesta" : "respuestas"}
          </span>
          {tema.last_reply_at && tema.replies_count > 0 && (
            <><span>·</span><span>Última actividad {relTime(tema.last_reply_at)}</span></>
          )}
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Create tema form (modal-like inline panel)
// ---------------------------------------------------------------------------
function CreateTemaForm({ perfil, onCreated }: { perfil: Perfil; onCreated: (t: Tema) => void }) {
  const [open, setOpen]         = useState(false);
  const [categoria, setCategoria] = useState<CategoriaKey>("consulta_clinica");
  const [titulo, setTitulo]     = useState("");
  const [cuerpo, setCuerpo]     = useState("");
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit() {
    if (titulo.trim().length < 5) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/kawsay/temas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria, titulo: titulo.trim(), cuerpo: cuerpo.trim() || undefined }),
      });
      if (!res.ok) {
        const { error: e } = await res.json() as { error: string };
        setError(e ?? "Error al publicar");
        return;
      }
      const { data } = await res.json() as { data: { id: string; created_at: string } };
      onCreated({
        id: data.id, user_id: perfil.user_id, categoria, titulo: titulo.trim(),
        cuerpo: cuerpo.trim() || null, votes_count: 0, replies_count: 0,
        is_solved: false, is_pinned: false, created_at: data.created_at, last_reply_at: null,
        nombre_publico: perfil.nombre_publico, avatar_url: perfil.avatar_url,
        prof_level: perfil.prof_level, has_voted: false, is_own: true,
      });
      setTitulo(""); setCuerpo(""); setCategoria("consulta_clinica"); setOpen(false);
    } finally { setSending(false); }
  }

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-qn-border bg-qn-paper px-4 py-3.5 text-left shadow-sm transition-colors hover:border-qn-terracotta"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-qn-ink text-[11px] font-semibold text-qn-gold">
          {perfil.nombre_publico.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm text-qn-text-subtle">¿Tienes una pregunta o experiencia que compartir?</span>
        <PenLine size={15} className="ml-auto shrink-0 text-qn-text-subtle" />
      </button>
    );
  }

  return (
    <div className="mb-4 rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-qn-ink">Nuevo tema</h2>
        <button onClick={() => setOpen(false)} className="text-qn-text-subtle hover:text-qn-ink">
          <X size={16} />
        </button>
      </div>

      {/* Categoría selector */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(Object.entries(CATEGORIAS) as [CategoriaKey, typeof CATEGORIAS[CategoriaKey]][]).map(([key, cat]) => (
          <button key={key} type="button" onClick={() => setCategoria(key)}
            style={categoria === key ? { color: cat.color, background: cat.bg, borderColor: cat.color + "40" } : {}}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
              categoria === key ? "border-current" : "border-qn-border text-qn-text-subtle hover:border-qn-terracotta"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título del tema — sé específico y claro"
        maxLength={200}
        className="mb-2 w-full rounded-xl border border-qn-border bg-qn-soft px-3 py-2.5 text-sm font-medium text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none"
      />
      <div className="mb-0.5 text-right text-[10px] text-qn-text-subtle">{titulo.length}/200</div>

      <textarea
        value={cuerpo}
        onChange={(e) => setCuerpo(e.target.value)}
        placeholder="Descripción, contexto o detalle del caso (opcional)"
        rows={4}
        maxLength={10000}
        className="w-full resize-none rounded-xl border border-qn-border bg-qn-soft px-3 py-2.5 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none"
      />

      {error && <p className="mt-2 text-xs text-qn-rust">{error}</p>}

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-qn-text-subtle">
          {titulo.trim().length < 5 ? `Mínimo 5 caracteres en el título` : ""}
        </span>
        <button onClick={submit} disabled={sending || titulo.trim().length < 5}
          className="flex items-center gap-2 rounded-full bg-qn-ink px-5 py-2 text-sm font-medium text-qn-bg disabled:opacity-50"
        >
          {sending ? <Loader2 size={14} className="animate-spin" /> : null}
          Publicar tema
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main KawsayIndex
// ---------------------------------------------------------------------------
type SortKey = "reciente" | "popular" | "activo" | "sin_respuesta";

const SORT_TABS: { label: string; value: SortKey }[] = [
  { label: "Reciente",      value: "reciente"      },
  { label: "Popular",       value: "popular"       },
  { label: "Más activo",    value: "activo"        },
  { label: "Sin respuesta", value: "sin_respuesta" },
];

export function KawsayIndex({ perfil }: { perfil: Perfil | null }) {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const catParam      = (searchParams.get("cat") ?? null) as CategoriaKey | null;
  const [sort, setSort]   = useState<SortKey>("reciente");
  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef  = useRef(1);
  const busyRef  = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadTemas = useCallback(async (reset = false) => {
    if (busyRef.current) return;
    busyRef.current = true;
    const nextPage = reset ? 1 : pageRef.current + 1;
    const params = new URLSearchParams({ sort, page: String(nextPage), pageSize: "25" });
    if (catParam) params.set("categoria", catParam);
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const { data } = await fetch(`/api/kawsay/temas?${params}`).then((r) => r.json()) as { data: Tema[] };
      if (reset) { setTemas(data ?? []); pageRef.current = 1; }
      else { setTemas((prev) => [...prev, ...(data ?? [])]); pageRef.current = nextPage; }
      setHasMore((data ?? []).length === 25);
    } finally { setLoading(false); setLoadingMore(false); busyRef.current = false; }
  }, [sort, catParam]);

  useEffect(() => { loadTemas(true); }, [loadTemas]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting && hasMore && !busyRef.current) loadTemas(false); },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadTemas]);

  function handleVote(temaId: string, voted: boolean) {
    setTemas((prev) => prev.map((t) =>
      t.id === temaId
        ? { ...t, has_voted: voted, votes_count: voted ? t.votes_count + 1 : Math.max(0, t.votes_count - 1) }
        : t,
    ));
  }

  const catInfo = catParam ? CATEGORIAS[catParam] : null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4">
        <h1 className="qn-display text-2xl text-qn-ink">
          {catInfo ? `${catInfo.emoji} ${catInfo.label}` : "Kawsay"}
        </h1>
        <p className="mt-0.5 text-sm text-qn-text-muted">
          {catInfo
            ? `Temas de la categoría ${catInfo.label}`
            : "El foro de la comunidad serumista. Debate, consulta y aprende."
          }
        </p>
      </div>

      {/* Create form */}
      {perfil && <CreateTemaForm perfil={perfil} onCreated={(t) => setTemas((prev) => [t, ...prev])} />}

      {/* Sort tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto pb-1">
        {SORT_TABS.map(({ label, value }) => (
          <button key={value} onClick={() => setSort(value)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              sort === value
                ? "bg-qn-ink text-qn-bg"
                : "border border-qn-border text-qn-text-muted hover:border-qn-terracotta"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category filter pills (all categories shown) */}
      {!catParam && (
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
          {(Object.entries(CATEGORIAS) as [CategoriaKey, typeof CATEGORIAS[CategoriaKey]][]).map(([key, cat]) => (
            <button key={key}
              onClick={() => router.push(`/kawsay?cat=${key}`)}
              style={{ color: cat.color, background: cat.bg }}
              className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium"
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map((i) => <TemaSkeleton key={i} />)}</div>
      ) : temas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-qn-border bg-qn-paper p-10 text-center">
          <MessageSquare size={28} className="mx-auto mb-3 text-qn-text-subtle" />
          <p className="text-sm font-medium text-qn-ink">
            {catParam ? "Sin temas en esta categoría todavía" : "El foro está vacío"}
          </p>
          <p className="mt-1 text-xs text-qn-text-muted">Sé el primero en publicar un tema.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {temas.map((t) => (
            <TemaCard key={t.id} tema={t} perfil={perfil} onVote={handleVote} />
          ))}
          <div ref={sentinelRef} className="h-1" />
          {loadingMore && (
            <div className="flex justify-center py-4">
              <Loader2 size={20} className="animate-spin text-qn-text-subtle" />
            </div>
          )}
          {!hasMore && temas.length >= 25 && (
            <p className="py-4 text-center text-xs text-qn-text-subtle">— Has visto todos los temas —</p>
          )}
        </div>
      )}

      {!perfil && temas.length > 0 && (
        <div className="mt-6 rounded-2xl border border-qn-gold/30 bg-qn-gold/5 p-4 text-center">
          <p className="text-sm font-medium text-qn-brown">Inicia sesión para participar</p>
          <p className="mt-1 text-xs text-qn-text-muted">Publica temas, responde y vota.</p>
        </div>
      )}
    </div>
  );
}
