import React, { useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { AnalysisResult } from '@/hooks/use-skin-analysis';
import { motion } from 'framer-motion';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

export const AnalysisResults = React.memo(({ analysis }: AnalysisResultsProps) => {
  const primaryPairs = useMemo(() => 
    analysis.primary_concerns.map((concern, index) => ({
      concern,
      recommendation: analysis.primary_recommendations[index] || '',
      isPrimary: true,
      priority: index + 1
    })), [analysis.primary_concerns, analysis.primary_recommendations]);

  const secondaryPairs = useMemo(() => 
    analysis.secondary_concerns.map((concern, index) => ({
      concern,
      recommendation: analysis.secondary_recommendations[index] || '',
      isPrimary: false,
      priority: index + 1
    })), [analysis.secondary_concerns, analysis.secondary_recommendations]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Primary Treatment Recommendations</h3>
          {primaryPairs.map((pair, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="w-full glass-card p-4 rounded-xl hover:bg-primary/5 transition-colors border-2 border-primary/30"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                        Priority {pair.priority}
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
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground">Enhancement Recommendations</h3>
          {secondaryPairs.map((pair, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="w-full glass-card p-4 rounded-xl hover:bg-secondary/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                        Optional {pair.priority}
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
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Click on any recommendation to see the detailed treatment information
      </p>
    </motion.div>
  );
});

AnalysisResults.displayName = 'AnalysisResults';