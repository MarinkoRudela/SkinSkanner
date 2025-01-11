import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBusinessData } from "@/hooks/use-business-data";
import { ScannerPageContainer } from "./ScannerPageContainer";
import { ErrorDisplay } from "./ErrorDisplay";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";

export const BrandedScannerPage = () => {
  const { shortCode } = useParams();
  const { businessData, isLoading, error } = useBusinessData(shortCode);
  const { linkVisitId } = useVisitorTracking(shortCode, businessData?.profile_id);

  useEffect(() => {
    console.log('Business data loaded:', businessData);
  }, [businessData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !businessData) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <ScannerPageContainer 
      businessData={businessData}
      shortCode={shortCode || ''}
      linkVisitId={linkVisitId}
    />
  );
};