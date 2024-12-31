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
      // First check if a record exists
      const { data: existingSettings } = await supabase
        .from('business_settings')
        .select('id')
        .eq('profile_id', session.user.id)
        .single();

      if (existingSettings) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('business_settings')
          .update({ booking_url: url })
          .eq('profile_id', session.user.id);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('business_settings')
          .insert([{ profile_id: session.user.id, booking_url: url }]);

        if (insertError) throw insertError;
      }

      // Only call updateBookingUrl if database operation succeeded
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