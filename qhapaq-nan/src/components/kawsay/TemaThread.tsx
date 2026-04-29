"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronUp, MessageSquare, CheckCircle2, Pin, Loader2,
  ArrowLeft, Trash2, CornerDownRight, MoreHorizontal, X,
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

interface Respuesta {
  id: string;
  tema_id: string;
  parent_id: string | null;
  cuerpo: string;
  is_answer: boolean;
  created_at: string;
  user_id: string;
  perfiles: {
    nombre_publico: string;
    avatar_url: string | null;
    prof_level: ProfLevel | null;
  } | null;
  // client-only
  is_own?: boolean;
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
// Toast
// ---------------------------------------------------------------------------
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-qn-ink px-5 py-2.5 text-sm font-medium text-qn-bg shadow-lg">
      {msg}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Avatar helper
// ---------------------------------------------------------------------------
function Avatar({ url, name, size = 8 }: { url: string | null; name: string; size?: number }) {
  const sz = `h-${size} w-${size}`;
  return (
    <div className={`${sz} shrink-0 flex items-center justify-center overflow-hidden rounded-full bg-qn-ink text-[9px] font-bold text-qn-gold`}>
      {url
        ? <img src={url} alt="" className="h-full w-full object-cover" />
        : name.charAt(0).toUpperCase()
      }
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reply form
// ---------------------------------------------------------------------------
function ReplyForm({
  temaId, parentId, perfil, autoFocus = false,
  onCreated, onCancel,
}: {
  temaId: string;
  parentId: string | null;
  perfil: Perfil;
  autoFocus?: boolean;
  onCreated: (r: Respuesta) => void;
  onCancel?: () => void;
}) {
  const [cuerpo, setCuerpo] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (autoFocus) ref.current?.focus(); }, [autoFocus]);

  async function submit() {
    if (cuerpo.trim().length < 1) return;
    setSending(true); setError(null);
    try {
      const res = await fetch(`/api/kawsay/temas/${temaId}/respuestas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuerpo: cuerpo.trim(), parent_id: parentId ?? undefined }),
      });
      if (!res.ok) {
        const { error: e } = await res.json() as { error: string };
        setError(e ?? "Error al publicar");
        return;
      }
      const { data } = await res.json() as { data: { id: string; created_at: string } };
      onCreated({
        id: data.id, tema_id: temaId, parent_id: parentId,
        cuerpo: cuerpo.trim(), is_answer: false,
        created_at: data.created_at, user_id: perfil.user_id,
        perfiles: { nombre_publico: perfil.nombre_publico, avatar_url: perfil.avatar_url, prof_level: perfil.prof_level },
        is_own: true,
      });
      setCuerpo("");
      onCancel?.();
    } finally { setSending(false); }
  }

  return (
    <div className="space-y-2">
      <textarea
        ref={ref}
        value={cuerpo}
        onChange={(e) => setCuerpo(e.target.value)}
        placeholder={parentId ? "Escribe una respuesta..." : "Escribe un comentario..."}
        rows={3}
        maxLength={5000}
        className="w-full resize-none rounded-xl border border-qn-border bg-qn-soft px-3 py-2.5 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none"
      />
      {error && <p className="text-xs text-qn-rust">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          onClick={submit}
          disabled={sending || cuerpo.trim().length < 1}
          className="flex items-center gap-1.5 rounded-full bg-qn-ink px-4 py-1.5 text-xs font-medium text-qn-bg disabled:opacity-50"
        >
          {sending ? <Loader2 size={12} className="animate-spin" /> : null}
          {parentId ? "Responder" : "Comentar"}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="rounded-full px-3 py-1.5 text-xs text-qn-text-muted hover:text-qn-ink">
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single respuesta card
// ---------------------------------------------------------------------------
function RespuestaCard({
  r, currentUserId, temaId, isTopLevel,
  onDelete, onReply, onMarkAnswer, isOwner,
}: {
  r: Respuesta;
  currentUserId: string | null;
  temaId: string;
  isTopLevel: boolean;
  onDelete: (id: string) => void;
  onReply: (parentId: string) => void;
  onMarkAnswer: (id: string, val: boolean) => void;
  isOwner: boolean; // tema owner
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const profile = r.perfiles;

  async function doDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/kawsay/temas/${temaId}/respuestas/${r.id}`, { method: "DELETE" });
      onDelete(r.id);
    } finally { setDeleting(false); }
  }

  async function toggleAnswer() {
    await fetch(`/api/kawsay/temas/${temaId}/respuestas/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_answer: !r.is_answer }),
    });
    onMarkAnswer(r.id, !r.is_answer);
    setShowMenu(false);
  }

  const isOwnReply = currentUserId === r.user_id;
  const canMenu = isOwnReply || isOwner;

  return (
    <div className={`relative flex gap-3 ${!isTopLevel ? "ml-8 border-l-2 border-qn-border-soft pl-4" : ""}`}>
      <Avatar url={profile?.avatar_url ?? null} name={profile?.nombre_publico ?? "?"} size={7} />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="font-medium text-qn-ink">{profile?.nombre_publico}</span>
          {profile?.prof_level && <VerificationBadge level={profile.prof_level} size="sm" showDot={false} />}
          {r.is_answer && (
            <span className="flex items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-medium text-green-700">
              <CheckCircle2 size={9} /> Respuesta aceptada
            </span>
          )}
          <span className="text-qn-text-subtle">{relTime(r.created_at)}</span>
        </div>

        {/* Body */}
        {confirmDelete ? (
          <div className="mb-2 flex items-center gap-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            <span>¿Eliminar este comentario?</span>
            <button onClick={doDelete} disabled={deleting}
              className="font-semibold underline disabled:opacity-50">
              {deleting ? "..." : "Sí"}
            </button>
            <button onClick={() => setConfirmDelete(false)} className="text-qn-text-subtle">No</button>
          </div>
        ) : (
          <p className="mb-1.5 whitespace-pre-wrap text-sm leading-relaxed text-qn-ink">{r.cuerpo}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 text-[11px] text-qn-text-subtle">
          {currentUserId && isTopLevel && (
            <button
              onClick={() => onReply(r.id)}
              className="flex items-center gap-1 hover:text-qn-ink"
            >
              <CornerDownRight size={11} /> Responder
            </button>
          )}
          {canMenu && !confirmDelete && (
            <div className="relative ml-auto">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="rounded p-0.5 hover:bg-qn-soft"
              >
                <MoreHorizontal size={13} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-5 z-20 min-w-[140px] rounded-xl border border-qn-border bg-qn-paper shadow-lg">
                  {isOwner && (
                    <button
                      onClick={toggleAnswer}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-qn-soft"
                    >
                      <CheckCircle2 size={12} className="text-green-600" />
                      {r.is_answer ? "Quitar como respuesta" : "Marcar como respuesta"}
                    </button>
                  )}
                  {isOwnReply && (
                    <button
                      onClick={() => { setConfirmDelete(true); setShowMenu(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-qn-soft"
                    >
                      <Trash2 size={12} /> Eliminar
                    </button>
                  )}
                  <button
                    onClick={() => setShowMenu(false)}
                    className="absolute -right-1 -top-1 rounded-full bg-qn-paper p-0.5 shadow"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main TemaThread
// ---------------------------------------------------------------------------
export function TemaThread({ temaId, perfil }: { temaId: string; perfil: Perfil | null }) {
  const router = useRouter();
  const [tema, setTema] = useState<Tema | null>(null);
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null); // parentId for inline reply
  const [toast, setToast] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDeleteTema, setConfirmDeleteTema] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/kawsay/temas/${temaId}`).then((r) => r.json()),
      fetch(`/api/kawsay/temas/${temaId}/respuestas`).then((r) => r.json()),
    ]).then(([temaRes, respRes]) => {
      setTema(temaRes.data ?? null);
      const rawRespuestas: Respuesta[] = respRes.data ?? [];
      const uid = temaRes.data?.user_id ?? null; // use tema owner as fallback; actual current user set below
      setRespuestas(rawRespuestas);
    }).finally(() => setLoading(false));
  }, [temaId]);

  // mark is_own on respuestas once we have the user from tema
  const currentUserId = perfil?.user_id ?? null;

  async function handleVote() {
    if (!perfil || !tema || voting) return;
    setVoting(true);
    const newVoted = !tema.has_voted;
    setTema((t) => t ? {
      ...t,
      has_voted: newVoted,
      votes_count: newVoted ? t.votes_count + 1 : Math.max(0, t.votes_count - 1),
    } : t);
    try { await fetch(`/api/kawsay/temas/${temaId}/vote`, { method: "POST" }); }
    finally { setVoting(false); }
  }

  async function toggleSolved() {
    if (!tema) return;
    const next = !tema.is_solved;
    await fetch(`/api/kawsay/temas/${temaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_solved: next }),
    });
    setTema((t) => t ? { ...t, is_solved: next } : t);
    setToast(next ? "Tema marcado como resuelto" : "Tema reabierto");
  }

  async function deleteTema() {
    setDeleting(true);
    try {
      await fetch(`/api/kawsay/temas/${temaId}`, { method: "DELETE" });
      router.push("/kawsay");
    } finally { setDeleting(false); }
  }

  function handleNewRespuesta(r: Respuesta) {
    setRespuestas((prev) => [...prev, { ...r, is_own: currentUserId === r.user_id }]);
    setTema((t) => t ? { ...t, replies_count: t.replies_count + 1 } : t);
    setReplyTo(null);
    setToast("Comentario publicado");
  }

  function handleDeleteRespuesta(id: string) {
    setRespuestas((prev) => prev.filter((r) => r.id !== id));
    setTema((t) => t ? { ...t, replies_count: Math.max(0, t.replies_count - 1) } : t);
    setToast("Comentario eliminado");
  }

  function handleMarkAnswer(id: string, val: boolean) {
    setRespuestas((prev) => prev.map((r) => r.id === id ? { ...r, is_answer: val } : r));
    setToast(val ? "Marcado como respuesta aceptada" : "Marcado desactivado");
  }

  // Build threaded tree: top-level + their children (1 level)
  const topLevel = respuestas.filter((r) => !r.parent_id);
  const childrenOf = (id: string) => respuestas.filter((r) => r.parent_id === id);

  if (loading) {
    return (
      <div className="w-full animate-pulse space-y-4">
        <div className="h-6 w-2/3 rounded-full bg-qn-soft" />
        <div className="h-4 w-full rounded-full bg-qn-soft" />
        <div className="h-4 w-5/6 rounded-full bg-qn-soft" />
        <div className="mt-6 h-28 rounded-2xl bg-qn-soft" />
      </div>
    );
  }

  if (!tema) {
    return (
      <div className="rounded-2xl border border-dashed border-qn-border bg-qn-paper p-10 text-center">
        <p className="text-sm text-qn-text-muted">Tema no encontrado.</p>
        <Link href="/kawsay" className="mt-3 inline-block text-xs text-qn-terracotta hover:underline">← Volver al foro</Link>
      </div>
    );
  }

  const cat = CATEGORIAS[tema.categoria];

  return (
    <div className="w-full">
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      {/* Back */}
      <Link href="/kawsay" className="mb-4 flex items-center gap-1.5 text-xs text-qn-text-muted hover:text-qn-ink">
        <ArrowLeft size={13} /> Volver al foro
      </Link>

      {/* Tema card */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-qn-border bg-qn-paper shadow-sm">
        <div className="flex gap-0">
          {/* Vote column */}
          <div className="flex w-12 shrink-0 flex-col items-center gap-0.5 border-r border-qn-border-soft bg-qn-soft/50 px-1.5 py-4">
            <button
              onClick={handleVote}
              disabled={!perfil || voting}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-default ${
                tema.has_voted
                  ? "bg-qn-terracotta/15 text-qn-terracotta"
                  : "text-qn-text-subtle hover:bg-qn-terracotta/10 hover:text-qn-terracotta"
              }`}
              aria-label="Votar"
            >
              <ChevronUp size={20} strokeWidth={2.5} />
            </button>
            <span className={`text-sm font-bold ${tema.has_voted ? "text-qn-terracotta" : "text-qn-text-muted"}`}>
              {tema.votes_count}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            {/* Meta badges */}
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
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

            <h1 className="mb-2 text-base font-bold leading-snug text-qn-ink">{tema.titulo}</h1>

            {tema.cuerpo && (
              <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-qn-ink">{tema.cuerpo}</p>
            )}

            {/* Footer */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-qn-text-subtle">
              <div className="flex items-center gap-1">
                <Avatar url={tema.avatar_url} name={tema.nombre_publico} size={5} />
                <span>{tema.nombre_publico}</span>
                {tema.prof_level && <VerificationBadge level={tema.prof_level} size="sm" showDot={false} />}
              </div>
              <span>·</span>
              <span title={new Date(tema.created_at).toLocaleString("es-PE")}>{relTime(tema.created_at)}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <MessageSquare size={10} /> {tema.replies_count} {tema.replies_count === 1 ? "respuesta" : "respuestas"}
              </span>

              {/* Owner actions */}
              {tema.is_own && (
                <>
                  <span>·</span>
                  <button
                    onClick={toggleSolved}
                    className={`flex items-center gap-0.5 hover:text-qn-ink ${tema.is_solved ? "text-green-600" : ""}`}
                  >
                    <CheckCircle2 size={10} />
                    {tema.is_solved ? "Reabrir" : "Marcar resuelto"}
                  </button>
                  <span>·</span>
                  {confirmDeleteTema ? (
                    <span className="flex items-center gap-1.5 text-red-600">
                      ¿Eliminar tema?
                      <button onClick={deleteTema} disabled={deleting} className="font-semibold underline disabled:opacity-50">
                        {deleting ? "..." : "Sí"}
                      </button>
                      <button onClick={() => setConfirmDeleteTema(false)}>No</button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteTema(true)}
                      className="flex items-center gap-0.5 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={10} /> Eliminar tema
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reply form (top-level) */}
      {perfil && (
        <div className="mb-6 rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Avatar url={perfil.avatar_url} name={perfil.nombre_publico} size={7} />
            <span className="text-xs font-medium text-qn-ink">Deja un comentario</span>
          </div>
          <ReplyForm
            temaId={temaId}
            parentId={null}
            perfil={perfil}
            onCreated={handleNewRespuesta}
          />
        </div>
      )}

      {/* Replies */}
      <div className="space-y-4">
        {topLevel.length === 0 && !perfil && (
          <div className="rounded-2xl border border-dashed border-qn-border bg-qn-paper p-8 text-center">
            <MessageSquare size={24} className="mx-auto mb-2 text-qn-text-subtle" />
            <p className="text-sm text-qn-text-muted">Sin comentarios todavía. Inicia sesión para participar.</p>
          </div>
        )}
        {topLevel.length === 0 && perfil && (
          <p className="py-4 text-center text-xs text-qn-text-subtle">Sin respuestas aún — sé el primero.</p>
        )}

        {topLevel.map((r) => {
          const children = childrenOf(r.id);
          return (
            <div key={r.id} className="rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm space-y-3">
              <RespuestaCard
                r={{ ...r, is_own: currentUserId === r.user_id }}
                currentUserId={currentUserId}
                temaId={temaId}
                isTopLevel={true}
                onDelete={handleDeleteRespuesta}
                onReply={(pid) => setReplyTo((prev) => prev === pid ? null : pid)}
                onMarkAnswer={handleMarkAnswer}
                isOwner={tema.is_own}
              />

              {/* Inline reply form for this top-level comment */}
              {replyTo === r.id && perfil && (
                <div className="ml-10 mt-2">
                  <ReplyForm
                    temaId={temaId}
                    parentId={r.id}
                    perfil={perfil}
                    autoFocus
                    onCreated={handleNewRespuesta}
                    onCancel={() => setReplyTo(null)}
                  />
                </div>
              )}

              {/* Nested children */}
              {children.length > 0 && (
                <div className="space-y-3 pt-1">
                  {children.map((child) => (
                    <RespuestaCard
                      key={child.id}
                      r={{ ...child, is_own: currentUserId === child.user_id }}
                      currentUserId={currentUserId}
                      temaId={temaId}
                      isTopLevel={false}
                      onDelete={handleDeleteRespuesta}
                      onReply={() => setReplyTo(r.id)} // replies to children → reply to parent
                      onMarkAnswer={handleMarkAnswer}
                      isOwner={tema.is_own}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!perfil && topLevel.length > 0 && (
        <div className="mt-6 rounded-2xl border border-qn-gold/30 bg-qn-gold/5 p-4 text-center">
          <p className="text-sm font-medium text-qn-brown">Inicia sesión para responder</p>
          <p className="mt-1 text-xs text-qn-text-muted">Únete a la conversación.</p>
        </div>
      )}
    </div>
  );
}
