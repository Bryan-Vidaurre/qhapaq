-- =============================================================
-- 016_kawsay.sql
-- Foro Kawsay: comunidad de debate, consultas y experiencias
-- de la comunidad serumista.
--
-- Inspirado en Reddit (categorías + votos), Discourse (solved),
-- y Stack Overflow (respuesta aceptada).
--
-- Tablas:
--   kawsay_temas      — hilos de debate (título + cuerpo)
--   kawsay_votos      — upvotes por usuario/tema
--   kawsay_respuestas — respuestas planas con soporte 1 nivel
--
-- Corrección de datos:
--   UPDATE profesion Bryan Vidaurre → PSICOLOGIA
-- =============================================================

-- -------------------------------------------------------------
-- 1. Categorías del foro (enum)
-- -------------------------------------------------------------
create type public.kawsay_categoria as enum (
  'consulta_clinica',    -- dudas clínicas y farmacológicas
  'preparacion_serums',  -- preparación, temario, consejos pre-SERUMS
  'mi_plaza',            -- experiencias y reseñas de plazas
  'derechos_sueldo',     -- derechos laborales, remuneración, CAS
  'vida_bienestar',      -- bienestar mental, vida personal, rutinas
  'off_topic'            -- conversación general
);

-- -------------------------------------------------------------
-- 2. Temas (hilos)
-- -------------------------------------------------------------
create table public.kawsay_temas (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  categoria      public.kawsay_categoria not null default 'off_topic',
  titulo         text        not null,
  cuerpo         text,
  votes_count    int         not null default 0 check (votes_count >= 0),
  replies_count  int         not null default 0 check (replies_count >= 0),
  is_solved      boolean     not null default false,
  is_pinned      boolean     not null default false,
  is_hidden      boolean     not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  last_reply_at  timestamptz,
  constraint kawsay_titulo_len check (char_length(titulo) between 5 and 200),
  constraint kawsay_cuerpo_len check (cuerpo is null or char_length(cuerpo) between 1 and 10000)
);

comment on table public.kawsay_temas is
  'Hilos del foro Kawsay. Cada tema tiene título, cuerpo opcional, categoría y contadores.';

create index kawsay_temas_feed     on public.kawsay_temas (created_at desc)    where not is_hidden;
create index kawsay_temas_popular  on public.kawsay_temas (votes_count desc)   where not is_hidden;
create index kawsay_temas_active   on public.kawsay_temas (last_reply_at desc) where not is_hidden;
create index kawsay_temas_categoria on public.kawsay_temas (categoria)         where not is_hidden;
create index kawsay_temas_user     on public.kawsay_temas (user_id);

create trigger set_updated_at_kawsay_temas
  before update on public.kawsay_temas
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------
-- 3. Votos (upvote únicamente, 1 por usuario)
-- -------------------------------------------------------------
create table public.kawsay_votos (
  tema_id    uuid        not null references public.kawsay_temas(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tema_id, user_id)
);

create index kawsay_votos_user on public.kawsay_votos (user_id);

create or replace function public.update_kawsay_votes_count()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update public.kawsay_temas set votes_count = votes_count + 1 where id = new.tema_id;
  elsif tg_op = 'DELETE' then
    update public.kawsay_temas set votes_count = greatest(0, votes_count - 1) where id = old.tema_id;
  end if;
  return null;
end;
$$;

create trigger trg_kawsay_votes
  after insert or delete on public.kawsay_votos
  for each row execute function public.update_kawsay_votes_count();

-- -------------------------------------------------------------
-- 4. Respuestas (planas + 1 nivel de anidación via parent_id)
-- -------------------------------------------------------------
create table public.kawsay_respuestas (
  id         uuid        primary key default gen_random_uuid(),
  tema_id    uuid        not null references public.kawsay_temas(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  parent_id  uuid        references public.kawsay_respuestas(id) on delete cascade,
  cuerpo     text        not null,
  is_answer  boolean     not null default false,
  is_hidden  boolean     not null default false,
  created_at timestamptz not null default now(),
  constraint kawsay_respuesta_len check (char_length(cuerpo) between 1 and 5000)
);

create index kawsay_respuestas_tema on public.kawsay_respuestas (tema_id, created_at) where not is_hidden;
create index kawsay_respuestas_user on public.kawsay_respuestas (user_id);

create or replace function public.update_kawsay_replies_count()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update public.kawsay_temas
       set replies_count = replies_count + 1,
           last_reply_at = now()
     where id = new.tema_id;
  elsif tg_op = 'DELETE' then
    update public.kawsay_temas
       set replies_count = greatest(0, replies_count - 1)
     where id = old.tema_id;
  end if;
  return null;
end;
$$;

create trigger trg_kawsay_replies
  after insert or delete on public.kawsay_respuestas
  for each row execute function public.update_kawsay_replies_count();

-- -------------------------------------------------------------
-- 5. Vista pública de temas
-- -------------------------------------------------------------
create view public.kawsay_temas_publicos
with (security_invoker = true) as
select
  t.id,
  t.user_id,
  t.categoria,
  t.titulo,
  t.cuerpo,
  t.votes_count,
  t.replies_count,
  t.is_solved,
  t.is_pinned,
  t.created_at,
  t.last_reply_at,
  pf.nombre_publico,
  pf.avatar_url,
  pf.prof_level,
  pf.profesion_declarada_id
from public.kawsay_temas t
join public.perfiles pf on pf.user_id = t.user_id
where not t.is_hidden;

comment on view public.kawsay_temas_publicos is
  'Temas públicos del foro Kawsay con datos del autor.';

-- -------------------------------------------------------------
-- 6. Row Level Security
-- -------------------------------------------------------------
alter table public.kawsay_temas      enable row level security;
alter table public.kawsay_votos      enable row level security;
alter table public.kawsay_respuestas enable row level security;

create policy "kawsay_temas_select"  on public.kawsay_temas for select using (not is_hidden);
create policy "kawsay_temas_insert"  on public.kawsay_temas for insert with check (auth.uid() = user_id);
create policy "kawsay_temas_update"  on public.kawsay_temas for update using (auth.uid() = user_id);
create policy "kawsay_temas_delete"  on public.kawsay_temas for delete using (auth.uid() = user_id);

create policy "kawsay_votos_select"  on public.kawsay_votos for select using (true);
create policy "kawsay_votos_insert"  on public.kawsay_votos for insert with check (auth.uid() = user_id);
create policy "kawsay_votos_delete"  on public.kawsay_votos for delete using (auth.uid() = user_id);

create policy "kawsay_resp_select"   on public.kawsay_respuestas for select using (not is_hidden);
create policy "kawsay_resp_insert"   on public.kawsay_respuestas for insert with check (auth.uid() = user_id);
create policy "kawsay_resp_delete"   on public.kawsay_respuestas for delete using (auth.uid() = user_id);

-- -------------------------------------------------------------
-- 7. Corrección de datos: profesión de Bryan → Psicología
-- -------------------------------------------------------------
update public.perfiles
  set profesion_declarada_id = 'PSICOLOGIA'
where nombre_publico ilike '%Bryan%'
  and profesion_declarada_id = 'MEDICINA';
