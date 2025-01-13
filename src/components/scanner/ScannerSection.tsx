import React, { useState } from 'react';
import { FaceScanner } from '@/components/FaceScanner';
import { Analysis } from '@/components/Analysis';
import { toast } from '@/components/ui/use-toast';
import { AnalysisLoading } from './AnalysisLoading';
import { useSkinAnalysis } from '@/hooks/use-skin-analysis';
import { Theme } from '@/types/business';

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
  theme?: Theme;
}

export const ScannerSection = ({ 
  bookingUrl, 
  onScanAgain,
  profileId,
  shortCode,
  linkVisitId,
  theme
}: ScannerSectionProps) => {
  console.log('ScannerSection props:', { bookingUrl, profileId, shortCode, linkVisitId, theme });
  
  const [capturedImages, setCapturedImages] = useState<CapturedImages | null>(null);
  const { analysis, isAnalyzing, analyzeImages, resetAnalysis } = useSkinAnalysis(profileId, linkVisitId);

  const handleImageCapture = async (images: CapturedImages) => {
    setCapturedImages(images);
    await analyzeImages(images);
  };

  const handleScanAgain = () => {
    setCapturedImages(null);
    resetAnalysis();
    onScanAgain();
  };

  const containerStyle = theme ? {
    color: theme.text_color
  } : {};

  return (
    <div className="space-y-8" style={containerStyle}>
      {!analysis && (
        <>
          <FaceScanner onImageCapture={handleImageCapture} />
          {isAnalyzing && <AnalysisLoading />}
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