import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandingTab } from "../TabContent/BrandingTab";
import { BookingTab } from "../TabContent/BookingTab";
import { GuideTab } from "../TabContent/GuideTab";
import { AnalyticsTab } from "../TabContent/AnalyticsTab";
import { SubscriptionTab } from "../TabContent/SubscriptionTab";
import { TreatmentsTab } from "../TabContent/TreatmentsTab";

interface TabsContainerProps {
  session: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookingUrl: string;
  handleUpdateBookingUrl: (url: string) => Promise<void>;
  uniqueLink: string;
  isLoading: boolean;
  brandName: string;
  logoUrl: string;
  tagline: string;
  onBrandingSave: () => void;
}

export const TabsContainer = ({
  session,
  activeTab,
  setActiveTab,
  bookingUrl,
  handleUpdateBookingUrl,
  uniqueLink,
  isLoading,
  brandName,
  logoUrl,
  tagline,
  onBrandingSave,
}: TabsContainerProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="guide">Setup Guide</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="treatments">Treatments</TabsTrigger>
        <TabsTrigger value="booking">Booking</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
      </TabsList>

      <TabsContent value="guide">
        <GuideTab />
      </TabsContent>

      <TabsContent value="branding">
        <BrandingTab
          brandName={brandName}
          logoUrl={logoUrl}
          tagline={tagline}
          onSave={onBrandingSave}
        />
      </TabsContent>

      <TabsContent value="treatments">
        <TreatmentsTab profileId={session?.user?.id} />
      </TabsContent>

      <TabsContent value="booking">
        <BookingTab
          bookingUrl={bookingUrl}
          handleUpdateBookingUrl={handleUpdateBookingUrl}
          uniqueLink={uniqueLink}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsTab session={session} />
      </TabsContent>

      <TabsContent value="subscription">
        <SubscriptionTab session={session} />
      </TabsContent>
    </Tabs>
  );
};