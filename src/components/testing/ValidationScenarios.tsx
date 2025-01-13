import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { FaceScanner } from '@/components/FaceScanner';
import { Analysis } from '@/components/Analysis';
import { supabase } from '@/integrations/supabase/client';

type Scenario = {
  name: string;
  profileId: string;
  businessType: string;
  description: string;
};

const testScenarios: Scenario[] = [
  {
    name: 'Med Spa - Injectable Areas',
    profileId: 'test-medspa-1',
    businessType: 'med_spa',
    description: 'Testing med spa with focus on injectable treatments'
  },
  {
    name: 'Brow Specialist',
    profileId: 'test-brow-1',
    businessType: 'brow_specialist',
    description: 'Testing brow specialist with limited service areas'
  },
  {
    name: 'Mixed Services',
    profileId: 'test-mixed-1',
    businessType: 'med_spa',
    description: 'Testing combination of different treatment types'
  },
  {
    name: 'Single Service',
    profileId: 'test-single-1',
    businessType: 'aesthetician',
    description: 'Testing edge case with single service type'
  }
];

interface CapturedImages {
  front?: string;
  left?: string;
  right?: string;
}

export const ValidationScenarios = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageCapture = async (images: CapturedImages) => {
    if (!selectedScenario) return;
    
    setIsAnalyzing(true);
    console.log('Testing scenario:', selectedScenario.name);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-skin-demo', {
        body: { images }
      });

      if (error) throw error;
      
      console.log('Demo analysis results:', data);
      setAnalysis(data);
      
      toast({
        title: "Analysis Complete",
        description: `Completed demo analysis for ${selectedScenario.name}`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Error during demo analysis. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetTest = () => {
    setSelectedScenario(null);
    setAnalysis(null);
  };

  return (
    <div className="space-y-8 p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Validation Testing</h2>
        <p className="text-muted-foreground mb-6">
          Select a test scenario to validate the analysis system
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {testScenarios.map((scenario) => (
            <Button
              key={scenario.name}
              variant={selectedScenario?.name === scenario.name ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-start text-left"
              onClick={() => setSelectedScenario(scenario)}
            >
              <span className="font-semibold">{scenario.name}</span>
              <span className="text-sm text-muted-foreground mt-1">
                {scenario.description}
              </span>
            </Button>
          ))}
        </div>

        {selectedScenario && !analysis && (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Testing: {selectedScenario.name}</h3>
              <p className="text-sm text-muted-foreground">
                Upload images to test analysis for this business type
              </p>
            </div>
            <FaceScanner onImageCapture={handleImageCapture} />
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <Analysis
              analysis={analysis}
              bookingUrl="#test"
              onScanAgain={resetTest}
              profileId={selectedScenario?.profileId}
            />
            <Button 
              variant="outline" 
              onClick={resetTest}
              className="w-full"
            >
              Test Another Scenario
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};