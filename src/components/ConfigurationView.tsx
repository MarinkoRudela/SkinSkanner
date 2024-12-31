import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BookingTab } from "./settings/TabContent/BookingTab";
import { BrandingTab } from "./settings/TabContent/BrandingTab";
import { IntegrationTab } from "./settings/TabContent/IntegrationTab";
import { SubscriptionTab } from "./settings/TabContent/SubscriptionTab";
import { DashboardTabs } from "./settings/DashboardTabs";
import { DashboardHeader } from "./settings/DashboardHeader";

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
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [uniqueLink, setUniqueLink] = useState('');
  const [activeTab, setActiveTab] = useState('booking');

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfileData();
    }
  }, [session]);

  const fetchProfileData = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setBrandName(profile.brand_name || '');
        setLogoUrl(profile.logo_url || '');
      }

      const baseUrl = window.location.origin;
      setUniqueLink(`${baseUrl}?business=${session.user.id}`);

    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

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
              updateBookingUrl={updateBookingUrl}
              uniqueLink={uniqueLink}
            />
          </TabsContent>

          <TabsContent value="branding">
            <BrandingTab 
              brandName={brandName}
              logoUrl={logoUrl}
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