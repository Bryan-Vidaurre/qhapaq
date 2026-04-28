# Scripts auxiliares

Scripts de Python para procesamiento de datos. No corren como parte de la app — son herramientas que se ejecutan ocasionalmente.

## parse-padron.py

Parsea los PDFs oficiales del MINSA (Anexo 2 y Anexo 3) y produce un JSON estructurado.

### Uso

```bash
pip install pdfplumber tqdm

python scripts/parse-padron.py \
  --remuneradas data/Plazas-remuneradas-serums-2026-i.pdf \
  --equivalentes data/Plazas-equivalentes-serums-2026-i.pdf \
  --output supabase/seed/padron_2026_i.json \
  --semestre 2026-I
```

### Cuándo correr

- Al inicio de cada semestre, cuando MINSA publique el padrón nuevo.
- El JSON resultante se carga vía `npm run seed`.

---

## geocode-establecimientos.py

Enriquece el padrón con coordenadas lat/lng para mostrar markers en el mapa.

Ver el docstring del archivo para las 3 etapas progresivas (departamental → distrital → exacto).

### Uso etapa 1 (rápida, baja precisión)

```bash
python scripts/geocode-establecimientos.py --etapa 1 \
  --input supabase/seed/padron_2026_i.json \
  --output supabase/seed/padron_2026_i_geo.json
```

---

## Notas

- Los scripts están en Python para aprovechar `pdfplumber` que es la mejor librería para extraer tablas de PDFs.
- Si tienes un PDF nuevo y el script no lo parsea bien, abre un issue con el PDF de muestra.
