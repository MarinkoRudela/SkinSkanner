import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DashboardTabs } from "../DashboardTabs";
import { BookingTab } from "../TabContent/BookingTab";
import { BrandingTab } from "../TabContent/BrandingTab";
import { IntegrationTab } from "../TabContent/IntegrationTab";
import { SubscriptionTab } from "../TabContent/SubscriptionTab";
import { GuideTab } from "../TabContent/GuideTab";
import { FAQTab } from "../TabContent/FAQTab";
import { AnalyticsTab } from "../TabContent/AnalyticsTab";

interface TabsContainerProps {
  session: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookingUrl: string;
  handleUpdateBookingUrl: (url: string) => Promise<void>;
  uniqueLink: string;
  isLoading: boolean;
  brandName: string | null;
  logoUrl: string | null;
  tagline: string | null;
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <TabsContent value="guide">
        <GuideTab />
      </TabsContent>

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
          onSave={onBrandingSave}
        />
      </TabsContent>

      <TabsContent value="integration">
        <IntegrationTab userId={session.user.id} />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsTab session={session} />
      </TabsContent>

      <TabsContent value="subscription">
        <SubscriptionTab session={session} />
      </TabsContent>

      <TabsContent value="faq">
        <FAQTab />
      </TabsContent>
    </Tabs>
  );
};