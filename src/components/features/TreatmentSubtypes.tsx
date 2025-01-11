import React from 'react';
import { Check } from 'lucide-react';

interface TreatmentSubtypesProps {
  subtypes: string[];
  isParentSelected?: boolean;
}

export const TreatmentSubtypes = ({ subtypes, isParentSelected }: TreatmentSubtypesProps) => {
  return (
    <div className="pl-8 space-y-2 mt-2">
      {subtypes.map((subtype, idx) => (
        <div
          key={idx}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <div className="w-4 h-4 rounded-sm border border-primary/30 flex items-center justify-center">
            {isParentSelected && <Check className="w-3 h-3 text-primary/50" />}
          </div>
          <span>{subtype}</span>
        </div>
      ))}
    </div>
  );
};