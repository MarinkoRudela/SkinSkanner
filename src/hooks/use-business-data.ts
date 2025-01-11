import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface BusinessData {
  brand_name: string;
  logo_url: string;
  tagline: string;
  business_settings: {
    booking_url: string;
  } | null;
  profile_id: string;
}

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

        // Then get the business data
        const { data, error: businessError } = await supabase
          .from('profiles')
          .select(`
            brand_name,
            logo_url,
            tagline,
            business_settings (
              booking_url
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

        // Add profile_id to the data
        const businessData = {
          ...data,
          profile_id: shortCodeData.profile_id
        };

        console.log('Business data fetched:', businessData);
        setBusinessData(businessData);
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