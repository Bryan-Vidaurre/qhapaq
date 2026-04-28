-- =============================================================
-- 002_padron.sql
-- Padrón oficial de plazas SERUMS (MINSA, Anexos 2 y 3).
--
-- Modelado:
--   - Una "oferta" representa una fila del padrón (puede tener n_plazas > 1).
--   - El @@unique es (semestre, renipress, profesion) — una posta puede
--     ofertar para varias profesiones simultáneamente; cada combinación
--     es una oferta distinta.
--   - El histórico se mantiene por semestre: cuando llegue 2026-II, se
--     insertan nuevas filas, no se actualizan las existentes.
-- =============================================================

-- =============================================================
-- Catálogos (lookup tables)
-- =============================================================
create table public.profesiones (
  id text primary key,
  nombre text not null,
  familia text not null,
  orden int not null default 99,
  created_at timestamptz default now()
);

comment on table public.profesiones is
  '17 profesiones del padrón SERUMS, agrupadas por familia.';

create table public.familias_profesionales (
  id text primary key,
  nombre text not null,
  orden int not null default 99
);

-- =============================================================
-- Plazas
-- =============================================================
create type public.modalidad_plaza as enum ('remunerada', 'equivalente');

create table public.plazas (
  id uuid primary key default gen_random_uuid(),
  semestre text not null,                        -- '2026-I', '2026-II', etc.
  modalidad public.modalidad_plaza not null,

  -- Ofertante
  institucion_ofertante text not null,           -- MINSA, ESSALUD, AMAZONAS, etc.
  diresa text,
  institucion text,                              -- 'GOBIERNO REGIONAL', etc.
  sede_adjudicacion text,
  presupuesto text,                              -- 'REGIONAL', 'NACIONAL', 'SIN PRESUPUESTO'

  -- Ubicación
  departamento text not null,
  provincia text not null,
  distrito text not null,
  ubigeo text,                                   -- a poblar contra INEI después
  lat double precision,
  lng double precision,

  -- Establecimiento
  renipress text not null,                       -- 8 dígitos
  establecimiento text not null,
  categoria text,                                -- I-1, I-2, I-3, II-1, II-2

  -- Plaza
  profesion_id text not null references public.profesiones(id),
  n_plazas int not null default 1 check (n_plazas > 0),
  gd text not null check (gd in ('GD-1', 'GD-2', 'GD-3', 'GD-4', 'GD-5')),
  zaf boolean not null default false,
  ze boolean not null default false,

  -- Métricas derivadas (denormalizadas para queries rápidas)
  total_reviews int not null default 0,
  avg_rating numeric(3, 2),

  -- FTS
  search_vector tsvector generated always as (
    to_tsvector(
      'spanish',
      coalesce(establecimiento, '') || ' ' ||
      coalesce(distrito, '') || ' ' ||
      coalesce(provincia, '') || ' ' ||
      coalesce(departamento, '') || ' ' ||
      coalesce(profesion_id, '')
    )
  ) stored,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique (semestre, renipress, profesion_id)
);

comment on table public.plazas is
  'Padrón oficial SERUMS. Una fila por oferta (semestre + RENIPRESS + profesión).';

-- Índices para queries comunes
create index plazas_semestre on public.plazas (semestre);
create index plazas_dep_prov_dist on public.plazas (departamento, provincia, distrito);
create index plazas_profesion on public.plazas (profesion_id);
create index plazas_gd on public.plazas (gd);
create index plazas_renipress on public.plazas (renipress);
create index plazas_search on public.plazas using gin (search_vector);

-- Trigram para búsqueda "fuzzy" (typos en nombre de establecimiento)
create index plazas_estab_trgm on public.plazas using gin (establecimiento gin_trgm_ops);

-- Trigger updated_at
create trigger set_updated_at_plazas
  before update on public.plazas
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- Vista pública: plaza con datos enriquecidos
-- =============================================================
create or replace view public.plazas_publicas as
  select
    p.id,
    p.semestre,
    p.modalidad,
    p.institucion_ofertante,
    p.diresa,
    p.departamento,
    p.provincia,
    p.distrito,
    p.lat,
    p.lng,
    p.renipress,
    p.establecimiento,
    p.categoria,
    p.profesion_id,
    pr.nombre as profesion_nombre,
    pr.familia as profesion_familia,
    p.n_plazas,
    p.gd,
    p.zaf,
    p.ze,
    p.total_reviews,
    p.avg_rating
  from public.plazas p
  join public.profesiones pr on pr.id = p.profesion_id;

comment on view public.plazas_publicas is
  'Vista pública del padrón. Sin RLS — datos de las plazas son públicos.';
