import React, { useState } from 'react';
import { FaceScanner } from '@/components/FaceScanner';
import { Analysis } from '@/components/Analysis';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const Index = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  
  // Replace with your actual booking URL
  const BOOKING_URL = "https://your-booking-url.com";

  const handleImageCapture = async (image: string) => {
    setCapturedImage(image);
    // Simulate AI analysis - replace with actual AI integration
    const mockAnalysis = {
      concerns: [
        "Fine lines around eyes",
        "Uneven skin texture",
        "Minor sun damage"
      ],
      recommendations: [
        "Hydrafacial treatment for skin rejuvenation",
        "LED light therapy for collagen stimulation",
        "Custom skincare routine with SPF protection"
      ]
    };
    
    setAnalysis(mockAnalysis);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Med Spa Analysis',
          text: 'Check out my personalized med spa treatment recommendations!',
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support Web Share API
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-medspa-800 mb-4">
            Virtual Face Analysis
          </h1>
          <p className="text-medspa-600 text-lg max-w-2xl mx-auto">
            Get personalized treatment recommendations based on your unique features
          </p>
        </motion.div>

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