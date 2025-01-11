import { supabase } from '@/integrations/supabase/client';
import { PerformanceMetric } from './types';

export const logMetric = async (metric: PerformanceMetric) => {
  try {
    console.log('Performance metric:', metric);
    const { error } = await supabase
      .from('performance_metrics')
      .insert([metric]);
      
    if (error) {
      console.error('Error logging performance metric:', error);
    }
  } catch (err) {
    console.error('Failed to log performance metric:', err);
  }
};