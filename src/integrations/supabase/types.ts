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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_template_bookmarks: {
        Row: {
          created_at: string
          id: string
          template_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          template_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_template_bookmarks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "ai_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_template_generations: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          output: string | null
          template_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs?: Json
          output?: string | null
          template_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          output?: string | null
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_template_generations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "ai_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_templates: {
        Row: {
          category: string
          character_limit: number | null
          created_at: string
          credit_cost: number
          description: string
          icon: string | null
          id: string
          input_schema: Json
          is_active: boolean
          name: string
          output_format: string
          platform: string
          prompt_template: string
          updated_at: string
        }
        Insert: {
          category?: string
          character_limit?: number | null
          created_at?: string
          credit_cost?: number
          description: string
          icon?: string | null
          id?: string
          input_schema?: Json
          is_active?: boolean
          name: string
          output_format?: string
          platform?: string
          prompt_template: string
          updated_at?: string
        }
        Update: {
          category?: string
          character_limit?: number | null
          created_at?: string
          credit_cost?: number
          description?: string
          icon?: string | null
          id?: string
          input_schema?: Json
          is_active?: boolean
          name?: string
          output_format?: string
          platform?: string
          prompt_template?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          content: string
          created_at: string | null
          id: string
          job_id: string
          message_type: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          job_id: string
          message_type: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          job_id?: string
          message_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      gmail_connections: {
        Row: {
          access_token: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_sync_at: string | null
          refresh_token: string
          token_expires_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          refresh_token: string
          token_expires_at: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          refresh_token?: string
          token_expires_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          analysis: Json | null
          answers: Json | null
          application_type: string | null
          budget_max: number | null
          budget_min: number | null
          client_name: string | null
          client_rating: number | null
          created_at: string | null
          description: string | null
          eligibility_score: number | null
          email_id: string | null
          expires_at: string | null
          id: string
          is_available: boolean | null
          job_link: string | null
          job_type: string | null
          last_availability_check: string | null
          payment_verified: boolean | null
          profile_id: string | null
          questions: Json | null
          source: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analysis?: Json | null
          answers?: Json | null
          application_type?: string | null
          budget_max?: number | null
          budget_min?: number | null
          client_name?: string | null
          client_rating?: number | null
          created_at?: string | null
          description?: string | null
          eligibility_score?: number | null
          email_id?: string | null
          expires_at?: string | null
          id?: string
          is_available?: boolean | null
          job_link?: string | null
          job_type?: string | null
          last_availability_check?: string | null
          payment_verified?: boolean | null
          profile_id?: string | null
          questions?: Json | null
          source?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analysis?: Json | null
          answers?: Json | null
          application_type?: string | null
          budget_max?: number | null
          budget_min?: number | null
          client_name?: string | null
          client_rating?: number | null
          created_at?: string | null
          description?: string | null
          eligibility_score?: number | null
          email_id?: string | null
          expires_at?: string | null
          id?: string
          is_available?: boolean | null
          job_link?: string | null
          job_type?: string | null
          last_availability_check?: string | null
          payment_verified?: boolean | null
          profile_id?: string | null
          questions?: Json | null
          source?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          case_study_description: string | null
          case_study_title: string | null
          created_at: string
          description: string | null
          file_path: string | null
          id: string
          is_featured: boolean | null
          item_type: string
          metrics: Json | null
          profile_id: string | null
          project_outcome: string | null
          skills_demonstrated: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          case_study_description?: string | null
          case_study_title?: string | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          is_featured?: boolean | null
          item_type?: string
          metrics?: Json | null
          profile_id?: string | null
          project_outcome?: string | null
          skills_demonstrated?: Json | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          case_study_description?: string | null
          case_study_title?: string | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          is_featured?: boolean | null
          item_type?: string
          metrics?: Json | null
          profile_id?: string | null
          project_outcome?: string | null
          skills_demonstrated?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_seo_versions: {
        Row: {
          created_at: string | null
          education_titles: Json | null
          experience_titles: Json | null
          id: string
          is_active: boolean | null
          keyword_strategy: string | null
          keywords: string[]
          long_tail_keyword_1: string
          long_tail_keyword_2: string
          name: string
          portfolio_titles: Json | null
          profile_description: string
          project_catalog_titles: Json | null
          skills_tags: Json | null
          top_skills_bold: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          education_titles?: Json | null
          experience_titles?: Json | null
          id?: string
          is_active?: boolean | null
          keyword_strategy?: string | null
          keywords?: string[]
          long_tail_keyword_1: string
          long_tail_keyword_2: string
          name: string
          portfolio_titles?: Json | null
          profile_description: string
          project_catalog_titles?: Json | null
          skills_tags?: Json | null
          top_skills_bold?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          education_titles?: Json | null
          experience_titles?: Json | null
          id?: string
          is_active?: boolean | null
          keyword_strategy?: string | null
          keywords?: string[]
          long_tail_keyword_1?: string
          long_tail_keyword_2?: string
          name?: string
          portfolio_titles?: Json | null
          profile_description?: string
          project_catalog_titles?: Json | null
          skills_tags?: Json | null
          top_skills_bold?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          availability: string | null
          created_at: string | null
          display_name: string | null
          experience: string | null
          hourly_rate: number | null
          id: string
          is_default: boolean | null
          order_index: number | null
          overview: string | null
          portfolio_links: Json | null
          portfolio_website: string | null
          skills: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability?: string | null
          created_at?: string | null
          display_name?: string | null
          experience?: string | null
          hourly_rate?: number | null
          id?: string
          is_default?: boolean | null
          order_index?: number | null
          overview?: string | null
          portfolio_links?: Json | null
          portfolio_website?: string | null
          skills?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability?: string | null
          created_at?: string | null
          display_name?: string | null
          experience?: string | null
          hourly_rate?: number | null
          id?: string
          is_default?: boolean | null
          order_index?: number | null
          overview?: string | null
          portfolio_links?: Json | null
          portfolio_website?: string | null
          skills?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      proposal_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string | null
          detailed: string | null
          id: string
          job_id: string
          medium: string | null
          short: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          detailed?: string | null
          id?: string
          job_id: string
          medium?: string | null
          short?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          detailed?: string | null
          id?: string
          job_id?: string
          medium?: string | null
          short?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      upwork_filters: {
        Row: {
          auto_generate_proposals: boolean
          created_at: string
          id: string
          is_active: boolean
          job_types: string[] | null
          keywords_exclude: string[] | null
          keywords_include: string[] | null
          max_budget: number | null
          min_budget: number | null
          min_client_rating: number | null
          payment_verified_only: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_generate_proposals?: boolean
          created_at?: string
          id?: string
          is_active?: boolean
          job_types?: string[] | null
          keywords_exclude?: string[] | null
          keywords_include?: string[] | null
          max_budget?: number | null
          min_budget?: number | null
          min_client_rating?: number | null
          payment_verified_only?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_generate_proposals?: boolean
          created_at?: string
          id?: string
          is_active?: boolean
          job_types?: string[] | null
          keywords_exclude?: string[] | null
          keywords_include?: string[] | null
          max_budget?: number | null
          min_budget?: number | null
          min_client_rating?: number | null
          payment_verified_only?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_personal_info: {
        Row: {
          created_at: string
          education: string | null
          id: string
          personal_story: string | null
          updated_at: string
          upwork_stats: string | null
          user_id: string
          work_experience: string | null
        }
        Insert: {
          created_at?: string
          education?: string | null
          id?: string
          personal_story?: string | null
          updated_at?: string
          upwork_stats?: string | null
          user_id: string
          work_experience?: string | null
        }
        Update: {
          created_at?: string
          education?: string | null
          id?: string
          personal_story?: string | null
          updated_at?: string
          upwork_stats?: string | null
          user_id?: string
          work_experience?: string | null
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
