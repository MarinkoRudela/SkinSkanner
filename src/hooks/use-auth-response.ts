import { useState, useCallback } from 'react';

interface CachedResponse {
  data: any;
  timestamp: number;
}

const responseCache = new Map<string, CachedResponse>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useAuthResponse = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResponse = useCallback(async (response: Response, cacheKey: string) => {
    setIsProcessing(true);
    try {
      console.log('Handling response for cache key:', cacheKey);
      
      // Check cache first
      const cached = responseCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Returning cached response');
        return cached.data;
      }

      // Clone response before reading
      const clonedResponse = response.clone();
      const data = await clonedResponse.json();
      console.log('Processed new response data');

      // Cache the result
      responseCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error('Error handling response:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    handleResponse,
    isProcessing,
  };
};