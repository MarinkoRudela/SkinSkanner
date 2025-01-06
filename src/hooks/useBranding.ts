import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BrandingData {
  brand_name: string | null;
  logo_url: string | null;
  tagline: string | null;
}

export const useBranding = () => {
  const [branding, setBranding] = useState<BrandingData>({
    brand_name: null,
    logo_url: null,
    tagline: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchBranding = useCallback(async (signal: AbortSignal) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('brand_name, logo_url, tagline')
          .eq('id', session.session.user.id)
          .abortSignal(signal)
          .maybeSingle();

        if (error) {
          throw error;
        }
        
        setBranding({
          brand_name: data?.brand_name ?? null,
          logo_url: data?.logo_url ?? null,
          tagline: data?.tagline ?? null,
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching branding:', error);
        if (error.code !== 'PGRST116') {
          toast({
            title: "Error",
            description: "Failed to load branding information",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchBranding(abortController.signal);

    const channel = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          console.log('Branding updated:', payload);
          fetchBranding(abortController.signal);
        }
      )
      .subscribe();

    return () => {
      abortController.abort();
      channel.unsubscribe();
    };
  }, [fetchBranding]);

  return { branding, isLoading };
};