import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <Card className="p-6 w-full max-w-md mx-auto bg-white rounded-xl shadow-lg">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-medspa-800 mb-2">Identified Concerns</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {analysis.concerns.map((concern, index) => (
                <li key={index}>{concern}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-medspa-800 mb-2">Recommended Treatments</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {analysis.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => window.open(bookingUrl, '_blank')}
              className="w-full bg-medspa-600 hover:bg-medspa-700 text-white"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Book Consultation
            </Button>
            
            <Button
              onClick={onShare}
              variant="outline"
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Analysis
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};