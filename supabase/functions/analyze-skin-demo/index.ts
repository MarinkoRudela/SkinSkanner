import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Demo analyze-skin function initialized')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Log the request
    console.log('Demo analysis request received')

    // Predefined demo analysis response
    const demoAnalysis = {
      primary_concerns: [
        "Fine lines and wrinkles around eyes",
        "Uneven skin tone",
        "Loss of facial volume"
      ],
      primary_recommendations: [
        "Botox for crow's feet and forehead lines",
        "IPL photofacial for pigmentation",
        "Dermal fillers for volume restoration"
      ],
      secondary_concerns: [
        "Mild sun damage",
        "Dehydrated skin",
        "Early signs of aging"
      ],
      secondary_recommendations: [
        "Chemical peel for skin renewal",
        "Hydrating facial treatment",
        "Microneedling for collagen stimulation"
      ]
    }

    console.log('Returning demo analysis:', demoAnalysis)

    return new Response(
      JSON.stringify(demoAnalysis),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error in demo analysis:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate demo analysis' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})