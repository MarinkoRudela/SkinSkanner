import { AnalysisResult, Treatment } from './types.ts';

export const validateAnalysis = (
  analysis: AnalysisResult, 
  availableTreatments: Treatment[] | null = null
): void => {
  if (!analysis.concerns || !analysis.recommendations || 
      !Array.isArray(analysis.concerns) || !Array.isArray(analysis.recommendations) ||
      analysis.concerns.length !== analysis.recommendations.length ||
      analysis.concerns.length !== 4) {
    throw new Error('Invalid analysis format');
  }

  if (availableTreatments) {
    const availableTreatmentNames = new Set(availableTreatments.map(t => t.name));
    const invalidTreatments = analysis.recommendations.filter(r => !availableTreatmentNames.has(r));
    
    if (invalidTreatments.length > 0) {
      throw new Error('AI recommended unavailable treatments');
    }
  }
};