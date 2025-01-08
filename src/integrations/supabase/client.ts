import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hyqidjgbnmdiirdhgtgs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cWlkamdibm1kaWlyZGhndGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTczOTQsImV4cCI6MjA1MDgzMzM5NH0.WOL854LeTbrb1y1TG9YMf2Op0c4z9XqyDOuxACOFTAk'

// Get the current domain
const currentDomain = window.location.hostname;

// Configure cookie options based on the domain
const cookieOptions = {
  domain: currentDomain === 'localhost' ? 'localhost' : `.${currentDomain}`,
  sameSite: 'lax' as const,
  secure: currentDomain !== 'localhost',
  path: '/'
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token',
    cookies: cookieOptions
  },
  global: {
    headers: {
      'x-client-info': `lovable-app/1.0.0`,
    },
  },
})

// Add debug logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.email);
  console.log('Current domain:', currentDomain);
  console.log('Cookie options:', cookieOptions);
  
  // Log token status
  if (session) {
    console.log('Access token present:', !!session.access_token);
    console.log('Refresh token present:', !!session.refresh_token);
  }
});