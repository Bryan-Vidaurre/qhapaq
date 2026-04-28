-- =============================================================
-- 003_users.sql
-- Perfiles de usuario, tipos de cuenta y niveles de verificación.
--
-- Supabase Auth ya gestiona la tabla `auth.users`. Aquí extendemos
-- con un perfil público en `public.perfiles` enlazado por user_id.
--
-- Modelo de identidad simplificado para MVP:
--   - Tipo cuenta: 'general' | 'profesional'
--   - Si profesional, tiene un nivel de verificación que sube
--     conforme presenta evidencia.
-- =============================================================

create type public.user_kind as enum ('general', 'profesional');

create type public.prof_level as enum (
  'autodeclarado',     -- Solo marcó su profesión, sin evidencia
  'estudiante',        -- Constancia universitaria vigente
  'egresado',          -- Diploma o constancia de bachiller/título
  'colegiado',         -- Verificado contra colegio profesional
  'serums_activo',     -- Plaza SERUMS cruzada con padrón MINSA
  'perenne'            -- Plaza orgánica del centro
);

-- =============================================================
-- Perfiles
-- =============================================================
create table public.perfiles (
  user_id uuid primary key references auth.users(id) on delete cascade,

  -- Identidad pública
  nombre_publico text not null,
  username text unique,                              -- @handle, opcional
  avatar_url text,
  bio text check (length(bio) <= 500),

  -- Tipo de cuenta
  kind public.user_kind not null default 'general',
  prof_level public.prof_level,                      -- null si kind='general'

  -- Profesión declarada (puede ser distinta a la verificada — mientras se valida)
  profesion_declarada_id text references public.profesiones(id),

  -- Plaza activa (si serums_activo)
  plaza_id uuid references public.plazas(id),
  plaza_periodo text,                                -- '2026-I'

  -- Yachay (sistema de reputación)
  yachay int not null default 0,

  -- Estados administrativos
  is_suspended boolean not null default false,
  suspended_until timestamptz,
  suspended_reason text,

  -- Preferencias mínimas
  email_notifications boolean not null default true,
  email_marketing boolean not null default false,    -- Por defecto NO (ley 29733)
  ip_at_signup inet,                                 -- Para detección de fraude
  locale text default 'es',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.perfiles is
  'Perfil público del usuario. Datos sensibles (DNI, etc.) viven en otra tabla cifrada.';

create index perfiles_kind on public.perfiles (kind);
create index perfiles_prof_level on public.perfiles (prof_level);
create index perfiles_username on public.perfiles (username);

create trigger set_updated_at_perfiles
  before update on public.perfiles
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- Datos sensibles de verificación (separados, acceso restringido)
-- =============================================================
create table public.perfiles_sensibles (
  user_id uuid primary key references auth.users(id) on delete cascade,

  -- Datos cifrados — solo accesibles por service_role
  -- Lo "cifrado" en columna no excluye que la app cifre antes de guardar
  -- para defensa en profundidad.
  dni_hash text,                                    -- hash SHA-256 del DNI
  dni_last4 text,                                   -- últimos 4 dígitos (para mostrar al usuario)
  nombres_legales text,                             -- nombre completo según DNI
  apellidos_legales text,

  -- Resolución SERUMS / constancia
  resolucion_numero text,
  resolucion_url text,                              -- ruta en Storage privado

  -- Documento de profesión / colegiatura
  cmp_numero text,                                  -- número de colegiatura (si aplica)
  diploma_url text,                                 -- ruta en Storage privado
  constancia_url text,

  -- Selfie de liveness (para verificación biométrica futura)
  selfie_hash text,                                 -- hash de la imagen biométrica
  selfie_taken_at timestamptz,
  selfie_deleted_at timestamptz,                    -- cuándo se eliminó (30 días post-verificación)

  -- Auditoría
  verified_at timestamptz,
  verified_by uuid references auth.users(id),       -- admin que aprobó
  verification_notes text,
  rejection_reason text,
  rejected_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.perfiles_sensibles is
  'Datos sensibles de verificación. NUNCA exponer en queries del cliente.';

create trigger set_updated_at_perfiles_sensibles
  before update on public.perfiles_sensibles
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- Solicitudes de verificación (cola de revisión)
-- =============================================================
create type public.verificacion_status as enum (
  'pendiente',
  'en_revision',
  'aprobada',
  'rechazada',
  'cancelada'
);

create table public.verificacion_solicitudes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  nivel_solicitado public.prof_level not null,
  status public.verificacion_status not null default 'pendiente',

  -- Documentos referenciados (URLs en Storage privado)
  documentos jsonb not null default '[]'::jsonb,    -- [{tipo, url, sha256}]

  -- Datos extraídos (a llenar por admin/IA)
  datos_extraidos jsonb,

  -- Resultado de revisión
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  notas_internas text,                              -- Visible solo a admins
  notas_publicas text,                              -- Visible al usuario

  -- Conflicto de plaza (si nivel='serums_activo' y hay otro reclamante)
  conflicto_con uuid references auth.users(id),
  conflicto_resuelto boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.verificacion_solicitudes is
  'Cola de revisión. Una persona puede tener varias solicitudes en su vida (ascender de nivel).';

create index verif_user on public.verificacion_solicitudes (user_id);
create index verif_status on public.verificacion_solicitudes (status);
create index verif_pending on public.verificacion_solicitudes (status, created_at)
  where status in ('pendiente', 'en_revision');

create trigger set_updated_at_verif
  before update on public.verificacion_solicitudes
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- Trigger: crear perfil automáticamente al registrarse
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (user_id, nombre_publico, kind)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre_publico', split_part(new.email, '@', 1)),
    'general'
  );

  insert into public.perfiles_sensibles (user_id) values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
