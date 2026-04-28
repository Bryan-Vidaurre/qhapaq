-- =============================================================
-- 005_reviews.sql
-- Sistema de reseñas de plazas SERUMS.
--
-- Reglas (de la política de contenido):
--   - Solo serums_activo o perenne pueden reseñar plazas donde estuvieron.
--   - 30 días mínimos en plaza antes de la primera reseña.
--   - Una reseña por (user, plaza) — editable durante 7 días.
--   - El jefe de microred verificado puede dar derecho a réplica.
-- =============================================================

create type public.review_status as enum (
  'visible',
  'oculta',
  'eliminada'
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plaza_id uuid not null references public.plazas(id) on delete cascade,

  -- Periodo de servicio (validado contra plaza_periodo del usuario)
  semestre_servicio text not null,

  -- Ratings (1-5 cada uno)
  rating_vivienda smallint check (rating_vivienda between 1 and 5),
  rating_equipo smallint check (rating_equipo between 1 and 5),
  rating_jefatura smallint check (rating_jefatura between 1 and 5),
  rating_conectividad smallint check (rating_conectividad between 1 and 5),
  rating_seguridad smallint check (rating_seguridad between 1 and 5),
  rating_carga smallint check (rating_carga between 1 and 5),
  rating_general numeric(3, 2),                    -- promedio ponderado

  -- Contenido
  texto text not null check (length(texto) between 50 and 4000),
  pros text[] default '{}',
  cons text[] default '{}',

  -- Conflicto de interés declarado (regla 9)
  conflicto_declarado text,

  -- Métricas
  helpful_count int not null default 0,

  -- Estado
  status public.review_status not null default 'visible',
  hidden_reason text,
  hidden_at timestamptz,

  -- Edición — solo permitida durante 7 días
  edited_at timestamptz,
  edit_count int not null default 0,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Una reseña por usuario por plaza
  unique (user_id, plaza_id)
);

comment on table public.reviews is
  'Reseñas de plazas. Una por (usuario, plaza). Editable 7 días.';

create index reviews_plaza on public.reviews (plaza_id) where status = 'visible';
create index reviews_user on public.reviews (user_id);
create index reviews_created on public.reviews (created_at desc);

create trigger set_updated_at_reviews
  before update on public.reviews
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- Réplicas (derecho de respuesta del jefe de microred)
-- =============================================================
create table public.review_replies (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id),    -- jefe verificado

  texto text not null check (length(texto) between 50 and 2000),
  status public.review_status not null default 'visible',

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Solo una réplica por reseña
  unique (review_id)
);

comment on table public.review_replies is
  'Réplica oficial. Solo una por reseña, solo de jefatura verificada del centro.';

create trigger set_updated_at_review_replies
  before update on public.review_replies
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- Marca "útil" (helpful)
-- =============================================================
create table public.review_helpful (
  review_id uuid not null references public.reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (review_id, user_id)
);

create index review_helpful_review on public.review_helpful (review_id);

-- =============================================================
-- Trigger: actualizar contador de helpful
-- =============================================================
create or replace function public.on_review_helpful()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.reviews
      set helpful_count = helpful_count + 1
    where id = new.review_id;
  elsif tg_op = 'DELETE' then
    update public.reviews
      set helpful_count = greatest(helpful_count - 1, 0)
    where id = old.review_id;
  end if;
  return null;
end;
$$;

create trigger review_helpful_count
  after insert or delete on public.review_helpful
  for each row execute procedure public.on_review_helpful();

-- =============================================================
-- Trigger: actualizar avg_rating de la plaza al crear/editar reseña
-- =============================================================
create or replace function public.update_plaza_rating()
returns trigger
language plpgsql
as $$
declare
  v_plaza_id uuid;
  v_avg numeric(3, 2);
  v_count int;
begin
  v_plaza_id := coalesce(new.plaza_id, old.plaza_id);

  select
    avg(rating_general)::numeric(3, 2),
    count(*)
  into v_avg, v_count
  from public.reviews
  where plaza_id = v_plaza_id
    and status = 'visible';

  update public.plazas
    set avg_rating = v_avg,
        total_reviews = v_count
  where id = v_plaza_id;

  return null;
end;
$$;

create trigger reviews_update_plaza_rating
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_plaza_rating();

-- =============================================================
-- Función: validar si un usuario puede reseñar una plaza
-- =============================================================
create or replace function public.puede_reseñar(
  p_user_id uuid,
  p_plaza_id uuid
)
returns boolean
language plpgsql
stable
security definer
as $$
declare
  v_perfil record;
  v_plaza record;
  v_dias_en_plaza int;
begin
  -- Buscar perfil
  select prof_level, plaza_id, plaza_periodo
    into v_perfil
  from public.perfiles
  where user_id = p_user_id;

  -- Solo serums_activo o perenne pueden reseñar
  if v_perfil.prof_level not in ('serums_activo', 'perenne') then
    return false;
  end if;

  -- Si serums_activo, debe ser su propia plaza
  if v_perfil.prof_level = 'serums_activo' and v_perfil.plaza_id != p_plaza_id then
    return false;
  end if;

  -- Mínimo 30 días en plaza desde verificación
  select extract(day from now() - verified_at)::int
    into v_dias_en_plaza
  from public.perfiles_sensibles
  where user_id = p_user_id;

  if v_dias_en_plaza < 30 then
    return false;
  end if;

  return true;
end;
$$;

comment on function public.puede_reseñar is
  'Valida los pre-requisitos antes de permitir publicar reseña.';
