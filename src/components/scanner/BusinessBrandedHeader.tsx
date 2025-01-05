import { Card } from "@/components/ui/card";
import { useState } from "react";

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

  return (
    <Card className="glass-card p-8 mb-8 text-center">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={brandName}
          className="h-16 mx-auto mb-4 object-contain"
          onError={handleLogoError}
        />
      ) : (
        <img
          src="/lovable-uploads/779fe9aa-eef9-453e-b5da-89a3ae847a62.png"
          alt="Skin Skanner AI"
          className="h-16 mx-auto mb-4 object-contain"
          onError={handleLogoError}
        />
      )}
      <h1 className="text-2xl font-bold mb-2">{brandName}</h1>
      {tagline && (
        <p className="text-muted-foreground">{tagline}</p>
      )}
    </Card>
  );
};