export interface LinkAnalytics {
  id: string;
  short_code: string;
  profile_id: string;
  visitor_id: string;
  device_type?: string;
  browser?: string;
  country?: string;
  region?: string;
  visit_timestamp?: string;
  session_duration?: number;
}

export interface WeeklyAnalytics {
  id: string;
  profile_id: string;
  visit_date: string;
  daily_visits: number;
  daily_completed_scans: number;
  daily_booking_clicks: number;
  avg_session_duration?: number;
  created_at: string;
  updated_at: string;
}

export interface ScannerAnalytics {
  id: string;
  link_visit_id: string;
  profile_id: string;
  scan_started_at?: string;
  scan_completed_at?: string;
  photos_uploaded?: number;
  recommendations_generated?: number;
  primary_concerns?: string[];
}