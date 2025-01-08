import React, { useState } from 'react';
import { FaceScanner } from '@/components/FaceScanner';
import { Analysis } from '@/components/Analysis';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface CapturedImages {
  front?: string;
  left?: string;
  right?: string;
}

interface ScannerSectionProps {
  bookingUrl: string;
  onScanAgain: () => void;
  profileId?: string;
  shortCode?: string;
  linkVisitId?: string;
}

export const ScannerSection = ({ 
  bookingUrl, 
  onScanAgain,
  profileId,
  shortCode,
  linkVisitId
}: ScannerSectionProps) => {
  const [capturedImages, setCapturedImages] = useState<CapturedImages | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageCapture = async (images: CapturedImages) => {
    setCapturedImages(images);
    setIsAnalyzing(true);
    
    try {
      console.log('Calling analyze-skin function with images:', images);
      
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { images },
        headers: {
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
      
      // Track scanner analytics if we have the required data
      if (profileId && linkVisitId) {
        await supabase
          .from('scanner_analytics')
          .insert([{
            link_visit_id: linkVisitId,
            profile_id: profileId,
            scan_started_at: new Date().toISOString(),
            scan_completed_at: new Date().toISOString(),
            photos_uploaded: 3,
            recommendations_generated: data.recommendations.length,
            primary_concerns: data.concerns
          }]);
      }

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
    onScanAgain();
  };

  return (
    <div className="space-y-8">
      {!analysis && (
        <>
          <FaceScanner onImageCapture={handleImageCapture} />
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center gap-4 mt-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Analyzing your photos...</p>
            </div>
          )}
        </>
      )}

      {analysis && (
        <Analysis
          analysis={analysis}
          bookingUrl={bookingUrl}
          onScanAgain={handleScanAgain}
          profileId={profileId}
          shortCode={shortCode}
          linkVisitId={linkVisitId}
        />
      )}
    </div>
  );
};