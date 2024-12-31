import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useBookingUrl = (session: any, bookingUrl: string, updateBookingUrl: (url: string) => Promise<void>) => {
  const [uniqueLink, setUniqueLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateUniqueLink = () => {
    if (bookingUrl && session?.user?.id) {
      const baseUrl = window.location.origin;
      setUniqueLink(`${baseUrl}?business=${session.user.id}`);
    }
  };

  const handleUpdateBookingUrl = async (url: string) => {
    setIsLoading(true);
    try {
      // Update state through parent component first
      await updateBookingUrl(url);
      
      toast({
        title: "Success",
        description: "Booking URL updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating booking URL:', error);
      toast({
        title: "Error",
        description: "Failed to update booking URL. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      generateUniqueLink();
    }
  }, [session, bookingUrl]);

  return {
    uniqueLink,
    isLoading,
    handleUpdateBookingUrl
  };
};