import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export const storeAnalytics = async (
  profileId: string, 
  analysis: { primary_concerns: string[]; primary_recommendations: string[] }
) => {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Missing Supabase configuration for analytics');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { error: analyticsError } = await supabase
      .from('scanner_analytics')
      .insert({
        profile_id: profileId,
        scan_completed_at: new Date().toISOString(),
        recommendations_generated: analysis.primary_recommendations.length,
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
};