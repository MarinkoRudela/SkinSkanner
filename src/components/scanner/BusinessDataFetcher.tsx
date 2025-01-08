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
      if (!shortCode) {
        console.error('No shortCode provided');
        onError('Invalid business link. Please check the URL and try again.');
        return;
      }

      try {
        console.log('Fetching business data for shortCode:', shortCode);
        setIsLoading(true);
        const businessData = await fetchBusinessData(shortCode);
        
        if (!businessData) {
          throw new Error('Business not found');
        }

        console.log('Business data received:', businessData);
        console.log('Business settings:', businessData?.business_settings);
        console.log('Booking URL:', businessData?.business_settings?.booking_url);
        
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

    loadData();
  }, [shortCode, onDataFetched, onError]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return null;
};