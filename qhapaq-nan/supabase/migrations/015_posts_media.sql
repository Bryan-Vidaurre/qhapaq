-- =============================================================
-- 015_posts_media.sql
-- Soporte de fotos y vídeos en posts del feed.
--
-- Regla de negocio:
--   - Todos los usuarios autenticados: texto + fotos (hasta 4)
--   - Usuarios verificados (nivel > autodeclarado): además vídeos (1 por post)
--
-- Diseño:
--   posts.media = JSONB array de objetos { url, tipo, mime }
--   El control de permisos de vídeo se hace en el API (server-side).
--   El storage bucket "post-media" es público para lectura.
-- =============================================================

-- -------------------------------------------------------------
-- 1. Columna media en posts
-- -------------------------------------------------------------
alter table public.posts
  add column if not exists media jsonb not null default '[]'::jsonb;

comment on column public.posts.media is
  'Array de objetos media adjuntos: [{url, tipo: "imagen"|"video", mime}].
   Imágenes: hasta 4 por post. Vídeo: hasta 1, solo usuarios con nivel > autodeclarado.';

-- -------------------------------------------------------------
-- 2. Recrear vista posts_publicos con la nueva columna
--    (drop + create porque postgres no permite reordenar columnas
--     en CREATE OR REPLACE VIEW)
-- -------------------------------------------------------------
drop view if exists public.posts_publicos;

create view public.posts_publicos
with (security_invoker = true) as
select
  p.id,
  p.user_id,
  p.tipo,
  p.cuerpo,
  p.plaza_id,
  p.ubicacion_texto,
  p.media,
  p.likes_count,
  p.comments_count,
  p.created_at,
  p.edited_at,
  pf.nombre_publico,
  pf.avatar_url,
  pf.prof_level,
  pf.profesion_declarada_id
from public.posts p
join public.perfiles pf on pf.user_id = p.user_id
where not p.is_hidden;

-- -------------------------------------------------------------
-- 3. Bucket de storage "post-media"
-- -------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-media',
  'post-media',
  true,
  52428800,  -- 50 MB por archivo
  array[
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'
  ]
)
on conflict (id) do nothing;

-- -------------------------------------------------------------
-- 4. RLS del bucket (storage.objects)
-- -------------------------------------------------------------

-- Lectura pública
create policy "post_media_read"
  on storage.objects for select
  using (bucket_id = 'post-media');

-- Upload: solo al propio directorio {user_id}/...
create policy "post_media_upload"
  on storage.objects for insert
  with check (
    bucket_id = 'post-media'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Borrado: solo del propio directorio
create policy "post_media_delete"
  on storage.objects for delete
  using (
    bucket_id = 'post-media'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );
