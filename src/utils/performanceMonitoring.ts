import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';
import { supabase } from '@/integrations/supabase/client';

// Type for performance metrics
type MetricType = 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'API';

interface PerformanceMetric {
  name: MetricType;
  value: number;
  path: string;
  timestamp: string;
}

// Function to log metrics to Supabase
const logMetric = async (metric: PerformanceMetric) => {
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

// API response time monitoring
export const monitorApiCall = async <T>(
  apiCall: () => Promise<T>,
  endpoint: string
): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    
    await logMetric({
      name: 'API',
      value: duration,
      path: endpoint,
      timestamp: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    await logMetric({
      name: 'API',
      value: duration,
      path: `${endpoint} (error)`,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// Initialize web vitals monitoring
export const initializeWebVitals = () => {
  const path = window.location.pathname;

  onFCP(metric => {
    logMetric({
      name: 'FCP',
      value: metric.value,
      path,
      timestamp: new Date().toISOString()
    });
  });

  onLCP(metric => {
    logMetric({
      name: 'LCP',
      value: metric.value,
      path,
      timestamp: new Date().toISOString()
    });
  });

  onCLS(metric => {
    logMetric({
      name: 'CLS',
      value: metric.value,
      path,
      timestamp: new Date().toISOString()
    });
  });

  onFID(metric => {
    logMetric({
      name: 'FID',
      value: metric.value,
      path,
      timestamp: new Date().toISOString()
    });
  });

  onTTFB(metric => {
    logMetric({
      name: 'TTFB',
      value: metric.value,
      path,
      timestamp: new Date().toISOString()
    });
  });
};