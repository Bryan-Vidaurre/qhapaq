-- 012_coords_acentos.sql
-- Asigna coordenadas a las plazas cuyo departamento tiene tildes
-- (ÁNCASH, HUÁNUCO, JUNÍN) que no coincidieron con migration 011.

with dep_coords (departamento, lat, lng) as (
  values
    ('ÁNCASH',   -9.5000, -77.5000),
    ('HUÁNUCO',  -9.9000, -76.2000),
    ('JUNÍN',   -11.5000, -75.0000)
)
update public.plazas p
set
  lat = d.lat + (random() - 0.5) * 0.8,
  lng = d.lng + (random() - 0.5) * 0.8
from dep_coords d
where p.departamento = d.departamento
  and p.lat is null;
