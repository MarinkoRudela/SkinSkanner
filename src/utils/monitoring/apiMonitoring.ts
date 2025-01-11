import { logMetric } from './logMetric';

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