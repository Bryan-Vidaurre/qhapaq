-- =============================================================
-- 010_onboarding.sql
-- Campo onboarding_completado en perfiles para rastrear si el
-- usuario ya pasó por el flujo de creación de cuenta.
-- =============================================================

alter table public.perfiles
  add column if not exists onboarding_completado boolean not null default false;

comment on column public.perfiles.onboarding_completado is
  'True si el usuario completó el flujo de onboarding (eligió nombre + profesión).';

-- Los usuarios existentes que tienen profesion_declarada_id ya están "onboarded"
update public.perfiles
  set onboarding_completado = true
  where profesion_declarada_id is not null
     or (kind = 'general' and nombre_publico not like '%@%' and nombre_publico like '% %');
