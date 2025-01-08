import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface CapturedImages {
  front?: string;
  left?: string;
  right?: string;
}

interface AnalysisResult {
  concerns: string[];
  recommendations: string[];
}

export const useSkinAnalysis = (profileId?: string, linkVisitId?: string) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImages = async (images: CapturedImages) => {
    setIsAnalyzing(true);
    
    try {
      console.log('Calling analyze-skin function with images:', images);
      
      // Track scan start if we have the required data
      if (profileId && linkVisitId) {
        await supabase
          .from('scanner_analytics')
          .insert([{
            link_visit_id: linkVisitId,
            profile_id: profileId,
            scan_started_at: new Date().toISOString(),
            photos_uploaded: 3
          }]);
      }

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
      
      // Track scan completion if we have the required data
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

  return {
    analysis,
    isAnalyzing,
    analyzeImages
  };
};