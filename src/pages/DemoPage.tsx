import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { FaceScanner } from '@/components/FaceScanner';
import { Analysis } from '@/components/Analysis';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface CapturedImages {
  front?: string;
  left?: string;
  right?: string;
}

export const DemoPage = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <Navigation session={null} />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Header />
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
                onScanAgain={() => navigate('/signup')}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DemoPage;