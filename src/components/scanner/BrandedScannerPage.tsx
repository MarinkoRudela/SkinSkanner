import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBusinessData } from "@/hooks/use-business-data";
import { ScannerPageContainer } from "./ScannerPageContainer";
import { ErrorDisplay } from "./ErrorDisplay";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";
import { toast } from "@/hooks/use-toast";

export const BrandedScannerPage = () => {
  const { shortCode } = useParams();
  const { businessData, isLoading, error } = useBusinessData(shortCode);
  const { visitId } = useVisitorTracking({ 
    shortCode: shortCode || '', 
    profileId: businessData?.profile_id || '' 
  });

  useEffect(() => {
    console.log('Theme data in BrandedScannerPage:', businessData?.theme);
    
    if (businessData?.theme) {
      document.body.style.background = `linear-gradient(to bottom, ${businessData.theme.background_gradient_start}, ${businessData.theme.background_gradient_end})`;
    } else {
      console.warn('No theme data available for business');
    }

    return () => {
      // Cleanup theme styles
      document.body.style.background = '';
    };
  }, [businessData]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-primary">Loading...</div>
    </div>;
  }

  if (error || !businessData) {
    toast({
      title: "Error",
      description: error || 'Failed to load business data',
      variant: "destructive"
    });
    return <ErrorDisplay error={error || 'No business data found'} />;
  }

  return (
    <ScannerPageContainer 
      businessData={businessData}
      shortCode={shortCode || ''}
      linkVisitId={visitId}
    />
  );
};