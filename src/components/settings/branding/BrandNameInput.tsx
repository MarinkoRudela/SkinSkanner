import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BrandNameInputProps {
  brandName: string;
  onChange: (value: string) => void;
}

export const BrandNameInput = ({ brandName, onChange }: BrandNameInputProps) => {
  return (
    <div>
      <Label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
        Brand Name
      </Label>
      <Input
        id="brandName"
        type="text"
        value={brandName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your brand name"
      />
    </div>
  );
};