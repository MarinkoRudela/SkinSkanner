import React, { useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { AnalysisResult } from '@/hooks/use-skin-analysis';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Primary Concerns</h3>
          {primaryPairs.map((pair, index) => (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <button 
                  className="w-full glass-card p-4 rounded-xl hover:bg-primary/5 transition-colors border-2 border-primary/30"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-primary/20 text-primary text-xs">
                      Priority {index + 1}
                    </Badge>
                    <span className="text-sm font-medium">{pair.concern}</span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="glass-card border-none p-4 max-w-xs">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-primary">
                    Recommended Treatment
                  </h4>
                  <p className="text-sm text-muted-foreground">{pair.recommendation}</p>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground">Enhancement Options</h3>
          {secondaryPairs.map((pair, index) => (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <button 
                  className="w-full glass-card p-4 rounded-xl hover:bg-secondary/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground text-xs">
                      Optional
                    </Badge>
                    <span className="text-sm font-medium text-muted-foreground">{pair.concern}</span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="glass-card border-none p-4 max-w-xs">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-secondary-foreground">
                    Enhancement Treatment
                  </h4>
                  <p className="text-sm text-muted-foreground">{pair.recommendation}</p>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Click on any concern to see the recommended treatment
      </p>
    </div>
  );
});

AnalysisResults.displayName = 'AnalysisResults';