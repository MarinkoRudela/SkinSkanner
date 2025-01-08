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
          throw new Error('Business not found');
        }
        
        onDataFetched(businessData);
      } catch (err: any) {
        console.error('Error fetching business data:', err);
        const errorMessage = err.message === 'Business not found' 
          ? `This business link (${shortCode}) doesn't exist. Please check the URL and try again.`
          : 'Failed to load business data. Please try again.';
        
        onError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
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