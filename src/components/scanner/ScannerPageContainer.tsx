import { BusinessBrandedHeader } from "./BusinessBrandedHeader";
import { ScannerSection } from "./ScannerSection";
import { toast } from "@/hooks/use-toast";

interface ScannerPageContainerProps {
  businessData: {
    brand_name: string;
    logo_url: string;
    tagline: string;
    business_settings: {
      booking_url: string;
    } | null;
    profile_id: string;
  };
  shortCode: string;
  linkVisitId?: string;
}

export const ScannerPageContainer = ({ 
  businessData,
  shortCode,
  linkVisitId
}: ScannerPageContainerProps) => {
  console.log('ScannerPageContainer received:', {
    brandName: businessData.brand_name,
    bookingUrl: businessData.business_settings?.booking_url,
    profileId: businessData.profile_id
  });

  if (!businessData.business_settings?.booking_url) {
    console.error('No booking URL found for business');
    toast({
      title: "Error",
      description: "This business hasn't set up their booking URL yet.",
      variant: "destructive"
    });
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
          bookingUrl={businessData.business_settings?.booking_url || '/signup'}
          profileId={businessData.profile_id}
          shortCode={shortCode}
          linkVisitId={linkVisitId}
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