export type LogroAlcance = "transversal" | "familia_profesional" | "profesion";

export type LogroEvidencia =
  | "auto_declarado"
  | "tiempo_plataforma"
  | "peer_confirmation"
  | "documento"
  | "padron_minsa"
  | "metrica_comunidad";

export type LogroRareza = "comun" | "poco_comun" | "raro" | "epico";

export type LogroStatus =
  | "reclamado"
  | "pendiente_revision"
  | "pendiente_peers"
  | "otorgado"
  | "rechazado"
  | "revocado";

export interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  alcance: LogroAlcance;
  familia_profesional?: string;
  profesion_id?: string;
  evidencia: LogroEvidencia;
  yachay: 0 | 1 | 2 | 3 | 4 | 5;
  rareza: LogroRareza;
  icono: string;
  activo: boolean;
}

export interface LogroUsuario {
  id: string;
  user_id: string;
  logro_id: string;
  status: LogroStatus;
  plaza_id: string | null;
  fecha_evento: string | null;
  descripcion: string | null;
  evidencia_urls: string[];
  validated_at: string | null;
  validated_by: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}
