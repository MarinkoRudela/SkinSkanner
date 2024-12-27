import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BrandingFormProps {
  initialBrandName?: string;
  initialLogoUrl?: string;
  onSave: () => void;
}

export const BrandingForm = ({ initialBrandName = '', initialLogoUrl = '', onSave }: BrandingFormProps) => {
  const [brandName, setBrandName] = useState(initialBrandName);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      setLogoUrl(publicUrl);
      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand Name
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Enter your brand name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo
          </label>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Current logo"
              className="h-16 mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-medspa-50 file:text-medspa-700 hover:file:bg-medspa-100"
          />
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || isUploading}
          className="w-full"
        >
          {isSaving ? "Saving..." : "Save Branding"}
        </Button>
      </div>
    </div>
  );
};