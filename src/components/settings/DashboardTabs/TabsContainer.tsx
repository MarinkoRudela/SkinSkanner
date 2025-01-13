import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuideTab } from "../TabContent/GuideTab";
import { BrandingTab } from "../TabContent/BrandingTab";
import { BookingTab } from "../TabContent/BookingTab";
import { AnalyticsTab } from "../TabContent/AnalyticsTab";
import { TreatmentsTab } from "../TabContent/treatments/TreatmentsTab";
import { SubscriptionTab } from "../TabContent/SubscriptionTab";
import { ThemeTab } from "../TabContent/ThemeTab";

interface TabsContainerProps {
  session: any;
  activeTab: string;
  setActiveTab: (value: string) => void;
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
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <TabsTrigger value="guide">Guide</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="booking">Booking</TabsTrigger>
        <TabsTrigger value="treatments">Treatments</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
      </TabsList>

      <TabsContent value="guide" className="space-y-4">
        <GuideTab />
      </TabsContent>

      <TabsContent value="branding" className="space-y-4">
        <BrandingTab
          session={session}
          brandName={brandName}
          logoUrl={logoUrl}
          tagline={tagline}
          onSave={onBrandingSave}
        />
      </TabsContent>

      <TabsContent value="booking" className="space-y-4">
        <BookingTab
          bookingUrl={bookingUrl}
          updateBookingUrl={handleUpdateBookingUrl}
          uniqueLink={uniqueLink}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="treatments" className="space-y-4">
        <TreatmentsTab profileId={session?.user?.id} />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <AnalyticsTab session={session} />
      </TabsContent>

      <TabsContent value="subscription" className="space-y-4">
        <SubscriptionTab session={session} />
      </TabsContent>

      <TabsContent value="theme" className="space-y-4">
        <ThemeTab session={session} />
      </TabsContent>
    </Tabs>
  );
};