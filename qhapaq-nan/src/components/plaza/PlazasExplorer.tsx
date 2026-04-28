"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Search, Filter, X } from "lucide-react";
import { FilterChip } from "@/components/ui/FilterChip";
import { PlazaListItem } from "@/components/plaza/PlazaListItem";
import { PlazaDetailPanel } from "@/components/plaza/PlazaDetailPanel";
import type { GD, PlazaPublica } from "@/types/padron";

// Leaflet rompe en SSR — cargar solo en cliente
const LeafletMap = dynamic(
  () => import("@/components/plaza/LeafletMap").then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-qn-bg">
        <div className="text-sm text-qn-text-muted">Cargando mapa...</div>
      </div>
    ),
  },
);

const GD_OPTIONS: GD[] = ["GD-1", "GD-2", "GD-3", "GD-4", "GD-5"];

interface ApiResponse {
  data: PlazaPublica[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function PlazasExplorer() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [profesion, setProfesion] = useState<string | null>(null);
  const [gd, setGd] = useState<GD | null>(null);
  const [zaf, setZaf] = useState<boolean | null>(null);
  const [ze, setZe] = useState<boolean | null>(null);

  const [plazas, setPlazas] = useState<PlazaPublica[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<PlazaPublica | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce de búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Cargar plazas según filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQ) params.set("q", debouncedQ);
    if (profesion) params.set("profesion", profesion);
    if (gd) params.set("gd", gd);
    if (zaf !== null) params.set("zaf", String(zaf));
    if (ze !== null) params.set("ze", String(ze));
    params.set("pageSize", "100");

    setLoading(true);
    fetch(`/api/plazas?${params.toString()}`)
      .then((r) => r.json())
      .then((res: ApiResponse) => {
        setPlazas(res.data || []);
        setTotal(res.pagination?.total ?? 0);
      })
      .catch((err) => console.error("Error fetching plazas:", err))
      .finally(() => setLoading(false));
  }, [debouncedQ, profesion, gd, zaf, ze]);

  const profesionesUnicas = useMemo(() => {
    const set = new Set<string>();
    plazas.forEach((p) => set.add(p.profesion_nombre));
    return Array.from(set).sort();
  }, [plazas]);

  const hasActiveFilters = profesion !== null || gd !== null || zaf !== null || ze !== null;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-full max-w-md flex-col border-r border-qn-border bg-qn-paper md:w-96">
        {/* Search + filters toggle */}
        <div className="border-b border-qn-border p-4">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-qn-text-subtle"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar establecimiento, distrito, profesión..."
              className="w-full rounded-full border border-qn-border bg-qn-soft py-2 pl-9 pr-4 text-sm text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none focus:bg-qn-paper"
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-xs text-qn-text-muted hover:text-qn-ink"
            >
              <Filter size={12} />
              Filtros
              {hasActiveFilters && (
                <span className="rounded-full bg-qn-terracotta px-1.5 text-[10px] text-qn-bg">
                  {[profesion, gd, zaf, ze].filter((v) => v !== null).length}
                </span>
              )}
            </button>
            <span className="text-xs text-qn-text-subtle">
              {loading ? "..." : `${total.toLocaleString("es-PE")} plazas`}
            </span>
          </div>

          {showFilters && (
            <div className="mt-3 space-y-3 border-t border-qn-border-soft pt-3">
              {/* GD */}
              <div>
                <div className="mb-2 text-[10px] uppercase tracking-qn-wide text-qn-text-subtle">
                  Grado de dificultad
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {GD_OPTIONS.map((g) => (
                    <FilterChip key={g} active={gd === g} onClick={() => setGd(gd === g ? null : g)}>
                      {g}
                    </FilterChip>
                  ))}
                </div>
              </div>

              {/* Bonos */}
              <div>
                <div className="mb-2 text-[10px] uppercase tracking-qn-wide text-qn-text-subtle">
                  Bonos
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip
                    active={zaf === true}
                    onClick={() => setZaf(zaf === true ? null : true)}
                  >
                    ZAF
                  </FilterChip>
                  <FilterChip active={ze === true} onClick={() => setZe(ze === true ? null : true)}>
                    VRAEM (ZE)
                  </FilterChip>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setProfesion(null);
                    setGd(null);
                    setZaf(null);
                    setZe(null);
                  }}
                  className="flex items-center gap-1 text-xs text-qn-rust hover:underline"
                >
                  <X size={12} /> Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {/* Lista */}
        <div className="qn-scroll flex-1 overflow-y-auto">
          {loading && plazas.length === 0 ? (
            <div className="p-6 text-sm text-qn-text-muted">Cargando...</div>
          ) : plazas.length === 0 ? (
            <div className="p-6 text-center">
              <div className="qn-display mb-2 text-qn-text" style={{ fontSize: 18 }}>
                Sin resultados
              </div>
              <div className="text-xs text-qn-text-subtle">
                Prueba ampliar los filtros o buscar otro término.
              </div>
            </div>
          ) : (
            plazas.map((p) => (
              <PlazaListItem
                key={p.id}
                plaza={p}
                isSelected={selected?.id === p.id}
                onClick={() => setSelected(p)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Mapa + panel de detalle */}
      <div className="relative hidden flex-1 md:block">
        <LeafletMap plazas={plazas} selected={selected} onSelect={setSelected} />
        {selected && (
          <PlazaDetailPanel plaza={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}
