import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface AnalysisResult {
  primary_concerns: string[];
  primary_recommendations: string[];
  secondary_concerns: string[];
  secondary_recommendations: string[];
}

export const useSkinAnalysis = (profileId?: string, linkVisitId?: string) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const resetAnalysis = () => {
    setAnalysis(null);
  };

  const analyzeImages = async (images: { front?: string; left?: string; right?: string; }) => {
    setIsAnalyzing(true);
    
    try {
      console.log('Calling analyze-skin function with:', { images, profileId });
      
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { 
          images,
          profileId,
          linkVisitId
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

  return {
    analysis,
    isAnalyzing,
    analyzeImages,
    resetAnalysis
  };
};