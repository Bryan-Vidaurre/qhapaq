export type UserKind = "general" | "profesional";

export type ProfLevel =
  | "autodeclarado"
  | "estudiante"
  | "egresado"
  | "colegiado"
  | "serums_activo"
  | "perenne";

export interface Perfil {
  user_id: string;
  nombre_publico: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;

  kind: UserKind;
  prof_level: ProfLevel | null;
  profesion_declarada_id: string | null;

  plaza_id: string | null;
  plaza_periodo: string | null;

  yachay: number;

  is_suspended: boolean;
  suspended_until: string | null;

  email_notifications: boolean;
  email_marketing: boolean;
  locale: string;

  created_at: string;
  updated_at: string;
}

/**
 * Permisos derivados del tipo + nivel de cuenta.
 * Refleja el código de conducta y el modelo de identidad simplificado.
 */
export const PERMISOS = {
  general: {
    canPostFeed: true,        // pueden comentar/publicar pero con marca de "no verificado"
    canReviewPlaza: false,
    canSellMarket: false,
    canModerateForum: false,
    canValidatePeers: false,
  },
  profesional_autodeclarado: {
    canPostFeed: true,
    canReviewPlaza: false,
    canSellMarket: false,
    canModerateForum: false,
    canValidatePeers: false,
  },
  profesional_estudiante: {
    canPostFeed: true,
    canReviewPlaza: false,
    canSellMarket: true,
    canModerateForum: false,
    canValidatePeers: false,
  },
  profesional_egresado: {
    canPostFeed: true,
    canReviewPlaza: false,
    canSellMarket: true,
    canModerateForum: false,
    canValidatePeers: false,
  },
  profesional_colegiado: {
    canPostFeed: true,
    canReviewPlaza: false,
    canSellMarket: true,
    canModerateForum: false,
    canValidatePeers: true,
  },
  profesional_serums_activo: {
    canPostFeed: true,
    canReviewPlaza: true,      // solo de su plaza, mínimo 30 días
    canSellMarket: true,
    canModerateForum: false,
    canValidatePeers: true,
  },
  profesional_perenne: {
    canPostFeed: true,
    canReviewPlaza: true,      // de cualquier plaza donde haya estado
    canSellMarket: true,
    canModerateForum: true,
    canValidatePeers: true,
  },
} as const;
