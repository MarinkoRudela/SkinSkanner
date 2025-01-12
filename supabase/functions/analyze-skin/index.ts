import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from './corsConfig.ts';
import { handleError } from './errorHandler.ts';
import { callOpenAI } from './openaiClient.ts';
import { storeAnalytics } from './analyticsService.ts';
import { createSystemPrompt } from './promptService.ts';
import { validateAnalysis } from './validationService.ts';
import { AnalysisRequest } from './types.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

console.log('🚀 Analyze-skin function initialized');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const requestText = await req.text();
    console.log('Request body:', requestText);
    
    const { images, profileId }: AnalysisRequest = JSON.parse(requestText);

    // Validate request
    if (!images?.front || !images?.left || !images?.right) {
      throw new Error('Missing required images');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch treatments and business profile
    let availableTreatments = null;
    let businessProfile = null;

    if (profileId) {
      try {
        const { data: treatments, error: treatmentsError } = await supabase
          .from('med_spa_treatments')
          .select(`
            treatment_id,
            treatments:treatment_id (
              name,
              description,
              category:category_id (
                name
              ),
              treatment_areas
            )
          `)
          .eq('profile_id', profileId)
          .eq('is_active', true);

        if (treatmentsError) throw treatmentsError;
        availableTreatments = treatments.map(t => ({
          name: t.treatments.name,
          category: t.treatments.category,
          description: t.treatments.description,
          treatment_areas: t.treatments.treatment_areas
        }));

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('brand_name')
          .eq('id', profileId)
          .single();
          
        if (profileError) throw profileError;
        businessProfile = profile;
      } catch (error) {
        console.error('Error fetching business data:', error);
        throw new Error(`Failed to fetch business data: ${error.message}`);
      }
    }

    // Create system prompt and call OpenAI
    const systemPrompt = createSystemPrompt(availableTreatments, businessProfile?.brand_name);
    const openaiData = await callOpenAI(systemPrompt, images);
    
    // Parse and validate analysis
    const analysis = JSON.parse(openaiData.choices[0].message.content);
    validateAnalysis(analysis, availableTreatments);

    // Store analytics if profile ID is provided
    if (profileId) {
      await storeAnalytics(profileId, analysis);
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleError(error);
  }
});