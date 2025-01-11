import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AnalysisResults } from './AnalysisResults';
import { ActionButtons } from '../ActionButtons';

interface AnalysisCardProps {
  analysis: {
    concerns: string[];
    recommendations: string[];
  };
  bookingUrl: string;
  onScanAgain: () => void;
  profileId?: string;
  shortCode?: string;
  linkVisitId?: string;
}

export const AnalysisCard = React.memo(({ 
  analysis, 
  bookingUrl, 
  onScanAgain,
  profileId,
  shortCode,
  linkVisitId
}: AnalysisCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Card className="glass-card p-8 w-full max-w-4xl mx-auto rounded-3xl">
        <div className="space-y-8">
          <h3 className="text-xl font-semibold text-center mb-8 purple-gradient bg-clip-text text-transparent">
            Analysis Results
          </h3>
          
          <p className="text-center text-muted-foreground text-sm mb-6">
            Click on any analysis result to see recommended treatments
          </p>
          
          <AnalysisResults analysis={analysis} />

          <ActionButtons 
            bookingUrl={bookingUrl} 
            onScanAgain={onScanAgain}
            profileId={profileId}
            shortCode={shortCode}
            linkVisitId={linkVisitId}
          />
          
          <p className="text-center text-sm text-muted-foreground mt-6 px-4">
            Disclaimer: These recommendations are for informational purposes only. Please consult with a licensed medical professional before proceeding with any treatments.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.bookingUrl === nextProps.bookingUrl &&
    prevProps.analysis.concerns.length === nextProps.analysis.concerns.length &&
    prevProps.analysis.concerns.every((concern, i) => concern === nextProps.analysis.concerns[i]) &&
    prevProps.analysis.recommendations.every((rec, i) => rec === nextProps.analysis.recommendations[i]) &&
    prevProps.profileId === nextProps.profileId &&
    prevProps.shortCode === nextProps.shortCode &&
    prevProps.linkVisitId === nextProps.linkVisitId
  );
});