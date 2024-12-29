import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
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
  // Pair each concern with its corresponding recommendation
  const pairs = analysis.concerns.map((concern, index) => ({
    concern,
    recommendation: analysis.recommendations[index] || ''
  }));

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
          
          <div className="family-tree">
            <div className="root-node glass-card p-4 rounded-2xl">
              <span className="font-semibold text-primary">Skin Analysis</span>
            </div>
            
            <div className="tree-container">
              {pairs.map((pair, index) => (
                <div key={index} className="concern-branch">
                  <div className="concern-node glass-card p-3 rounded-xl">
                    <span className="text-sm font-medium">{pair.concern}</span>
                  </div>
                  
                  <div className="recommendation-node glass-card p-3 rounded-xl">
                    <span className="text-sm text-muted-foreground">{pair.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ActionButtons bookingUrl={bookingUrl} onShare={onShare} />
        </div>
      </Card>
    </motion.div>
  );
};