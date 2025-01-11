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
    const requestText = await req.text();
    const { images, profileId, businessType, brandName }: AnalysisRequest = JSON.parse(requestText);

    if (!images?.front || !images?.left || !images?.right) {
      throw new Error('Missing required images');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    let availableTreatments = null;
    let businessProfile = null;
    if (profileId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase configuration');
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      availableTreatments = await fetchMedSpaTreatments(supabase, profileId);
      
      // Fetch business profile for branding
      const { data: profile } = await supabase
        .from('profiles')
        .select('brand_name, business_type')
        .eq('id', profileId)
        .single();
        
      businessProfile = profile;
    }

    const systemPrompt = createSystemPrompt(
      availableTreatments, 
      businessProfile?.business_type || businessType || 'med_spa',
      businessProfile?.brand_name || brandName
    );
    
    console.log('System prompt:', systemPrompt);
    
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
    const analysis = JSON.parse(openaiData.choices[0].message.content);
    
    console.log('Analysis result:', analysis);
    
    validateAnalysis(analysis, availableTreatments);

    // Track analytics if profile ID is provided
    if (profileId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') as string,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
      );
      
      await supabase.from('scanner_analytics').insert({
        profile_id: profileId,
        scan_completed_at: new Date().toISOString(),
        recommendations_generated: 6,
        primary_concerns: analysis.primary_concerns
      });
    }

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