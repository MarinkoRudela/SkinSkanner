import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";

export const useBookingUrl = (
  session: any,
  initialBookingUrl: string,
  updateBookingUrl: (url: string) => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueLink, setUniqueLink] = useState("");

  const generateUniqueLink = (userId: string, bookingUrl: string) => {
    // Create a unique link using the user's ID and booking URL
    const baseUrl = window.location.origin;
    return `${baseUrl}?business=${userId}`;
  };

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
      // First check if a record exists
      const { data: existingSettings } = await supabase
        .from('business_settings')
        .select('id')
        .eq('profile_id', session.user.id)
        .single();

      let error;
      
      if (existingSettings) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('business_settings')
          .update({ booking_url: url })
          .eq('profile_id', session.user.id);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('business_settings')
          .insert([{ 
            profile_id: session.user.id, 
            booking_url: url 
          }]);
        error = insertError;
      }

      if (error) throw error;

      // Update local state and generate unique link
      const newUniqueLink = generateUniqueLink(session.user.id, url);
      setUniqueLink(newUniqueLink);
      
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