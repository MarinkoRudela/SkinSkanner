import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { TreatmentAreaSelector } from './TreatmentAreaSelector';
import { Treatment } from './types';
import { Badge } from '@/components/ui/badge';

interface TreatmentItemProps {
  treatment: Treatment;
  isSelected: boolean;
  onToggle: () => void;
  onAreaToggle: (area: string) => void;
  selectedAreas: string[];
  businessType?: string;
}

export const TreatmentItem = ({ 
  treatment, 
  isSelected, 
  onToggle,
  onAreaToggle,
  selectedAreas,
  businessType = 'med_spa'
}: TreatmentItemProps) => {
  const showTreatmentAreas = treatment.category?.category_type !== 'eyebrow';
  const treatmentAreas = treatment.treatment_areas || [];

  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors">
      <div className="flex items-start space-x-3">
        <Checkbox
          id={treatment.id}
          checked={isSelected}
          onCheckedChange={onToggle}
        />
        <div className="grid gap-1.5 leading-none flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label
              htmlFor={treatment.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {treatment.name}
            </label>
            <div className="flex gap-2">
              {treatment.requires_license && (
                <Badge variant="secondary" className="text-xs">
                  License Required
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {treatment.description}
          </p>
        </div>
      </div>
      
      {isSelected && showTreatmentAreas && (
        <div className="pl-7">
          <TreatmentAreaSelector
            areas={treatmentAreas}
            selectedAreas={selectedAreas}
            onAreaToggle={onAreaToggle}
            businessType={businessType}
          />
        </div>
      )}
    </div>
  );
};