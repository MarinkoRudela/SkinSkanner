import { Header } from "./Header";
import { AuthForm } from "./auth/AuthForm";
import { BookingUrlForm } from "./settings/BookingUrlForm";
import { IntegrationGuide } from "./settings/IntegrationGuide";
import { ShareLinks } from "./settings/ShareLinks";
import { BrandingForm } from "./settings/BrandingForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  const [uniqueLink, setUniqueLink] = useState('');

  useEffect(() => {
    if (session?.user?.id) {
      fetchBranding();
      generateUniqueLink();
    }
  }, [session?.user?.id, bookingUrl]);

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

  const generateUniqueLink = () => {
    if (bookingUrl && session?.user?.id) {
      const baseUrl = window.location.origin;
      const link = `${baseUrl}?business=${session.user.id}`;
      setUniqueLink(link);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uniqueLink);
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Business Dashboard</h2>
      
      <Tabs defaultValue="booking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="booking">Booking Settings</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Booking Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BookingUrlForm 
                initialUrl={bookingUrl} 
                onSave={updateBookingUrl}
              />
              
              {bookingUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Your Unique Booking Link</h3>
                  <div className="flex gap-2">
                    <Input value={uniqueLink} readOnly />
                    <Button onClick={copyToClipboard} variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share this link with your clients to let them book appointments through your customized scanner.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <BrandingForm
                initialBrandName={brandName}
                initialLogoUrl={logoUrl}
                onSave={fetchBranding}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>Integration Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <IntegrationGuide />
              <ShareLinks userId={session.user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};