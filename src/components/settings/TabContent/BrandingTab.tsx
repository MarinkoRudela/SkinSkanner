import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandingForm } from "../BrandingForm";

interface BrandingTabProps {
  brandName: string;
  logoUrl: string;
  tagline: string;
  onSave: () => void;
}

export const BrandingTab = ({ brandName, logoUrl, tagline, onSave }: BrandingTabProps) => {
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
          onSave={onSave}
        />
      </CardContent>
    </Card>
  );
};