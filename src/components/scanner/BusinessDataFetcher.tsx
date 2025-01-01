import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BusinessData {
  brand_name: string;
  logo_url: string;
  tagline: string;
  booking_url: string;
}

interface BusinessDataFetcherProps {
  shortCode: string;
  onDataFetched: (data: BusinessData) => void;
  onError: (error: string) => void;
}

export const BusinessDataFetcher = ({ 
  shortCode, 
  onDataFetched, 
  onError 
}: BusinessDataFetcherProps) => {
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        console.log('Fetching business data for short code:', shortCode);
        
        const { data: shortCodeData, error: shortCodeError } = await supabase
          .from('business_short_codes')
          .select('profile_id')
          .eq('short_code', shortCode)
          .maybeSingle();

        if (shortCodeError) {
          console.error('Error fetching short code:', shortCodeError);
          throw new Error('Invalid booking link');
        }

        if (!shortCodeData) {
          console.error('No business found for short code:', shortCode);
          throw new Error('Business not found');
        }

        console.log('Found profile_id:', shortCodeData.profile_id);

        const [profileResponse, settingsResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('brand_name, logo_url, tagline')
            .eq('id', shortCodeData.profile_id)
            .maybeSingle(),
          supabase
            .from('business_settings')
            .select('booking_url')
            .eq('profile_id', shortCodeData.profile_id)
            .maybeSingle()
        ]);

        if (profileResponse.error || settingsResponse.error) {
          console.error('Error fetching data:', { 
            profileError: profileResponse.error, 
            settingsError: settingsResponse.error 
          });
          throw new Error('Could not load business information');
        }

        if (!profileResponse.data || !settingsResponse.data) {
          console.error('Missing data:', { 
            profile: profileResponse.data, 
            settings: settingsResponse.data 
          });
          throw new Error('Business information is incomplete');
        }

        const businessInfo = {
          ...profileResponse.data,
          booking_url: settingsResponse.data.booking_url
        };
        
        console.log('Successfully loaded business data:', businessInfo);
        onDataFetched(businessInfo);
        
        toast({
          title: "Success",
          description: "Welcome to the face analysis tool",
        });
      } catch (err: any) {
        console.error('Error in fetchBusinessData:', err);
        onError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    };

    fetchBusinessData();
  }, [shortCode, onDataFetched, onError]);

  return null;
};