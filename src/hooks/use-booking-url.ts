import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export const useBookingUrl = (session: any, bookingUrl: string, updateBookingUrl: (url: string) => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueLink, setUniqueLink] = useState("");

  useEffect(() => {
    if (bookingUrl) {
      try {
        // Ensure the URL is properly formatted
        const formattedUrl = formatUrl(bookingUrl);
        setUniqueLink(formattedUrl);
      } catch (error) {
        console.error('Error formatting URL:', error);
        setUniqueLink("");
      }
    }
  }, [bookingUrl]);

  const formatUrl = (url: string): string => {
    try {
      // Remove any trailing colons
      url = url.replace(/:+$/, '');
      
      // If the URL doesn't start with http:// or https://, add https://
      if (!url.match(/^https?:\/\//i)) {
        url = `https://${url}`;
      }
      
      // Create URL object to validate and normalize the URL
      const urlObject = new URL(url);
      return urlObject.toString();
    } catch (error) {
      console.error('Invalid URL:', error);
      throw new Error('Invalid URL format');
    }
  };

  const handleUpdateBookingUrl = async (url: string) => {
    setIsLoading(true);
    try {
      // Format the URL before updating
      const formattedUrl = formatUrl(url);
      await updateBookingUrl(formattedUrl);
      
      toast({
        title: "Success",
        description: "Booking URL updated successfully",
      });
      
      setUniqueLink(formattedUrl);
    } catch (error: any) {
      console.error('Error updating booking URL:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update booking URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uniqueLink,
    isLoading,
    handleUpdateBookingUrl,
  };
};