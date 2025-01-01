import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BrandingData {
  brand_name: string | null;
  logo_url: string | null;
  tagline: string | null;
}

export const Header = () => {
  const [branding, setBranding] = useState<BrandingData>({
    brand_name: null,
    logo_url: null,
    tagline: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchBranding = useCallback(async (signal: AbortSignal) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('brand_name, logo_url, tagline')
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
    } catch (error: any) {
      // Only show toast for actual errors, not for aborted requests
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

    return () => {
      abortController.abort();
    };
  }, [fetchBranding]);

  if (isLoading) {
    return (
      <div className="text-center mb-8">
        <div className="h-16 w-16 mx-auto mb-4 bg-gray-100 animate-pulse rounded-full"></div>
        <div className="h-8 w-48 mx-auto mb-2 bg-gray-100 animate-pulse rounded"></div>
        <div className="h-4 w-64 mx-auto bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="text-center mb-8">
      {branding.logo_url && (
        <img
          src={branding.logo_url}
          alt="Business Logo"
          className="mx-auto mb-4 h-16 w-auto"
        />
      )}
      <h1 className="text-4xl font-bold text-indigo-900 mb-2">
        {branding.brand_name || "Skin Skanner AI"}
      </h1>
      <p className="text-lg text-indigo-700">
        {branding.tagline || "Because radiant skin is just a 'skan' away"}
      </p>
    </div>
  );
};