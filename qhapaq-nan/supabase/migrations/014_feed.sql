-- =============================================================
-- 014_feed.sql
-- Feed de publicaciones — corazón del Yachay social.
--
-- "Yachay" es el sistema de reputación (logros). El feed es donde
-- ese conocimiento se comparte: reflexiones, preguntas y guías de
-- serumistas activos y ex-serumistas.
--
-- Tablas:
--   posts             — publicaciones del feed
--   post_reactions    — likes (1 por usuario/post)
--   post_comments     — comentarios bajo cada publicación
-- =============================================================

-- -------------------------------------------------------------
-- Tipo de publicación
-- -------------------------------------------------------------
create type public.post_tipo as enum (
  'reflexion',   -- experiencia personal, anécdota
  'pregunta',    -- consulta a la comunidad
  'guia'         -- consejos prácticos, mini-tutorial
);

-- -------------------------------------------------------------
-- Posts
-- -------------------------------------------------------------
create table public.posts (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  tipo           public.post_tipo not null default 'reflexion',
  cuerpo         text        not null,

  -- Referencia opcional a una plaza específica del padrón
  plaza_id       uuid        references public.plazas(id) on delete set null,

  -- Ubicación de display (puede diferir de la plaza si plaza_id es null)
  -- Permite posts de "Lima → buscando SERUMS" sin plaza asociada
  ubicacion_texto text,

  -- Contadores mantenidos por trigger (denormalizados para evitar COUNT(*) en cada read)
  likes_count    int         not null default 0 check (likes_count >= 0),
  comments_count int         not null default 0 check (comments_count >= 0),

  -- Moderación
  is_hidden      boolean     not null default false,
  hidden_reason  text,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  edited_at      timestamptz,

  constraint post_cuerpo_len check (char_length(cuerpo) between 10 and 5000)
);

comment on table public.posts is
  'Feed social: reflexiones, preguntas y guías de la comunidad serumista.';
comment on column public.posts.ubicacion_texto is
  'Texto libre de ubicación para posts sin plaza_id ("Lima → buscando SERUMS", etc.)';

create index posts_feed    on public.posts (created_at desc) where not is_hidden;
create index posts_user    on public.posts (user_id);
create index posts_tipo    on public.posts (tipo) where not is_hidden;
create index posts_plaza   on public.posts (plaza_id) where plaza_id is not null;

create trigger set_updated_at_posts
  before update on public.posts
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------
-- Reacciones (likes) — 1 por usuario por post
-- -------------------------------------------------------------
create table public.post_reactions (
  post_id    uuid        not null references public.posts(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

comment on table public.post_reactions is
  'Un usuario solo puede dar "like" una vez por post.';

create index post_reactions_user on public.post_reactions (user_id);

-- Trigger: mantener likes_count actualizado
create or replace function public.update_post_likes_count()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update public.posts
       set likes_count = likes_count + 1
     where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.posts
       set likes_count = greatest(0, likes_count - 1)
     where id = old.post_id;
  end if;
  return null;
end;
$$;

create trigger trg_post_likes
  after insert or delete on public.post_reactions
  for each row execute function public.update_post_likes_count();

-- -------------------------------------------------------------
-- Comentarios
-- -------------------------------------------------------------
create table public.post_comments (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.posts(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  cuerpo     text        not null,
  is_hidden  boolean     not null default false,
  created_at timestamptz not null default now(),

  constraint comment_cuerpo_len check (char_length(cuerpo) between 1 and 1000)
);

comment on table public.post_comments is
  'Comentarios en los posts del feed. No se editan (eliminación blanda via is_hidden).';

create index post_comments_post on public.post_comments (post_id, created_at)
  where not is_hidden;
create index post_comments_user on public.post_comments (user_id);

-- Trigger: mantener comments_count actualizado
create or replace function public.update_post_comments_count()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update public.posts
       set comments_count = comments_count + 1
     where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.posts
       set comments_count = greatest(0, comments_count - 1)
     where id = old.post_id;
  end if;
  return null;
end;
$$;

create trigger trg_post_comments
  after insert or delete on public.post_comments
  for each row execute function public.update_post_comments_count();

-- -------------------------------------------------------------
-- Vista pública: posts + datos del autor (sin datos sensibles)
-- -------------------------------------------------------------
create or replace view public.posts_publicos
with (security_invoker = true) as
select
  p.id,
  p.user_id,
  p.tipo,
  p.cuerpo,
  p.plaza_id,
  p.ubicacion_texto,
  p.likes_count,
  p.comments_count,
  p.created_at,
  p.edited_at,
  -- Autor (solo campos públicos de perfiles)
  pf.nombre_publico,
  pf.avatar_url,
  pf.prof_level,
  pf.profesion_declarada_id
from public.posts p
join public.perfiles pf on pf.user_id = p.user_id
where not p.is_hidden;

comment on view public.posts_publicos is
  'Join de posts con datos públicos del autor. security_invoker = RLS del llamador.';

-- -------------------------------------------------------------
-- Row Level Security
-- -------------------------------------------------------------
alter table public.posts          enable row level security;
alter table public.post_reactions enable row level security;
alter table public.post_comments  enable row level security;

-- Posts: lectura pública (no is_hidden)
create policy "posts_select_public" on public.posts
  for select using (not is_hidden);

-- Posts: usuario autenticado puede crear
create policy "posts_insert_auth" on public.posts
  for insert with check (auth.uid() = user_id);

-- Posts: usuario puede editar/ocultar sus propios posts
create policy "posts_update_own" on public.posts
  for update using (auth.uid() = user_id);

-- Posts: usuario puede eliminar sus propios posts
create policy "posts_delete_own" on public.posts
  for delete using (auth.uid() = user_id);

-- Reactions: lectura pública
create policy "reactions_select" on public.post_reactions
  for select using (true);

-- Reactions: usuario autenticado da/quita like
create policy "reactions_insert" on public.post_reactions
  for insert with check (auth.uid() = user_id);

create policy "reactions_delete" on public.post_reactions
  for delete using (auth.uid() = user_id);

-- Comentarios: lectura pública (no is_hidden)
create policy "comments_select" on public.post_comments
  for select using (not is_hidden);

-- Comentarios: usuario autenticado puede comentar
create policy "comments_insert" on public.post_comments
  for insert with check (auth.uid() = user_id);

-- Comentarios: usuario puede eliminar (ocultar) sus propios comentarios
create policy "comments_delete" on public.post_comments
  for delete using (auth.uid() = user_id);
