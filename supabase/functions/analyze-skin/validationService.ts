import { AnalysisResult, Treatment } from './types.ts';

const validateTreatmentForArea = (
  treatment: string,
  concern: string,
  availableTreatments: Treatment[]
): boolean => {
  const treatmentObj = availableTreatments.find(t => t.name === treatment);
  if (!treatmentObj) return false;

  // Common facial areas and their variations
  const areaKeywords: Record<string, string[]> = {
    'forehead': ['forehead', 'upper face', 'front'],
    'eyes': ['eye', 'under-eye', 'crow', 'upper face'],
    'cheeks': ['cheek', 'mid face', 'middle face'],
    'nose': ['nose', 'nasal'],
    'mouth': ['mouth', 'lip', 'lower face'],
    'jaw': ['jaw', 'lower face', 'chin'],
    'neck': ['neck', 'under chin']
  };

  // Extract area from concern
  const concernLower = concern.toLowerCase();
  let matchedArea: string | null = null;

  for (const [area, keywords] of Object.entries(areaKeywords)) {
    if (keywords.some(keyword => concernLower.includes(keyword))) {
      matchedArea = area;
      break;
    }
  }

  if (!matchedArea) return true; // If no specific area mentioned, consider it valid

  // Check if treatment is available for the matched area
  return treatmentObj.treatment_areas?.some(area => 
    area.toLowerCase().includes(matchedArea!.toLowerCase())
  ) ?? false;
};

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

    // Validate treatment areas match concerns
    [...analysis.primary_concerns.map((concern, i) => ({
      concern,
      treatment: analysis.primary_recommendations[i]
    })), ...analysis.secondary_concerns.map((concern, i) => ({
      concern,
      treatment: analysis.secondary_recommendations[i]
    }))].forEach(({ concern, treatment }) => {
      if (!validateTreatmentForArea(treatment, concern, availableTreatments)) {
        throw new Error(`Treatment "${treatment}" is not appropriate for concern: "${concern}"`);
      }
    });
  }

  // Validate matching lengths
  if (analysis.primary_concerns.length !== analysis.primary_recommendations.length ||
      analysis.secondary_concerns.length !== analysis.secondary_recommendations.length) {
    throw new Error('Number of concerns must match number of recommendations');
  }
};