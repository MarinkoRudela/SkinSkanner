import React, { useState, useEffect } from 'react';
import { FaceScanner } from '@/components/FaceScanner';
import { Analysis } from '@/components/Analysis';
import { Header } from '@/components/Header';
import { toast } from '@/components/ui/use-toast';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface CapturedImages {
  front?: string;
  left?: string;
  right?: string;
}

const Index = () => {
  const [capturedImages, setCapturedImages] = useState<CapturedImages | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [bookingUrl, setBookingUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check for authentication status changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchBusinessSettings();
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchBusinessSettings();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch business settings for authenticated users
  const fetchBusinessSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned is ok for new users
          console.error('Error fetching business settings:', error);
          toast({
            title: "Error",
            description: "Failed to load business settings",
            variant: "destructive"
          });
        }
      } else if (data) {
        setBookingUrl(data.booking_url);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Update booking URL for authenticated users
  const updateBookingUrl = async (url: string) => {
    if (!session) return;

    try {
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
    } catch (error) {
      console.error('Error updating booking URL:', error);
      toast({
        title: "Error",
        description: "Failed to update booking URL",
        variant: "destructive"
      });
    }
  };

  const handleImageCapture = async (images: CapturedImages) => {
    setCapturedImages(images);
    const mockAnalysis = {
      concerns: [
        "Fine lines around eyes",
        "Uneven skin texture",
        "Minor sun damage",
        "Slight volume loss in cheeks"
      ],
      recommendations: [
        "Hydrafacial treatment for skin rejuvenation",
        "LED light therapy for collagen stimulation",
        "Custom skincare routine with SPF protection",
        "Consider dermal fillers for cheek enhancement"
      ]
    };
    
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your photos and prepared personalized recommendations."
      });
    }, 1500);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Consult Club Analysis',
          text: 'Check out my personalized treatment recommendations!',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard",
          description: "You can now share it with others!"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Show auth UI for configuration mode when not logged in
  const isConfigMode = new URLSearchParams(window.location.search).get('config') === 'true';
  if (isConfigMode && !session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
        <div className="container max-w-md mx-auto px-4 py-8">
          <Header />
          <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">Business Owner Login</h2>
            <Auth 
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Header />
        
        {isConfigMode && session && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Business Configuration</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="bookingUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Booking URL
                </label>
                <input
                  type="url"
                  id="bookingUrl"
                  className="w-full p-2 border rounded"
                  value={bookingUrl}
                  onChange={(e) => updateBookingUrl(e.target.value)}
                  placeholder="Enter your booking platform URL"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the URL where clients can book appointments (e.g., your Calendly or Acuity link)
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Integration Guide</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">To embed this application on your website:</p>
                  <div className="bg-gray-50 p-4 rounded">
                    <pre className="text-sm overflow-x-auto">
                      {`<iframe
  src="${window.location.origin}"
  width="100%"
  height="800px"
  frameborder="0"
></iframe>`}
                    </pre>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Share directly on social media:</p>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-medspa-600 hover:bg-medspa-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medspa-500"
                  >
                    Share Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {!analysis && (
            <FaceScanner onImageCapture={handleImageCapture} />
          )}

          {analysis && (
            <Analysis
              analysis={analysis}
              bookingUrl={bookingUrl}
              onShare={handleShare}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
