import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ConcernsList } from './ConcernsList';
import { RecommendationsList } from './RecommendationsList';
import { ActionButtons } from './ActionButtons';

interface AnalysisProps {
  analysis: {
    concerns: string[];
    recommendations: string[];
  };
  bookingUrl: string;
  onShare: () => void;
}

export const Analysis = ({ analysis, bookingUrl, onShare }: AnalysisProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card p-8 w-full max-w-md mx-auto rounded-3xl">
        <div className="space-y-8">
          <ConcernsList concerns={analysis.concerns} />
          <RecommendationsList recommendations={analysis.recommendations} />
          <ActionButtons bookingUrl={bookingUrl} onShare={onShare} />
        </div>
      </Card>
    </motion.div>
  );
};