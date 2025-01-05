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
          className="h-20 mx-auto mb-4 object-contain"
          onError={handleLogoError}
        />
      ) : (
        <img
          src="/lovable-uploads/cd10fb62-a904-4fa5-bacc-19f3ec61ed55.png"
          alt="Skin Skanner AI"
          className="h-24 mx-auto mb-4 object-contain"
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