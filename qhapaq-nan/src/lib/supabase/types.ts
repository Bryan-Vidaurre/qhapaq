export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_deletions: {
        Row: {
          cancelled_at: string | null
          cancelled_reason: string | null
          completed_at: string | null
          id: string
          reason: string | null
          requested_at: string
          scheduled_for: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          cancelled_reason?: string | null
          completed_at?: string | null
          id?: string
          reason?: string | null
          requested_at?: string
          scheduled_for: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          cancelled_reason?: string | null
          completed_at?: string | null
          id?: string
          reason?: string | null
          requested_at?: string
          scheduled_for?: string
          user_id?: string
        }
        Relationships: []
      }
      familias_profesionales: {
        Row: {
          id: string
          nombre: string
          orden: number
        }
        Insert: {
          id: string
          nombre: string
          orden?: number
        }
        Update: {
          id?: string
          nombre?: string
          orden?: number
        }
        Relationships: []
      }
      logros: {
        Row: {
          activo: boolean
          alcance: Database["public"]["Enums"]["logro_alcance"]
          created_at: string | null
          descripcion: string
          evidencia: Database["public"]["Enums"]["logro_evidencia"]
          familia_profesional: string | null
          icono: string | null
          id: string
          nombre: string
          profesion_id: string | null
          rareza: Database["public"]["Enums"]["logro_rareza"]
          updated_at: string | null
          yachay: number
        }
        Insert: {
          activo?: boolean
          alcance: Database["public"]["Enums"]["logro_alcance"]
          created_at?: string | null
          descripcion: string
          evidencia: Database["public"]["Enums"]["logro_evidencia"]
          familia_profesional?: string | null
          icono?: string | null
          id: string
          nombre: string
          profesion_id?: string | null
          rareza?: Database["public"]["Enums"]["logro_rareza"]
          updated_at?: string | null
          yachay?: number
        }
        Update: {
          activo?: boolean
          alcance?: Database["public"]["Enums"]["logro_alcance"]
          created_at?: string | null
          descripcion?: string
          evidencia?: Database["public"]["Enums"]["logro_evidencia"]
          familia_profesional?: string | null
          icono?: string | null
          id?: string
          nombre?: string
          profesion_id?: string | null
          rareza?: Database["public"]["Enums"]["logro_rareza"]
          updated_at?: string | null
          yachay?: number
        }
        Relationships: [
          {
            foreignKeyName: "logros_profesion_id_fkey"
            columns: ["profesion_id"]
            isOneToOne: false
            referencedRelation: "profesiones"
            referencedColumns: ["id"]
          },
        ]
      }
      logros_usuario: {
        Row: {
          created_at: string | null
          descripcion: string | null
          evidencia_urls: Json | null
          fecha_evento: string | null
          id: string
          logro_id: string
          plaza_id: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["logro_status"]
          updated_at: string | null
          user_id: string
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          evidencia_urls?: Json | null
          fecha_evento?: string | null
          id?: string
          logro_id: string
          plaza_id?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["logro_status"]
          updated_at?: string | null
          user_id: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          evidencia_urls?: Json | null
          fecha_evento?: string | null
          id?: string
          logro_id?: string
          plaza_id?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["logro_status"]
          updated_at?: string | null
          user_id?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logros_usuario_logro_id_fkey"
            columns: ["logro_id"]
            isOneToOne: false
            referencedRelation: "logros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logros_usuario_plaza_id_fkey"
            columns: ["plaza_id"]
            isOneToOne: false
            referencedRelation: "plazas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logros_usuario_plaza_id_fkey"
            columns: ["plaza_id"]
            isOneToOne: false
            referencedRelation: "plazas_publicas"
            referencedColumns: ["id"]
          },
        ]
      }
      peer_confirmations: {
        Row: {
          comentario: string | null
          confirmador_id: string
          created_at: string | null
          id: string
          logro_usuario_id: string
        }
        Insert: {
          comentario?: string | null
          confirmador_id: string
          created_at?: string | null
          id?: string
          logro_usuario_id: string
        }
        Update: {
          comentario?: string | null
          confirmador_id?: string
          created_at?: string | null
          id?: string
          logro_usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "peer_confirmations_logro_usuario_id_fkey"
            columns: ["logro_usuario_id"]
            isOneToOne: false
            referencedRelation: "logros_usuario"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email_marketing: boolean
          email_notifications: boolean
          ip_at_signup: unknown
          is_suspended: boolean
          kind: Database["public"]["Enums"]["user_kind"]
          locale: string | null
          nombre_publico: string
          plaza_id: string | null
          plaza_periodo: string | null
          prof_level: Database["public"]["Enums"]["prof_level"] | null
          profesion_declarada_id: string | null
          suspended_reason: string | null
          suspended_until: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          yachay: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email_marketing?: boolean
          email_notifications?: boolean
          ip_at_signup?: unknown
          is_suspended?: boolean
          kind?: Database["public"]["Enums"]["user_kind"]
          locale?: string | null
          nombre_publico: string
          plaza_id?: string | null
          plaza_periodo?: string | null
          prof_level?: Database["public"]["Enums"]["prof_level"] | null
          profesion_declarada_id?: string | null
          suspended_reason?: string | null
          suspended_until?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          yachay?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email_marketing?: boolean
          email_notifications?: boolean
          ip_at_signup?: unknown
          is_suspended?: boolean
          kind?: Database["public"]["Enums"]["user_kind"]
          locale?: string | null
          nombre_publico?: string
          plaza_id?: string | null
          plaza_periodo?: string | null
          prof_level?: Database["public"]["Enums"]["prof_level"] | null
          profesion_declarada_id?: string | null
          suspended_reason?: string | null
          suspended_until?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          yachay?: number
        }
        Relationships: [
          {
            foreignKeyName: "perfiles_plaza_id_fkey"
            columns: ["plaza_id"]
            isOneToOne: false
            referencedRelation: "plazas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfiles_plaza_id_fkey"
            columns: ["plaza_id"]
            isOneToOne: false
            referencedRelation: "plazas_publicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfiles_profesion_declarada_id_fkey"
            columns: ["profesion_declarada_id"]
            isOneToOne: false
            referencedRelation: "profesiones"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles_sensibles: {
        Row: {
          apellidos_legales: string | null
          cmp_numero: string | null
          constancia_url: string | null
          created_at: string | null
          diploma_url: string | null
          dni_hash: string | null
          dni_last4: string | null
          nombres_legales: string | null
          rejected_at: string | null
          rejection_reason: string | null
          resolucion_numero: string | null
          resolucion_url: string | null
          selfie_deleted_at: string | null
          selfie_hash: string | null
          selfie_taken_at: string | null
          updated_at: string | null
          user_id: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          apellidos_legales?: string | null
          cmp_numero?: string | null
          constancia_url?: string | null
          created_at?: string | null
          diploma_url?: string | null
          dni_hash?: string | null
          dni_last4?: string | null
          nombres_legales?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          resolucion_numero?: string | null
          resolucion_url?: string | null
          selfie_deleted_at?: string | null
          selfie_hash?: string | null
          selfie_taken_at?: string | null
          updated_at?: string | null
          user_id: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          apellidos_legales?: string | null
          cmp_numero?: string | null
          constancia_url?: string | null
          created_at?: string | null
          diploma_url?: string | null
          dni_hash?: string | null
          dni_last4?: string | null
          nombres_legales?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          resolucion_numero?: string | null
          resolucion_url?: string | null
          selfie_deleted_at?: string | null
          selfie_hash?: string | null
          selfie_taken_at?: string | null
          updated_at?: string | null
          user_id?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      plazas: {
        Row: {
          avg_rating: number | null
          categoria: string | null
          created_at: string | null
          departamento: string
          diresa: string | null
          distrito: string
          establecimiento: string
          gd: string
          id: string
          institucion: string | null
          institucion_ofertante: string
          lat: number | null
          lng: number | null
          modalidad: Database["public"]["Enums"]["modalidad_plaza"]
          n_plazas: number
          presupuesto: string | null
          profesion_id: string
          provincia: string
          renipress: string
          search_vector: unknown
          sede_adjudicacion: string | null
          semestre: string
          total_reviews: number
          ubigeo: string | null
          updated_at: string | null
          zaf: boolean
          ze: boolean
        }
        Insert: {
          avg_rating?: number | null
          categoria?: string | null
          created_at?: string | null
          departamento: string
          diresa?: string | null
          distrito: string
          establecimiento: string
          gd: string
          id?: string
          institucion?: string | null
          institucion_ofertante: string
          lat?: number | null
          lng?: number | null
          modalidad: Database["public"]["Enums"]["modalidad_plaza"]
          n_plazas?: number
          presupuesto?: string | null
          profesion_id: string
          provincia: string
          renipress: string
          search_vector?: unknown
          sede_adjudicacion?: string | null
          semestre: string
          total_reviews?: number
          ubigeo?: string | null
          updated_at?: string | null
          zaf?: boolean
          ze?: boolean
        }
        Update: {
          avg_rating?: number | null
          categoria?: string | null
          created_at?: string | null
          departamento?: string
          diresa?: string | null
          distrito?: string
          establecimiento?: string
          gd?: string
          id?: string
          institucion?: string | null
          institucion_ofertante?: string
          lat?: number | null
          lng?: number | null
          modalidad?: Database["public"]["Enums"]["modalidad_plaza"]
          n_plazas?: number
          presupuesto?: string | null
          profesion_id?: string
          provincia?: string
          renipress?: string
          search_vector?: unknown
          sede_adjudicacion?: string | null
          semestre?: string
          total_reviews?: number
          ubigeo?: string | null
          updated_at?: string | null
          zaf?: boolean
          ze?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "plazas_profesion_id_fkey"
            columns: ["profesion_id"]
            isOneToOne: false
            referencedRelation: "profesiones"
            referencedColumns: ["id"]
          },
        ]
      }
      profesiones: {
        Row: {
          created_at: string | null
          familia: string
          id: string
          nombre: string
          orden: number
        }
        Insert: {
          created_at?: string | null
          familia: string
          id: string
          nombre: string
          orden?: number
        }
        Update: {
          created_at?: string | null
          familia?: string
          id?: string
          nombre?: string
          orden?: number
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          count: number
          key: string
          window_start: string
        }
        Insert: {
          count?: number
          key: string
          window_start?: string
        }
        Update: {
          count?: number
          key?: string
          window_start?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          action_taken: string | null
          created_at: string | null
          description: string | null
          evidence_urls: Json | null
          id: string
          kind: Database["public"]["Enums"]["report_kind"]
          priority: number | null
          reported_entity_id: string | null
          reported_entity_type: string | null
          reported_user_id: string | null
          reporter_id: string
          resolution_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          description?: string | null
          evidence_urls?: Json | null
          id?: string
          kind: Database["public"]["Enums"]["report_kind"]
          priority?: number | null
          reported_entity_id?: string | null
          reported_entity_type?: string | null
          reported_user_id?: string | null
          reporter_id: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          description?: string | null
          evidence_urls?: Json | null
          id?: string
          kind?: Database["public"]["Enums"]["report_kind"]
          priority?: number | null
          reported_entity_id?: string | null
          reported_entity_type?: string | null
          reported_user_id?: string | null
          reporter_id?: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      review_helpful: {
        Row: {
          created_at: string | null
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_replies: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          status: Database["public"]["Enums"]["review_status"]
          texto: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          status?: Database["public"]["Enums"]["review_status"]
          texto: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          status?: Database["public"]["Enums"]["review_status"]
          texto?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          conflicto_declarado: string | null
          cons: string[] | null
          created_at: string | null
          display_mode: string
          edit_count: number
          edited_at: string | null
          helpful_count: number
          hidden_at: string | null
          hidden_reason: string | null
          id: string
          plaza_id: string
          pros: string[] | null
          rating_carga: number | null
          rating_conectividad: number | null
          rating_equipo: number | null
          rating_general: number | null
          rating_jefatura: number | null
          rating_seguridad: number | null
          rating_vivienda: number | null
          semestre_servicio: string
          status: Database["public"]["Enums"]["review_status"]
          texto: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conflicto_declarado?: string | null
          cons?: string[] | null
          created_at?: string | null
          display_mode?: string
          edit_count?: number
          edited_at?: string | null
          helpful_count?: number
          hidden_at?: string | null
          hidden_reason?: string | null
          id?: string
          plaza_id: string
          pros?: string[] | null
          rating_carga?: number | null
          rating_conectividad?: number | null
          rating_equipo?: number | null
          rating_general?: number | null
          rating_jefatura?: number | null
          rating_seguridad?: number | null
          rating_vivienda?: number | null
          semestre_servicio: string
          status?: Database["public"]["Enums"]["review_status"]
          texto: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conflicto_declarado?: string | null
          cons?: string[] | null
          created_at?: string | null
          display_mode?: string
          edit_count?: number
          edited_at?: string | null
          helpful_count?: number
          hidden_at?: string | null
          hidden_reason?: string | null
          id?: string
          plaza_id?: string
          pros?: string[] | null
          rating_carga?: number | null
          rating_conectividad?: number | null
          rating_equipo?: number | null
          rating_general?: number | null
          rating_jefatura?: number | null
          rating_seguridad?: number | null
          rating_vivienda?: number | null
          semestre_servicio?: string
          status?: Database["public"]["Enums"]["review_status"]
          texto?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_plaza_id_fkey"
            columns: ["plaza_id"]
            isOneToOne: false
            referencedRelation: "plazas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_plaza_id_fkey"
            columns: ["plaza_id"]
            isOneToOne: false
            referencedRelation: "plazas_publicas"
            referencedColumns: ["id"]
          },
        ]
      }
      verificacion_solicitudes: {
        Row: {
          conflicto_con: string | null
          conflicto_resuelto: boolean | null
          created_at: string | null
          datos_extraidos: Json | null
          documentos: Json
          id: string
          nivel_solicitado: Database["public"]["Enums"]["prof_level"]
          notas_internas: string | null
          notas_publicas: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["verificacion_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conflicto_con?: string | null
          conflicto_resuelto?: boolean | null
          created_at?: string | null
          datos_extraidos?: Json | null
          documentos?: Json
          id?: string
          nivel_solicitado: Database["public"]["Enums"]["prof_level"]
          notas_internas?: string | null
          notas_publicas?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["verificacion_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conflicto_con?: string | null
          conflicto_resuelto?: boolean | null
          created_at?: string | null
          datos_extraidos?: Json | null
          documentos?: Json
          id?: string
          nivel_solicitado?: Database["public"]["Enums"]["prof_level"]
          notas_internas?: string | null
          notas_publicas?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["verificacion_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      plazas_publicas: {
        Row: {
          avg_rating: number | null
          categoria: string | null
          departamento: string | null
          diresa: string | null
          distrito: string | null
          establecimiento: string | null
          gd: string | null
          id: string | null
          institucion_ofertante: string | null
          lat: number | null
          lng: number | null
          modalidad: Database["public"]["Enums"]["modalidad_plaza"] | null
          n_plazas: number | null
          profesion_familia: string | null
          profesion_id: string | null
          profesion_nombre: string | null
          provincia: string | null
          renipress: string | null
          semestre: string | null
          total_reviews: number | null
          zaf: boolean | null
          ze: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "plazas_profesion_id_fkey"
            columns: ["profesion_id"]
            isOneToOne: false
            referencedRelation: "profesiones"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_key: string
          p_max_attempts: number
          p_window_seconds: number
        }
        Returns: boolean
      }
      puede_reseñar: {
        Args: { p_plaza_id: string; p_user_id: string }
        Returns: boolean
      }
      recalc_yachay: { Args: { p_user_id: string }; Returns: number }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      slugify: { Args: { text_in: string }; Returns: string }
    }
    Enums: {
      logro_alcance: "transversal" | "familia_profesional" | "profesion"
      logro_evidencia:
        | "auto_declarado"
        | "tiempo_plataforma"
        | "peer_confirmation"
        | "documento"
        | "padron_minsa"
        | "metrica_comunidad"
      logro_rareza: "comun" | "poco_comun" | "raro" | "epico"
      logro_status:
        | "reclamado"
        | "pendiente_revision"
        | "pendiente_peers"
        | "otorgado"
        | "rechazado"
        | "revocado"
      modalidad_plaza: "remunerada" | "equivalente"
      prof_level:
        | "autodeclarado"
        | "estudiante"
        | "egresado"
        | "colegiado"
        | "serums_activo"
        | "perenne"
      report_kind:
        | "spam"
        | "acoso"
        | "contenido_inapropiado"
        | "suplantacion"
        | "datos_paciente"
        | "fraude_marketplace"
        | "usurpacion_plaza"
        | "otro"
      report_status:
        | "pendiente"
        | "en_revision"
        | "resuelto_accion"
        | "resuelto_sin_accion"
        | "cerrado_invalido"
      review_status: "visible" | "oculta" | "eliminada"
      user_kind: "general" | "profesional"
      verificacion_status:
        | "pendiente"
        | "en_revision"
        | "aprobada"
        | "rechazada"
        | "cancelada"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          metadata: Json | null
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] }
        Returns: boolean
      }
      allow_only_operation: {
        Args: { expected_operation: string }
        Returns: boolean
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      logro_alcance: ["transversal", "familia_profesional", "profesion"],
      logro_evidencia: [
        "auto_declarado",
        "tiempo_plataforma",
        "peer_confirmation",
        "documento",
        "padron_minsa",
        "metrica_comunidad",
      ],
      logro_rareza: ["comun", "poco_comun", "raro", "epico"],
      logro_status: [
        "reclamado",
        "pendiente_revision",
        "pendiente_peers",
        "otorgado",
        "rechazado",
        "revocado",
      ],
      modalidad_plaza: ["remunerada", "equivalente"],
      prof_level: [
        "autodeclarado",
        "estudiante",
        "egresado",
        "colegiado",
        "serums_activo",
        "perenne",
      ],
      report_kind: [
        "spam",
        "acoso",
        "contenido_inapropiado",
        "suplantacion",
        "datos_paciente",
        "fraude_marketplace",
        "usurpacion_plaza",
        "otro",
      ],
      report_status: [
        "pendiente",
        "en_revision",
        "resuelto_accion",
        "resuelto_sin_accion",
        "cerrado_invalido",
      ],
      review_status: ["visible", "oculta", "eliminada"],
      user_kind: ["general", "profesional"],
      verificacion_status: [
        "pendiente",
        "en_revision",
        "aprobada",
        "rechazada",
        "cancelada",
      ],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const
