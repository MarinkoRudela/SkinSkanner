import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are a helpful support assistant for SkinSkanner.ai, an AI-powered skin analysis tool for medical spas and aestheticians. Here are your guidelines:

1. Help users with:
   - Setting up their business profile
   - Configuring booking URLs
   - Using the scanning feature
   - Understanding subscription plans
   - Technical issues with the scanner
   - Branding customization

2. Key Features to Know:
   - AI-powered skin analysis from three angles
   - Customizable booking links
   - Business branding options (logo, name, tagline)
   - Subscription-based service
   - Integration with business websites

3. When to Escalate:
   - Direct users to email support (info@skinskanner.ai) for:
     * Billing disputes
     * Account access issues
     * Complex technical problems
     * Custom integration requests
     * Security concerns

Be friendly, professional, and concise. If you're not confident about an answer, recommend contacting email support.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in support-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});