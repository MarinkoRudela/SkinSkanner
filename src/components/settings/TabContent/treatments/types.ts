export interface Treatment {
  id: string;
  name: string;
  description: string;
  requires_license: boolean;
  treatment_areas?: string[];
  category_id?: string;
  business_types?: string[];
}

export interface TreatmentWithAreas {
  treatment_id: string;
  treatments: {
    id: string;
    treatment_areas: string[];
  };
}

export interface TreatmentCategory {
  id: string;
  name: string;
  description: string;
  treatments: Treatment[];
}

export interface TreatmentState {
  selectedTreatments: Set<string>;
  treatmentAreas: Record<string, string[]>;
}

export type BusinessType = 'med_spa' | 'aesthetician' | 'brow_specialist';