import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

    if (!propsBrandName && !propsLogoUrl) {
      fetchBranding();
    } else {
      setBrandName(propsBrandName || "Skin Skanner AI");
      setLogoUrl(propsLogoUrl || "");
    }
  }, [propsBrandName, propsLogoUrl]);

  return (
    <header className="text-center py-12">
      {logoUrl && (
        <img
          src={logoUrl}
          alt={`${brandName} logo`}
          className="h-20 mx-auto mb-6"
        />
      )}
      <h1 className="text-4xl md:text-5xl font-bold text-primary-hover mb-4 bg-clip-text text-transparent purple-gradient">
        {brandName}
      </h1>
      <p className="text-lg text-muted-foreground">
        Because radiant skin is just a "skan" away
      </p>
    </header>
  );
};