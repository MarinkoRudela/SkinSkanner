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

  if (!businessData.business_settings) {
    console.warn('No business settings found for business');
    toast({
      title: "Setup Required",
      description: "This business hasn't completed their profile setup yet. Please try again later.",
      variant: "destructive"
    });
    return null;
  }

  const bookingUrl = businessData.business_settings.booking_url;

  const containerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: '24px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    padding: '2rem',
    margin: '2rem auto',
    maxWidth: '1000px',
    color: businessData.theme?.text_color || '#333333'
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-8">
      <div 
        className="mx-auto"
        style={containerStyle}
      >
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