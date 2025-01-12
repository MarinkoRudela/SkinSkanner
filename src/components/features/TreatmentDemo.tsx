import React, { useState } from 'react';
import { Accordion } from "@/components/ui/accordion";
import { TreatmentCategory } from './TreatmentCategory';
import { treatmentCategories } from '@/data/treatmentOptions';
import { toast } from '@/hooks/use-toast';

const TreatmentDemo = () => {
  const [selectedTreatments, setSelectedTreatments] = useState<Set<string>>(new Set());

  const toggleTreatment = (treatmentName: string) => {
    try {
      const newSelected = new Set(selectedTreatments);
      if (newSelected.has(treatmentName)) {
        newSelected.delete(treatmentName);
      } else {
        newSelected.add(treatmentName);
      }
      setSelectedTreatments(newSelected);
      
      toast({
        title: "Treatment updated",
        description: newSelected.has(treatmentName) 
          ? "Treatment added to your menu" 
          : "Treatment removed from your menu",
      });
    } catch (error) {
      console.error('Error toggling treatment:', error);
      toast({
        title: "Error",
        description: "Failed to update treatment selection",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-xl bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-indigo-900 mb-2">
          Customize Your Treatment Menu
        </h3>
        <p className="text-gray-600">
          Select the treatments you offer to ensure AI recommendations match your services
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {treatmentCategories.map((category, idx) => (
          <TreatmentCategory
            key={idx}
            category={category}
            selectedTreatments={selectedTreatments}
            onTreatmentToggle={toggleTreatment}
            index={idx}
          />
        ))}
      </Accordion>

      <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Pro tip:</span> Customize this list to match your med spa's offerings
          </div>
          <div className="text-sm text-primary">
            {selectedTreatments.size} Treatments Selected
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentDemo;