import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PlanSelectionProps {
  planType: string;
  setPlanType: (value: string) => void;
}

export const PlanSelection = ({ planType, setPlanType }: PlanSelectionProps) => {
  return (
    <div className="mb-6 space-y-4">
      <RadioGroup
        defaultValue="monthly"
        value={planType}
        onValueChange={setPlanType}
        className="grid grid-cols-1 gap-4"
      >
        <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
          <RadioGroupItem value="monthly" id="monthly" />
          <Label htmlFor="monthly" className="cursor-pointer">
            <div className="font-semibold">Monthly Plan</div>
            <div className="text-sm text-gray-500">$99/month</div>
            <div className="text-xs text-green-600">30-day free trial</div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
          <RadioGroupItem value="yearly" id="yearly" />
          <Label htmlFor="yearly" className="cursor-pointer">
            <div className="font-semibold">Yearly Plan</div>
            <div className="text-sm text-gray-500">$799/year</div>
            <div className="text-xs text-green-600">Save $389/year</div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
          <RadioGroupItem value="lifetime" id="lifetime" />
          <Label htmlFor="lifetime" className="cursor-pointer">
            <div className="font-semibold">Lifetime Access</div>
            <div className="text-sm text-gray-500">$1999 one-time</div>
            <div className="text-xs text-green-600">Best long-term value</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};