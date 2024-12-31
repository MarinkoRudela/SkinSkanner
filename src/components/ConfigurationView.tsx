import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BookingTab } from "./settings/TabContent/BookingTab";
import { BrandingTab } from "./settings/TabContent/BrandingTab";
import { IntegrationTab } from "./settings/TabContent/IntegrationTab";
import { SubscriptionTab } from "./settings/TabContent/SubscriptionTab";
import { DashboardTabs } from "./settings/DashboardTabs";
import { DashboardHeader } from "./settings/DashboardHeader";
import { toast } from "@/hooks/use-toast";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfileData();
      generateUniqueLink();
    }
  }, [session, bookingUrl]);

  const fetchProfileData = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        setBrandName(profile.brand_name || '');
        setLogoUrl(profile.logo_url || '');
      }
    } catch (error) {
      console.error('Error in fetchProfileData:', error);
    }
  };

  const generateUniqueLink = () => {
    if (bookingUrl && session?.user?.id) {
      const baseUrl = window.location.origin;
      setUniqueLink(`${baseUrl}?business=${session.user.id}`);
    }
  };

  const handleUpdateBookingUrl = async (url: string) => {
    setIsLoading(true);
    try {
      // First check if a record exists
      const { data: existingSettings } = await supabase
        .from('business_settings')
        .select('id')
        .eq('profile_id', session.user.id)
        .single();

      if (existingSettings) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('business_settings')
          .update({ booking_url: url })
          .eq('profile_id', session.user.id);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('business_settings')
          .insert([{ profile_id: session.user.id, booking_url: url }]);

        if (insertError) throw insertError;
      }

      await updateBookingUrl(url);
      toast({
        title: "Success",
        description: "Booking URL updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating booking URL:', error);
      toast({
        title: "Error",
        description: "Failed to update booking URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
              updateBookingUrl={handleUpdateBookingUrl}
              uniqueLink={uniqueLink}
              isLoading={isLoading}
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