import React from 'react';
import { AnalysisCard } from './analysis/AnalysisCard';
import { AnalysisResult } from '@/hooks/use-skin-analysis';

interface AnalysisProps {
  analysis: AnalysisResult;
  bookingUrl: string;
  onScanAgain: () => void;
  profileId?: string;
  shortCode?: string;
  linkVisitId?: string;
}

export const Analysis = ({ 
  analysis, 
  bookingUrl, 
  onScanAgain,
  profileId,
  shortCode,
  linkVisitId
}: AnalysisProps) => {
  console.log('Analysis component received bookingUrl:', bookingUrl);
  
  return (
    <AnalysisCard
      analysis={analysis}
      bookingUrl={bookingUrl}
      onScanAgain={onScanAgain}
      profileId={profileId}
      shortCode={shortCode}
      linkVisitId={linkVisitId}
    />
  );
};