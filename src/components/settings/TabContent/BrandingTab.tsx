import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandingForm } from "../BrandingForm";

interface BrandingTabProps {
  brandName: string;
  logoUrl: string;
  onSave: () => void;
}

export const BrandingTab = ({ brandName, logoUrl, onSave }: BrandingTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <BrandingForm
          initialBrandName={brandName}
          initialLogoUrl={logoUrl}
          onSave={onSave}
        />
      </CardContent>
    </Card>
  );
};