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
  const isMarbleTheme = businessData.theme?.name.toLowerCase().includes('marble');

  // Apply container styles based on theme
  const containerStyle = isMarbleTheme ? {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Subtle white background for content
    backdropFilter: 'blur(2px)', // Minimal blur for readability
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
  } : {
    background: businessData.theme ? 
      `linear-gradient(to bottom, ${businessData.theme.background_gradient_start}, ${businessData.theme.background_gradient_end})` : '',
    color: businessData.theme?.text_color
  };

  return (
    <div className="min-h-screen py-8">
      <div 
        className="container max-w-4xl mx-auto px-4 md:px-8"
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