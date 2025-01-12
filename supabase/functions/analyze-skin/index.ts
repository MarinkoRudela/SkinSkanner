import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { fetchMedSpaTreatments } from './treatmentService.ts';
import { createSystemPrompt } from './promptService.ts';
import { validateAnalysis } from './validationService.ts';
import { AnalysisRequest } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 Analyze-skin function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Initialize Supabase client with logging
    console.log('Initializing Supabase client...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // Check required environment variables
    const requiredEnvVars = {
      SUPABASE_URL: supabaseUrl,
      SUPABASE_SERVICE_KEY: supabaseServiceKey,
      OPENAI_API_KEY: openaiApiKey
    };

    console.log('Environment variables status:', 
      Object.entries(requiredEnvVars)
        .map(([key, value]) => `${key}: ${value ? '✅' : '❌'}`)
    );

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase client initialized');

    // 2. Parse request with error handling
    console.log('Parsing request body...');
    const requestText = await req.text();
    console.log('Request body:', requestText);
    
    const { images, profileId }: AnalysisRequest = JSON.parse(requestText);
    console.log('Profile ID:', profileId);

    // 3. Validate request data
    if (!images?.front || !images?.left || !images?.right) {
      console.error('Missing required images');
      throw new Error('Missing required images');
    }

    // 4. Fetch treatments with detailed logging
    console.log('🔍 Fetching treatments for profile:', profileId);
    let availableTreatments = null;
    let businessProfile = null;

    if (profileId) {
      try {
        availableTreatments = await fetchMedSpaTreatments(supabase, profileId);
        console.log('Available treatments:', JSON.stringify(availableTreatments, null, 2));

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('brand_name')
          .eq('id', profileId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        businessProfile = profile;
        console.log('Business profile:', JSON.stringify(businessProfile, null, 2));
      } catch (error) {
        console.error('Error fetching business data:', error);
        throw new Error(`Failed to fetch business data: ${error.message}`);
      }
    }

    // 5. Create system prompt with logging
    console.log('Creating system prompt...');
    const systemPrompt = createSystemPrompt(availableTreatments, businessProfile?.brand_name);
    console.log('System prompt:', systemPrompt);

    // 6. Call OpenAI with updated model and error handling
    if (!openaiApiKey) {
      console.error('OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Calling OpenAI API with gpt-4o model...');
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
                text: 'Please analyze these facial images and provide personalized treatment recommendations:'
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
      console.error('OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('OpenAI response:', JSON.stringify(openaiData, null, 2));
    
    const analysis = JSON.parse(openaiData.choices[0].message.content);
    console.log('Parsed analysis:', JSON.stringify(analysis, null, 2));

    // 7. Validate analysis with logging
    console.log('Validating analysis...');
    try {
      validateAnalysis(analysis, availableTreatments);
      console.log('✅ Analysis validation passed');
    } catch (error) {
      console.error('❌ Analysis validation failed:', error);
      throw error;
    }

    // 8. Store analytics data if profile ID is provided
    if (profileId) {
      try {
        const { error: analyticsError } = await supabase
          .from('scanner_analytics')
          .insert({
            profile_id: profileId,
            scan_completed_at: new Date().toISOString(),
            recommendations_generated: analysis.primary_recommendations.length + analysis.secondary_recommendations.length,
            primary_concerns: analysis.primary_concerns
          });

        if (analyticsError) {
          console.error('Error storing analytics:', analyticsError);
        } else {
          console.log('✅ Analytics data stored successfully');
        }
      } catch (error) {
        console.error('Error storing analytics:', error);
      }
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ Error in analyze-skin function:', error);
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to analyze skin images',
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});