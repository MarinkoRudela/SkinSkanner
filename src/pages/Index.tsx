import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { ConfigSection } from '@/components/config/ConfigSection';
import { ScannerSection } from '@/components/scanner/ScannerSection';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthResponse } from '@/hooks/use-auth-response';
import { globalRequestQueue } from '@/utils/requestQueue';

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [bookingUrl, setBookingUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const { handleResponse } = useAuthResponse();
  
  useEffect(() => {
    const businessId = new URLSearchParams(window.location.search).get('business');
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session: authSession } } = await supabase.auth.getSession();
        console.log('Auth session retrieved:', authSession?.user?.email);
        
        const processedSession = await handleResponse(
          new Response(JSON.stringify({ session: authSession })),
          'auth-session'
        );
        setSession(processedSession.session);
        
        if (processedSession.session) {
          console.log('Fetching business settings for user:', processedSession.session.user.id);
          await fetchBusinessSettings(processedSession.session.user.id);
        } else if (businessId) {
          console.log('Fetching business settings for business:', businessId);
          await fetchBusinessSettings(businessId);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast({
          title: "Error",
          description: "Failed to initialize authentication",
          variant: "destructive"
        });
      } finally {
        setDataFetched(true);
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log('Auth state changed:', _event, newSession?.user?.email);
      setSession(newSession);
      if (newSession) {
        await fetchBusinessSettings(newSession.user.id);
      }
      setDataFetched(true);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [handleResponse]);

  const fetchBusinessSettings = async (userId: string) => {
    return globalRequestQueue.add(async () => {
      try {
        console.log('Fetching business settings...');
        const { data, error } = await supabase
          .from('business_settings')
          .select('booking_url')
          .eq('profile_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching business settings:', error);
          toast({
            title: "Error",
            description: "Failed to load business settings",
            variant: "destructive"
          });
          return;
        }

        console.log('Business settings data:', data);
        if (data) {
          setBookingUrl(data.booking_url);
        } else if (!session) {
          console.log('No business settings found');
          toast({
            title: "Not Found",
            description: "Business booking link not found",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  };

  const updateBookingUrl = async (url: string) => {
    if (!session) return;

    return globalRequestQueue.add(async () => {
      try {
        console.log('Updating booking URL...');
        const { error } = await supabase
          .from('business_settings')
          .upsert({
            profile_id: session.user.id,
            booking_url: url
          });

        if (error) throw error;

        setBookingUrl(url);
        toast({
          title: "Success",
          description: "Booking URL updated successfully"
        });
      } catch (error: any) {
        console.error('Error updating booking URL:', error);
        toast({
          title: "Error",
          description: "Failed to update booking URL",
          variant: "destructive"
        });
        throw error;
      }
    });
  };

  // Show loading state only if we haven't completed initialization
  if (loading && !dataFetched) {
    console.log('Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-indigo-600">Loading...</p>
        </div>
      </div>
    );
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