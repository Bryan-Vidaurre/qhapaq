"""
Parser del padrón oficial SERUMS (MINSA) de los PDFs Anexo 2 (remuneradas)
y Anexo 3 (equivalentes) a JSON estructurado.

Uso:
    python parse_padron_serums.py \\
        --remuneradas Plazas-remuneradas-serums-2026-i.pdf \\
        --equivalentes Plazas-equivalentes-serums-2026-i.pdf \\
        --salida padron.json \\
        --semestre 2026-I

Dependencias:
    pip install pdfplumber

Notas:
    - El PDF tiene 16 columnas estables. Si MINSA cambia el formato en
      semestres futuros, hay que ajustar el parser. Mantén la versión
      del semestre que parseaste (--semestre).
    - n_plazas es el número de plazas que ofrece esa fila. Una fila con
      n_plazas=2 representa 2 vacantes en el mismo establecimiento +
      profesión.
    - Genera 16,018 ofertas / 20,093 plazas / 5,810 establecimientos
      únicos para SERUMS 2026-I.
"""

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    sys.exit("Instala pdfplumber: pip install pdfplumber")


COLUMNAS = [
    "institucion_ofertante",  # 0
    "profesion",              # 1
    "sede_adjudicacion",      # 2
    "n_plazas",               # 3
    "diresa",                 # 4
    "institucion",            # 5 (gobierno regional / nacional / etc.)
    "departamento",           # 6
    "provincia",              # 7
    "distrito",               # 8
    "gd",                     # 9 (grado de dificultad)
    "renipress",              # 10 (código RENIPRESS, 8 dígitos)
    "establecimiento",        # 11
    "categoria",              # 12 (I-1, I-2, I-3, II-1, etc.)
    "presupuesto",            # 13
    "zaf",                    # 14 (boolean)
    "ze",                     # 15 (boolean)
]


def es_fila_de_datos(row):
    """Filtra filas de header, anexo y notas."""
    if not row or not row[0]:
        return False
    if len(row) < 16:
        return False
    txt0 = (row[0] or "").strip()
    if any(k in txt0 for k in ("ANEXO", "NOTA", "INSTITUCIÓN", "INSTITUCION")):
        return False
    renipress = (row[10] or "").strip() if row[10] else ""
    return renipress.isdigit() and len(renipress) == 8


def fila_a_dict(row, modalidad, semestre):
    """Convierte una fila cruda en dict normalizado."""
    def clean(idx):
        v = row[idx] or ""
        return v.replace("\n", " ").strip()

    n_plazas_raw = clean(3)
    try:
        n_plazas = int(n_plazas_raw or 0)
    except ValueError:
        n_plazas = 0

    return {
        "institucion_ofertante": clean(0),
        "profesion": clean(1),
        "sede_adjudicacion": clean(2),
        "n_plazas": n_plazas,
        "diresa": clean(4),
        "institucion": clean(5),
        "departamento": clean(6),
        "provincia": clean(7),
        "distrito": clean(8),
        "gd": clean(9),
        "renipress": clean(10),
        "establecimiento": clean(11),
        "categoria": clean(12),
        "presupuesto": clean(13),
        "zaf": clean(14).upper() == "SI",
        "ze": clean(15).upper() == "SI",
        "modalidad": modalidad,
        "semestre": semestre,
    }


def parse_pdf(path, modalidad, semestre, verbose=True):
    plazas = []
    with pdfplumber.open(path) as pdf:
        total = len(pdf.pages)
        if verbose:
            print(f"  {Path(path).name}: {total} páginas", file=sys.stderr)
        for i, page in enumerate(pdf.pages):
            if verbose and i % 50 == 0 and i > 0:
                print(f"    página {i}/{total}", file=sys.stderr)
            for table in page.extract_tables():
                for row in table:
                    if es_fila_de_datos(row):
                        plazas.append(fila_a_dict(row, modalidad, semestre))
    return plazas


def imprimir_stats(plazas):
    print(f"\nOfertas: {len(plazas)}", file=sys.stderr)
    print(
        f"Plazas individuales: {sum(p['n_plazas'] for p in plazas)}",
        file=sys.stderr,
    )
    print(
        f"Establecimientos únicos: {len(set(p['renipress'] for p in plazas))}",
        file=sys.stderr,
    )
    print(
        f"Distritos: {len(set((p['departamento'], p['provincia'], p['distrito']) for p in plazas))}",
        file=sys.stderr,
    )
    print("\nProfesiones:", file=sys.stderr)
    for prof, c in Counter(p["profesion"] for p in plazas).most_common():
        print(f"  {prof}: {c}", file=sys.stderr)


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--remuneradas", required=True, help="PDF Anexo 2")
    parser.add_argument("--equivalentes", required=True, help="PDF Anexo 3")
    parser.add_argument(
        "--salida", default="padron.json", help="Ruta del JSON de salida"
    )
    parser.add_argument(
        "--semestre", default="2026-I", help="Semestre (ej. 2026-I, 2026-II)"
    )
    parser.add_argument(
        "--stats", action="store_true", help="Imprimir estadísticas a stderr"
    )
    args = parser.parse_args()

    print("Parseando remuneradas...", file=sys.stderr)
    rem = parse_pdf(args.remuneradas, "remunerada", args.semestre)
    print("Parseando equivalentes...", file=sys.stderr)
    equ = parse_pdf(args.equivalentes, "equivalente", args.semestre)

    todas = rem + equ
    if args.stats:
        imprimir_stats(todas)

    with open(args.salida, "w", encoding="utf-8") as f:
        json.dump(todas, f, ensure_ascii=False, indent=2)
    print(f"\n→ {len(todas)} ofertas escritas a {args.salida}", file=sys.stderr)


if __name__ == "__main__":
    main()
