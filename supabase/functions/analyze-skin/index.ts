import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { images } = await req.json();
    
    console.log('Processing images for skin analysis');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional skin analysis AI assistant. Analyze the provided facial images and:
            1. Identify 3-4 potential skin concerns
            2. Provide specific treatment recommendations for each concern
            3. Keep responses concise and professional
            4. Format output as JSON with 'concerns' and 'recommendations' arrays that match 1:1
            Example format: 
            {
              "concerns": ["Uneven skin tone", "Fine lines"],
              "recommendations": ["Vitamin C serum for pigmentation", "Retinol treatment for fine lines"]
            }`
          },
          {
            role: 'user',
            content: `Please analyze these facial images from different angles and provide skin care recommendations. Front view: ${images.front}, Left side: ${images.left}, Right side: ${images.right}`
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Analysis completed successfully');
    
    // Parse the GPT response to ensure it's valid JSON
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-skin function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});