import { corsHeaders } from './corsConfig.ts';

export const handleError = (error: Error) => {
  console.error('❌ Error in analyze-skin function:', error);
  console.error('Error stack:', error.stack);
  
  return new Response(
    JSON.stringify({ 
      error: error.message,
      details: 'Failed to analyze skin images',
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
};