import { BrandingLogo } from "./branding/BrandingLogo";
import { BrandingInfo } from "./branding/BrandingInfo";
import { useBranding } from "@/hooks/useBranding";

export const Header = () => {
  const { branding, isLoading } = useBranding();

  return (
    <div className="text-center mb-8">
      <BrandingLogo
        logoUrl={branding.logo_url}
        brandName={branding.brand_name}
        isLoading={isLoading}
      />
      <BrandingInfo
        brandName={branding.brand_name}
        tagline={branding.tagline}
        isLoading={isLoading}
      />
    </div>
  );
};