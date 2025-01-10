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
          profile_id: string
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
      profiles: {
        Row: {
          brand_name: string
          business_name: string | null
          created_at: string
          id: string
          logo_url: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          brand_name?: string
          business_name?: string | null
          created_at?: string
          id: string
          logo_url?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          brand_name?: string
          business_name?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
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
          profile_id: string
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
          profile_id: string
          updated_at?: string
          visit_date: string
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
      [_ in never]: never
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
