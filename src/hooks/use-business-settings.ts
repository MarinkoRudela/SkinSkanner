import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";

export const useBusinessSettings = () => {
  const updateBusinessSettings = async (userId: string, bookingUrl: string) => {
    try {
      // First check if a record exists
      const { data: existingSettings, error: fetchError } = await supabase
        .from('business_settings')
        .select('id')
        .eq('profile_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing settings:', fetchError);
        throw fetchError;
      }

      let error;
      
      if (existingSettings) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('business_settings')
          .update({ booking_url: bookingUrl })
          .eq('profile_id', userId);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('business_settings')
          .insert([{ 
            profile_id: userId, 
            booking_url: bookingUrl 
          }]);
        error = insertError;
      }

      if (error) {
        console.error('Error updating business settings:', error);
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error in updateBusinessSettings:', error);
      throw error;
    }
  };

  return {
    updateBusinessSettings
  };
};