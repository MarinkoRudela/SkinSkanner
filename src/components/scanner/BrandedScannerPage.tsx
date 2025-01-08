import { useState } from "react";
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

  if (!shortCode) {
    return <ErrorDisplay error="Invalid URL" />;
  }

  // Initialize visitor tracking when business data is loaded
  if (businessData) {
    useVisitorTracking({
      shortCode,
      profileId: businessData.profile_id
    });
  }

  if (isLoading) {
    return (
      <>
        <BusinessDataFetcher
          shortCode={shortCode}
          onDataFetched={(data) => {
            setBusinessData(data);
            setIsLoading(false);
          }}
          onError={(err) => {
            setError(err);
            setIsLoading(false);
          }}
        />
        <LoadingScreen />
      </>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} />;
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