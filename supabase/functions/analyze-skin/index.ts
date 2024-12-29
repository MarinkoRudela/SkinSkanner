import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get the JWT token from the request header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const { images } = await req.json();
    
    console.log('Processing images for user:', user.id);
    
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
            1. Identify potential skin concerns
            2. Provide specific treatment recommendations for each concern
            3. Keep responses concise and professional
            4. Format output as JSON with 'concerns' and 'recommendations' arrays that match 1:1
            Example format: 
            {
              "concerns": ["Concern 1", "Concern 2"],
              "recommendations": ["Treatment 1 for Concern 1", "Treatment 2 for Concern 2"]
            }`
          },
          {
            role: 'user',
            content: `Please analyze these facial images from different angles and provide skin care recommendations. Images: ${images.front}, ${images.left}, ${images.right}`
          }
        ],
      }),
    });

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    console.log('Analysis completed successfully');

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