import React from 'react';
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
  const [capturedImages, setCapturedImages] = React.useState<CapturedImages | null>(null);
  const [analysis, setAnalysis] = React.useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleImageCapture = async (images: CapturedImages) => {
    setCapturedImages(images);
    setIsAnalyzing(true);
    
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call the Edge Function with proper authentication
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { images },
      });

      if (error) {
        throw error;
      }

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