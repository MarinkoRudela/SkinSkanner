import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BookingTab } from "./settings/TabContent/BookingTab";
import { BrandingTab } from "./settings/TabContent/BrandingTab";
import { IntegrationTab } from "./settings/TabContent/IntegrationTab";
import { SubscriptionTab } from "./settings/TabContent/SubscriptionTab";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { Navigation } from "./Navigation";

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
  const isMobile = useIsMobile();

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

      // Generate unique link
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

  const renderTabNavigation = () => {
    if (isMobile) {
      return (
        <div className="w-full mb-6">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select tab" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="booking">Booking Settings</SelectItem>
              <SelectItem value="branding">Branding</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="booking">Booking Settings</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="integration">Integration</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
      </TabsList>
    );
  };

  return (
    <div className="relative">
      <Navigation session={session} />
      <div className="container mx-auto p-4 md:p-6">
        <h2 className="text-2xl font-semibold mb-6">Business Dashboard</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {renderTabNavigation()}

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
            <IntegrationTab />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionTab session={session} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};