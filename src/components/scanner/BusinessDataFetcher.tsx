import React from 'react';
import { fetchBusinessData } from '@/services/businessDataService';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingScreen } from '../LoadingScreen';
import { toast } from '@/hooks/use-toast';

interface BusinessDataFetcherProps {
  shortCode: string;
  onDataFetched: (data: any) => void;
  onError: (err: string) => void;
}

export const BusinessDataFetcher: React.FC<BusinessDataFetcherProps> = ({ 
  shortCode, 
  onDataFetched, 
  onError 
}) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching business data for shortCode:', shortCode);
        setIsLoading(true);
        const businessData = await fetchBusinessData(shortCode);
        console.log('Business data received:', businessData);
        
        if (!businessData) {
          throw new Error('No business data found');
        }
        
        onDataFetched(businessData);
      } catch (err: any) {
        console.error('Error fetching business data:', err);
        onError(err.message || 'Failed to load business data');
        toast({
          title: "Error",
          description: "Failed to load business data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (shortCode) {
      loadData();
    }
  }, [shortCode, onDataFetched, onError]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return null;
};