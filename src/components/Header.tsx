import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BrandingData {
  brand_name: string | null;
  logo_url: string | null;
}

export const Header = () => {
  const [branding, setBranding] = useState<BrandingData>({
    brand_name: null,
    logo_url: null,
  });

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        // Use maybeSingle() instead of single() to handle the case where no data exists
        const { data, error } = await supabase
          .from('profiles')
          .select('brand_name, logo_url')
          .maybeSingle();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        // Handle the case where data might be null
        setBranding({
          brand_name: data?.brand_name ?? null,
          logo_url: data?.logo_url ?? null,
        });
      } catch (error: any) {
        console.error('Error fetching branding:', error);
        // Only show toast for actual errors, not for missing data
        if (error.code !== 'PGRST116') {
          toast({
            title: "Error",
            description: "Failed to load branding information",
            variant: "destructive",
          });
        }
      }
    };

    fetchBranding();
  }, []);

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
        Because radiant skin is just a 'skan' away
      </p>
    </div>
  );
};