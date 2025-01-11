import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogoUpload } from "./branding/LogoUpload";
import { BrandNameInput } from "./branding/BrandNameInput";
import { TaglineInput } from "./branding/TaglineInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface BrandingFormProps {
  initialBrandName?: string;
  initialLogoUrl?: string;
  initialTagline?: string;
  initialBusinessType?: string;
  onSave: () => void;
}

export const BrandingForm = ({ 
  initialBrandName = '', 
  initialLogoUrl = '',
  initialTagline = '',
  initialBusinessType = 'med_spa',
  onSave 
}: BrandingFormProps) => {
  const [brandName, setBrandName] = useState(initialBrandName);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [tagline, setTagline] = useState(initialTagline);
  const [businessType, setBusinessType] = useState(initialBusinessType);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          brand_name: brandName,
          logo_url: logoUrl,
          tagline: tagline,
          business_type: businessType,
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
        <TaglineInput
          tagline={tagline}
          onChange={setTagline}
        />
        <div className="space-y-2">
          <label htmlFor="businessType" className="text-sm font-medium text-gray-700">
            Business Type
          </label>
          <Select value={businessType} onValueChange={setBusinessType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="med_spa">Medical Spa</SelectItem>
              <SelectItem value="aesthetician">Aesthetician</SelectItem>
              <SelectItem value="brow_specialist">Brow Specialist</SelectItem>
            </SelectContent>
          </Select>
        </div>
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