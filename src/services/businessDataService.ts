import { supabase } from '@/integrations/supabase/client';

export const fetchBusinessData = async (shortCode: string) => {
  console.log('Fetching business data for shortCode:', shortCode);
  
  try {
    // First, get the profile_id from business_short_codes
    const { data: shortCodeData, error: shortCodeError } = await supabase
      .from('business_short_codes')
      .select('profile_id')
      .eq('short_code', shortCode)
      .maybeSingle();

    if (shortCodeError) {
      console.error('Error fetching short code:', shortCodeError);
      throw new Error('Failed to find business');
    }

    if (!shortCodeData) {
      console.error('No short code data found');
      throw new Error('Business not found');
    }

    // Then, get the business data with theme information
    const { data: businessData, error: businessError } = await supabase
      .from('profiles')
      .select(`
        id,
        brand_name,
        logo_url,
        tagline,
        theme_id,
        themes!inner (
          id,
          name,
          background_gradient_start,
          background_gradient_end,
          card_background,
          button_color,
          text_color,
          is_default
        ),
        business_settings!inner (
          booking_url
        )
      `)
      .eq('id', shortCodeData.profile_id)
      .maybeSingle();

    if (businessError) {
      console.error('Error fetching business data:', businessError);
      throw new Error('Failed to load business data');
    }

    if (!businessData) {
      console.error('No business data found');
      throw new Error('Business profile not found');
    }

    // Restructure the data to match the expected format
    const formattedData = {
      ...businessData,
      theme: businessData.themes,
      business_settings: businessData.business_settings[0],
      profile_id: businessData.id
    };

    console.log('Successfully fetched business data:', formattedData);
    console.log('Theme data:', formattedData.theme);
    console.log('Business settings:', formattedData.business_settings);
    return formattedData;
  } catch (error: any) {
    console.error('Error in fetchBusinessData:', error);
    throw error;
  }
};