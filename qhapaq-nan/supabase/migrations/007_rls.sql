-- =============================================================
-- 007_rls.sql
-- Row Level Security: define quién puede leer/escribir qué.
--
-- Filosofía:
--   - Por defecto, NADA es accesible (deny all).
--   - Datos públicos (padrón, profesiones): lectura pública (anon).
--   - Datos de usuario: el usuario lee/edita sus cosas.
--   - Datos sensibles: solo service_role (queries del servidor).
--   - Auditoría: solo service_role.
--
-- Roles de Supabase:
--   - anon: usuarios no autenticados
--   - authenticated: usuarios con sesión válida
--   - service_role: queries del servidor (bypass RLS)
-- =============================================================

-- =============================================================
-- Catálogos públicos (lectura libre)
-- =============================================================
alter table public.profesiones enable row level security;
create policy "profesiones_read_all" on public.profesiones
  for select using (true);

alter table public.familias_profesionales enable row level security;
create policy "familias_read_all" on public.familias_profesionales
  for select using (true);

-- =============================================================
-- Plazas (lectura pública, escritura solo service_role)
-- =============================================================
alter table public.plazas enable row level security;
create policy "plazas_read_all" on public.plazas
  for select using (true);

-- INSERT/UPDATE/DELETE solo via service_role (sin policy = denegado a authenticated)

-- =============================================================
-- Logros: catálogo público
-- =============================================================
alter table public.logros enable row level security;
create policy "logros_read_all" on public.logros
  for select using (activo = true);

-- =============================================================
-- Perfiles públicos
-- =============================================================
alter table public.perfiles enable row level security;

-- Cualquiera puede leer perfiles públicos básicos
create policy "perfiles_read_public" on public.perfiles
  for select using (true);

-- Solo el dueño puede actualizar su perfil
create policy "perfiles_update_own" on public.perfiles
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Insert se hace via trigger handle_new_user (service_role)

-- =============================================================
-- Perfiles sensibles (NUNCA accesibles desde cliente)
-- =============================================================
alter table public.perfiles_sensibles enable row level security;

-- El usuario solo puede ver SUS PROPIOS datos sensibles, no los de otros
create policy "perfiles_sens_read_own" on public.perfiles_sensibles
  for select using (auth.uid() = user_id);

-- NO hay policy de UPDATE/INSERT/DELETE para authenticated
-- → Solo service_role puede modificar (server-side, controlado).

-- =============================================================
-- Verificación
-- =============================================================
alter table public.verificacion_solicitudes enable row level security;

-- El usuario ve sus propias solicitudes
create policy "verif_read_own" on public.verificacion_solicitudes
  for select using (auth.uid() = user_id);

-- El usuario puede crear sus solicitudes
create policy "verif_insert_own" on public.verificacion_solicitudes
  for insert with check (auth.uid() = user_id);

-- El usuario puede cancelar (status='cancelada') sus solicitudes pendientes
create policy "verif_cancel_own" on public.verificacion_solicitudes
  for update using (auth.uid() = user_id and status = 'pendiente')
  with check (auth.uid() = user_id and status in ('pendiente', 'cancelada'));

-- Aprobación/rechazo solo via service_role

-- =============================================================
-- Logros de usuario
-- =============================================================
alter table public.logros_usuario enable row level security;

-- Cualquiera puede ver logros otorgados (son públicos)
create policy "logros_usuario_read_otorgados" on public.logros_usuario
  for select using (status = 'otorgado' or auth.uid() = user_id);

-- El usuario puede reclamar logros aspiracionales
create policy "logros_usuario_insert_own" on public.logros_usuario
  for insert with check (auth.uid() = user_id);

-- El usuario puede cancelar sus reclamos pendientes
create policy "logros_usuario_update_own" on public.logros_usuario
  for update using (auth.uid() = user_id and status in ('reclamado', 'pendiente_revision', 'pendiente_peers'));

-- =============================================================
-- Peer confirmations
-- =============================================================
alter table public.peer_confirmations enable row level security;

create policy "peer_conf_read_all" on public.peer_confirmations
  for select using (true);

-- Solo usuarios verificados pueden confirmar (lo refuerza la app)
create policy "peer_conf_insert_authenticated" on public.peer_confirmations
  for insert with check (auth.uid() = confirmador_id);

-- Puedes retirar tu propia confirmación
create policy "peer_conf_delete_own" on public.peer_confirmations
  for delete using (auth.uid() = confirmador_id);

-- =============================================================
-- Reseñas
-- =============================================================
alter table public.reviews enable row level security;

-- Lectura pública de reseñas visibles
create policy "reviews_read_visible" on public.reviews
  for select using (status = 'visible' or auth.uid() = user_id);

-- Solo serums_activo o perenne pueden crear (función puede_reseñar lo valida)
create policy "reviews_insert_eligible" on public.reviews
  for insert with check (
    auth.uid() = user_id and public.puede_reseñar(auth.uid(), plaza_id)
  );

-- Editar solo durante 7 días desde creación
create policy "reviews_update_within_7d" on public.reviews
  for update using (
    auth.uid() = user_id and
    created_at > now() - interval '7 days' and
    status = 'visible'
  )
  with check (auth.uid() = user_id);

-- =============================================================
-- Réplicas a reseñas
-- =============================================================
alter table public.review_replies enable row level security;

create policy "replies_read_all" on public.review_replies
  for select using (status = 'visible');

-- Solo perenne verificado del centro puede replicar
-- (la app valida que sea jefatura del centro de la reseña)
create policy "replies_insert_perenne" on public.review_replies
  for insert with check (
    auth.uid() = user_id and exists (
      select 1 from public.perfiles
      where user_id = auth.uid() and prof_level = 'perenne'
    )
  );

-- =============================================================
-- Helpful
-- =============================================================
alter table public.review_helpful enable row level security;

create policy "helpful_read_all" on public.review_helpful
  for select using (true);

create policy "helpful_insert_own" on public.review_helpful
  for insert with check (auth.uid() = user_id);

create policy "helpful_delete_own" on public.review_helpful
  for delete using (auth.uid() = user_id);

-- =============================================================
-- Account deletions (solicitudes ARCO)
-- =============================================================
alter table public.account_deletions enable row level security;

create policy "deletions_read_own" on public.account_deletions
  for select using (auth.uid() = user_id);

create policy "deletions_insert_own" on public.account_deletions
  for insert with check (auth.uid() = user_id);

create policy "deletions_cancel_own" on public.account_deletions
  for update using (
    auth.uid() = user_id and completed_at is null and cancelled_at is null
  )
  with check (auth.uid() = user_id);

-- =============================================================
-- Reports
-- =============================================================
alter table public.reports enable row level security;

-- El reportante ve sus reportes; el usuario reportado NO ve los reportes en su contra
create policy "reports_read_own" on public.reports
  for select using (auth.uid() = reporter_id);

create policy "reports_insert_authenticated" on public.reports
  for insert with check (auth.uid() = reporter_id);

-- =============================================================
-- Audit / rate_limits — solo service_role
-- =============================================================
-- audit.events no expone policies → inaccesible a anon/authenticated
-- public.rate_limits idem

alter table audit.events enable row level security;
alter table public.rate_limits enable row level security;

-- =============================================================
-- Permisos a nivel schema
-- =============================================================
-- audit schema: solo service_role
revoke all on schema audit from anon, authenticated;
grant usage on schema audit to service_role;
grant all on all tables in schema audit to service_role;
