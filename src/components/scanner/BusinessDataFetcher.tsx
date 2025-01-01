import { useEffect } from "react";
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
        
        const normalizedShortCode = shortCode.toUpperCase();
        console.log('Normalized short code:', normalizedShortCode);
        
        // First, get the profile_id from short code
        const { data: shortCodeData, error: shortCodeError } = await supabase
          .from('business_short_codes')
          .select('profile_id')
          .ilike('short_code', normalizedShortCode)
          .maybeSingle();

        if (shortCodeError) {
          console.error('Error fetching short code:', shortCodeError);
          throw new Error('Invalid booking link');
        }

        if (!shortCodeData) {
          console.error('No business found for short code:', normalizedShortCode);
          throw new Error(`Business not found for code: ${shortCode}`);
        }

        console.log('Found profile_id:', shortCodeData.profile_id);

        // Then fetch both profile and settings data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('brand_name, logo_url, tagline')
          .eq('id', shortCodeData.profile_id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw new Error('Could not load business profile information');
        }

        if (!profileData || !profileData.brand_name) {
          console.error('Incomplete profile data:', profileData);
          throw new Error('This business profile is not completely set up. Please make sure brand name is set.');
        }

        const { data: settingsData, error: settingsError } = await supabase
          .from('business_settings')
          .select('booking_url')
          .eq('profile_id', shortCodeData.profile_id)
          .maybeSingle();

        if (settingsError) {
          console.error('Error fetching settings:', settingsError);
          throw new Error('Could not load business settings');
        }

        if (!settingsData?.booking_url) {
          console.error('Missing booking URL:', settingsData);
          throw new Error('This business has not set up their booking URL yet.');
        }

        const businessInfo = {
          brand_name: profileData.brand_name,
          logo_url: profileData.logo_url || '',
          tagline: profileData.tagline || '',
          booking_url: settingsData.booking_url
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