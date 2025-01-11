import React, { useState } from 'react';
import { FaceScanner } from '@/components/FaceScanner';
import { Analysis } from '@/components/Analysis';
import { toast } from '@/components/ui/use-toast';
import { AnalysisLoading } from './AnalysisLoading';
import { useSkinAnalysis } from '@/hooks/use-skin-analysis';

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
  console.log('ScannerSection props:', { bookingUrl, profileId, shortCode, linkVisitId });
  
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

  return (
    <div className="space-y-8">
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