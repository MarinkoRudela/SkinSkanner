import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Picture } from "@/components/ui/picture";
import { Theme } from "@/types/business";
import { toast } from "@/hooks/use-toast";

interface BusinessBrandedHeaderProps {
  brandName: string;
  logoUrl: string | null;
  tagline: string | null;
  theme?: Theme | null;
}

export const BusinessBrandedHeader = ({
  brandName,
  logoUrl,
  tagline,
  theme
}: BusinessBrandedHeaderProps) => {
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    console.error('Failed to load logo');
    setLogoError(true);
    toast({
      title: "Logo Error",
      description: "Failed to load business logo",
      variant: "destructive"
    });
  };

  const defaultLogo = "/lovable-uploads/779fe9aa-eef9-453e-b5da-89a3ae847a62.png";

  const cardStyle = theme ? {
    background: theme.card_background,
    color: theme.text_color
  } : {};

  return (
    <Card className="glass-card p-8 mb-8 text-center" style={cardStyle}>
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
        <p style={{ color: theme?.text_color }}>{tagline}</p>
      )}
    </Card>
  );
};