import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorDisplay } from "./ErrorDisplay";
import { BusinessDataFetcher } from "./BusinessDataFetcher";
import { ScannerPageContainer } from "./ScannerPageContainer";
import { VisitorTracker } from "./VisitorTracker";

interface BusinessData {
  brand_name: string;
  logo_url: string;
  tagline: string;
  business_settings: {
    booking_url: string;
  };
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
    <>
      <VisitorTracker
        shortCode={shortCode}
        profileId={businessData.profile_id}
        onVisitIdReceived={(visitId) => setLinkVisitId(visitId)}
      />
      <ScannerPageContainer
        businessData={businessData}
        shortCode={shortCode}
        linkVisitId={linkVisitId || undefined}
        profileId={businessData.profile_id}
      />
    </>
  );
};