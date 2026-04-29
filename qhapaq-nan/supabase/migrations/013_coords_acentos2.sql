-- 013_coords_acentos2.sql
-- Coordenadas para departamentos con tildes que aún faltan

with dep_coords (departamento, lat, lng) as (
  values
    ('APURÍMAC',   -13.6000, -73.0000),
    ('SAN MARTÍN',  -6.5000, -76.5000)
)
update public.plazas p
set
  lat = d.lat + (random() - 0.5) * 0.8,
  lng = d.lng + (random() - 0.5) * 0.8
from dep_coords d
where p.departamento = d.departamento
  and p.lat is null;
