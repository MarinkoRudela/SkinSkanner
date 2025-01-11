import { Treatment } from './types.ts';

export const createSystemPrompt = (treatments: Treatment[] | null = null, businessType: string = 'med_spa', brandName: string = ''): string => {
  let businessTitle = 'medical aesthetician';
  switch(businessType) {
    case 'brow_specialist':
      businessTitle = 'brow and facial aesthetics specialist';
      break;
    case 'aesthetician':
      businessTitle = 'licensed aesthetician';
      break;
    default:
      businessTitle = 'medical aesthetician';
  }

  let prompt = `You are an expert ${businessTitle}${brandName ? ` at ${brandName}` : ''}. 
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
   - Under-eye concerns`;

  if (treatments && treatments.length > 0) {
    const treatmentsByArea = treatments.reduce((acc: Record<string, string[]>, t: Treatment) => {
      (t.treatment_areas || []).forEach(area => {
        if (!acc[area]) {
          acc[area] = [];
        }
        acc[area].push(t.name);
      });
      return acc;
    }, {});

    prompt += `\n\nAvailable treatments by area:\n`;
    Object.entries(treatmentsByArea).forEach(([area, treatments]) => {
      prompt += `\n${area}:\n${treatments.map(t => `- ${t}`).join('\n')}`;
    });
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
${treatments ? '- Only recommend treatments from the provided list of available treatments' : '- Provide general treatment recommendations'}
- Each concern must be paired with its corresponding treatment recommendation in the same array position
- Primary concerns should focus on the most noticeable or urgent treatment needs
- Secondary concerns should address enhancement opportunities or preventive care
- Tailor language and recommendations to match the expertise level of a ${businessTitle}
- Only recommend treatments that are appropriate for the specific areas where concerns are identified
- Use professional medical aesthetics terminology appropriate for a ${businessTitle}`;

  return prompt;
};