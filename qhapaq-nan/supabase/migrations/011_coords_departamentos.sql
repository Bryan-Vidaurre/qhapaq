-- =============================================================
-- 011_coords_departamentos.sql
-- Asigna coordenadas aproximadas a todas las plazas sin lat/lng
-- usando los centroides de los 25 departamentos del Perú.
-- Es un fallback rápido — el geocoding de distritos mejorará
-- la precisión más adelante.
-- =============================================================

-- Tabla temporal de centroides por departamento
with dep_coords (departamento, lat, lng) as (
  values
    ('AMAZONAS',      -5.8000, -78.0000),
    ('ANCASH',        -9.5000, -77.5000),
    ('APURIMAC',     -13.6000, -73.0000),
    ('AREQUIPA',     -16.4000, -71.5000),
    ('AYACUCHO',     -13.2000, -74.2000),
    ('CAJAMARCA',     -7.0000, -78.5000),
    ('CALLAO',       -12.0500, -77.1200),
    ('CUSCO',        -13.5000, -71.9000),
    ('HUANCAVELICA', -12.8000, -74.9000),
    ('HUANUCO',       -9.9000, -76.2000),
    ('ICA',          -14.0000, -75.7000),
    ('JUNIN',        -11.5000, -75.0000),
    ('LA LIBERTAD',   -8.0000, -78.3000),
    ('LAMBAYEQUE',    -6.5000, -79.8000),
    ('LIMA',         -11.5000, -76.5000),
    ('LORETO',        -4.5000, -76.0000),
    ('MADRE DE DIOS',-11.5000, -70.0000),
    ('MOQUEGUA',     -16.9000, -70.9000),
    ('PASCO',        -10.7000, -76.2000),
    ('PIURA',         -5.0000, -80.5000),
    ('PUNO',         -14.5000, -70.0000),
    ('SAN MARTIN',    -6.5000, -76.5000),
    ('TACNA',        -17.9000, -70.2000),
    ('TUMBES',        -3.6000, -80.4000),
    ('UCAYALI',       -9.5000, -74.0000)
)
update public.plazas p
set
  lat = d.lat + (random() - 0.5) * 0.8,   -- dispersión ±0.4° para no apilar todo
  lng = d.lng + (random() - 0.5) * 0.8
from dep_coords d
where p.departamento = d.departamento
  and p.lat is null;
