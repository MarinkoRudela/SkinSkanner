import React, { useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface AnalysisResultsProps {
  analysis: {
    primary_concerns: string[];
    primary_recommendations: string[];
    secondary_concerns: string[];
    secondary_recommendations: string[];
  };
}

export const AnalysisResults = React.memo(({ analysis }: AnalysisResultsProps) => {
  const primaryPairs = useMemo(() => 
    analysis.primary_concerns.map((concern, index) => ({
      concern,
      recommendation: analysis.primary_recommendations[index] || '',
      isPrimary: true
    })), [analysis.primary_concerns, analysis.primary_recommendations]);

  const secondaryPairs = useMemo(() => 
    analysis.secondary_concerns.map((concern, index) => ({
      concern,
      recommendation: analysis.secondary_recommendations[index] || '',
      isPrimary: false
    })), [analysis.secondary_concerns, analysis.secondary_recommendations]);

  const allPairs = [...primaryPairs, ...secondaryPairs];

  return (
    <div className="family-tree">
      <div className="root-node glass-card p-4 rounded-2xl">
        <span className="font-semibold text-primary">Skin Analysis</span>
      </div>
      
      <div className="tree-container">
        {allPairs.map((pair, index) => (
          <div key={index} className="concern-branch">
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className={`concern-node glass-card p-3 rounded-xl w-full hover:bg-primary/5 transition-colors ${
                    pair.isPrimary ? 'border-2 border-primary/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {pair.isPrimary && (
                      <Badge variant="default" className="bg-primary/20 text-primary text-xs">
                        Primary
                      </Badge>
                    )}
                    <span className="text-sm font-medium">{pair.concern}</span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="glass-card border-none p-4 max-w-xs">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-primary">
                    {pair.isPrimary ? 'Recommended Treatment' : 'Enhancement Option'}
                  </h4>
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