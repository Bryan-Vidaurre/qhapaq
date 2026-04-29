"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Heart, MessageCircle, MapPin, Send, ChevronDown, ChevronUp,
  PenLine, Loader2, BookOpen, X, Route, ShoppingBag,
  ImagePlus, Video, Play, Lock, MoreHorizontal, Trash2,
  Pencil, Link2, Flag, Bookmark, BookmarkCheck,
} from "lucide-react";
import type { Perfil, ProfLevel } from "@/types/user";
import { VerificationBadge } from "@/components/perfil/VerificationBadge";
import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type PostTipo = "reflexion" | "pregunta" | "guia";
interface MediaItem { url: string; tipo: "imagen" | "video"; mime: string }

interface Post {
  id: string;
  user_id: string;
  tipo: PostTipo;
  cuerpo: string;
  plaza_id: string | null;
  ubicacion_texto: string | null;
  media: MediaItem[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  edited_at: string | null;
  nombre_publico: string;
  avatar_url: string | null;
  prof_level: ProfLevel | null;
  profesion_declarada_id: string | null;
  has_liked: boolean;
  is_own: boolean;
}

interface Comment {
  id: string;
  cuerpo: string;
  created_at: string;
  user_id: string;
  perfiles: { nombre_publico: string; avatar_url: string | null; prof_level: ProfLevel | null } | null;
}

interface PendingFile {
  file: File; previewUrl: string; tipo: "imagen" | "video";
  uploading: boolean; uploadedUrl?: string; error?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TIPO_CONFIG: Record<PostTipo, { label: string; color: string; bg: string }> = {
  reflexion: { label: "Reflexión", color: "#8E3F11", bg: "#FBF4E4" },
  pregunta:  { label: "Pregunta",  color: "#1d4ed8", bg: "#eff6ff" },
  guia:      { label: "Guía",      color: "#1F3F26", bg: "#E1F5EE" },
};

const NIVELES_VIDEO = ["estudiante", "egresado", "colegiado", "serums_activo", "perenne"];

function canUploadVideos(perfil: Perfil): boolean {
  return !!perfil.prof_level && NIVELES_VIDEO.includes(perfil.prof_level);
}

function relTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "ahora";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

function fileExt(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png",
    "image/webp": "webp", "image/gif": "gif",
    "video/mp4": "mp4", "video/webm": "webm",
    "video/quicktime": "mov", "video/x-m4v": "m4v",
  };
  return map[mime] ?? "bin";
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-qn-ink px-5 py-2.5 text-sm text-qn-bg shadow-lg">
      {message}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
function PostSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-2.5">
        <div className="h-9 w-9 shrink-0 rounded-full bg-qn-soft" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-28 rounded-full bg-qn-soft" />
          <div className="h-2.5 w-16 rounded-full bg-qn-soft" />
        </div>
        <div className="h-5 w-16 rounded-full bg-qn-soft" />
      </div>
      <div className="mb-3 space-y-2">
        <div className="h-3 w-full rounded-full bg-qn-soft" />
        <div className="h-3 w-5/6 rounded-full bg-qn-soft" />
        <div className="h-3 w-4/6 rounded-full bg-qn-soft" />
      </div>
      <div className="flex gap-4 border-t border-qn-border-soft pt-2.5">
        <div className="h-4 w-12 rounded-full bg-qn-soft" />
        <div className="h-4 w-14 rounded-full bg-qn-soft" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expandable text ("Ver más")
// ---------------------------------------------------------------------------
const TRUNCATE_AT = 300;

function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > TRUNCATE_AT;
  const shown = long && !expanded ? text.slice(0, TRUNCATE_AT).trimEnd() + "…" : text;
  return (
    <div className="mb-3">
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-qn-text">{shown}</p>
      {long && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-medium text-qn-terracotta hover:underline"
        >
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post menu (3-dot dropdown)
// ---------------------------------------------------------------------------
function PostMenu({
  isOwn, onEdit, onDelete, onCopyLink, onReport,
}: {
  isOwn: boolean;
  onEdit: () => void; onDelete: () => void;
  onCopyLink: () => void; onReport: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Opciones"
        className="flex h-7 w-7 items-center justify-center rounded-full text-qn-text-subtle transition-colors hover:bg-qn-soft hover:text-qn-ink"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 min-w-[195px] overflow-hidden rounded-2xl border border-qn-border bg-qn-paper py-1 shadow-lg">
          {isOwn && (
            <>
              <button
                onClick={() => { setOpen(false); onEdit(); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-qn-ink hover:bg-qn-soft"
              >
                <Pencil size={14} className="text-qn-text-subtle" /> Editar publicación
              </button>
              <button
                onClick={() => { setOpen(false); onDelete(); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-qn-rust hover:bg-qn-soft"
              >
                <Trash2 size={14} /> Eliminar publicación
              </button>
              <div className="my-1 border-t border-qn-border-soft" />
            </>
          )}
          <button
            onClick={() => { setOpen(false); onCopyLink(); }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-qn-ink hover:bg-qn-soft"
          >
            <Link2 size={14} className="text-qn-text-subtle" /> Copiar enlace
          </button>
          {!isOwn && (
            <button
              onClick={() => { setOpen(false); onReport(); }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-qn-text-muted hover:bg-qn-soft"
            >
              <Flag size={14} className="text-qn-text-subtle" /> Reportar contenido
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Glosario
// ---------------------------------------------------------------------------
const TERMINOS = [
  { quechua: "Qhapaq Ñan", homolog: "Red de caminos", es: "El gran camino del Inca — la red vial más extensa del mundo antiguo", icon: Route },
  { quechua: "Yachay",     homolog: "Feed",            es: "Conocimiento — publicaciones, reflexiones y preguntas de la comunidad", icon: BookOpen },
  { quechua: "Qhatus",     homolog: "Marketplace",     es: "Mercado — recursos, materiales y oportunidades entre colegas", icon: ShoppingBag },
  { quechua: "Kawsay",     homolog: "Foro",             es: "Vida — espacio de debate, experiencias y comunidad", icon: Heart },
];

function GlosarioBar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-qn-gold/30 bg-qn-gold/5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-qn-brown">
          <BookOpen size={14} />
          ¿Qué significan los nombres en quechua?
        </span>
        {open ? <ChevronUp size={15} className="text-qn-text-subtle" /> : <ChevronDown size={15} className="text-qn-text-subtle" />}
      </button>
      {open && (
        <div className="border-t border-qn-gold/20 px-4 pb-4 pt-3">
          <p className="mb-3 text-xs text-qn-text-muted">
            Qhapaq Ñan usa términos quechuas — el idioma nativo de los Andes — como
            reconocimiento a las comunidades donde trabajan los serumistas.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TERMINOS.map(({ quechua, homolog, es, icon: Icon }) => (
              <div key={quechua} className="rounded-xl border border-qn-gold/20 bg-qn-paper p-2.5">
                <div className="mb-1 flex items-center gap-1.5">
                  <Icon size={12} className="text-qn-brown" />
                  <span className="text-xs font-semibold text-qn-ink">{quechua}</span>
                </div>
                <span className="mb-1 inline-block rounded-full bg-qn-gold/20 px-1.5 py-0.5 text-[10px] font-medium text-qn-brown">{homolog}</span>
                <p className="text-[11px] leading-snug text-qn-text-muted">{es}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Media grid (display)
// ---------------------------------------------------------------------------
function MediaGrid({ media }: { media: MediaItem[] }) {
  if (!media.length) return null;
  const images = media.filter((m) => m.tipo === "imagen");
  const video  = media.find((m) => m.tipo === "video");

  if (video) {
    return (
      <div className="mb-3 overflow-hidden rounded-xl bg-black">
        <video src={video.url} controls preload="metadata" className="max-h-72 w-full object-contain" />
      </div>
    );
  }
  if (images.length === 1) {
    return (
      <div className="mb-3 overflow-hidden rounded-xl">
        <img src={images[0]!.url} alt="" className="max-h-80 w-full object-cover" />
      </div>
    );
  }
  return (
    <div className="mb-3 grid grid-cols-2 gap-1">
      {images.slice(0, 4).map((img, i) => (
        <div key={img.url} className={`overflow-hidden rounded-xl ${images.length === 3 && i === 0 ? "col-span-2" : ""}`}>
          <img src={img.url} alt="" className="h-36 w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Media uploader (create form)
// ---------------------------------------------------------------------------
function MediaUploader({
  perfil, pending, onAdd, onRemove,
}: {
  perfil: Perfil; pending: PendingFile[];
  onAdd: (files: PendingFile[]) => void; onRemove: (idx: number) => void;
}) {
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);
  const hasVideo  = pending.some((p) => p.tipo === "video");
  const hasImages = pending.some((p) => p.tipo === "imagen");
  const canAddImage = !hasVideo && pending.filter((p) => p.tipo === "imagen").length < 4;
  const canAddVideo = canUploadVideos(perfil) && !hasImages && !hasVideo;
  const videoLocked = !canUploadVideos(perfil);

  function handleFiles(files: FileList | null, tipo: "imagen" | "video") {
    if (!files) return;
    onAdd(Array.from(files).map((f) => ({ file: f, previewUrl: URL.createObjectURL(f), tipo, uploading: false })));
  }

  return (
    <div className="mt-2">
      {pending.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {pending.map((p, i) => (
            <div key={i} className="relative">
              {p.tipo === "imagen"
                ? <img src={p.previewUrl} alt="" className="h-20 w-20 rounded-xl border border-qn-border object-cover" />
                : (
                  <div className="flex h-20 w-32 items-center justify-center rounded-xl border border-qn-border bg-qn-soft">
                    <Play size={22} className="text-qn-brown" />
                    <span className="ml-1.5 max-w-[80px] truncate text-xs text-qn-text-muted">{p.file.name}</span>
                  </div>
                )
              }
              {p.uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
                  <Loader2 size={18} className="animate-spin text-white" />
                </div>
              )}
              {p.error && (
                <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-red-500/80 px-1 py-0.5 text-center text-[9px] text-white">Error</div>
              )}
              {!p.uploading && (
                <button
                  onClick={() => onRemove(i)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-qn-border bg-qn-paper shadow-sm"
                >
                  <X size={10} className="text-qn-text-muted" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input ref={imgRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files, "imagen")} />
        <input ref={vidRef} type="file" accept="video/mp4,video/webm,video/quicktime,video/x-m4v" hidden onChange={(e) => handleFiles(e.target.files, "video")} />
        <button type="button" onClick={() => imgRef.current?.click()} disabled={!canAddImage}
          title={!canAddImage ? "Máximo 4 fotos por post" : "Añadir fotos"}
          className="flex items-center gap-1.5 rounded-full border border-qn-border px-3 py-1.5 text-xs text-qn-text-muted transition-colors hover:border-qn-terracotta hover:text-qn-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ImagePlus size={13} /> Fotos
        </button>
        <button type="button" onClick={() => !videoLocked && vidRef.current?.click()} disabled={!canAddVideo}
          title={videoLocked ? "Videos disponibles para usuarios verificados" : !canAddVideo ? "Solo 1 vídeo por post" : "Añadir vídeo"}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
            videoLocked
              ? "cursor-not-allowed border-qn-border/50 text-qn-text-subtle/60"
              : canAddVideo
                ? "border-qn-border text-qn-text-muted hover:border-qn-terracotta hover:text-qn-ink"
                : "cursor-not-allowed border-qn-border/50 text-qn-text-subtle/60"
          }`}
        >
          {videoLocked ? <Lock size={11} /> : <Video size={13} />}
          {videoLocked ? "Video · solo verificados" : "Video"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create post form
// ---------------------------------------------------------------------------
function CreatePostForm({ perfil, onCreated }: { perfil: Perfil; onCreated: (p: Post) => void }) {
  const [open, setOpen]         = useState(false);
  const [tipo, setTipo]         = useState<PostTipo>("reflexion");
  const [cuerpo, setCuerpo]     = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [pending, setPending]   = useState<PendingFile[]>([]);
  const [sending, setSending]   = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tipoOpts: { v: PostTipo; label: string; hint: string }[] = [
    { v: "reflexion", label: "Reflexión", hint: "Una experiencia o anécdota personal" },
    { v: "pregunta",  label: "Pregunta",  hint: "Consulta a la comunidad" },
    { v: "guia",      label: "Guía",      hint: "Consejo práctico o mini-tutorial" },
  ];

  function handleAddFiles(files: PendingFile[]) {
    setPending((prev) => {
      if (files[0]?.tipo === "video") return [...files];
      const imgs = prev.filter((p) => p.tipo === "imagen");
      return [...prev.filter((p) => p.tipo !== "imagen"), ...imgs, ...files.slice(0, 4 - imgs.length)];
    });
  }

  function handleRemove(idx: number) {
    setPending((prev) => {
      const removed = prev[idx];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function uploadFiles(): Promise<MediaItem[]> {
    if (!pending.length) return [];
    const supabase = createClient();
    const results: MediaItem[] = [];
    for (let i = 0; i < pending.length; i++) {
      const p = pending[i]!;
      setPending((prev) => prev.map((f, j) => j === i ? { ...f, uploading: true } : f));
      const ext  = fileExt(p.file.type);
      const path = `${perfil.user_id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { data, error } = await supabase.storage.from("post-media").upload(path, p.file, { contentType: p.file.type });
      if (error || !data) {
        setPending((prev) => prev.map((f, j) => j === i ? { ...f, uploading: false, error: error?.message ?? "Error" } : f));
        throw new Error(`Error al subir ${p.file.name}`);
      }
      const { data: { publicUrl } } = supabase.storage.from("post-media").getPublicUrl(data.path);
      setPending((prev) => prev.map((f, j) => j === i ? { ...f, uploading: false, uploadedUrl: publicUrl } : f));
      results.push({ url: publicUrl, tipo: p.tipo, mime: p.file.type });
    }
    return results;
  }

  async function submit() {
    if (!cuerpo.trim() || cuerpo.length < 10) return;
    setSending(true);
    setUploadError(null);
    let media: MediaItem[] = [];
    try {
      media = await uploadFiles();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Error al subir archivos");
      setSending(false);
      return;
    }
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, cuerpo: cuerpo.trim(), ubicacion_texto: ubicacion.trim() || undefined, media }),
      });
      if (!res.ok) {
        const { error } = await res.json() as { error: string };
        setUploadError(error ?? "Error al publicar");
        return;
      }
      const { data } = await res.json() as { data: { id: string; created_at: string } };
      onCreated({
        id: data.id, user_id: perfil.user_id, tipo, cuerpo: cuerpo.trim(),
        plaza_id: null, ubicacion_texto: ubicacion.trim() || null, media,
        likes_count: 0, comments_count: 0, created_at: data.created_at, edited_at: null,
        nombre_publico: perfil.nombre_publico, avatar_url: perfil.avatar_url,
        prof_level: perfil.prof_level, profesion_declarada_id: perfil.profesion_declarada_id,
        has_liked: false, is_own: true,
      });
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setCuerpo(""); setUbicacion(""); setTipo("reflexion"); setPending([]); setOpen(false);
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setTimeout(() => textareaRef.current?.focus(), 50); }}
        className="mb-5 flex w-full items-center gap-3 rounded-2xl border border-qn-border bg-qn-paper px-4 py-3.5 text-left shadow-sm transition-colors hover:border-qn-terracotta"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-qn-ink text-[11px] font-semibold text-qn-gold">
          {perfil.nombre_publico.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm text-qn-text-subtle">¿Qué quieres compartir con la comunidad?</span>
        <PenLine size={15} className="ml-auto text-qn-text-subtle" />
      </button>
    );
  }

  return (
    <div className="mb-5 rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
      <div className="mb-3 flex gap-2">
        {tipoOpts.map(({ v, label }) => {
          const cfg = TIPO_CONFIG[v];
          return (
            <button key={v} onClick={() => setTipo(v)}
              style={tipo === v ? { color: cfg.color, background: cfg.bg, borderColor: cfg.color + "40" } : {}}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                tipo === v ? "border-current" : "border-qn-border text-qn-text-subtle hover:border-qn-terracotta"
              }`}
            >
              {label}
            </button>
          );
        })}
        <button onClick={() => setOpen(false)} className="ml-auto text-qn-text-subtle hover:text-qn-ink">
          <X size={16} />
        </button>
      </div>
      <textarea ref={textareaRef} value={cuerpo} onChange={(e) => setCuerpo(e.target.value)}
        placeholder={tipoOpts.find((t) => t.v === tipo)?.hint + "..."}
        rows={4} maxLength={5000}
        className="w-full resize-none rounded-xl border border-qn-border bg-qn-soft px-3 py-2.5 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none"
      />
      <div className="mt-0.5 text-right text-[10px] text-qn-text-subtle">{cuerpo.length}/5000</div>
      <input type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}
        placeholder="Ubicación (opcional) — ej: Pozuzo, Pasco" maxLength={200}
        className="mt-2 w-full rounded-xl border border-qn-border bg-qn-soft px-3 py-2 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none"
      />
      <MediaUploader perfil={perfil} pending={pending} onAdd={handleAddFiles} onRemove={handleRemove} />
      {uploadError && (
        <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{uploadError}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-qn-text-subtle">
          {cuerpo.length < 10 ? `${10 - cuerpo.length} caracteres mínimo` : ""}
        </span>
        <button onClick={submit} disabled={sending || cuerpo.length < 10}
          className="flex items-center gap-2 rounded-full bg-qn-ink px-5 py-2 text-sm font-medium text-qn-bg disabled:opacity-50"
        >
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          Publicar
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Comments section
// ---------------------------------------------------------------------------
function CommentsSection({
  postId, perfil, onCountChange,
}: {
  postId: string; perfil: Perfil | null;
  onCountChange: (delta: number) => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading]   = useState(true);
  const [cuerpo, setCuerpo]     = useState("");
  const [sending, setSending]   = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((r) => r.json())
      .then(({ data }) => setComments(data ?? []))
      .finally(() => setLoading(false));
  }, [postId]);

  async function submit() {
    if (!cuerpo.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuerpo: cuerpo.trim() }),
      });
      if (!res.ok) return;
      const { data } = await res.json() as { data: { id: string; created_at: string } };
      setComments((prev) => [...prev, {
        id: data.id, cuerpo: cuerpo.trim(), created_at: data.created_at,
        user_id: perfil?.user_id ?? "",
        perfiles: perfil ? { nombre_publico: perfil.nombre_publico, avatar_url: perfil.avatar_url, prof_level: perfil.prof_level } : null,
      }]);
      setCuerpo("");
      onCountChange(1);
    } finally { setSending(false); }
  }

  async function deleteComment(commentId: string) {
    const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) return;
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    onCountChange(-1);
  }

  if (loading) {
    return <div className="py-3 text-center text-xs text-qn-text-subtle"><Loader2 size={14} className="inline animate-spin" /></div>;
  }

  return (
    <div className="border-t border-qn-border-soft pt-3">
      {comments.length === 0 && (
        <p className="pb-2 text-center text-xs text-qn-text-subtle">Sin comentarios · sé el primero</p>
      )}
      {comments.map((c) => (
        <div key={c.id} className="mb-2.5 flex gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-qn-soft text-[10px] font-semibold text-qn-brown">
            {c.perfiles?.nombre_publico?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 rounded-xl bg-qn-soft px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-medium text-qn-ink">{c.perfiles?.nombre_publico ?? "Usuario"}</span>
                <span className="ml-2 text-[10px] text-qn-text-subtle">{relTime(c.created_at)}</span>
              </div>
              {perfil && c.user_id === perfil.user_id && (
                <button
                  onClick={() => deleteComment(c.id)}
                  title="Eliminar comentario"
                  className="flex h-5 w-5 items-center justify-center rounded-full text-qn-text-subtle transition-colors hover:text-qn-rust"
                >
                  <X size={10} />
                </button>
              )}
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-qn-text-muted">{c.cuerpo}</p>
          </div>
        </div>
      ))}
      {perfil && (
        <div className="mt-2 flex gap-2">
          <input
            type="text" value={cuerpo} onChange={(e) => setCuerpo(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Escribe un comentario…" maxLength={1000}
            className="flex-1 rounded-full border border-qn-border bg-qn-soft px-3 py-1.5 text-xs text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none"
          />
          <button onClick={submit} disabled={sending || !cuerpo.trim()}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-qn-ink text-qn-bg disabled:opacity-50"
          >
            {sending ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post card
// ---------------------------------------------------------------------------
function PostCard({
  post, perfil, bookmarked,
  onLikeToggle, onDelete, onUpdate, onBookmarkToggle, onToast,
}: {
  post: Post; perfil: Perfil | null; bookmarked: boolean;
  onLikeToggle: (id: string, liked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Post>) => void;
  onBookmarkToggle: (id: string) => void;
  onToast: (msg: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [liking, setLiking]             = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [editMode, setEditMode]         = useState(false);
  const [editCuerpo, setEditCuerpo]     = useState(post.cuerpo);
  const [editUbicacion, setEditUbicacion] = useState(post.ubicacion_texto ?? "");
  const [editSaving, setEditSaving]     = useState(false);
  const [editError, setEditError]       = useState<string | null>(null);
  const cfg = TIPO_CONFIG[post.tipo];

  async function handleLike() {
    if (!perfil || liking) return;
    setLiking(true);
    onLikeToggle(post.id, !post.has_liked);
    try { await fetch(`/api/posts/${post.id}/like`, { method: "POST" }); }
    finally { setLiking(false); }
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (res.ok || res.status === 204) {
      onDelete(post.id);
    } else {
      onToast("Error al eliminar la publicación");
      setConfirmDelete(false);
      setDeleting(false);
    }
  }

  async function handleSaveEdit() {
    if (editCuerpo.trim().length < 10) return;
    setEditSaving(true);
    setEditError(null);
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cuerpo: editCuerpo.trim(), ubicacion_texto: editUbicacion.trim() || null }),
    });
    if (!res.ok) {
      const { error } = await res.json() as { error: string };
      setEditError(error ?? "Error al guardar");
      setEditSaving(false);
      return;
    }
    const { data } = await res.json() as { data: { cuerpo: string; ubicacion_texto: string | null; edited_at: string } };
    onUpdate(post.id, { cuerpo: data.cuerpo, ubicacion_texto: data.ubicacion_texto, edited_at: data.edited_at });
    setEditMode(false);
    setEditSaving(false);
    onToast("Publicación editada");
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/yachay#post-${post.id}`;
    navigator.clipboard.writeText(url).catch(() => {});
    onToast("¡Enlace copiado!");
  }

  return (
    <article id={`post-${post.id}`} className="rounded-2xl border border-qn-border bg-qn-paper p-4 shadow-sm">
      {/* Header */}
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-qn-ink text-[11px] font-semibold text-qn-gold">
            {post.avatar_url
              ? <img src={post.avatar_url} alt={post.nombre_publico} className="h-9 w-9 object-cover" />
              : post.nombre_publico.charAt(0).toUpperCase()
            }
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-semibold text-qn-ink">{post.nombre_publico}</span>
              {post.prof_level && <VerificationBadge level={post.prof_level} size="sm" showDot />}
            </div>
            <div className="flex flex-wrap items-center gap-1 text-[11px] text-qn-text-subtle">
              {post.ubicacion_texto && !editMode && (
                <><MapPin size={10} /><span>{post.ubicacion_texto}</span><span>·</span></>
              )}
              <span title={new Date(post.created_at).toLocaleString("es-PE")}>{relTime(post.created_at)}</span>
              {post.edited_at && <span className="italic">(editado)</span>}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span style={{ color: cfg.color, background: cfg.bg }} className="rounded-full px-2 py-0.5 text-[10px] font-medium">
            {cfg.label}
          </span>
          {perfil && (
            <PostMenu
              isOwn={post.is_own}
              onEdit={() => { setEditMode(true); setEditCuerpo(post.cuerpo); setEditUbicacion(post.ubicacion_texto ?? ""); }}
              onDelete={() => setConfirmDelete(true)}
              onCopyLink={handleCopyLink}
              onReport={() => onToast("Gracias. Revisaremos el contenido.")}
            />
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-qn-rust/20 bg-qn-rust/5 px-3 py-2.5">
          <span className="flex-1 text-sm text-qn-ink">¿Eliminar esta publicación?</span>
          <button onClick={handleDelete} disabled={deleting}
            className="rounded-full bg-qn-rust px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
          >
            {deleting ? <Loader2 size={11} className="animate-spin" /> : "Sí, eliminar"}
          </button>
          <button onClick={() => setConfirmDelete(false)}
            className="rounded-full border border-qn-border px-3 py-1 text-xs text-qn-text-muted"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Edit mode */}
      {editMode ? (
        <div className="mb-3">
          <textarea
            value={editCuerpo} onChange={(e) => setEditCuerpo(e.target.value)}
            maxLength={5000} rows={4} autoFocus
            className="w-full resize-none rounded-xl border border-qn-terracotta/40 bg-qn-soft px-3 py-2.5 text-sm text-qn-ink focus:border-qn-terracotta focus:outline-none"
          />
          <div className="mt-0.5 mb-2 text-right text-[10px] text-qn-text-subtle">{editCuerpo.length}/5000</div>
          <input
            type="text" value={editUbicacion} onChange={(e) => setEditUbicacion(e.target.value)}
            placeholder="Ubicación (opcional)" maxLength={200}
            className="w-full rounded-xl border border-qn-border bg-qn-soft px-3 py-2 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none"
          />
          {editError && <p className="mt-1.5 text-xs text-qn-rust">{editError}</p>}
          <div className="mt-2.5 flex gap-2">
            <button onClick={handleSaveEdit} disabled={editSaving || editCuerpo.trim().length < 10}
              className="flex items-center gap-1.5 rounded-full bg-qn-ink px-4 py-1.5 text-xs font-medium text-qn-bg disabled:opacity-50"
            >
              {editSaving && <Loader2 size={11} className="animate-spin" />}
              Guardar cambios
            </button>
            <button onClick={() => { setEditMode(false); setEditError(null); }}
              className="rounded-full border border-qn-border px-4 py-1.5 text-xs text-qn-text-muted"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <ExpandableText text={post.cuerpo} />
          {post.media?.length > 0 && <MediaGrid media={post.media} />}
        </>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-qn-border-soft pt-2.5">
        <button onClick={handleLike} disabled={!perfil}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            post.has_liked ? "text-qn-rust" : "text-qn-text-subtle hover:text-qn-rust"
          } disabled:cursor-default`}
        >
          <Heart size={16} fill={post.has_liked ? "currentColor" : "none"} className={liking ? "animate-pulse" : ""} />
          {post.likes_count > 0 && <span className="text-xs">{post.likes_count}</span>}
        </button>

        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 text-sm text-qn-text-subtle transition-colors hover:text-qn-ink"
        >
          <MessageCircle size={16} />
          {post.comments_count > 0 && <span className="text-xs">{post.comments_count}</span>}
          {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {perfil && (
          <button
            onClick={() => onBookmarkToggle(post.id)}
            title={bookmarked ? "Quitar guardado" : "Guardar publicación"}
            className={`ml-auto flex items-center transition-colors ${
              bookmarked ? "text-qn-brown" : "text-qn-text-subtle hover:text-qn-brown"
            }`}
          >
            {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        )}
      </div>

      {showComments && (
        <div className="mt-3">
          <CommentsSection
            postId={post.id}
            perfil={perfil}
            onCountChange={(delta) => onUpdate(post.id, { comments_count: Math.max(0, post.comments_count + delta) })}
          />
        </div>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
interface YachayFeedProps { perfil: Perfil | null }

export function YachayFeed({ perfil }: YachayFeedProps) {
  const [posts, setPosts]           = useState<Post[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tipoFilter, setTipoFilter] = useState<PostTipo | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore]       = useState(true);
  const [toast, setToast]           = useState<string | null>(null);
  const [bookmarks, setBookmarks]   = useState<Set<string>>(new Set());
  const pageRef    = useRef(1);
  const busyRef    = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("qn-bookmarks");
      if (stored) setBookmarks(new Set(JSON.parse(stored) as string[]));
    } catch {}
  }, []);

  const loadPosts = useCallback(async (reset = false) => {
    if (busyRef.current) return;
    busyRef.current = true;
    const nextPage = reset ? 1 : pageRef.current + 1;
    const params = new URLSearchParams({ page: String(nextPage), pageSize: "20" });
    if (tipoFilter) params.set("tipo", tipoFilter);
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const { data } = await fetch(`/api/posts?${params}`).then((r) => r.json()) as { data: Post[] };
      if (reset) { setPosts(data ?? []); pageRef.current = 1; }
      else { setPosts((prev) => [...prev, ...(data ?? [])]); pageRef.current = nextPage; }
      setHasMore((data ?? []).length === 20);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      busyRef.current = false;
    }
  }, [tipoFilter]);

  useEffect(() => { loadPosts(true); }, [loadPosts]);

  // Infinite scroll sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting && hasMore && !busyRef.current) loadPosts(false); },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadPosts]);

  function handleLikeToggle(postId: string, liked: boolean) {
    setPosts((prev) => prev.map((p) =>
      p.id === postId
        ? { ...p, has_liked: liked, likes_count: liked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1) }
        : p,
    ));
  }

  function handleDelete(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  function handleUpdate(postId: string, updates: Partial<Post>) {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, ...updates } : p));
  }

  function handleBookmarkToggle(postId: string) {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      try { localStorage.setItem("qn-bookmarks", JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  const tabs: { label: string; value: PostTipo | null }[] = [
    { label: "Todo", value: null },
    { label: "Reflexiones", value: "reflexion" },
    { label: "Preguntas", value: "pregunta" },
    { label: "Guías", value: "guia" },
  ];

  return (
    <div className="w-full">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <GlosarioBar />

      <div className="mb-5">
        <h1 className="qn-display text-2xl text-qn-ink">Yachay</h1>
        <p className="mt-0.5 text-sm text-qn-text-muted">Lo que la comunidad serumista comparte, pregunta y enseña.</p>
      </div>

      {perfil && <CreatePostForm perfil={perfil} onCreated={(p) => setPosts((prev) => [p, ...prev])} />}

      <div className="mb-4 flex gap-1 overflow-x-auto pb-1">
        {tabs.map(({ label, value }) => (
          <button key={label} onClick={() => setTipoFilter(value)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              tipoFilter === value
                ? "bg-qn-ink text-qn-bg"
                : "border border-qn-border text-qn-text-muted hover:border-qn-terracotta"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-qn-border bg-qn-paper p-10 text-center">
          <BookOpen size={28} className="mx-auto mb-3 text-qn-text-subtle" />
          <p className="text-sm font-medium text-qn-ink">
            {tipoFilter ? `Sin ${tipoFilter}es todavía` : "El feed está vacío"}
          </p>
          <p className="mt-1 text-xs text-qn-text-muted">Sé el primero en publicar.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              perfil={perfil}
              bookmarked={bookmarks.has(post.id)}
              onLikeToggle={handleLikeToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onBookmarkToggle={handleBookmarkToggle}
              onToast={setToast}
            />
          ))}
          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-1" />
          {loadingMore && (
            <div className="flex justify-center py-4">
              <Loader2 size={20} className="animate-spin text-qn-text-subtle" />
            </div>
          )}
          {!hasMore && posts.length >= 20 && (
            <p className="py-4 text-center text-xs text-qn-text-subtle">— Has visto todo el feed —</p>
          )}
        </div>
      )}

      {!perfil && posts.length > 0 && (
        <div className="mt-6 rounded-2xl border border-qn-gold/30 bg-qn-gold/5 p-4 text-center">
          <p className="text-sm font-medium text-qn-brown">Crea una cuenta para participar</p>
          <p className="mt-1 text-xs text-qn-text-muted">Publica, haz preguntas y apoya a tus colegas.</p>
        </div>
      )}
    </div>
  );
}
