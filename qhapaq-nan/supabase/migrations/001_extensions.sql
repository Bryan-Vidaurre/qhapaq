-- =============================================================
-- 001_extensions.sql
-- Extensiones de Postgres y funciones auxiliares.
-- =============================================================

-- UUIDs
create extension if not exists "uuid-ossp";

-- Búsqueda full-text con trigramas (útil para "buscar parecido a")
create extension if not exists "pg_trgm";

-- Cifrado para hashes de tokens y datos sensibles
create extension if not exists "pgcrypto";

-- =============================================================
-- Función helper: actualizar updated_at automáticamente
-- =============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================
-- Función helper: generar slug desde texto (para URLs amigables)
-- =============================================================
create or replace function public.slugify(text_in text)
returns text
language sql
immutable
as $$
  select lower(
    regexp_replace(
      regexp_replace(
        translate(text_in, 'áéíóúñü', 'aeiounu'),
        '[^a-zA-Z0-9 -]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
$$;

-- =============================================================
-- Schema separado para auditoría (no expuesto al cliente)
-- =============================================================
create schema if not exists audit;

comment on schema audit is
  'Logs de auditoría. Nunca expuesto a clientes anon o authenticated.';
