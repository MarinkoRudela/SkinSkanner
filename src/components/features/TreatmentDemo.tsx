import React from 'react';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

const TreatmentDemo = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 my-12">
      <Card className="p-6 bg-red-50 border-red-100">
        <div className="flex items-center gap-2 mb-4">
          <X className="text-red-500 h-6 w-6" />
          <h3 className="text-lg font-semibold">Without Treatment Selection</h3>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-gray-600">• Generic recommendations not matching your services</p>
          <p className="text-gray-600">• Potential client disappointment</p>
          <p className="text-gray-600">• Time wasted on unavailable treatments</p>
          <p className="text-gray-600">• Lower booking conversion rates</p>
        </div>
      </Card>
      
      <Card className="p-6 bg-green-50 border-green-100">
        <div className="flex items-center gap-2 mb-4">
          <Check className="text-green-500 h-6 w-6" />
          <h3 className="text-lg font-semibold">With Treatment Selection</h3>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-gray-600">• Perfectly matched recommendations</p>
          <p className="text-gray-600">• Higher client satisfaction</p>
          <p className="text-gray-600">• Streamlined consultation process</p>
          <p className="text-gray-600">• Improved booking rates</p>
        </div>
      </Card>
    </div>
  );
};

export default TreatmentDemo;