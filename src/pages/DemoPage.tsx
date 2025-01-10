import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { DemoScanner } from '@/components/demo/DemoScanner';
import { FeatureComparison } from '@/components/demo/FeatureComparison';
import { DemoCallToAction } from '@/components/demo/DemoCallToAction';

export const DemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <Navigation session={null} />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Header />
        
        <div className="relative">
          {/* Demo Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
            Demo Version
          </div>
          
          <DemoScanner />
          <FeatureComparison />
          <DemoCallToAction />
        </div>
      </div>
    </div>
  );
};

export default DemoPage;