import { BusinessBrandedHeader } from "./BusinessBrandedHeader";
import { ScannerSection } from "./ScannerSection";
import { toast } from "@/hooks/use-toast";
import { BusinessData } from "@/types/business";

interface ScannerPageContainerProps {
  businessData: BusinessData;
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
    profileId: businessData.profile_id,
    theme: businessData.theme
  });

  // Only show the setup warning if business_settings is null
  if (!businessData.business_settings) {
    console.warn('No business settings found for business');
    toast({
      title: "Setup Required",
      description: "This business hasn't completed their profile setup yet. Please try again later.",
      variant: "destructive"
    });
    return null;
  }

  // Get the booking URL from business settings
  const bookingUrl = businessData.business_settings.booking_url;

  // Apply theme styles if available
  const containerStyle = businessData.theme ? {
    background: `linear-gradient(to bottom, ${businessData.theme.background_gradient_start}, ${businessData.theme.background_gradient_end})`,
    color: businessData.theme.text_color
  } : {};

  return (
    <div className="min-h-screen" style={containerStyle}>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <BusinessBrandedHeader
          brandName={businessData.brand_name}
          logoUrl={businessData.logo_url}
          tagline={businessData.tagline}
          theme={businessData.theme}
        />
        <ScannerSection
          bookingUrl={bookingUrl}
          profileId={businessData.profile_id}
          shortCode={shortCode}
          linkVisitId={linkVisitId}
          theme={businessData.theme}
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