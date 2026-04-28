-- =============================================================
-- 004_yachay.sql
-- Sistema Yachay: logros y reputación.
--
-- "Yachay" en quechua significa saber/conocimiento — académico, técnico
-- y cultural. Es el sistema de reputación de Qhapaq Ñan.
--
-- Cada logro tiene:
--   - alcance: transversal | familia_profesional | profesion
--   - tipo de evidencia: cómo se obtiene
--   - peso (yachay): cuánto suma a la reputación si es validado
-- =============================================================

create type public.logro_alcance as enum (
  'transversal',           -- Aplica a todos
  'familia_profesional',   -- Por familia (MEDICINA, ENFERMERIA, etc.)
  'profesion'              -- Específico a una profesión exacta
);

create type public.logro_evidencia as enum (
  'auto_declarado',        -- Aspiracional, lo marcas y listo
  'tiempo_plataforma',     -- Sistema lo otorga (días en app, etc.)
  'peer_confirmation',     -- Otros usuarios verificados confirman
  'documento',             -- Subes evidencia, mod revisa
  'padron_minsa',          -- Cruce automático con padrón
  'metrica_comunidad'      -- N likes, M reseñas útiles, etc.
);

create type public.logro_rareza as enum (
  'comun',                 -- La mayoría lo tiene (aspiracionales)
  'poco_comun',            -- Algunos lo tienen
  'raro',                  -- Pocos lo tienen
  'epico'                  -- Muy pocos lo tienen
);

-- =============================================================
-- Catálogo de logros
-- =============================================================
create table public.logros (
  id text primary key,                             -- 'med-parto-rural', etc.
  nombre text not null,
  descripcion text not null,

  alcance public.logro_alcance not null,
  familia_profesional text,                        -- si alcance = 'familia_profesional'
  profesion_id text references public.profesiones(id),  -- si alcance = 'profesion'

  evidencia public.logro_evidencia not null,
  yachay int not null default 0 check (yachay >= 0 and yachay <= 5),
  rareza public.logro_rareza not null default 'comun',

  icono text,                                      -- nombre de lucide icon
  activo boolean not null default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.logros is
  'Catálogo de logros disponibles. Los aspiracionales tienen yachay=0.';

create index logros_alcance on public.logros (alcance);
create index logros_familia on public.logros (familia_profesional);
create index logros_profesion on public.logros (profesion_id);

-- =============================================================
-- Logros otorgados a usuarios
-- =============================================================
create type public.logro_status as enum (
  'reclamado',             -- Usuario lo declaró (auto_declarado o solicitud pendiente)
  'pendiente_revision',    -- Documento subido, esperando admin
  'pendiente_peers',       -- Esperando peer_confirmations
  'otorgado',              -- Validado y otorgado
  'rechazado',             -- Rechazado tras revisión
  'revocado'               -- Otorgado pero luego revocado por violación
);

create table public.logros_usuario (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  logro_id text not null references public.logros(id),

  status public.logro_status not null default 'reclamado',

  -- Contexto al reclamar
  plaza_id uuid references public.plazas(id),       -- en qué plaza ocurrió
  fecha_evento date,                                -- cuándo ocurrió en el mundo real
  descripcion text,                                 -- contexto opcional del usuario

  -- Evidencia subida (si aplica)
  evidencia_urls jsonb default '[]'::jsonb,

  -- Validación
  validated_at timestamptz,
  validated_by uuid references auth.users(id),
  rejection_reason text,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Una persona puede tener un logro una sola vez (excepto los repetibles, que no tenemos aún)
  unique (user_id, logro_id)
);

comment on table public.logros_usuario is
  'Logros otorgados, en proceso o rechazados.';

create index logros_usuario_user on public.logros_usuario (user_id);
create index logros_usuario_status on public.logros_usuario (status);

create trigger set_updated_at_logros_usuario
  before update on public.logros_usuario
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- Peer confirmations (validaciones entre pares)
-- =============================================================
create table public.peer_confirmations (
  id uuid primary key default gen_random_uuid(),
  logro_usuario_id uuid not null references public.logros_usuario(id) on delete cascade,
  confirmador_id uuid not null references auth.users(id),

  comentario text,
  created_at timestamptz default now(),

  -- Un usuario solo puede confirmar un logro una vez
  unique (logro_usuario_id, confirmador_id)
);

create index peer_conf_logro on public.peer_confirmations (logro_usuario_id);
create index peer_conf_user on public.peer_confirmations (confirmador_id);

-- =============================================================
-- Función: recalcular yachay de un usuario
-- =============================================================
create or replace function public.recalc_yachay(p_user_id uuid)
returns int
language plpgsql
security definer
as $$
declare
  total int;
begin
  select coalesce(sum(l.yachay), 0)
    into total
  from public.logros_usuario lu
  join public.logros l on l.id = lu.logro_id
  where lu.user_id = p_user_id
    and lu.status = 'otorgado'
    and l.yachay > 0;  -- Solo logros con peso real

  update public.perfiles
    set yachay = total
  where user_id = p_user_id;

  return total;
end;
$$;

comment on function public.recalc_yachay is
  'Recalcula el yachay total de un usuario sumando logros otorgados con peso > 0.';

-- =============================================================
-- Trigger: cuando un logro pasa a 'otorgado', recalcular
-- =============================================================
create or replace function public.on_logro_otorgado()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'otorgado' and (old.status is distinct from 'otorgado') then
    perform public.recalc_yachay(new.user_id);
  end if;
  if old.status = 'otorgado' and new.status != 'otorgado' then
    -- Logro revocado o rechazado tras estar otorgado
    perform public.recalc_yachay(new.user_id);
  end if;
  return new;
end;
$$;

create trigger logros_usuario_yachay
  after update on public.logros_usuario
  for each row execute procedure public.on_logro_otorgado();
