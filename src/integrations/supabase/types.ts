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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alimentos: {
        Row: {
          corte_12_mais: string | null
          corte_6_9m: string | null
          corte_9_12m: string | null
          created_at: string
          id: string
          nome: string
          preparo: string | null
          tipo: string
        }
        Insert: {
          corte_12_mais?: string | null
          corte_6_9m?: string | null
          corte_9_12m?: string | null
          created_at?: string
          id?: string
          nome: string
          preparo?: string | null
          tipo: string
        }
        Update: {
          corte_12_mais?: string | null
          corte_6_9m?: string | null
          corte_9_12m?: string | null
          created_at?: string
          id?: string
          nome?: string
          preparo?: string | null
          tipo?: string
        }
        Relationships: []
      }
      cardapios: {
        Row: {
          carboidrato_id: string | null
          created_at: string
          data: string
          id: string
          proteina_id: string | null
          refeicao: string
          user_id: string
          vegetal_id: string | null
        }
        Insert: {
          carboidrato_id?: string | null
          created_at?: string
          data: string
          id?: string
          proteina_id?: string | null
          refeicao: string
          user_id: string
          vegetal_id?: string | null
        }
        Update: {
          carboidrato_id?: string | null
          created_at?: string
          data?: string
          id?: string
          proteina_id?: string | null
          refeicao?: string
          user_id?: string
          vegetal_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cardapios_carboidrato_id_fkey"
            columns: ["carboidrato_id"]
            isOneToOne: false
            referencedRelation: "alimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cardapios_proteina_id_fkey"
            columns: ["proteina_id"]
            isOneToOne: false
            referencedRelation: "alimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cardapios_vegetal_id_fkey"
            columns: ["vegetal_id"]
            isOneToOne: false
            referencedRelation: "alimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aplv: boolean
          baby_birth_date: string | null
          baby_name: string | null
          created_at: string
          id: string
          is_premium: boolean
          nome: string | null
          sem_gluten: boolean
          updated_at: string
          user_id: string
          vegano: boolean
        }
        Insert: {
          aplv?: boolean
          baby_birth_date?: string | null
          baby_name?: string | null
          created_at?: string
          id?: string
          is_premium?: boolean
          nome?: string | null
          sem_gluten?: boolean
          updated_at?: string
          user_id: string
          vegano?: boolean
        }
        Update: {
          aplv?: boolean
          baby_birth_date?: string | null
          baby_name?: string | null
          created_at?: string
          id?: string
          is_premium?: boolean
          nome?: string | null
          sem_gluten?: boolean
          updated_at?: string
          user_id?: string
          vegano?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
