export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      booking_conversions: {
        Row: {
          id: string
          link_visit_id: string
          profile_id: string
          short_code: string
          conversion_timestamp: string | null
          booking_url_clicked: string
        }
        Insert: {
          id?: string
          link_visit_id: string
          profile_id: string
          short_code: string
          conversion_timestamp?: string | null
          booking_url_clicked: string
        }
        Update: {
          id?: string
          link_visit_id?: string
          profile_id?: string
          short_code?: string
          conversion_timestamp?: string | null
          booking_url_clicked?: string
        }
      }
      weekly_analytics: {
        Row: {
          id: string
          profile_id: string
          visit_date: string
          daily_visits: number
          daily_completed_scans: number
          daily_booking_clicks: number
          avg_session_duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          visit_date: string
          daily_visits?: number
          daily_completed_scans?: number
          daily_booking_clicks?: number
          avg_session_duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          visit_date?: string
          daily_visits?: number
          daily_completed_scans?: number
          daily_booking_clicks?: number
          avg_session_duration?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_todays_analytics: {
        Args: { profile_id_param: string }
        Returns: {
          total_visits_today: number
          total_scans_today: number
          total_booking_clicks_today: number
          peak_hour_today: number
          avg_session_duration_today: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]