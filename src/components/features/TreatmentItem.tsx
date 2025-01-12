import React from 'react';
import { Check } from 'lucide-react';

interface TreatmentItemProps {
  treatment: {
    name: string;
    description: string;
    requiresLicense?: boolean;
  };
  isSelected: boolean;
  onToggle: () => void;
}

export const TreatmentItem = ({ treatment, isSelected, onToggle }: TreatmentItemProps) => {
  return (
    <div
      className="flex items-start space-x-3 group hover:bg-secondary/30 p-3 rounded-lg transition-colors cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex-shrink-0 mt-1">
        <div className="w-5 h-5 rounded border border-primary/30 group-hover:border-primary/50 flex items-center justify-center">
          {isSelected && <Check className="w-3 h-3 text-primary/50" />}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900">{treatment.name}</h4>
          {treatment.requiresLicense && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
              License Required
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">{treatment.description}</p>
      </div>
    </div>
  );
};