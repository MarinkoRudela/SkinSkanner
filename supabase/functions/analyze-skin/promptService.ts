import { Treatment } from './types.ts';

const createExpertiseMappings = (treatments: Treatment[]) => {
  const mappings: Record<string, string[]> = {};
  
  treatments.forEach(treatment => {
    (treatment.treatment_areas || []).forEach(area => {
      if (!mappings[area]) {
        mappings[area] = [];
      }
      mappings[area].push(treatment.name);
    });
  });

  return mappings;
};

const formatTreatmentsList = (treatments: Treatment[]): string => {
  const categories: Record<string, Treatment[]> = {};
  
  treatments.forEach(treatment => {
    const categoryName = treatment.category?.name || 'Other';
    if (!categories[categoryName]) {
      categories[categoryName] = [];
    }
    categories[categoryName].push(treatment);
  });

  let formattedList = 'Available Treatments:\n';
  Object.entries(categories).forEach(([category, categoryTreatments]) => {
    formattedList += `\n${category}:\n`;
    categoryTreatments.forEach(treatment => {
      formattedList += `- ${treatment.name}: ${treatment.description}\n`;
    });
  });

  formattedList += '\nAllowed treatment names:\n';
  formattedList += treatments.map(t => `"${t.name}"`).join(', ');
  
  return formattedList;
};

export const createSystemPrompt = (treatments: Treatment[] | null = null, brandName: string = ''): string => {
  let prompt = `You are an expert medical aesthetician${brandName ? ` at ${brandName}` : ''}. 
Your task is to analyze facial images and provide a detailed JSON-formatted analysis with personalized recommendations.

When analyzing the images, focus on these key areas:
1. Facial Analysis:
   - Fine lines and wrinkles
   - Volume loss and facial contours
   - Skin texture and tone
   - Pigmentation or discoloration
   - Pore size and appearance
   - Signs of aging
   - Skin laxity
   - Under-eye concerns\n\n`;

  if (treatments && treatments.length > 0) {
    // Add formatted treatments list
    prompt += formatTreatmentsList(treatments);
    
    // Add expertise mappings
    const expertiseMappings = createExpertiseMappings(treatments);
    if (Object.keys(expertiseMappings).length > 0) {
      prompt += '\n\nTreatments by facial area:\n';
      Object.entries(expertiseMappings).forEach(([area, areatreatments]) => {
        prompt += `\n${area}:\n${areatreatments.map(t => `- ${t}`).join('\n')}`;
      });
    }

    prompt += `\n\nSTRICT RULES FOR RECOMMENDATIONS:
- You can ONLY recommend treatments from the list above
- Each recommendation must EXACTLY match one of these names: ${treatments.map(t => `"${t.name}"`).join(', ')}
- Recommendations must be appropriate for the specific facial areas where concerns are identified
- Match treatments to areas based on the "Treatments by facial area" mapping above
- Do not suggest any treatments not listed, even if they might be beneficial`;
  }

  prompt += `\n\nYour response must be formatted as a JSON object with exactly this structure:
{
  "primary_concerns": ["Major concern 1", "Major concern 2", "Major concern 3"],
  "primary_recommendations": ["Primary treatment 1", "Primary treatment 2", "Primary treatment 3"],
  "secondary_concerns": ["Minor concern 1", "Minor concern 2", "Minor concern 3"],
  "secondary_recommendations": ["Secondary treatment 1", "Secondary treatment 2", "Secondary treatment 3"]
}

IMPORTANT GUIDELINES:
- Provide exactly 3 primary and 3 secondary observations with matching treatment recommendations
- ONLY recommend treatments from the provided list - any other recommendations will be rejected
- Each concern must be paired with its corresponding treatment recommendation in the same array position
- Primary concerns should focus on the most noticeable or urgent treatment needs
- Secondary concerns should address enhancement opportunities or preventive care
- Use professional medical aesthetics terminology
- Only recommend treatments that are appropriate for the specific areas where concerns are identified`;

  return prompt;
};