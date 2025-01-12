import { Treatment } from './types.ts';

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

  formattedList += '\nSTRICTLY use ONLY these treatment names:\n';
  formattedList += treatments.map(t => `"${t.name}"`).join(', ');
  
  return formattedList;
};

export const createSystemPrompt = (treatments: Treatment[] | null = null, brandName: string = ''): string => {
  console.log('Creating system prompt with brand name:', brandName);
  
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
    console.log('Adding treatments to prompt:', treatments.length, 'treatments available');
    prompt += formatTreatmentsList(treatments);
    
    prompt += `\n\nSTRICT RULES FOR RECOMMENDATIONS:
- You can ONLY recommend treatments from the list above
- Each recommendation must EXACTLY match one of the listed treatment names
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
- Use professional medical aesthetics terminology`;

  console.log('Generated system prompt:', prompt);
  return prompt;
};