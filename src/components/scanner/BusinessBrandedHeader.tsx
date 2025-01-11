import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Picture } from "@/components/ui/picture";

interface BusinessBrandedHeaderProps {
  brandName: string;
  logoUrl: string;
  tagline: string;
}

export const BusinessBrandedHeader = ({
  brandName,
  logoUrl,
  tagline
}: BusinessBrandedHeaderProps) => {
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    console.error('Failed to load logo');
    setLogoError(true);
  };

  const defaultLogo = "/lovable-uploads/779fe9aa-eef9-453e-b5da-89a3ae847a62.png";

  return (
    <Card className="glass-card p-8 mb-8 text-center">
      <Picture
        src={logoUrl || defaultLogo}
        alt={brandName}
        className="h-32 mx-auto mb-4 object-contain"
        onError={handleLogoError}
        sizes="(max-width: 768px) 100vw, 128px"
        loading="lazy"
      />
      <h1 className="text-2xl font-bold mb-2">{brandName}</h1>
      {tagline && (
        <p className="text-muted-foreground">{tagline}</p>
      )}
    </Card>
  );
};