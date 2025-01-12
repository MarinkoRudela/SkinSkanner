import { AnalysisResult, Treatment } from './types.ts';

const validateTreatmentForArea = (
  treatment: string,
  concern: string,
  availableTreatments: Treatment[]
): { isValid: boolean; reason?: string } => {
  const treatmentObj = availableTreatments.find(t => t.name === treatment);
  if (!treatmentObj) {
    return { 
      isValid: false, 
      reason: `Treatment "${treatment}" not found in available treatments` 
    };
  }

  // Common facial areas and their variations
  const areaKeywords: Record<string, string[]> = {
    'forehead': ['forehead', 'upper face', 'front', 'brow'],
    'eyes': ['eye', 'under-eye', 'crow', 'upper face', 'periorbital'],
    'cheeks': ['cheek', 'mid face', 'middle face', 'midface'],
    'nose': ['nose', 'nasal', 'bridge'],
    'mouth': ['mouth', 'lip', 'lower face', 'perioral'],
    'jaw': ['jaw', 'lower face', 'chin', 'jawline'],
    'neck': ['neck', 'under chin', 'submental']
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

  if (!matchedArea) {
    return { isValid: true }; // If no specific area mentioned, consider it valid
  }

  // Check if treatment is available for the matched area
  const isValidForArea = treatmentObj.treatment_areas?.some(area => 
    area.toLowerCase().includes(matchedArea!.toLowerCase())
  ) ?? false;

  return {
    isValid: isValidForArea,
    reason: isValidForArea ? undefined : 
      `Treatment "${treatment}" is not appropriate for ${matchedArea} area (concern: "${concern}")`
  };
};

export const validateAnalysis = (
  analysis: AnalysisResult, 
  availableTreatments: Treatment[] | null = null
): void => {
  console.log('Starting analysis validation...');

  // Validate structure
  if (!analysis.primary_concerns || !analysis.primary_recommendations || 
      !analysis.secondary_concerns || !analysis.secondary_recommendations) {
    throw new Error('Invalid analysis format: missing required arrays');
  }

  if (!Array.isArray(analysis.primary_concerns) || !Array.isArray(analysis.primary_recommendations) ||
      !Array.isArray(analysis.secondary_concerns) || !Array.isArray(analysis.secondary_recommendations)) {
    throw new Error('Invalid analysis format: arrays expected');
  }

  // Validate counts
  const validateCount = (arr: any[], name: string) => {
    if (arr.length !== 3) {
      throw new Error(`Analysis must contain exactly 3 ${name} (found ${arr.length})`);
    }
  };

  validateCount(analysis.primary_concerns, 'primary concerns');
  validateCount(analysis.primary_recommendations, 'primary recommendations');
  validateCount(analysis.secondary_concerns, 'secondary concerns');
  validateCount(analysis.secondary_recommendations, 'secondary recommendations');

  // Validate against available treatments if provided
  if (availableTreatments) {
    console.log('Validating against available treatments...');
    const availableTreatmentNames = new Set(availableTreatments.map(t => t.name));
    const allRecommendations = [...analysis.primary_recommendations, ...analysis.secondary_recommendations];
    
    const invalidTreatments = allRecommendations.filter(r => !availableTreatmentNames.has(r));
    if (invalidTreatments.length > 0) {
      throw new Error(`AI recommended unavailable treatments: ${invalidTreatments.join(', ')}`);
    }

    // Validate treatment areas match concerns
    console.log('Validating treatment areas...');
    const allPairs = [
      ...analysis.primary_concerns.map((concern, i) => ({
        concern,
        treatment: analysis.primary_recommendations[i],
        isPrimary: true
      })),
      ...analysis.secondary_concerns.map((concern, i) => ({
        concern,
        treatment: analysis.secondary_recommendations[i],
        isPrimary: false
      }))
    ];

    allPairs.forEach(({ concern, treatment, isPrimary }) => {
      const validation = validateTreatmentForArea(treatment, concern, availableTreatments);
      if (!validation.isValid) {
        throw new Error(
          `Invalid ${isPrimary ? 'primary' : 'secondary'} recommendation: ${validation.reason}`
        );
      }
    });
  }

  // Validate matching lengths
  if (analysis.primary_concerns.length !== analysis.primary_recommendations.length ||
      analysis.secondary_concerns.length !== analysis.secondary_recommendations.length) {
    throw new Error('Number of concerns must match number of recommendations');
  }

  console.log('✅ Analysis validation completed successfully');
};