import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import QRCode from 'npm:qrcode'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { shortCode } = await req.json()
    
    if (!shortCode) {
      throw new Error('Short code is required')
    }

    const baseUrl = req.headers.get('origin') || 'https://yourdomain.com'
    const scannerUrl = `${baseUrl}/b/${shortCode}`
    
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(scannerUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#4F46E5', // Indigo color for the QR code
        light: '#FFFFFF'
      }
    })

    return new Response(
      JSON.stringify({ qrCode: qrDataUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error generating QR code:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})