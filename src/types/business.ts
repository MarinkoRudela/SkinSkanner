export type BusinessType = 'med_spa' | 'aesthetician' | 'brow_specialist';

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
  created_at: string;
  updated_at: string;
}