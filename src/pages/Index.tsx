import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { ConfigSection } from '@/components/config/ConfigSection';
import { ScannerSection } from '@/components/scanner/ScannerSection';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuthInitialization } from '@/hooks/use-auth-initialization';
import { useBusinessSettingsManagement } from '@/hooks/use-business-settings-management';

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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-8 relative">
        <Navigation session={session} />
        <Header />
        
        {isConfigMode ? (
          <ConfigSection 
            session={session}
            bookingUrl={bookingUrl}
            updateBookingUrl={updateBookingUrl}
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