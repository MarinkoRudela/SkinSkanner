import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AnalysisResults } from './AnalysisResults';
import { ActionButtons } from '../ActionButtons';
import { AnalysisResult } from '@/hooks/use-skin-analysis';

interface AnalysisCardProps {
  analysis: AnalysisResult;
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
      <Card className="glass-card p-8 w-full max-w-4xl mx-auto rounded-3xl shadow-lg">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-center mb-8 purple-gradient bg-clip-text text-transparent">
              Your Personalized Treatment Plan
            </h3>
          </motion.div>
          
          <AnalysisResults analysis={analysis} />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ActionButtons 
              bookingUrl={bookingUrl} 
              onScanAgain={onScanAgain}
              profileId={profileId}
              shortCode={shortCode}
              linkVisitId={linkVisitId}
            />
          </motion.div>
          
          <motion.p 
            className="text-center text-sm text-muted-foreground mt-6 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Disclaimer: These recommendations are for informational purposes only. Please consult with a licensed professional before proceeding with any treatments.
          </motion.p>
        </div>
      </Card>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.bookingUrl === nextProps.bookingUrl &&
    prevProps.analysis.primary_concerns.length === nextProps.analysis.primary_concerns.length &&
    prevProps.analysis.primary_concerns.every((concern, i) => concern === nextProps.analysis.primary_concerns[i]) &&
    prevProps.analysis.primary_recommendations.every((rec, i) => rec === nextProps.analysis.primary_recommendations[i]) &&
    prevProps.analysis.secondary_concerns.length === nextProps.analysis.secondary_concerns.length &&
    prevProps.analysis.secondary_concerns.every((concern, i) => concern === nextProps.analysis.secondary_concerns[i]) &&
    prevProps.analysis.secondary_recommendations.every((rec, i) => rec === nextProps.analysis.secondary_recommendations[i]) &&
    prevProps.profileId === nextProps.profileId &&
    prevProps.shortCode === nextProps.shortCode &&
    prevProps.linkVisitId === nextProps.linkVisitId
  );
});

AnalysisCard.displayName = 'AnalysisCard';