import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  console.log('Login function invoked:', new Date().toISOString());

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request body
    const { email, password } = await req.json();
    console.log('Login attempt for email:', email.slice(0, 3) + '***@' + email.split('@')[1]);

    if (!email || !password) {
      console.error('Missing required fields');
      throw new Error('Email and password are required');
    }

    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing required environment variables');
      throw new Error('Server configuration error');
    }

    console.log('Environment variables validated');
    console.log('Supabase URL present:', !!supabaseUrl);
    console.log('Service role key present:', !!supabaseServiceRoleKey);

    // Initialize Supabase admin client
    console.log('Initializing Supabase admin client');
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    console.log('Supabase admin client initialized');

    // Attempt authentication
    console.log('Attempting user authentication');
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Authentication error:', error.message);
      throw error;
    }

    console.log('Authentication successful');
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );

  } catch (error) {
    console.error('Error details:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: error.status || 400,
      },
    );
  }
})