import { useState, useEffect } from "react";
import { toast } from "./use-toast";
import { useShortCode } from "./use-short-code";
import { useBusinessSettings } from "./use-business-settings";
import { supabase } from "@/integrations/supabase/client";

export const useBookingUrl = (
  session: any,
  initialBookingUrl: string,
  updateBookingUrl: (url: string) => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueLink, setUniqueLink] = useState("");
  const { getOrCreateShortCode } = useShortCode();
  const { updateBusinessSettings } = useBusinessSettings();

  // Fetch existing short code on mount
  useEffect(() => {
    const fetchExistingShortCode = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('business_short_codes')
          .select('short_code')
          .eq('profile_id', session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (data?.short_code) {
          // Properly construct the URL without adding extra colons
          const baseUrl = window.location.origin;
          const newUniqueLink = `${baseUrl}/b/${data.short_code}`;
          setUniqueLink(newUniqueLink);
        }
      } catch (error) {
        console.error('Error fetching existing short code:', error);
      }
    };

    fetchExistingShortCode();
  }, [session?.user?.id]);

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
      
      // Create the unique link with proper URL construction
      const baseUrl = window.location.origin;
      const newUniqueLink = `${baseUrl}/b/${shortCode}`;
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