import React, { useState } from 'react';
import { FaceScanner } from '@/components/FaceScanner';
import { Analysis } from '@/components/Analysis';
import { Header } from '@/components/Header';
import { toast } from '@/components/ui/use-toast';

interface CapturedImages {
  front?: string;
  left?: string;
  right?: string;
}

// Users can update this URL to their preferred booking platform
// Examples:
// - Calendly: https://calendly.com/your-business
// - Acuity: https://app.acuityscheduling.com/schedule.php?owner=YOUR_ID
// - Square: https://square.site/book/YOUR_BUSINESS
const BOOKING_URL = window.localStorage.getItem('BOOKING_URL') || "https://calendly.com/your-business";

const Index = () => {
  const [capturedImages, setCapturedImages] = useState<CapturedImages | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [bookingUrl, setBookingUrl] = useState(BOOKING_URL);
  
  // Function to update booking URL
  const updateBookingUrl = (url: string) => {
    window.localStorage.setItem('BOOKING_URL', url);
    setBookingUrl(url);
    toast({
      title: "Booking URL Updated",
      description: "Your booking link has been successfully updated."
    });
  };

  const handleImageCapture = async (images: CapturedImages) => {
    setCapturedImages(images);
    // Simulate AI analysis - replace with actual GPT integration
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

  // Add configuration UI for business owners
  const isConfigMode = new URLSearchParams(window.location.search).get('config') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Header />
        
        {isConfigMode && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Business Configuration</h2>
            <div className="space-y-4">
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