export type BusinessType = 'med_spa' | 'aesthetician' | 'brow_specialist';

export type CategoryType = 'injectable' | 'skin' | 'eyebrow';

export interface Treatment {
  id: string;
  name: string;
  description: string;
  requires_license: boolean;
  treatment_areas?: string[];
  category_id?: string;
  business_types?: string[];
  category?: {
    id: string;
    name: string;
    category_type: CategoryType;
  };
}

export interface TreatmentCategory {
  id: string;
  name: string;
  description: string;
  category_type: CategoryType;
  treatments: Treatment[];
}

export interface TreatmentState {
  selectedTreatments: Set<string>;
  treatmentAreas: Record<string, string[]>;
}

export interface TreatmentData {
  treatment_id: string;
  treatments: Treatment;
}