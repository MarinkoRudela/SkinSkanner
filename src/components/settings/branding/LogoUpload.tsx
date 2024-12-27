import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LogoUploadProps {
  initialLogoUrl?: string;
  onLogoChange: (url: string) => void;
}

export const LogoUpload = ({ initialLogoUrl = '', onLogoChange }: LogoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      onLogoChange(publicUrl);
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

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Logo
      </label>
      {initialLogoUrl && (
        <img
          src={initialLogoUrl}
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
  );
};