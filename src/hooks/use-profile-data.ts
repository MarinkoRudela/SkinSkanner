import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useProfileData = (session: any) => {
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [tagline, setTagline] = useState('');

  const fetchProfileData = async () => {
    if (!session?.user?.id) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        setBrandName(profile.brand_name || '');
        setLogoUrl(profile.logo_url || '');
        setTagline(profile.tagline || '');
      }
    } catch (error) {
      console.error('Error in fetchProfileData:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfileData();
    }
  }, [session]);

  return {
    brandName,
    logoUrl,
    tagline,
    fetchProfileData
  };
};