import { useState, useEffect } from "react";
import { useProfileData } from "@/hooks/use-profile-data";
import { useBookingUrl } from "@/hooks/use-booking-url";
import { DashboardContainer } from "./settings/DashboardContainer";
import { TabsContainer } from "./settings/DashboardTabs/TabsContainer";

interface ConfigurationViewProps {
  session: any;
  bookingUrl: string;
  updateBookingUrl: (url: string) => Promise<void>;
}

export const ConfigurationView = ({
  session,
  bookingUrl,
  updateBookingUrl,
}: ConfigurationViewProps) => {
  const [activeTab, setActiveTab] = useState('guide');
  const { brandName, logoUrl, tagline, fetchProfileData } = useProfileData(session);
  const { uniqueLink, isLoading, handleUpdateBookingUrl } = useBookingUrl(
    session,
    bookingUrl,
    updateBookingUrl
  );

  useEffect(() => {
    if (!brandName) {
      setActiveTab('branding');
    }
  }, [brandName]);

  return (
    <DashboardContainer session={session} brandName={brandName}>
      <TabsContainer
        session={session}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingUrl={bookingUrl}
        handleUpdateBookingUrl={handleUpdateBookingUrl}
        uniqueLink={uniqueLink}
        isLoading={isLoading}
        brandName={brandName}
        logoUrl={logoUrl}
        tagline={tagline}
        onBrandingSave={fetchProfileData}
      />
    </DashboardContainer>
  );
};