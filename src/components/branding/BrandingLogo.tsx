import { useState } from "react";

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

  return logoUrl ? (
    <img
      src={logoUrl}
      alt={brandName || "Business Logo"}
      className="mx-auto mb-4 h-80 w-auto"
      onError={handleLogoError}
    />
  ) : (
    <img
      src="/lovable-uploads/56380414-6671-46a7-99f4-723c10622c30.png"
      alt="Skin Skanner AI"
      className="mx-auto mb-4 h-80 w-auto"
      onError={handleLogoError}
    />
  );
};