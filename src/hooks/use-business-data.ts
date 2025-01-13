import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { BusinessData } from '@/types/business';

export const useBusinessData = (shortCode?: string) => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!shortCode) {
        setError('No short code provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching business data for shortCode:', shortCode);
        
        // First get the profile_id from short codes
        const { data: shortCodeData, error: shortCodeError } = await supabase
          .from('business_short_codes')
          .select('profile_id')
          .eq('short_code', shortCode)
          .maybeSingle();

        if (shortCodeError) {
          throw new Error('Failed to find business');
        }

        if (!shortCodeData) {
          throw new Error('Business not found');
        }

        // Then get the business data with theme information
        const { data, error: businessError } = await supabase
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
              id,
              profile_id,
              booking_url,
              created_at,
              updated_at
            )
          `)
          .eq('id', shortCodeData.profile_id)
          .maybeSingle();

        if (businessError) {
          throw businessError;
        }

        if (!data) {
          throw new Error('Business profile not found');
        }

        // Transform the data to match the BusinessData interface
        const transformedData: BusinessData = {
          id: data.id,
          brand_name: data.brand_name,
          logo_url: data.logo_url,
          tagline: data.tagline,
          business_settings: data.business_settings?.[0] || null,
          profile_id: shortCodeData.profile_id,
          theme_id: data.theme_id,
          theme: data.themes
        };

        console.log('Business data fetched:', transformedData);
        console.log('Theme data:', transformedData.theme);
        console.log('Business settings:', transformedData.business_settings);
        
        setBusinessData(transformedData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching business data:', err);
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [shortCode]);

  return { businessData, isLoading, error };
};