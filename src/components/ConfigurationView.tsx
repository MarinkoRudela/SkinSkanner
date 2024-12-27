import { Header } from "./Header";
import { AuthForm } from "./auth/AuthForm";
import { BookingUrlForm } from "./settings/BookingUrlForm";
import { IntegrationGuide } from "./settings/IntegrationGuide";
import { ShareLinks } from "./settings/ShareLinks";
import { BrandingForm } from "./settings/BrandingForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ConfigurationViewProps {
  session: any;
  bookingUrl: string;
  updateBookingUrl: (url: string) => Promise<void>;
}

export const ConfigurationView = ({
  session,
  bookingUrl,
  updateBookingUrl,
}: ConfigurationViewProps) => {
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    if (session?.user?.id) {
      fetchBranding();
    }
  }, [session?.user?.id]);

  const fetchBranding = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('brand_name, logo_url')
      .eq('id', session.user.id)
      .single();

    if (!error && data) {
      setBrandName(data.brand_name || '');
      setLogoUrl(data.logo_url || '');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-medspa-50 to-white">
        <div className="container max-w-md mx-auto px-4 py-8">
          <Header />
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Business Configuration</h2>
      <div className="space-y-6">
        <BrandingForm
          initialBrandName={brandName}
          initialLogoUrl={logoUrl}
          onSave={fetchBranding}
        />
        <BookingUrlForm 
          initialUrl={bookingUrl} 
          onSave={updateBookingUrl} 
        />
        <IntegrationGuide />
        <ShareLinks userId={session.user.id} />
      </div>
    </div>
  );
};