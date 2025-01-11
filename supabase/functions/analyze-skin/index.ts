import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Treatment {
  name: string;
  category: { name: string };
  description: string;
}

interface AnalysisResult {
  concerns: string[];
  recommendations: string[];
}

const fetchMedSpaTreatments = async (supabase: any, profileId: string): Promise<Treatment[]> => {
  const { data: medSpaTreatments, error } = await supabase
    .from('med_spa_treatments')
    .select(`
      treatment_id,
      treatments:treatment_id (
        name,
        description,
        category:category_id (
          name
        )
      )
    `)
    .eq('profile_id', profileId)
    .eq('is_active', true);

  if (error) throw error;
  return medSpaTreatments.map((t: any) => ({
    name: t.treatments.name,
    category: t.treatments.category,
    description: t.treatments.description
  }));
};

const createSystemPrompt = (treatments: Treatment[] | null = null): string => {
  let prompt = `You are an expert medical aesthetician and dermatology specialist at a luxury medical spa. Your task is to analyze facial images and provide JSON-formatted recommendations`;

  if (treatments && treatments.length > 0) {
    prompt += ` specifically choosing from the following available treatments:\n\n${
      treatments.map(t => `- ${t.name} (${t.category.name}): ${t.description}`).join('\n')
    }`;
  } else {
    prompt += ` for common medical spa treatments.`;
  }

  prompt += `\n\nWhen analyzing the images, focus on these key areas:
1. Skin Analysis (look for):
   - Fine lines and wrinkles
   - Volume loss and facial contours
   - Skin texture and tone
   - Pigmentation or discoloration
   - Pore size and appearance
   - Signs of aging
   - Skin laxity
   - Under-eye concerns

Your response must be formatted as a JSON object with exactly this structure:
{
  "concerns": ["Observed condition 1", "Observed condition 2", "Observed condition 3", "Observed condition 4"],
  "recommendations": ["Specific treatment 1", "Specific treatment 2", "Specific treatment 3", "Specific treatment 4"]
}

IMPORTANT:
- Provide exactly 4 key observations and their matching treatment recommendations
${treatments ? '- Only recommend treatments from the provided list of available treatments' : '- Provide general treatment recommendations'}
- Each concern must be paired with its corresponding treatment recommendation in the same array position`;

  return prompt;
};

const validateAnalysis = (
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

serve(async (req) => {
  console.log('🚀 Analyze-skin function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestText = await req.text();
    const { images, profileId } = JSON.parse(requestText);

    if (!images?.front || !images?.left || !images?.right) {
      throw new Error('Missing required images');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    let availableTreatments = null;
    if (profileId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase configuration');
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      availableTreatments = await fetchMedSpaTreatments(supabase, profileId);
    }

    const systemPrompt = createSystemPrompt(availableTreatments);
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze these facial images and provide personalized medical spa treatment recommendations:'
              },
              {
                type: 'image_url',
                image_url: { url: images.front }
              },
              {
                type: 'image_url',
                image_url: { url: images.left }
              },
              {
                type: 'image_url',
                image_url: { url: images.right }
              }
            ]
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}`);
    }

    const openaiData = await openaiResponse.json();
    const analysis = JSON.parse(openaiData.choices[0].message.content);
    
    validateAnalysis(analysis, availableTreatments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ Error in analyze-skin function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to analyze skin images'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});