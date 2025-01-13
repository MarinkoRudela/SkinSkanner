import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBusinessData } from "@/hooks/use-business-data";
import { ScannerPageContainer } from "./ScannerPageContainer";
import { ErrorDisplay } from "./ErrorDisplay";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";

export const BrandedScannerPage = () => {
  const { shortCode } = useParams();
  const { businessData, isLoading, error } = useBusinessData(shortCode);
  const { visitId } = useVisitorTracking({ 
    shortCode: shortCode || '', 
    profileId: businessData?.profile_id || '' 
  });

  useEffect(() => {
    if (businessData?.theme_id) {
      // Apply theme styles to body
      document.body.style.background = businessData.theme?.background_gradient_start 
        ? `linear-gradient(to bottom, ${businessData.theme.background_gradient_start}, ${businessData.theme.background_gradient_end})`
        : '';
    }

    return () => {
      // Cleanup theme styles
      document.body.style.background = '';
    };
  }, [businessData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !businessData) {
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