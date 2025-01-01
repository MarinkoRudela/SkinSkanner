import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BusinessData {
  brand_name: string;
  logo_url: string;
  tagline: string;
  booking_url: string;
}

export const fetchBusinessShortCode = async (shortCode: string) => {
  console.log('Fetching business data for short code:', shortCode);
  const normalizedShortCode = shortCode.toUpperCase();
  console.log('Normalized short code:', normalizedShortCode);
  
  const { data, error } = await supabase
    .from('business_short_codes')
    .select('profile_id')
    .ilike('short_code', normalizedShortCode)
    .maybeSingle();

  if (error) {
    console.error('Error fetching short code:', error);
    throw new Error('Invalid booking link');
  }

  if (!data) {
    console.error('No business found for short code:', normalizedShortCode);
    throw new Error(`Business not found for code: ${shortCode}`);
  }

  console.log('Found profile_id:', data.profile_id);
  return data.profile_id;
};

export const fetchBusinessProfile = async (profileId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('brand_name, logo_url, tagline')
    .eq('id', profileId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Could not load business profile information');
  }

  if (!data || !data.brand_name) {
    console.error('Incomplete profile data:', data);
    throw new Error('This business profile is not completely set up. Please make sure brand name is set.');
  }

  return data;
};

export const fetchBusinessSettings = async (profileId: string) => {
  const { data, error } = await supabase
    .from('business_settings')
    .select('booking_url')
    .eq('profile_id', profileId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching settings:', error);
    throw new Error('Could not load business settings');
  }

  if (!data?.booking_url) {
    console.error('Missing booking URL:', data);
    throw new Error('This business has not set up their booking URL yet.');
  }

  return data;
};

export const fetchBusinessData = async (shortCode: string): Promise<BusinessData> => {
  try {
    const profileId = await fetchBusinessShortCode(shortCode);
    const profileData = await fetchBusinessProfile(profileId);
    const settingsData = await fetchBusinessSettings(profileId);

    const businessInfo = {
      brand_name: profileData.brand_name,
      logo_url: profileData.logo_url || '',
      tagline: profileData.tagline || '',
      booking_url: settingsData.booking_url
    };
    
    console.log('Successfully loaded business data:', businessInfo);
    return businessInfo;
  } catch (error) {
    throw error;
  }
};