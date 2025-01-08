import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";
import { BusinessBrandedHeader } from "./BusinessBrandedHeader";
import { ScannerSection } from "./ScannerSection";
import { ErrorDisplay } from "./ErrorDisplay";
import { BusinessDataFetcher } from "./BusinessDataFetcher";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";
import { toast } from "@/hooks/use-toast";

interface BusinessData {
  brand_name: string;
  logo_url: string;
  tagline: string;
  booking_url: string;
  profile_id: string;
}

export const BrandedScannerPage = () => {
  const { shortCode } = useParams();
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkVisitId, setLinkVisitId] = useState<string | null>(null);

  useEffect(() => {
    console.log('BrandedScannerPage mounted with shortCode:', shortCode);
  }, [shortCode]);

  // Initialize visitor tracking when business data is loaded
  useEffect(() => {
    if (businessData && shortCode) {
      console.log('Initializing visitor tracking');
      const { visitId } = useVisitorTracking({
        shortCode,
        profileId: businessData.profile_id
      });
      
      // Update linkVisitId when we get it from tracking
      if (visitId) {
        console.log('Visit ID received:', visitId);
        setLinkVisitId(visitId);
      }
    }
  }, [businessData, shortCode]);

  if (!shortCode) {
    console.error('No shortCode provided in URL');
    return <ErrorDisplay error="Invalid URL" />;
  }

  if (isLoading) {
    return (
      <>
        <BusinessDataFetcher
          shortCode={shortCode}
          onDataFetched={(data) => {
            console.log('Business data fetched successfully:', data);
            setBusinessData(data);
            setIsLoading(false);
          }}
          onError={(err) => {
            console.error('Error fetching business data:', err);
            setError(err);
            setIsLoading(false);
          }}
        />
        <LoadingScreen />
      </>
    );
  }

  if (error) {
    console.error('Rendering error state:', error);
    return <ErrorDisplay error={error} />;
  }

  if (!businessData) {
    console.error('No business data available');
    return <ErrorDisplay error="Failed to load business information" />;
  }

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
          profileId={businessData.profile_id}
          shortCode={shortCode}
          linkVisitId={linkVisitId || undefined}
          onScanAgain={() => {
            toast({
              title: "Ready",
              description: "Upload new photos for another analysis",
            });
          }}
        />
      </div>
    </div>
  );
};