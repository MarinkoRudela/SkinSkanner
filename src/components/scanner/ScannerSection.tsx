import React from 'react';
import { FaceScanner } from '@/components/FaceScanner';
import { Analysis } from '@/components/Analysis';
import { toast } from '@/components/ui/use-toast';

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

  const handleImageCapture = async (images: CapturedImages) => {
    setCapturedImages(images);
    const mockAnalysis = {
      concerns: [
        "Fine lines around eyes",
        "Uneven skin texture",
        "Minor sun damage",
        "Slight volume loss in cheeks"
      ],
      recommendations: [
        "Hydrafacial treatment for skin rejuvenation",
        "LED light therapy for collagen stimulation",
        "Custom skincare routine with SPF protection",
        "Consider dermal fillers for cheek enhancement"
      ]
    };
    
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your photos and prepared personalized recommendations."
      });
    }, 1500);
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
          onScanAgain={onScanAgain}
        />
      )}
    </div>
  );
};