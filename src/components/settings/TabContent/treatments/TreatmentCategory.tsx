import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TreatmentItem } from "./TreatmentItem";
import { Treatment } from "./types";

interface TreatmentCategoryProps {
  category: {
    id: string;
    name: string;
    description: string;
    treatments: Treatment[];
  };
  selectedTreatments: Set<string>;
  onTreatmentToggle: (treatmentId: string) => Promise<void>;
  treatmentAreas: Record<string, string[]>;
  onAreaToggle: (treatmentId: string, area: string) => Promise<void>;
}

export const TreatmentCategory = ({
  category,
  selectedTreatments,
  onTreatmentToggle,
  treatmentAreas,
  onAreaToggle
}: TreatmentCategoryProps) => {
  return (
    <AccordionItem key={category.id} value={category.id}>
      <AccordionTrigger className="text-lg font-semibold">
        {category.name}
      </AccordionTrigger>
      <AccordionContent>
        <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
        <div className="space-y-4">
          {category.treatments.map((treatment) => (
            <TreatmentItem
              key={treatment.id}
              treatment={treatment}
              isSelected={selectedTreatments.has(treatment.id)}
              onToggle={() => onTreatmentToggle(treatment.id)}
              onAreaToggle={(area) => onAreaToggle(treatment.id, area)}
              selectedAreas={treatmentAreas[treatment.id] || []}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};