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
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureComparison } from '@/components/demo/FeatureComparison';

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
        
        <div className="relative">
          {/* Demo Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
            Demo Version
          </div>
          
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
                <>
                  <Analysis
                    analysis={analysis}
                    bookingUrl="/signup"
                    onScanAgain={() => navigate('/signup')}
                  />
                  <div className="mt-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      Ready to offer this analysis to your clients?
                    </p>
                    <Button 
                      onClick={() => navigate('/signup')}
                      className="bg-primary hover:bg-primary-hover text-white px-8 py-6"
                    >
                      Sign Up Now <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Feature Comparison */}
          <FeatureComparison />

          {/* Final CTA */}
          <Card className="mt-8 p-8 text-center bg-primary/5">
            <h3 className="text-xl font-semibold mb-4">
              Transform Your Med Spa Business
            </h3>
            <p className="text-muted-foreground mb-6">
              Join leading med spas using our AI-powered skin analysis to enhance consultations and boost bookings.
            </p>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-6"
            >
              Start Your Free Trial <ArrowRight className="ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;