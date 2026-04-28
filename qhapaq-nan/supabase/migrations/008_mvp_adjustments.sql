-- =============================================================
-- 008_mvp_adjustments.sql
-- Ajustes para lanzamiento MVP:
--
--   1. Campo display_mode en reviews (decisión D2: usuario elige
--      si aparece con nombre+especialidad o como seudónimo).
--
--   2. Versión relajada de puede_reseñar para MVP:
--      En v0.1 cualquier usuario con perfil profesional completado
--      (autodeclarado+) puede reseñar cualquier plaza.
--      La restricción estricta (serums_activo/perenne, 30 días, plaza propia)
--      se restaurará en v0.2 cuando activemos la verificación de documentos.
--
-- =============================================================

-- -------------------------------------------------------------
-- 1. display_mode en reviews
-- -------------------------------------------------------------

alter table public.reviews
  add column display_mode text not null default 'seudonimo'
  check (display_mode in ('nombre_especialidad', 'seudonimo'));

comment on column public.reviews.display_mode is
  'Cómo aparece el autor de la reseña. nombre_especialidad = "Carlos M. · Médico · Cusco". seudonimo = "Profesional verificado · Médico · Cusco".';

-- -------------------------------------------------------------
-- 2. Relajar puede_reseñar para MVP
--
--    Requisito mínimo: usuario con kind=profesional y prof_level
--    no nulo (autodeclarado es suficiente).
--    Sin restricción de plaza ni de días.
-- -------------------------------------------------------------

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
  v_kind     public.user_kind;
  v_level    public.prof_level;
  v_suspendido boolean;
begin
  select kind, prof_level, is_suspended
    into v_kind, v_level, v_suspendido
  from public.perfiles
  where user_id = p_user_id;

  -- Usuario no encontrado
  if not found then
    return false;
  end if;

  -- Suspendido no puede reseñar
  if v_suspendido then
    return false;
  end if;

  -- Solo profesionales con perfil completado (autodeclarado en adelante)
  if v_kind != 'profesional' or v_level is null then
    return false;
  end if;

  -- MVP: cualquier plaza es válida para reseñar
  -- (en v0.2 se validará que hayan estado en esa plaza específica)
  return true;
end;
$$;

comment on function public.puede_reseñar is
  'MVP: permite reseñar a cualquier profesional autodeclarado o superior. v0.2 añadirá validación cruzada con padrón MINSA.';
