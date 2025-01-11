import { useState } from "react";
import { Picture } from "@/components/ui/picture";

interface BrandingLogoProps {
  logoUrl: string | null;
  brandName: string | null;
  isLoading: boolean;
}

export const BrandingLogo = ({ logoUrl, brandName, isLoading }: BrandingLogoProps) => {
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    console.error('Failed to load logo');
    setLogoError(true);
  };

  if (isLoading) {
    return (
      <div className="h-80 w-80 mx-auto mb-4 bg-gray-100 animate-pulse rounded-full" />
    );
  }

  const defaultLogo = "/lovable-uploads/56380414-6671-46a7-99f4-723c10622c30.png";
  const imgSrc = logoUrl || defaultLogo;

  return (
    <Picture
      src={imgSrc}
      alt={brandName || "Business Logo"}
      className="mx-auto mb-4 h-80 w-auto"
      onError={handleLogoError}
      sizes="(max-width: 768px) 100vw, 320px"
      loading="lazy"
    />
  );
};