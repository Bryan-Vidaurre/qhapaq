-- =============================================================
-- 009_plaza_seleccion.sql
-- Registra adjudicaciones e intereses en plazas durante el
-- proceso de selección SERUMS. Habilitado en Realtime para
-- mostrar actividad en vivo en el mapa.
-- =============================================================

create table public.plaza_seleccion (
  id uuid primary key default gen_random_uuid(),
  plaza_id uuid not null references public.plazas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  semestre text not null default '2026-I',

  -- 'adjudicada': confirmó que se adjudicó esta plaza
  -- 'interes':    marcó que le interesa (antes de adjudicar)
  tipo text not null default 'adjudicada'
    check (tipo in ('adjudicada', 'interes')),

  created_at timestamptz default now(),

  -- Un usuario solo puede tener una adjudicación por semestre
  -- (el proceso SERUMS es una sola plaza por año)
  unique (user_id, semestre)
);

comment on table public.plaza_seleccion is
  'Adjudicaciones e intereses en plazas durante el proceso SERUMS. Visible en tiempo real.';

-- Índices
create index plaza_sel_plaza on public.plaza_seleccion (plaza_id);
create index plaza_sel_semestre on public.plaza_seleccion (semestre, tipo);
create index plaza_sel_user on public.plaza_seleccion (user_id);

-- RLS
alter table public.plaza_seleccion enable row level security;

-- Lectura pública (anónimos y autenticados)
create policy "Adjudicaciones son públicas"
  on public.plaza_seleccion for select
  to authenticated, anon
  using (true);

-- Insertar solo tu propia adjudicación
create policy "Usuario registra su propia adjudicación"
  on public.plaza_seleccion for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Actualizar solo tu propia adjudicación
create policy "Usuario actualiza su propia adjudicación"
  on public.plaza_seleccion for update
  to authenticated
  using (auth.uid() = user_id);

-- Eliminar solo tu propia adjudicación
create policy "Usuario elimina su propia adjudicación"
  on public.plaza_seleccion for delete
  to authenticated
  using (auth.uid() = user_id);

-- Publicar en Realtime
alter publication supabase_realtime add table public.plaza_seleccion;
