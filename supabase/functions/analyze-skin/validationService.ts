import { AnalysisResult, Treatment } from './types.ts';

export const validateAnalysis = (
  analysis: AnalysisResult, 
  availableTreatments: Treatment[] | null = null
): void => {
  console.log('Starting analysis validation...');
  console.log('Analysis to validate:', JSON.stringify(analysis, null, 2));
  
  if (availableTreatments) {
    console.log('Available treatments:', JSON.stringify(availableTreatments, null, 2));
  }

  // Collect all validation errors
  const errors: string[] = [];

  // Validate structure
  if (!analysis.primary_concerns || !analysis.primary_recommendations || 
      !analysis.secondary_concerns || !analysis.secondary_recommendations) {
    errors.push('Invalid analysis format: missing required arrays');
  }

  // Validate arrays
  if (!Array.isArray(analysis.primary_concerns) || !Array.isArray(analysis.primary_recommendations) ||
      !Array.isArray(analysis.secondary_concerns) || !Array.isArray(analysis.secondary_recommendations)) {
    errors.push('Invalid analysis format: arrays expected');
  }

  // Validate counts
  const validateCount = (arr: any[], name: string) => {
    if (arr.length !== 3) {
      errors.push(`Analysis must contain exactly 3 ${name} (found ${arr.length})`);
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
    
    // Validate all recommendations exist in available treatments
    const allRecommendations = [...analysis.primary_recommendations, ...analysis.secondary_recommendations];
    const invalidTreatments = allRecommendations.filter(r => !availableTreatmentNames.has(r));
    
    if (invalidTreatments.length > 0) {
      errors.push(`AI recommended unavailable treatments: ${invalidTreatments.join(', ')}`);
    }

    // Log available and recommended treatments for debugging
    console.log('Available treatment names:', Array.from(availableTreatmentNames));
    console.log('Recommended treatments:', allRecommendations);
  }

  // Validate matching lengths
  if (analysis.primary_concerns.length !== analysis.primary_recommendations.length ||
      analysis.secondary_concerns.length !== analysis.secondary_recommendations.length) {
    errors.push('Number of concerns must match number of recommendations');
  }

  // If there are any validation errors, throw them all at once
  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    throw new Error(errors.join('\n'));
  }

  console.log('✅ Analysis validation completed successfully');
};