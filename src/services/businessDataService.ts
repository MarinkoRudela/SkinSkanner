import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BusinessData {
  brand_name: string;
  logo_url: string;
  tagline: string;
  booking_url: string;
  profile_id: string;
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
  console.log('Fetching business profile for ID:', profileId);
  const { data, error } = await supabase
    .from('profiles')
    .select('brand_name, logo_url, tagline, id')
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

  console.log('Business profile fetched:', data);
  return {
    brand_name: data.brand_name,
    logo_url: data.logo_url,
    tagline: data.tagline,
    profile_id: data.id
  };
};

export const fetchBusinessSettings = async (profileId: string) => {
  console.log('Fetching business settings for ID:', profileId);
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

  console.log('Business settings fetched:', data);
  return data;
};

export const fetchBusinessData = async (shortCode: string): Promise<BusinessData> => {
  try {
    console.log('Starting business data fetch process for shortCode:', shortCode);
    const profileId = await fetchBusinessShortCode(shortCode);
    const profileData = await fetchBusinessProfile(profileId);
    const settingsData = await fetchBusinessSettings(profileId);

    const businessInfo = {
      brand_name: profileData.brand_name,
      logo_url: profileData.logo_url || '',
      tagline: profileData.tagline || '',
      booking_url: settingsData.booking_url,
      profile_id: profileData.profile_id
    };
    
    console.log('Successfully loaded business data:', businessInfo);
    return businessInfo;
  } catch (error) {
    console.error('Error in fetchBusinessData:', error);
    throw error;
  }
};