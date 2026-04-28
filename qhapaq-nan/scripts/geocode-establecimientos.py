#!/usr/bin/env python3
"""
geocode-establecimientos.py — Enriquece el padrón con coordenadas.

ESTADO: placeholder de v0.1.

ENFOQUE PROGRESIVO:

Etapa 1 (v0.1, gratis):
  - Geocodificar a nivel distrito usando ubigeo INEI + centroides distritales.
  - Resultado: marker en el centro del distrito, no del establecimiento exacto.
  - Suficiente para mostrar densidad por zona.

Etapa 2 (v0.2-v0.3):
  - Cruce con shapefiles RENIPRESS de MINSA (cuando estén disponibles).
  - Para establecimientos sin coordenadas, usar Nominatim (OSM) con rate limit
    de 1 req/s, máx 1 vez por establecimiento (cachear).
  - Resultado: ~80% de establecimientos con lat/lng precisos.

Etapa 3 (v1.0):
  - Crowdsourcing: usuarios verificados con plaza activa pueden corregir
    coordenadas con foto de evidencia.
  - Validación por jefatura del centro.

DEPENDENCIAS (pip install):
  - requests
  - tqdm

USO:
  python scripts/geocode-establecimientos.py --etapa 1 --input padron.json --output padron_geo.json
"""

import argparse
import json
import sys
from pathlib import Path


# Centroides aproximados por departamento (Etapa 1 fallback más burdo).
# Para precisión a nivel distrito, hay que descargar el shapefile distrital
# del INEI y calcular centroides — eso es trabajo de la Etapa 1 real.
DEPARTAMENTO_CENTROIDES = {
    "AMAZONAS": (-6.232, -77.872),
    "ANCASH": (-9.527, -77.527),
    "APURIMAC": (-13.633, -73.000),
    "AREQUIPA": (-16.398, -71.535),
    "AYACUCHO": (-13.158, -74.224),
    "CAJAMARCA": (-7.163, -78.500),
    "CALLAO": (-12.061, -77.117),
    "CUSCO": (-13.531, -71.967),
    "HUANCAVELICA": (-12.787, -74.973),
    "HUANUCO": (-9.929, -76.241),
    "ICA": (-14.067, -75.728),
    "JUNIN": (-12.066, -75.205),
    "LA LIBERTAD": (-8.115, -79.029),
    "LAMBAYEQUE": (-6.701, -79.907),
    "LIMA": (-12.046, -77.043),
    "LORETO": (-3.749, -73.253),
    "MADRE DE DIOS": (-12.595, -69.181),
    "MOQUEGUA": (-17.194, -70.935),
    "PASCO": (-10.685, -76.255),
    "PIURA": (-5.194, -80.632),
    "PUNO": (-15.840, -70.027),
    "SAN MARTIN": (-6.486, -76.366),
    "TACNA": (-18.014, -70.253),
    "TUMBES": (-3.566, -80.451),
    "UCAYALI": (-8.379, -74.553),
}


def main():
    parser = argparse.ArgumentParser(description="Geocodifica el padrón SERUMS.")
    parser.add_argument("--etapa", type=int, choices=[1, 2, 3], default=1)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    if not args.input.exists():
        print(f"❌ Input no encontrado: {args.input}")
        sys.exit(1)

    raw = json.loads(args.input.read_text(encoding="utf-8"))
    print(f"  → {len(raw)} ofertas en input")

    if args.etapa == 1:
        print("  → Etapa 1: centroides departamentales (fallback)")
        for p in raw:
            dep = p.get("departamento", "").upper().strip()
            if dep in DEPARTAMENTO_CENTROIDES:
                lat, lng = DEPARTAMENTO_CENTROIDES[dep]
                p["lat"] = lat
                p["lng"] = lng
            else:
                p["lat"] = None
                p["lng"] = None
        geocoded = sum(1 for p in raw if p.get("lat") is not None)
        print(f"  → {geocoded}/{len(raw)} con coordenadas (precisión: departamental)")

    elif args.etapa == 2:
        print("  → Etapa 2: NO IMPLEMENTADO. Requiere shapefiles INEI + Nominatim.")
        print("     Ver docstring del script para guía.")
        sys.exit(1)

    elif args.etapa == 3:
        print("  → Etapa 3: NO IMPLEMENTADO. Requiere flujo crowdsourcing.")
        sys.exit(1)

    args.output.write_text(json.dumps(raw, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  ✓ Output: {args.output}")


if __name__ == "__main__":
    main()
