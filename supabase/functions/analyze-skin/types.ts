export interface Treatment {
  name: string;
  category: { name: string };
  description: string;
}

export interface AnalysisResult {
  concerns: string[];
  recommendations: string[];
}

export interface AnalysisImages {
  front?: string;
  left?: string;
  right?: string;
}

export interface AnalysisRequest {
  images: AnalysisImages;
  profileId?: string;
}