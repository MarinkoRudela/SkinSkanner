import { useState, useEffect } from "react";
import { useProfileData } from "@/hooks/use-profile-data";
import { useBookingUrl } from "@/hooks/use-booking-url";
import { DashboardContainer } from "./settings/DashboardContainer";
import { TabsContainer } from "./settings/DashboardTabs/TabsContainer";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('guide');
  const { brandName, logoUrl, tagline, fetchProfileData } = useProfileData(session);

  const { data: profile, isLoading: profileLoading } = useQuery({
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

  const { data: pendingBusinessName } = useQuery({
    queryKey: ['pending_business_name', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('pending_business_names')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!session?.user?.id && profile?.payment_status === 'pending'
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

  // Handle pending payment status
  useEffect(() => {
    const handlePendingPayment = async () => {
      if (profile?.payment_status === 'pending' && pendingBusinessName?.stripe_checkout_url) {
        toast({
          title: "Completing Registration",
          description: `Redirecting to complete registration for ${pendingBusinessName.business_name}`,
        });
        
        // Update last checkout attempt
        await supabase
          .from('pending_business_names')
          .update({ last_checkout_attempt: new Date().toISOString() })
          .eq('user_id', session.user.id);

        // Redirect to stored checkout URL
        window.location.href = pendingBusinessName.stripe_checkout_url;
      } else if (profile?.payment_status === 'pending') {
        navigate('/signup');
      }
    };

    if (!profileLoading) {
      handlePendingPayment();
    }
  }, [profile, pendingBusinessName, profileLoading, session?.user?.id, navigate]);

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