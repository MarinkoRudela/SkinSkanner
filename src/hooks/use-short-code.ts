import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateShortCode } from "@/utils/shortCode";

export const useShortCode = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const getOrCreateShortCode = async (userId: string): Promise<string> => {
    try {
      setIsGenerating(true);
      
      // First check if user already has a short code
      const { data: existingCode, error: fetchError } = await supabase
        .from('business_short_codes')
        .select('short_code')
        .eq('profile_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing code:', fetchError);
        throw fetchError;
      }

      // If existing code found, return it
      if (existingCode?.short_code) {
        return existingCode.short_code;
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
        throw insertError;
      }

      return shortCode;
    } catch (error) {
      console.error('Error managing short code:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    getOrCreateShortCode
  };
};