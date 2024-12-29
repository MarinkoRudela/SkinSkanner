import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    console.log('Starting skin analysis...');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured');
    }

    const { images } = await req.json();
    console.log('Received request with images:', Object.keys(images));

    if (!images || !images.front || !images.left || !images.right) {
      throw new Error('Missing required images');
    }

    // Clean and validate base64 images
    const cleanBase64 = (dataUrl: string) => {
      // Remove any existing data URL prefix
      const base64Data = dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
      // Validate base64
      try {
        atob(base64Data);
      } catch (e) {
        console.error('Invalid base64 data:', e);
        throw new Error('Invalid image data');
      }
      return `data:image/jpeg;base64,${base64Data}`;
    };

    console.log('Cleaning and validating image data...');
    const imageUrls = {
      front: cleanBase64(images.front),
      left: cleanBase64(images.left),
      right: cleanBase64(images.right)
    };

    console.log('Images validated successfully');
    console.log('Preparing OpenAI request...');
    
    const openAIRequest = {
      model: "gpt-4-vision-preview",
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `You are a professional skin analysis AI assistant. Your task is to:
          1. Analyze the provided facial images from different angles
          2. Identify 3-4 key skin concerns based on visible features
          3. Provide specific, actionable treatment recommendations for each concern
          4. Return your analysis in a structured JSON format with matching concerns and recommendations
          
          Format your response exactly like this example:
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
              text: 'Analyze these facial images and provide personalized skin care recommendations:'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrls.front
              }
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrls.left
              }
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrls.right
              }
            }
          ]
        }
      ]
    };

    console.log('Sending request to OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openAIRequest),
    });

    console.log('OpenAI API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, response.statusText);
      console.error('Error details:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received response from OpenAI:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    // Parse and validate the GPT response
    let analysis;
    try {
      analysis = JSON.parse(data.choices[0].message.content);
      
      // Validate the analysis structure
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-skin function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to analyze skin images'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});