import { Header } from "./Header";
import { AuthForm } from "./auth/AuthForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BookingTab } from "./settings/TabContent/BookingTab";
import { BrandingTab } from "./settings/TabContent/BrandingTab";
import { IntegrationTab } from "./settings/TabContent/IntegrationTab";
import { SubscriptionTab } from "./settings/TabContent/SubscriptionTab";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

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
      fetchBranding();
      generateUniqueLink();
    }
  }, [session?.user?.id, bookingUrl]);

  const fetchBranding = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('brand_name, logo_url')
      .eq('id', session.user.id)
      .single();

    if (!error && data) {
      setBrandName(data.brand_name || '');
      setLogoUrl(data.logo_url || '');
    }
  };

  const generateUniqueLink = () => {
    if (bookingUrl && session?.user?.id) {
      const baseUrl = window.location.origin;
      const link = `${baseUrl}?business=${session.user.id}`;
      setUniqueLink(link);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
        <div className="container max-w-md mx-auto px-4 py-8">
          <Header />
          <AuthForm />
        </div>
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
            onSave={fetchBranding}
          />
        </TabsContent>

        <TabsContent value="integration">
          <IntegrationTab userId={session.user.id} />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};