export interface Treatment {
  id: string;
  name: string;
  description: string;
  requires_license: boolean;
}

export interface TreatmentCategory {
  id: string;
  name: string;
  description: string;
  treatments: Treatment[];
}