/**
 * Tipos compartidos del dominio.
 *
 * Cuando hayas levantado Supabase localmente y corrido las migraciones,
 * regenera tipos exactos con:
 *   npm run supabase:gen-types
 *
 * Eso reescribe src/lib/supabase/types.ts con tipos generados.
 */

// =============================================================
// Padrón
// =============================================================
export type Modalidad = "remunerada" | "equivalente";

export type GD = "GD-1" | "GD-2" | "GD-3" | "GD-4" | "GD-5";

export interface Plaza {
  id: string;
  semestre: string;
  modalidad: Modalidad;

  institucion_ofertante: string;
  diresa: string | null;
  institucion: string | null;
  sede_adjudicacion: string | null;
  presupuesto: string | null;

  departamento: string;
  provincia: string;
  distrito: string;
  ubigeo: string | null;
  lat: number | null;
  lng: number | null;

  renipress: string;
  establecimiento: string;
  categoria: string | null;

  profesion_id: string;
  n_plazas: number;
  gd: GD;
  zaf: boolean;
  ze: boolean;

  total_reviews: number;
  avg_rating: number | null;

  created_at: string;
  updated_at: string;
}

export interface PlazaPublica extends Plaza {
  profesion_nombre: string;
  profesion_familia: string;
}

// =============================================================
// Profesiones
// =============================================================
export interface FamiliaProfesional {
  id: string;
  nombre: string;
  orden: number;
}

export interface Profesion {
  id: string;
  nombre: string;
  familia: string;
  orden: number;
}

// =============================================================
// Filtros del mapa
// =============================================================
export interface PlazaFiltros {
  q?: string;                       // texto libre
  profesion?: string;               // ID exacto de profesión
  familia?: string;                 // ID de familia
  gd?: GD;
  zaf?: boolean;
  ze?: boolean;
  modalidad?: Modalidad;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  semestre?: string;                // default: actual
  page?: number;
  pageSize?: number;
}
