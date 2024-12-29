import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  brandName?: string;
  logoUrl?: string;
}

export const Header = ({ brandName: propsBrandName, logoUrl: propsLogoUrl }: HeaderProps) => {
  const [brandName, setBrandName] = useState<string>("Skin Skanner AI");
  const [logoUrl, setLogoUrl] = useState<string>("");

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('brand_name, logo_url')
          .maybeSingle();

        if (error) {
          console.error('Error fetching branding:', error);
          return;
        }

        if (profile) {
          setBrandName(profile.brand_name || "Skin Skanner AI");
          setLogoUrl(profile.logo_url || "");
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // If no props are provided, fetch from Supabase
    if (!propsBrandName && !propsLogoUrl) {
      fetchBranding();
    } else {
      // Use props if provided
      setBrandName(propsBrandName || "Skin Skanner AI");
      setLogoUrl(propsLogoUrl || "");
    }
  }, [propsBrandName, propsLogoUrl]);

  return (
    <header className="text-center py-8">
      {logoUrl && (
        <img
          src={logoUrl}
          alt={`${brandName} logo`}
          className="h-16 mx-auto mb-4"
        />
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-medspa-800 mb-4">
        {brandName}
      </h1>
      <p className="text-lg text-medspa-600 italic">
        Because radiant skin is just a scan away
      </p>
    </header>
  );
};