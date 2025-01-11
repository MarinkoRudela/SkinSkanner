import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandingForm } from "../BrandingForm";

interface BrandingTabProps {
  session: any;
  brandName: string;
  logoUrl: string;
  tagline: string;
  businessType: string;
  onSave: () => void;
}

export const BrandingTab = ({ 
  session, 
  brandName, 
  logoUrl, 
  tagline,
  businessType, 
  onSave 
}: BrandingTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <BrandingForm
          initialBrandName={brandName}
          initialLogoUrl={logoUrl}
          initialTagline={tagline}
          initialBusinessType={businessType}
          onSave={onSave}
        />
      </CardContent>
    </Card>
  );
};