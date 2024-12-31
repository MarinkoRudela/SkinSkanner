import { useState } from "react";
import { toast } from "./use-toast";
import { useShortCode } from "./use-short-code";
import { useBusinessSettings } from "./use-business-settings";

export const useBookingUrl = (
  session: any,
  initialBookingUrl: string,
  updateBookingUrl: (url: string) => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueLink, setUniqueLink] = useState("");
  const { getOrCreateShortCode } = useShortCode();
  const { updateBusinessSettings } = useBusinessSettings();

  const handleUpdateBookingUrl = async (url: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update your booking URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update business settings
      await updateBusinessSettings(session.user.id, url);
      
      // Generate or get existing short code
      const shortCode = await getOrCreateShortCode(session.user.id);
      
      // Create the unique link
      const newUniqueLink = `${window.location.origin}/b/${shortCode}`;
      setUniqueLink(newUniqueLink);
      
      // Update parent state
      await updateBookingUrl(url);
      
      toast({
        title: "Success",
        description: "Booking URL updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating booking URL:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update booking URL",
        variant: "destructive",
      });
      throw error;
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