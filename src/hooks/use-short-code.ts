import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateShortCode } from "@/utils/shortCode";
import { toast } from "@/hooks/use-toast";

export const useShortCode = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const getOrCreateShortCode = async (userId: string): Promise<string> => {
    try {
      setIsGenerating(true);
      console.log('Checking for existing short code for user:', userId);
      
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
        console.log('Found existing short code:', existingCode.short_code);
        return existingCode.short_code;
      }

      // Generate new unique code
      console.log('Generating new short code');
      const shortCode = await generateShortCode();
      
      // Insert new code
      const { error: insertError } = await supabase
        .from('business_short_codes')
        .insert([{
          profile_id: userId,
          short_code: shortCode
        }]);

      if (insertError) {
        console.error('Error creating short code:', insertError);
        toast({
          title: "Error",
          description: "Failed to create short code. Please try again.",
          variant: "destructive"
        });
        throw insertError;
      }

      console.log('Successfully created new short code:', shortCode);
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