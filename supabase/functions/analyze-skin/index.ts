import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { images } = await req.json();
    console.log('Received request with images:', Object.keys(images));

    if (!images || !images.front || !images.left || !images.right) {
      throw new Error('Missing required images');
    }

    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      console.error('Perplexity API key is not configured');
      throw new Error('Perplexity API key is not configured');
    }

    console.log('Preparing Perplexity request...');
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a professional skin analysis AI assistant. Analyze the provided facial images and provide:
            1. 3-4 key skin concerns based on visible features
            2. Specific treatment recommendations for each concern
            Format your response exactly as this example:
            {
              "concerns": ["Uneven skin tone", "Fine lines", "Dehydration"],
              "recommendations": ["Regular use of Vitamin C serum", "Retinol treatment at night", "Hyaluronic acid moisturizer"]
            }`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze these facial images and provide personalized skin care recommendations:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: images.front
                }
              },
              {
                type: 'image_url',
                image_url: {
                  url: images.left
                }
              },
              {
                type: 'image_url',
                image_url: {
                  url: images.right
                }
              }
            ]
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      }),
    });

    console.log('Perplexity API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, response.statusText);
      console.error('Error details:', errorText);
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received response from Perplexity:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Perplexity');
    }

    // Parse and validate the analysis
    let analysis;
    try {
      analysis = JSON.parse(data.choices[0].message.content);
      
      if (!analysis.concerns || !analysis.recommendations || 
          !Array.isArray(analysis.concerns) || !Array.isArray(analysis.recommendations) ||
          analysis.concerns.length !== analysis.recommendations.length) {
        throw new Error('Invalid analysis format');
      }
    } catch (error) {
      console.error('Error parsing analysis:', error);
      throw new Error('Failed to parse analysis results');
    }

    console.log('Analysis completed successfully:', analysis);

    return new Response(JSON.stringify(analysis), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error in analyze-skin function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to analyze skin images'
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });
  }
});