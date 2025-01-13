import React from 'react';
import { DemoScanner } from '@/components/demo/DemoScanner';
import { Navigation } from '@/components/Navigation';

const DemoPage = () => {
  return (
    <div className="container mx-auto py-8">
      <Navigation session={null} />
      <DemoScanner />
    </div>
  );
};

export default DemoPage;