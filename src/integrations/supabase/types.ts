export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booking_conversions: {
        Row: {
          booking_url_clicked: string
          conversion_timestamp: string | null
          id: string
          link_visit_id: string
          profile_id: string
          short_code: string
        }
        Insert: {
          booking_url_clicked: string
          conversion_timestamp?: string | null
          id?: string
          link_visit_id: string
          profile_id: string
          short_code: string
        }
        Update: {
          booking_url_clicked?: string
          conversion_timestamp?: string | null
          id?: string
          link_visit_id?: string
          profile_id?: string
          short_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_conversions_link_visit_id_fkey"
            columns: ["link_visit_id"]
            isOneToOne: false
            referencedRelation: "link_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_conversions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_settings: {
        Row: {
          booking_url: string
          created_at: string
          id: string
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          booking_url: string
          created_at?: string
          id?: string
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          booking_url?: string
          created_at?: string
          id?: string
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_settings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_short_codes: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          short_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          short_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          short_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_short_codes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      link_analytics: {
        Row: {
          browser: string | null
          country: string | null
          device_type: string | null
          id: string
          profile_id: string
          region: string | null
          session_duration: number | null
          short_code: string
          visit_timestamp: string | null
          visitor_id: string
        }
        Insert: {
          browser?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          profile_id: string
          region?: string | null
          session_duration?: number | null
          short_code: string
          visit_timestamp?: string | null
          visitor_id: string
        }
        Update: {
          browser?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          profile_id?: string
          region?: string | null
          session_duration?: number | null
          short_code?: string
          visit_timestamp?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profile"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_analytics_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      med_spa_treatments: {
        Row: {
          created_at: string
          expertise_areas: string[] | null
          id: string
          is_active: boolean | null
          profile_id: string | null
          treatment_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          expertise_areas?: string[] | null
          id?: string
          is_active?: boolean | null
          profile_id?: string | null
          treatment_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          expertise_areas?: string[] | null
          id?: string
          is_active?: boolean | null
          profile_id?: string | null
          treatment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "med_spa_treatments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "med_spa_treatments_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "available_business_treatments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "med_spa_treatments_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_business_names: {
        Row: {
          business_name: string
          created_at: string
          id: string
          processed: boolean | null
          user_id: string | null
        }
        Insert: {
          business_name: string
          created_at?: string
          id?: string
          processed?: boolean | null
          user_id?: string | null
        }
        Update: {
          business_name?: string
          created_at?: string
          id?: string
          processed?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          created_at: string
          id: string
          name: string
          path: string
          timestamp: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          path: string
          timestamp?: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          path?: string
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          brand_name: string
          business_name: string | null
          business_type: string | null
          created_at: string
          id: string
          logo_url: string | null
          tagline: string | null
          theme_id: string | null
          updated_at: string
        }
        Insert: {
          brand_name?: string
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          id: string
          logo_url?: string | null
          tagline?: string | null
          theme_id?: string | null
          updated_at?: string
        }
        Update: {
          brand_name?: string
          business_name?: string | null
          business_type?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          tagline?: string | null
          theme_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      scanner_analytics: {
        Row: {
          id: string
          link_visit_id: string
          photos_uploaded: number | null
          primary_concerns: string[] | null
          profile_id: string
          recommendations_generated: number | null
          scan_completed_at: string | null
          scan_started_at: string | null
        }
        Insert: {
          id?: string
          link_visit_id: string
          photos_uploaded?: number | null
          primary_concerns?: string[] | null
          profile_id: string
          recommendations_generated?: number | null
          scan_completed_at?: string | null
          scan_started_at?: string | null
        }
        Update: {
          id?: string
          link_visit_id?: string
          photos_uploaded?: number | null
          primary_concerns?: string[] | null
          profile_id?: string
          recommendations_generated?: number | null
          scan_completed_at?: string | null
          scan_started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scanner_analytics_link_visit_id_fkey"
            columns: ["link_visit_id"]
            isOneToOne: false
            referencedRelation: "link_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scanner_analytics_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan_type: string
          profile_id: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type: string
          profile_id: string
          status: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type?: string
          profile_id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_name: string
          author_title: string
          business_name: string
          created_at: string
          id: string
          is_featured: boolean | null
          rating: number | null
          testimonial: string
          updated_at: string
        }
        Insert: {
          author_name: string
          author_title: string
          business_name: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          testimonial: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_title?: string
          business_name?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          testimonial?: string
          updated_at?: string
        }
        Relationships: []
      }
      themes: {
        Row: {
          background_gradient_end: string
          background_gradient_start: string
          button_color: string
          card_background: string
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          text_color: string
          texture_url: string | null
          updated_at: string
        }
        Insert: {
          background_gradient_end: string
          background_gradient_start: string
          button_color: string
          card_background: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          text_color: string
          texture_url?: string | null
          updated_at?: string
        }
        Update: {
          background_gradient_end?: string
          background_gradient_start?: string
          button_color?: string
          card_background?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          text_color?: string
          texture_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      treatment_categories: {
        Row: {
          category_type: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category_type?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category_type?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      treatment_subtypes: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          treatment_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          treatment_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          treatment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_subtypes_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "available_business_treatments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_subtypes_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          business_types: string[] | null
          category_id: string | null
          created_at: string
          description: string
          id: string
          name: string
          requires_license: boolean | null
          treatment_areas: string[] | null
          updated_at: string
        }
        Insert: {
          business_types?: string[] | null
          category_id?: string | null
          created_at?: string
          description: string
          id?: string
          name: string
          requires_license?: boolean | null
          treatment_areas?: string[] | null
          updated_at?: string
        }
        Update: {
          business_types?: string[] | null
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          requires_license?: boolean | null
          treatment_areas?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "treatment_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_analytics: {
        Row: {
          avg_session_duration: number | null
          created_at: string
          daily_booking_clicks: number
          daily_completed_scans: number
          daily_visits: number
          id: string
          profile_id: string
          updated_at: string
          visit_date: string
        }
        Insert: {
          avg_session_duration?: number | null
          created_at?: string
          daily_booking_clicks?: number
          daily_completed_scans?: number
          daily_visits?: number
          id?: string
          profile_id: string
          updated_at?: string
          visit_date: string
        }
        Update: {
          avg_session_duration?: number | null
          created_at?: string
          daily_booking_clicks?: number
          daily_completed_scans?: number
          daily_visits?: number
          id?: string
          profile_id?: string
          updated_at?: string
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_analytics_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      available_business_treatments: {
        Row: {
          business_types: string[] | null
          category_name: string | null
          category_type: string | null
          description: string | null
          id: string | null
          name: string | null
          profile_id: string | null
          requires_license: boolean | null
          treatment_areas: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "med_spa_treatments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_todays_analytics: {
        Args: {
          profile_id_param: string
        }
        Returns: {
          total_visits_today: number
          total_scans_today: number
          total_booking_clicks_today: number
          peak_hour_today: number
          avg_session_duration_today: number
        }[]
      }
      refresh_weekly_analytics: {
        Args: {
          profile_id_param: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
