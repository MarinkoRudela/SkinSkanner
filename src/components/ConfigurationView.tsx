import { useState, useEffect } from "react";
import { useProfileData } from "@/hooks/use-profile-data";
import { useBookingUrl } from "@/hooks/use-booking-url";
import { DashboardContainer } from "./settings/DashboardContainer";
import { TabsContainer } from "./settings/DashboardTabs/TabsContainer";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('guide');
  const { brandName, logoUrl, tagline, fetchProfileData } = useProfileData(session);

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

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

  // Redirect to signup if payment is pending
  useEffect(() => {
    if (profile?.payment_status === 'pending') {
      navigate('/signup');
    }
  }, [profile, navigate]);

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