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

    // Then, get the business settings and profile info
    const { data: businessData, error: businessError } = await supabase
      .from('profiles')
      .select(`
        *,
        business_settings (*)
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

    console.log('Successfully fetched business data:', businessData);
    return businessData;
  } catch (error: any) {
    console.error('Error in fetchBusinessData:', error);
    throw error;
  }
};