import React from 'react';
import { AnalysisCard } from './analysis/AnalysisCard';

interface AnalysisProps {
  analysis: {
    primary_concerns: string[];
    primary_recommendations: string[];
    secondary_concerns: string[];
    secondary_recommendations: string[];
  };
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