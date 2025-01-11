import React from 'react';
import { ArrowRight, ListChecks, Upload, Sparkles } from 'lucide-react';

const IntegrationProcess = () => {
  return (
    <div className="py-12">
      <h3 className="text-2xl font-semibold text-center mb-8">How It Works</h3>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        <div className="flex flex-col items-center text-center max-w-[200px]">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ListChecks className="h-8 w-8 text-primary" />
          </div>
          <h4 className="font-medium mb-2">Select Treatments</h4>
          <p className="text-sm text-gray-600">Customize your available services and specialties</p>
        </div>
        
        <ArrowRight className="hidden md:block h-6 w-6 text-gray-400" />
        
        <div className="flex flex-col items-center text-center max-w-[200px]">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h4 className="font-medium mb-2">Client Photos</h4>
          <p className="text-sm text-gray-600">Clients upload photos for AI analysis</p>
        </div>
        
        <ArrowRight className="hidden md:block h-6 w-6 text-gray-400" />
        
        <div className="flex flex-col items-center text-center max-w-[200px]">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h4 className="font-medium mb-2">Smart Recommendations</h4>
          <p className="text-sm text-gray-600">Get personalized treatment suggestions from your menu</p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationProcess;