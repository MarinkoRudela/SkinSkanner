import { Checkbox } from "@/components/ui/checkbox";
import { Treatment } from "./types";

interface TreatmentItemProps {
  treatment: Treatment;
  isSelected: boolean;
  onToggle: () => void;
}

export const TreatmentItem = ({ treatment, isSelected, onToggle }: TreatmentItemProps) => {
  return (
    <div className="flex items-start space-x-3">
      <Checkbox
        id={treatment.id}
        checked={isSelected}
        onCheckedChange={onToggle}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={treatment.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {treatment.name}
          {treatment.requires_license && (
            <span className="ml-2 text-xs text-yellow-600">
              (Requires License)
            </span>
          )}
        </label>
        <p className="text-sm text-muted-foreground">
          {treatment.description}
        </p>
      </div>
    </div>
  );
};