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

const Index = () => {
  const [capturedImages, setCapturedImages] = useState<CapturedImages | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  
  // Replace this URL with your actual booking platform URL (Calendly, Acuity, etc.)
  const BOOKING_URL = "https://calendly.com/your-business";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Header />
        <div className="space-y-8">
          {!analysis && (
            <FaceScanner onImageCapture={handleImageCapture} />
          )}

          {analysis && (
            <Analysis
              analysis={analysis}
              bookingUrl={BOOKING_URL}
              onShare={handleShare}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;