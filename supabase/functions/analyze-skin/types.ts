export interface Treatment {
  name: string;
  category: { name: string };
  description: string;
  treatment_areas?: string[];
}

export interface AnalysisResult {
  primary_concerns: string[];
  primary_recommendations: string[];
  secondary_concerns: string[];
  secondary_recommendations: string[];
}

export interface AnalysisImages {
  front?: string;
  left?: string;
  right?: string;
}

export interface AnalysisRequest {
  images: AnalysisImages;
  profileId?: string;
  businessType?: string;
  brandName?: string;
}