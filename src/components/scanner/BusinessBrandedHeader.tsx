import { Card } from "@/components/ui/card";

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
  return (
    <Card className="glass-card p-8 mb-8 text-center">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={brandName}
          className="h-20 mx-auto mb-4 object-contain"
        />
      ) : (
        <img
          src="/logo.png"
          alt="Skin Skanner AI"
          className="h-24 mx-auto mb-4 object-contain"
        />
      )}
      <h1 className="text-2xl font-bold mb-2">{brandName}</h1>
      {tagline && (
        <p className="text-muted-foreground">{tagline}</p>
      )}
    </Card>
  );
};