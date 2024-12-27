import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Header = () => {
  const [brandName, setBrandName] = useState('Skin Scanner AI');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const fetchBranding = async () => {
      // Get business ID from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      const businessId = urlParams.get('business');

      if (businessId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('brand_name, logo_url')
          .eq('id', businessId)
          .single();

        if (!error && data) {
          if (data.brand_name) setBrandName(data.brand_name);
          if (data.logo_url) setLogoUrl(data.logo_url);
        }
      }
    };

    fetchBranding();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      {logoUrl && (
        <img 
          src={logoUrl} 
          alt={brandName} 
          className="h-16 mx-auto mb-4"
        />
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-medspa-800 mb-4">
        {brandName}
      </h1>
      <p className="text-lg text-medspa-600 italic">
        Because radiant skin is just a scan away
      </p>
    </motion.div>
  );
};