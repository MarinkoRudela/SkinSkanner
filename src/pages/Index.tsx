import React from 'react';
import { Header } from '@/components/Header';
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

const Index = () => {
  const { session, isInitializing } = useAuthInitialization();
  const { bookingUrl, fetchBusinessSettings, updateBookingUrl } = useBusinessSettingsManagement();

  React.useEffect(() => {
    if (session?.user?.id) {
      fetchBusinessSettings(session.user.id);
    }
  }, [session, fetchBusinessSettings]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  const isConfigMode = new URLSearchParams(window.location.search).get('config') === 'true';
  const showHomepage = !session && !isConfigMode && window.location.search === '';
  
  // Create a wrapper function that only takes url parameter
  const handleUpdateBookingUrl = async (url: string) => {
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to update your booking URL",
        variant: "destructive"
      });
      return;
    }
    return updateBookingUrl(url, session);
  };

  if (showHomepage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
        <Navigation session={session} />
        <HeroSection />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-8 relative">
        <Navigation session={session} />
        <Header />
        
        {isConfigMode ? (
          <ConfigSection 
            session={session}
            bookingUrl={bookingUrl}
            updateBookingUrl={handleUpdateBookingUrl}
          />
        ) : (
          <ScannerSection 
            bookingUrl={bookingUrl}
            onScanAgain={() => {
              toast({
                title: "Ready for New Scan",
                description: "Please upload your photos for a new analysis."
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;