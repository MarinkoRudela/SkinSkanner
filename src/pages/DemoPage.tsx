import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';

export const DemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
      <Navigation session={null} />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Header />
        <Card className="mt-8 p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Try Our AI Skin Analysis
          </h2>
          <p className="text-muted-foreground mb-6">
            Experience our advanced AI-powered skin analysis tool. Upload your photos to receive personalized treatment recommendations.
          </p>
          {/* Scanner component will be added in the next step */}
        </Card>
      </div>
    </div>
  );
};

export default DemoPage;