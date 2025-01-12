import React from 'react';
import { TreatmentItem } from './TreatmentItem';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { LucideIcon } from 'lucide-react';

interface TreatmentCategoryProps {
  category: {
    category: string;
    icon: LucideIcon;
    requiresLicense?: boolean;
    treatments: {
      name: string;
      description: string;
      requiresLicense?: boolean;
    }[];
  };
  selectedTreatments: Set<string>;
  onTreatmentToggle: (treatmentName: string) => void;
  index: number;
}

export const TreatmentCategory = ({ 
  category, 
  selectedTreatments, 
  onTreatmentToggle, 
  index 
}: TreatmentCategoryProps) => {
  return (
    <AccordionItem
      value={`item-${index}`}
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
            <TreatmentItem
              key={treatmentIdx}
              treatment={treatment}
              isSelected={selectedTreatments.has(treatment.name)}
              onToggle={() => onTreatmentToggle(treatment.name)}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};