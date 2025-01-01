import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/LoadingScreen";
import { BusinessBrandedHeader } from "./BusinessBrandedHeader";
import { ScannerSection } from "./ScannerSection";

interface BusinessData {
  brand_name: string;
  logo_url: string;
  tagline: string;
  booking_url: string;
}

export const BrandedScannerPage = () => {
  const { shortCode } = useParams();
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        // Get profile_id from short code
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
          throw new Error('Business not found');
        }

        // Get business data and booking URL
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

        if (profileResponse.error) {
          console.error('Error fetching profile:', profileResponse.error);
          throw new Error('Could not load business information');
        }

        if (settingsResponse.error) {
          console.error('Error fetching settings:', settingsResponse.error);
          throw new Error('Could not load business settings');
        }

        if (!profileResponse.data || !settingsResponse.data) {
          throw new Error('Business information not found');
        }

        setBusinessData({
          ...profileResponse.data,
          booking_url: settingsResponse.data.booking_url
        });
      } catch (err: any) {
        console.error('Error fetching business data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [shortCode]);

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-medspa-50 to-white">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!businessData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <BusinessBrandedHeader
          brandName={businessData.brand_name}
          logoUrl={businessData.logo_url}
          tagline={businessData.tagline}
        />
        <ScannerSection
          bookingUrl={businessData.booking_url}
          onScanAgain={() => {}}
        />
      </div>
    </div>
  );
};