import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { ConfigSection } from '@/components/config/ConfigSection';
import { ScannerSection } from '@/components/scanner/ScannerSection';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuthInitialization } from '@/hooks/use-auth-initialization';
import { useBusinessSettingsManagement } from '@/hooks/use-business-settings-management';
import { toast } from '@/hooks/use-toast';
import { HeroSection } from '@/components/home/HeroSection';
import { BenefitsSection } from '@/components/home/BenefitsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const navigate = useNavigate();
  const { session, isInitializing } = useAuthInitialization();
  const { bookingUrl, fetchBusinessSettings, updateBookingUrl } = useBusinessSettingsManagement();

  // Fetch profile data including payment status
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
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

  React.useEffect(() => {
    if (session?.user?.id) {
      fetchBusinessSettings(session.user.id);
    }
  }, [session, fetchBusinessSettings]);

  // Handle payment status checks
  React.useEffect(() => {
    if (profile && profile.payment_status === 'pending') {
      // Check if we have a business name stored
      const checkPendingBusinessName = async () => {
        const { data: pendingName } = await supabase
          .from('pending_business_names')
          .select('business_name')
          .eq('user_id', session?.user?.id)
          .single();

        if (pendingName) {
          // Redirect to complete payment
          navigate('/signup');
        }
      };

      checkPendingBusinessName();
    }
  }, [profile, session?.user?.id, navigate]);

  if (isInitializing || isLoadingProfile) {
    return <LoadingScreen />;
  }

  const isConfigMode = new URLSearchParams(window.location.search).get('config') === 'true';
  
  // If user is logged in but payment is pending, redirect to signup
  if (session && profile?.payment_status === 'pending') {
    navigate('/signup');
    return <LoadingScreen />;
  }

  // If user is logged in and payment is completed, show appropriate section
  if (session && profile?.payment_status === 'completed') {
    if (isConfigMode) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
          <div className="container max-w-4xl mx-auto px-4 py-8 relative">
            <Navigation session={session} />
            <Header />
            <ConfigSection 
              session={session}
              bookingUrl={bookingUrl}
              updateBookingUrl={(url: string) => updateBookingUrl(url, session)}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
        <div className="container max-w-4xl mx-auto px-4 py-8 relative">
          <Navigation session={session} />
          <Header />
          <ScannerSection 
            bookingUrl={bookingUrl}
            onScanAgain={() => {
              toast({
                title: "Ready for New Scan",
                description: "Please upload your photos for a new analysis."
              });
            }}
          />
        </div>
      </div>
    );
  }

  // Default: Show homepage for visitors
  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <Navigation session={session} />
      <HeroSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Index;