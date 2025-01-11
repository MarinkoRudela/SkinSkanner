import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ActionButtons } from './ActionButtons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AnalysisProps {
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

export const Analysis = React.memo(({ 
  analysis, 
  bookingUrl, 
  onScanAgain,
  profileId,
  shortCode,
  linkVisitId
}: AnalysisProps) => {
  console.log('Analysis component received bookingUrl:', bookingUrl);
  
  // Memoize the pairs calculation to prevent unnecessary recalculations
  const pairs = useMemo(() => analysis.concerns.map((concern, index) => ({
    concern,
    recommendation: analysis.recommendations[index] || ''
  })), [analysis.concerns, analysis.recommendations]);

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
          
          <div className="family-tree">
            <div className="root-node glass-card p-4 rounded-2xl">
              <span className="font-semibold text-primary">Skin Analysis</span>
            </div>
            
            <div className="tree-container">
              {pairs.map((pair, index) => (
                <div key={index} className="concern-branch">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="concern-node glass-card p-3 rounded-xl w-full hover:bg-primary/5 transition-colors">
                        <span className="text-sm font-medium">{pair.concern}</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="glass-card border-none p-4 max-w-xs">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-primary">Recommended Treatment</h4>
                        <p className="text-sm text-muted-foreground">{pair.recommendation}</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>
          </div>

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
  // Custom comparison function for React.memo
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