import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogoUpload } from "./branding/LogoUpload";
import { BrandNameInput } from "./branding/BrandNameInput";

interface BrandingFormProps {
  initialBrandName?: string;
  initialLogoUrl?: string;
  onSave: () => void;
}

export const BrandingForm = ({ 
  initialBrandName = '', 
  initialLogoUrl = '', 
  onSave 
}: BrandingFormProps) => {
  const [brandName, setBrandName] = useState(initialBrandName);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          brand_name: brandName,
          logo_url: logoUrl,
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Branding settings saved successfully",
      });
      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Branding Settings</h3>
      <div className="space-y-4">
        <BrandNameInput 
          brandName={brandName}
          onChange={setBrandName}
        />
        <LogoUpload 
          initialLogoUrl={logoUrl}
          onLogoChange={setLogoUrl}
        />
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? "Saving..." : "Save Branding"}
        </Button>
      </div>
    </div>
  );
};