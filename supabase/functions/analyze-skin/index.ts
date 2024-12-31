import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 Analyze-skin function called');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting request processing...');
    
    // Log request body
    const requestText = await req.text();
    console.log('Raw request body:', requestText);
    
    // Parse the request body
    const { images } = JSON.parse(requestText);
    console.log('Parsed images object keys:', Object.keys(images));

    if (!images || !images.front || !images.left || !images.right) {
      console.error('❌ Missing required images:', {
        front: !!images?.front,
        left: !!images?.left,
        right: !!images?.right
      });
      throw new Error('Missing required images');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('❌ OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured');
    }
    console.log('✅ OpenAI API key found');

    console.log('📝 Preparing OpenAI request...');
    const messages = [
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
    ];
    
    console.log('🔄 Making request to OpenAI API...');
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    console.log('OpenAI response status:', openaiResponse.status);
    console.log('OpenAI response headers:', Object.fromEntries(openaiResponse.headers.entries()));

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('❌ OpenAI API error:', {
        status: openaiResponse.status,
        statusText: openaiResponse.statusText,
        errorDetails: errorText
      });
      throw new Error(`OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('✅ Received response from OpenAI:', openaiData);

    if (!openaiData.choices?.[0]?.message?.content) {
      console.error('❌ Invalid response format from OpenAI:', openaiData);
      throw new Error('Invalid response format from OpenAI');
    }

    // Parse and validate the analysis
    let analysis;
    try {
      console.log('🔄 Parsing OpenAI response content:', openaiData.choices[0].message.content);
      analysis = JSON.parse(openaiData.choices[0].message.content);
      
      if (!analysis.concerns || !analysis.recommendations || 
          !Array.isArray(analysis.concerns) || !Array.isArray(analysis.recommendations) ||
          analysis.concerns.length !== analysis.recommendations.length) {
        console.error('❌ Invalid analysis format:', analysis);
        throw new Error('Invalid analysis format');
      }

      console.log('✅ Analysis validation passed:', analysis);
    } catch (error) {
      console.error('❌ Error parsing analysis:', error);
      console.error('Raw content:', openaiData.choices[0].message.content);
      throw new Error('Failed to parse analysis results');
    }

    console.log('✅ Analysis completed successfully');
    return new Response(JSON.stringify(analysis), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('❌ Error in analyze-skin function:', {
      error: error.message,
      stack: error.stack
    });
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