-- =============================================================
-- 006_audit.sql
-- Auditoría de acciones sensibles y registro de eventos para
-- cumplimiento de Ley 29733 (derechos ARCO).
-- =============================================================

-- =============================================================
-- Log general de auditoría
-- =============================================================
create table audit.events (
  id bigserial primary key,
  event_at timestamptz not null default now(),

  -- Quién (puede ser null para eventos del sistema)
  actor_id uuid references auth.users(id),
  actor_ip inet,
  actor_user_agent text,

  -- Qué
  event_type text not null,                        -- 'login', 'verify_request', 'review_create', etc.
  entity_type text,                                -- 'user', 'plaza', 'review', etc.
  entity_id text,

  -- Detalles
  metadata jsonb default '{}'::jsonb,

  -- Para eventos sensibles, guardar el cambio (before/after)
  changes jsonb
);

comment on table audit.events is
  'Log de auditoría. Append-only — nunca se modifica ni borra. Retención 2 años.';

create index audit_events_actor on audit.events (actor_id);
create index audit_events_type on audit.events (event_type);
create index audit_events_entity on audit.events (entity_type, entity_id);
create index audit_events_at on audit.events (event_at desc);

-- =============================================================
-- Función helper: registrar evento
-- =============================================================
create or replace function audit.log_event(
  p_event_type text,
  p_entity_type text default null,
  p_entity_id text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_changes jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public, audit
as $$
begin
  insert into audit.events (
    actor_id, event_type, entity_type, entity_id, metadata, changes
  ) values (
    auth.uid(), p_event_type, p_entity_type, p_entity_id, p_metadata, p_changes
  );
end;
$$;

-- =============================================================
-- Eliminación de cuenta (derecho ARCO de cancelación)
-- =============================================================
create table public.account_deletions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  requested_at timestamptz not null default now(),
  scheduled_for timestamptz not null,              -- requested_at + 30 días gracia
  completed_at timestamptz,
  reason text,
  cancelled_at timestamptz,                        -- si el usuario se arrepiente
  cancelled_reason text
);

comment on table public.account_deletions is
  'Solicitudes de eliminación de cuenta. 30 días de gracia para revertir.';

create index account_deletions_pending
  on public.account_deletions (scheduled_for)
  where completed_at is null and cancelled_at is null;

-- =============================================================
-- Reportes de contenido / usuarios
-- =============================================================
create type public.report_kind as enum (
  'spam',
  'acoso',
  'contenido_inapropiado',
  'suplantacion',
  'datos_paciente',
  'fraude_marketplace',
  'usurpacion_plaza',
  'otro'
);

create type public.report_status as enum (
  'pendiente',
  'en_revision',
  'resuelto_accion',
  'resuelto_sin_accion',
  'cerrado_invalido'
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id),
  reported_user_id uuid references auth.users(id),
  reported_entity_type text,                       -- 'review', 'post', 'listing'
  reported_entity_id text,

  kind public.report_kind not null,
  description text,
  evidence_urls jsonb default '[]'::jsonb,

  status public.report_status not null default 'pendiente',
  priority smallint default 3 check (priority between 1 and 5),  -- 1 = urgente

  -- Resolución
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  resolution_notes text,
  action_taken text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index reports_status on public.reports (status, priority);
create index reports_reporter on public.reports (reporter_id);
create index reports_target on public.reports (reported_user_id);

create trigger set_updated_at_reports
  before update on public.reports
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- Rate limiting (para magic links principalmente)
-- =============================================================
create table public.rate_limits (
  key text not null,                               -- p.ej. 'magic_link:user@example.com'
  count int not null default 1,
  window_start timestamptz not null default now(),
  primary key (key)
);

comment on table public.rate_limits is
  'Rate limiting básico. Para producción multi-instancia migrar a Upstash Redis.';

create index rate_limits_window on public.rate_limits (window_start);

-- Función: incrementar contador respetando ventana
create or replace function public.check_rate_limit(
  p_key text,
  p_max_attempts int,
  p_window_seconds int
)
returns boolean
language plpgsql
as $$
declare
  v_record record;
begin
  select * into v_record
  from public.rate_limits
  where key = p_key;

  if v_record is null then
    insert into public.rate_limits (key) values (p_key);
    return true;
  end if;

  -- ¿Ventana vencida? Reiniciar
  if extract(epoch from (now() - v_record.window_start)) > p_window_seconds then
    update public.rate_limits
      set count = 1, window_start = now()
    where key = p_key;
    return true;
  end if;

  -- Dentro de la ventana, ¿alcanzó el máximo?
  if v_record.count >= p_max_attempts then
    return false;
  end if;

  update public.rate_limits
    set count = count + 1
  where key = p_key;

  return true;
end;
$$;
