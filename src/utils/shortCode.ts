import { supabase } from "@/integrations/supabase/client";

const RETRY_LIMIT = 3;
const CODE_LENGTH = 6;

const generateRandomCode = (length: number = CODE_LENGTH): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = chars.length;
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

const isCodeUnique = async (code: string): Promise<boolean> => {
  const { data } = await supabase
    .from('business_short_codes')
    .select('short_code')
    .eq('short_code', code)
    .maybeSingle();
    
  return !data;
};

export const generateShortCode = async (): Promise<string> => {
  let attempts = 0;
  
  while (attempts < RETRY_LIMIT) {
    const code = generateRandomCode();
    console.log('Generated code:', code);
    
    try {
      const isUnique = await isCodeUnique(code);
      if (isUnique) {
        console.log('Unique code generated:', code);
        return code;
      }
    } catch (error) {
      console.error('Error checking code uniqueness:', error);
    }
    
    attempts++;
  }
  
  throw new Error('Failed to generate unique short code after multiple attempts');
};