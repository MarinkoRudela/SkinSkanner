export type BusinessType = 'med_spa' | 'aesthetician' | 'brow_specialist';

export interface Theme {
  id: string;
  name: string;
  background_gradient_start: string;
  background_gradient_end: string;
  card_background: string;
  button_color: string;
  text_color: string;
  is_default?: boolean;
  texture_url?: string;
}

export interface BusinessSettings {
  id: string;
  profile_id: string | null;
  booking_url: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessProfile {
  id: string;
  business_name: string | null;
  brand_name: string;
  logo_url: string | null;
  tagline: string | null;
  business_type: BusinessType | null;
  theme_id: string | null;
  theme?: Theme | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessData {
  id: string;
  brand_name: string;
  logo_url: string | null;
  tagline: string | null;
  business_settings: BusinessSettings | null;
  profile_id: string;
  theme_id: string | null;
  theme?: Theme | null;
}
