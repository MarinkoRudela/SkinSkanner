import { supabase } from "@/integrations/supabase/client";

interface ConversionTrackingProps {
  profileId?: string;
  shortCode?: string;
  linkVisitId?: string;
}

export const useConversionTracking = () => {
  const trackConversion = async (url: string, { profileId, shortCode, linkVisitId }: ConversionTrackingProps) => {
    console.log('Tracking conversion for URL:', url);
    
    if (!profileId || !shortCode || !linkVisitId) {
      console.log('Missing required data for conversion tracking');
      return;
    }

    try {
      await supabase
        .from('booking_conversions')
        .insert([{
          link_visit_id: linkVisitId,
          profile_id: profileId,
          short_code: shortCode,
          booking_url_clicked: url
        }]);
      console.log('Conversion tracked successfully');
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  };

  return { trackConversion };
};