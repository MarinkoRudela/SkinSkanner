import React, { useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AnalysisResultsProps {
  analysis: {
    concerns: string[];
    recommendations: string[];
  };
}

export const AnalysisResults = React.memo(({ analysis }: AnalysisResultsProps) => {
  const pairs = useMemo(() => analysis.concerns.map((concern, index) => ({
    concern,
    recommendation: analysis.recommendations[index] || ''
  })), [analysis.concerns, analysis.recommendations]);

  return (
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
  );
});

AnalysisResults.displayName = 'AnalysisResults';