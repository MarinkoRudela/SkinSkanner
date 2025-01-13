import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FaceScanner } from '@/components/FaceScanner';
import { Analysis } from '@/components/Analysis';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface CapturedImages {
  front?: string;
  left?: string;
  right?: string;
}

export const DemoScanner = () => {
  const [capturedImages, setCapturedImages] = useState<CapturedImages | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageCapture = async (images: CapturedImages) => {
    setCapturedImages(images);
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-skin-demo', {
        body: { images }
      });

      if (error) throw error;
      
      console.log('Demo analysis results:', data);
      setAnalysis(data);
      
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your photos and prepared personalized recommendations.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "We couldn't analyze your photos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="mt-8 p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Try Our AI Skin Analysis
      </h2>
      <p className="text-muted-foreground mb-6">
        Experience our advanced AI-powered skin analysis tool. Upload your photos to receive personalized treatment recommendations.
      </p>
      
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
            bookingUrl="/signup"
            onScanAgain={() => window.location.reload()}
          />
        )}
      </div>
    </Card>
  );
};