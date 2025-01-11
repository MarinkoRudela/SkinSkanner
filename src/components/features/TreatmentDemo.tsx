import React, { useState } from 'react';
import { Check } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TreatmentSubtypes } from './TreatmentSubtypes';
import { treatmentCategories } from '@/data/treatmentOptions';

const TreatmentDemo = () => {
  const [selectedTreatments, setSelectedTreatments] = useState<Set<string>>(new Set());

  const toggleTreatment = (treatmentName: string) => {
    const newSelected = new Set(selectedTreatments);
    if (newSelected.has(treatmentName)) {
      newSelected.delete(treatmentName);
    } else {
      newSelected.add(treatmentName);
    }
    setSelectedTreatments(newSelected);
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
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="border rounded-lg px-4 hover:bg-secondary/50 transition-colors"
          >
            <AccordionTrigger className="flex items-center py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  {React.createElement(category.icon, { className: "w-5 h-5" })}
                </div>
                <span className="text-lg font-medium">
                  {category.category}
                </span>
                {category.requiresLicense && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    License Required
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-4">
                {category.treatments.map((treatment, treatmentIdx) => (
                  <div key={treatmentIdx}>
                    <div
                      className="flex items-start space-x-3 group hover:bg-secondary/30 p-3 rounded-lg transition-colors cursor-pointer"
                      onClick={() => toggleTreatment(treatment.name)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 rounded border border-primary/30 group-hover:border-primary/50 flex items-center justify-center">
                          {selectedTreatments.has(treatment.name) && (
                            <Check className="w-3 h-3 text-primary/50" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {treatment.name}
                          </h4>
                          {treatment.requiresLicense && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                              License Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {treatment.description}
                        </p>
                        {treatment.subtypes && (
                          <TreatmentSubtypes
                            subtypes={treatment.subtypes}
                            isParentSelected={selectedTreatments.has(treatment.name)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Pro tip:</span> Customize this list to match your med spa's offerings
          </div>
          <div className="text-sm text-primary">
            {treatmentCategories.reduce((acc, cat) => acc + cat.treatments.length, 0)} Treatments Available
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentDemo;