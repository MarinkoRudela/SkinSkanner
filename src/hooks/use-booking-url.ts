import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";
import { generateShortCode } from "@/utils/shortCode";

export const useBookingUrl = (
  session: any,
  initialBookingUrl: string,
  updateBookingUrl: (url: string) => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueLink, setUniqueLink] = useState("");

  const generateUniqueLink = async (userId: string) => {
    try {
      // First check if user already has a short code
      const { data: existingCode } = await supabase
        .from('business_short_codes')
        .select('short_code')
        .eq('profile_id', userId)
        .maybeSingle();

      if (existingCode?.short_code) {
        const baseUrl = window.location.origin;
        return `${baseUrl}/b/${existingCode.short_code}`;
      }

      // If no existing code, generate a new one
      const shortCode = generateShortCode();
      
      const { error: insertError } = await supabase
        .from('business_short_codes')
        .insert([{
          profile_id: userId,
          short_code: shortCode
        }]);

      if (insertError) {
        console.error('Error creating short code:', insertError);
        // Fallback to using user ID if short code creation fails
        return `${window.location.origin}/b/${userId}`;
      }

      return `${window.location.origin}/b/${shortCode}`;
    } catch (error) {
      console.error('Error generating unique link:', error);
      // Fallback to using user ID
      return `${window.location.origin}/b/${userId}`;
    }
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
      const { data: existingSettings, error: fetchError } = await supabase
        .from('business_settings')
        .select('id')
        .eq('profile_id', session.user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

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

      // Generate unique link with short code
      const newUniqueLink = await generateUniqueLink(session.user.id);
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