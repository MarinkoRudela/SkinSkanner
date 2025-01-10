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
      business_settings: {
        Row: {
          id: string
          profile_id: string | null
          booking_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          booking_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          booking_url?: string
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}