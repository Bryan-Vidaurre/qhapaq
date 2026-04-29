"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { PlazaListItem } from "@/components/plaza/PlazaListItem";
import { PlazaDetailPanel } from "@/components/plaza/PlazaDetailPanel";
import { createClient } from "@/lib/supabase/client";
import type { GD, PlazaPublica } from "@/types/padron";

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

const PROFESIONES = [
  { id: "MEDICINA", label: "Medicina" },
  { id: "ENFERMERIA", label: "Enfermería" },
  { id: "OBSTETRICIA", label: "Obstetricia" },
  { id: "ODONTOLOGIA", label: "Odontología" },
  { id: "PSICOLOGIA", label: "Psicología" },
  { id: "NUTRICION", label: "Nutrición" },
  { id: "QUIMICO FARMACEUTICO", label: "Quím. Farmacéutico" },
  { id: "BIOLOGIA", label: "Biología" },
  { id: "TRABAJO SOCIAL", label: "Trabajo Social" },
  { id: "MEDICINA VETERINARIA", label: "Med. Veterinaria" },
  { id: "INGENIERIA SANITARIA", label: "Ing. Sanitaria" },
  { id: "TM - LABORATORIO CLINICO", label: "T.M. Laboratorio" },
  { id: "TM - TERAPIA FISICA", label: "T.M. Terapia Física" },
  { id: "TM - RADIOLOGIA", label: "T.M. Radiología" },
  { id: "TM - TERAPIA LENGUAJE", label: "T.M. T. Lenguaje" },
  { id: "TM - TERAPIA OCUPACIONAL", label: "T.M. T. Ocupacional" },
  { id: "TM - OPTOMETRIA", label: "T.M. Optometría" },
];

const DEPARTAMENTOS = [
  "AMAZONAS", "ANCASH", "APURIMAC", "AREQUIPA", "AYACUCHO",
  "CAJAMARCA", "CALLAO", "CUSCO", "HUANCAVELICA", "HUANUCO",
  "ICA", "JUNIN", "LA LIBERTAD", "LAMBAYEQUE", "LIMA",
  "LORETO", "MADRE DE DIOS", "MOQUEGUA", "PASCO", "PIURA",
  "PUNO", "SAN MARTIN", "TACNA", "TUMBES", "UCAYALI",
];

interface ApiResponse {
  data: PlazaPublica[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-qn-border-soft">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-qn-wide text-qn-text-subtle hover:text-qn-ink"
        onClick={onToggle}
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function PlazasExplorer() {
  // Filter state
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [profesiones, setProfesiones] = useState<string[]>([]);
  const [modalidad, setModalidad] = useState<"remunerada" | "equivalente" | null>(null);
  const [gd, setGd] = useState<GD | null>(null);
  const [zaf, setZaf] = useState<boolean | null>(null);
  const [ze, setZe] = useState<boolean | null>(null);
  const [departamento, setDepartamento] = useState<string | null>(null);
  const [deptSearch, setDeptSearch] = useState("");

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [secProfOpen, setSecProfOpen] = useState(true);
  const [secModalidadOpen, setSecModalidadOpen] = useState(true);
  const [secUbicOpen, setSecUbicOpen] = useState(false);
  const [secGdOpen, setSecGdOpen] = useState(false);
  const [secBonosOpen, setSecBonosOpen] = useState(false);

  // Data state
  const [plazas, setPlazas] = useState<PlazaPublica[]>([]);      // list (filtered+search)
  const [mapPlazas, setMapPlazas] = useState<PlazaPublica[]>([]); // map (all, spatial filters only)
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<PlazaPublica | null>(null);

  // Real-time adjudicaciones
  const [adjudicaciones, setAdjudicaciones] = useState<number>(0);
  const [recentFlash, setRecentFlash] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // ── Fetch list (filtered + search, paginated) ──────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQ) params.set("q", debouncedQ);
    if (profesiones.length > 0) params.set("profesiones", profesiones.join(","));
    if (modalidad) params.set("modalidad", modalidad);
    if (gd) params.set("gd", gd);
    if (zaf !== null) params.set("zaf", String(zaf));
    if (ze !== null) params.set("ze", String(ze));
    if (departamento) params.set("departamento", departamento);
    params.set("pageSize", "100");

    setLoading(true);
    fetch(`/api/plazas?${params.toString()}`)
      .then((r) => r.json())
      .then((res: ApiResponse) => {
        setPlazas(res.data ?? []);
        setTotal(res.pagination?.total ?? 0);
      })
      .catch((err) => console.error("Error fetching list:", err))
      .finally(() => setLoading(false));
  }, [debouncedQ, profesiones, modalidad, gd, zaf, ze, departamento]);

  // ── Fetch map plazas (ALL, spatial filters only, parallel batches) ──────
  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      const PAGE_SIZE = 2000;
      const base = new URLSearchParams();
      if (profesiones.length > 0) base.set("profesiones", profesiones.join(","));
      if (modalidad) base.set("modalidad", modalidad);
      if (gd) base.set("gd", gd);
      if (zaf !== null) base.set("zaf", String(zaf));
      if (ze !== null) base.set("ze", String(ze));
      if (departamento) base.set("departamento", departamento);
      base.set("pageSize", String(PAGE_SIZE));
      base.set("page", "1");

      try {
        const first = await fetch(`/api/plazas?${base.toString()}`).then((r) => r.json()) as ApiResponse;
        if (cancelled) return;
        setMapPlazas(first.data ?? []);

        const totalPages = first.pagination?.totalPages ?? 1;
        if (totalPages > 1) {
          const rest = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) => {
              const p = new URLSearchParams(base);
              p.set("page", String(i + 2));
              return fetch(`/api/plazas?${p.toString()}`).then((r) => r.json()) as Promise<ApiResponse>;
            }),
          );
          if (cancelled) return;
          setMapPlazas((prev) => [...prev, ...rest.flatMap((r) => r.data ?? [])]);
        }
      } catch (err) {
        console.error("Error loading map plazas:", err);
      }
    }

    loadMap();
    return () => { cancelled = true; };
  }, [profesiones, modalidad, gd, zaf, ze, departamento]);

  // Real-time adjudicaciones counter
  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("plaza_seleccion")
      .select("id", { count: "exact", head: true })
      .eq("semestre", "2026-I")
      .eq("tipo", "adjudicada")
      .then(({ count }) => setAdjudicaciones(count ?? 0));

    const channel = supabase
      .channel("adjudicaciones_live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "plaza_seleccion" }, () => {
        setAdjudicaciones((n) => n + 1);
        setRecentFlash(true);
        setTimeout(() => setRecentFlash(false), 2500);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "plaza_seleccion" }, () => {
        setAdjudicaciones((n) => Math.max(0, n - 1));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const toggleProfesion = useCallback((id: string) => {
    setProfesiones((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  }, []);

  const clearAll = () => {
    setProfesiones([]);
    setModalidad(null);
    setGd(null);
    setZaf(null);
    setZe(null);
    setDepartamento(null);
    setDeptSearch("");
  };

  const activeFilterCount =
    profesiones.length +
    (modalidad ? 1 : 0) +
    (gd ? 1 : 0) +
    (zaf !== null ? 1 : 0) +
    (ze !== null ? 1 : 0) +
    (departamento ? 1 : 0);

  const filteredDepts = DEPARTAMENTOS.filter((d) =>
    d.toLowerCase().includes(deptSearch.toLowerCase()),
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Filter panel (LISA-style) */}
      <aside
        className={`flex-shrink-0 flex-col overflow-y-auto border-r border-qn-border bg-qn-paper transition-all duration-200 ${
          showFilters ? "flex w-64" : "hidden"
        }`}
      >
        {/* Filter header */}
        <div className="flex items-center justify-between border-b border-qn-border px-4 py-3">
          <span className="text-sm font-semibold text-qn-ink">Filtros</span>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 rounded-full bg-qn-terracotta/10 px-2 py-0.5 text-xs text-qn-terracotta hover:bg-qn-terracotta/20"
              >
                <X size={10} /> Limpiar ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Profesiones */}
        <FilterSection title="Profesión" open={secProfOpen} onToggle={() => setSecProfOpen((v) => !v)}>
          <div className="space-y-1.5">
            {PROFESIONES.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-2 text-xs text-qn-text">
                <input
                  type="checkbox"
                  checked={profesiones.includes(p.id)}
                  onChange={() => toggleProfesion(p.id)}
                  className="h-3.5 w-3.5 accent-qn-terracotta"
                />
                {p.label}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Modalidad */}
        <FilterSection title="Modalidad" open={secModalidadOpen} onToggle={() => setSecModalidadOpen((v) => !v)}>
          <div className="flex flex-col gap-2">
            {(["remunerada", "equivalente"] as const).map((m) => (
              <label key={m} className="flex cursor-pointer items-center gap-2 text-xs text-qn-text">
                <input
                  type="radio"
                  name="modalidad"
                  checked={modalidad === m}
                  onChange={() => setModalidad(modalidad === m ? null : m)}
                  className="accent-qn-terracotta"
                />
                {m === "remunerada" ? "Remunerada" : "Equivalente (no remunerada)"}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Ubicación */}
        <FilterSection title="Departamento" open={secUbicOpen} onToggle={() => setSecUbicOpen((v) => !v)}>
          <input
            type="search"
            value={deptSearch}
            onChange={(e) => setDeptSearch(e.target.value)}
            placeholder="Buscar departamento..."
            className="mb-2 w-full rounded border border-qn-border bg-qn-soft px-2 py-1 text-xs text-qn-ink focus:outline-none focus:border-qn-terracotta"
          />
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {filteredDepts.map((d) => (
              <label key={d} className="flex cursor-pointer items-center gap-2 text-xs text-qn-text">
                <input
                  type="radio"
                  name="departamento"
                  checked={departamento === d}
                  onChange={() => setDepartamento(departamento === d ? null : d)}
                  className="accent-qn-terracotta"
                />
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* GD */}
        <FilterSection title="Grado de dificultad" open={secGdOpen} onToggle={() => setSecGdOpen((v) => !v)}>
          <div className="space-y-1.5">
            {GD_OPTIONS.map((g) => (
              <label key={g} className="flex cursor-pointer items-center gap-2 text-xs text-qn-text">
                <input
                  type="radio"
                  name="gd"
                  checked={gd === g}
                  onChange={() => setGd(gd === g ? null : g)}
                  className="accent-qn-terracotta"
                />
                <span className={`rounded px-1.5 py-0.5 text-[10px] qn-gd-${g.split("-")[1]}`}>{g}</span>
                {g === "GD-1" && " — Accesible"}
                {g === "GD-2" && " — Moderado"}
                {g === "GD-3" && " — Difícil"}
                {g === "GD-4" && " — Muy difícil"}
                {g === "GD-5" && " — Extremo"}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Bonos */}
        <FilterSection title="Bonos especiales" open={secBonosOpen} onToggle={() => setSecBonosOpen((v) => !v)}>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-qn-text">
              <input
                type="checkbox"
                checked={zaf === true}
                onChange={() => setZaf(zaf === true ? null : true)}
                className="accent-qn-terracotta"
              />
              Zona Alejada y de Frontera (ZAF)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-qn-text">
              <input
                type="checkbox"
                checked={ze === true}
                onChange={() => setZe(ze === true ? null : true)}
                className="accent-qn-terracotta"
              />
              Zona de Emergencia · VRAEM (ZE)
            </label>
          </div>
        </FilterSection>
      </aside>

      {/* Search + list sidebar */}
      <aside className="flex w-full flex-shrink-0 flex-col border-r border-qn-border bg-qn-paper md:w-80">
        {/* Search bar + filter toggle */}
        <div className="border-b border-qn-border p-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-qn-text-subtle"
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar establecimiento, lugar..."
                className="w-full rounded-full border border-qn-border bg-qn-soft py-2 pl-8 pr-3 text-xs text-qn-ink placeholder:text-qn-text-subtle focus:border-qn-terracotta focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                showFilters || activeFilterCount > 0
                  ? "border-qn-terracotta bg-qn-terracotta text-white"
                  : "border-qn-border text-qn-text-muted hover:border-qn-terracotta hover:text-qn-ink"
              }`}
              aria-label="Filtros"
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-qn-text-subtle">
              {loading ? "Buscando..." : `${total.toLocaleString("es-PE")} plazas`}
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-[11px] text-qn-rust hover:underline"
              >
                <X size={10} /> Limpiar ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {profesiones.map((id) => {
                const p = PROFESIONES.find((x) => x.id === id);
                return (
                  <span
                    key={id}
                    className="flex items-center gap-1 rounded-full bg-qn-terracotta/10 px-2 py-0.5 text-[10px] text-qn-terracotta"
                  >
                    {p?.label ?? id}
                    <button onClick={() => toggleProfesion(id)}><X size={9} /></button>
                  </span>
                );
              })}
              {modalidad && (
                <span className="flex items-center gap-1 rounded-full bg-qn-ink/10 px-2 py-0.5 text-[10px] text-qn-ink">
                  {modalidad === "remunerada" ? "Remunerada" : "Equivalente"}
                  <button onClick={() => setModalidad(null)}><X size={9} /></button>
                </span>
              )}
              {departamento && (
                <span className="flex items-center gap-1 rounded-full bg-qn-ink/10 px-2 py-0.5 text-[10px] text-qn-ink">
                  {departamento.charAt(0) + departamento.slice(1).toLowerCase()}
                  <button onClick={() => setDepartamento(null)}><X size={9} /></button>
                </span>
              )}
              {gd && (
                <span className="flex items-center gap-1 rounded-full bg-qn-ink/10 px-2 py-0.5 text-[10px] text-qn-ink">
                  {gd}
                  <button onClick={() => setGd(null)}><X size={9} /></button>
                </span>
              )}
              {zaf && (
                <span className="flex items-center gap-1 rounded-full bg-qn-ink/10 px-2 py-0.5 text-[10px] text-qn-ink">
                  ZAF
                  <button onClick={() => setZaf(null)}><X size={9} /></button>
                </span>
              )}
              {ze && (
                <span className="flex items-center gap-1 rounded-full bg-qn-ink/10 px-2 py-0.5 text-[10px] text-qn-ink">
                  VRAEM
                  <button onClick={() => setZe(null)}><X size={9} /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Plaza list */}
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

      {/* Map area */}
      <div className="relative hidden flex-1 md:block">
        <LeafletMap plazas={mapPlazas} selected={selected} onSelect={setSelected} />

        {selected && (
          <PlazaDetailPanel plaza={selected} onClose={() => setSelected(null)} />
        )}

        {/* Real-time adjudicaciones counter */}
        <div
          className={`absolute bottom-4 left-4 z-[1000] flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs shadow-md transition-all ${
            recentFlash
              ? "border-green-300 bg-green-50 text-green-700"
              : "border-qn-border bg-qn-paper/90 text-qn-text-muted backdrop-blur"
          }`}
        >
          {recentFlash ? (
            <CheckCircle2 size={13} className="text-green-600" />
          ) : (
            <Activity size={13} className={adjudicaciones > 0 ? "text-qn-terracotta" : ""} />
          )}
          {recentFlash
            ? "¡Nueva adjudicación registrada!"
            : adjudicaciones > 0
              ? `${adjudicaciones} adjudicacion${adjudicaciones === 1 ? "" : "es"} SERUMS 2026-I`
              : "En vivo · Nadie adjudicado aún"}
        </div>
      </div>
    </div>
  );
}
