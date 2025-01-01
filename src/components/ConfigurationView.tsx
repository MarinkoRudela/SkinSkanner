import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { BookingTab } from "./settings/TabContent/BookingTab";
import { BrandingTab } from "./settings/TabContent/BrandingTab";
import { IntegrationTab } from "./settings/TabContent/IntegrationTab";
import { SubscriptionTab } from "./settings/TabContent/SubscriptionTab";
import { DashboardTabs } from "./settings/DashboardTabs";
import { DashboardHeader } from "./settings/DashboardHeader";
import { useProfileData } from "@/hooks/use-profile-data";
import { useBookingUrl } from "@/hooks/use-booking-url";

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
  const [activeTab, setActiveTab] = useState('booking');
  const { brandName, logoUrl, tagline, fetchProfileData } = useProfileData(session);
  const { uniqueLink, isLoading, handleUpdateBookingUrl } = useBookingUrl(
    session,
    bookingUrl,
    updateBookingUrl
  );

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto p-4 md:p-6 pt-16">
        <DashboardHeader session={session} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <TabsContent value="booking">
            <BookingTab 
              bookingUrl={bookingUrl}
              updateBookingUrl={handleUpdateBookingUrl}
              uniqueLink={uniqueLink}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="branding">
            <BrandingTab 
              brandName={brandName}
              logoUrl={logoUrl}
              tagline={tagline}
              onSave={fetchProfileData}
            />
          </TabsContent>

          <TabsContent value="integration">
            <IntegrationTab userId={session.user.id} />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionTab session={session} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};