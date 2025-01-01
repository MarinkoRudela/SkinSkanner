import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TaglineInputProps {
  tagline: string;
  onChange: (value: string) => void;
}

export const TaglineInput = ({ tagline, onChange }: TaglineInputProps) => {
  return (
    <div>
      <Label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
        Tagline
      </Label>
      <Input
        id="tagline"
        type="text"
        value={tagline}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your custom tagline"
      />
    </div>
  );
};