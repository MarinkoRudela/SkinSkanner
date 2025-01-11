import { AnalysisResult, Treatment } from './types.ts';

export const validateAnalysis = (
  analysis: AnalysisResult, 
  availableTreatments: Treatment[] | null = null
): void => {
  // Validate structure
  if (!analysis.primary_concerns || !analysis.primary_recommendations || 
      !analysis.secondary_concerns || !analysis.secondary_recommendations ||
      !Array.isArray(analysis.primary_concerns) || !Array.isArray(analysis.primary_recommendations) ||
      !Array.isArray(analysis.secondary_concerns) || !Array.isArray(analysis.secondary_recommendations)) {
    throw new Error('Invalid analysis format');
  }

  // Validate counts
  if (analysis.primary_concerns.length !== 3 || analysis.primary_recommendations.length !== 3 ||
      analysis.secondary_concerns.length !== 3 || analysis.secondary_recommendations.length !== 3) {
    throw new Error('Analysis must contain exactly 3 primary and 3 secondary recommendations');
  }

  // Validate against available treatments if provided
  if (availableTreatments) {
    const availableTreatmentNames = new Set(availableTreatments.map(t => t.name));
    const allRecommendations = [...analysis.primary_recommendations, ...analysis.secondary_recommendations];
    const invalidTreatments = allRecommendations.filter(r => !availableTreatmentNames.has(r));
    
    if (invalidTreatments.length > 0) {
      throw new Error('AI recommended unavailable treatments: ' + invalidTreatments.join(', '));
    }
  }
};