import React from 'react';
import { fetchBusinessData } from '@/services/businessDataService';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingScreen } from '../LoadingScreen';
import { toast } from '@/hooks/use-toast';

interface BusinessDataFetcherProps {
  shortCode: string;
  children: (data: any) => React.ReactNode;
}

export const BusinessDataFetcher: React.FC<BusinessDataFetcherProps> = ({ shortCode, children }) => {
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
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
        
        setData(businessData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching business data:', err);
        setError(err.message || 'Failed to load business data');
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
  }, [shortCode]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!data) {
    return <ErrorDisplay message="No business data found" />;
  }

  return <>{children(data)}</>;
};