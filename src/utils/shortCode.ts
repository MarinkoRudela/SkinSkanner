import { supabase } from "@/integrations/supabase/client";

const RETRY_LIMIT = 5;
const CODE_LENGTH = 6;
const MAX_ATTEMPTS = 3;

const generateRandomCode = (length: number = CODE_LENGTH): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = chars.length;
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

const isCodeUnique = async (code: string): Promise<boolean> => {
  console.log('Checking if code is unique:', code);
  try {
    const { data, error } = await supabase
      .from('business_short_codes')
      .select('short_code')
      .ilike('short_code', code)
      .maybeSingle();

    if (error) {
      console.error('Error checking code uniqueness:', error);
      throw error;
    }

    const isUnique = !data;
    console.log('Code uniqueness result:', isUnique);
    return isUnique;
  } catch (error) {
    console.error('Error in isCodeUnique:', error);
    throw error;
  }
};

const generateUniqueCode = async (): Promise<string> => {
  let attempts = 0;
  
  while (attempts < MAX_ATTEMPTS) {
    const code = generateRandomCode();
    console.log(`Attempt ${attempts + 1}: Generated code ${code}`);
    
    try {
      const isUnique = await isCodeUnique(code);
      if (isUnique) {
        console.log('Successfully generated unique code:', code);
        return code;
      }
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
    }
    
    attempts++;
  }
  
  throw new Error('Failed to generate unique short code after multiple attempts');
};

export const generateShortCode = async (): Promise<string> => {
  console.log('Starting short code generation process');
  let retries = 0;
  
  while (retries < RETRY_LIMIT) {
    try {
      const code = await generateUniqueCode();
      console.log('Successfully generated and validated short code:', code);
      return code;
    } catch (error) {
      console.error(`Retry ${retries + 1} failed:`, error);
      retries++;
      
      if (retries === RETRY_LIMIT) {
        console.error('Exceeded maximum retries for short code generation');
        throw new Error('Unable to generate unique short code. Please try again later.');
      }
    }
  }
  
  throw new Error('Short code generation failed unexpectedly');
};