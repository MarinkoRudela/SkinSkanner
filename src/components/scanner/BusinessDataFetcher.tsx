import { useEffect } from "react";
import { fetchBusinessData } from "@/services/businessDataService";
import { toast } from "@/hooks/use-toast";

interface BusinessData {
  brand_name: string;
  logo_url: string;
  tagline: string;
  booking_url: string;
  profile_id: string;
}

interface BusinessDataFetcherProps {
  shortCode: string;
  onDataFetched: (data: BusinessData) => void;
  onError: (error: string) => void;
}

export const BusinessDataFetcher = ({ 
  shortCode, 
  onDataFetched, 
  onError 
}: BusinessDataFetcherProps) => {
  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        console.log('Fetching business data for shortCode:', shortCode);
        const businessInfo = await fetchBusinessData(shortCode);
        console.log('Business data fetched successfully:', businessInfo);
        onDataFetched(businessInfo);
        
        toast({
          title: "Success",
          description: "Welcome to the face analysis tool",
        });
      } catch (err: any) {
        console.error('Error in loadBusinessData:', err);
        const errorMessage = err.message.includes('not completely set up')
          ? "This business hasn't completed their profile setup yet. Please contact them directly or try again later."
          : err.message;
        console.error('Displaying error message:', errorMessage);
        onError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    loadBusinessData();
  }, [shortCode, onDataFetched, onError]);

  return null;
};