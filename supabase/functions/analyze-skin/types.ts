export interface AnalysisRequest {
  images: {
    front?: string;
    left?: string;
    right?: string;
  };
  profileId?: string;
  linkVisitId?: string;
}

export interface AnalysisResult {
  primary_concerns: string[];
  primary_recommendations: string[];
  secondary_concerns: string[];
  secondary_recommendations: string[];
}