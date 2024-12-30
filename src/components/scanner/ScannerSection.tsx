import React, { useState } from 'react';
import { FaceScanner } from '@/components/FaceScanner';
import { Analysis } from '@/components/Analysis';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CapturedImages {
  front?: string;
  left?: string;
  right?: string;
}

interface ScannerSectionProps {
  bookingUrl: string;
  onScanAgain: () => void;
}

export const ScannerSection = ({ bookingUrl, onScanAgain }: ScannerSectionProps) => {
  const [capturedImages, setCapturedImages] = useState<CapturedImages | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageCapture = async (images: CapturedImages) => {
    setCapturedImages(images);
    setIsAnalyzing(true);
    
    try {
      console.log('Calling analyze-skin function with images:', images);
      
      // Call the function without any auth headers
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { images },
        headers: {
          // Explicitly remove authorization header
          Authorization: undefined
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No analysis data received');
      }

      console.log('Analysis data received:', data);
      setAnalysis(data);
      
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your photos and prepared personalized recommendations.",
        duration: 3000,
        className: "top-center-toast"
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "We couldn't analyze your photos. Please try again.",
        variant: "destructive",
        duration: 3000,
        className: "top-center-toast"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScanAgain = () => {
    setCapturedImages(null);
    setAnalysis(null);
    toast({
      title: "Ready for New Scan",
      description: "Please upload your photos for a new analysis.",
      duration: 3000,
      className: "top-center-toast"
    });
  };

  return (
    <div className="space-y-8">
      {!analysis && (
        <FaceScanner onImageCapture={handleImageCapture} />
      )}

      {analysis && (
        <Analysis
          analysis={analysis}
          bookingUrl={bookingUrl}
          onScanAgain={handleScanAgain}
        />
      )}
    </div>
  );
};