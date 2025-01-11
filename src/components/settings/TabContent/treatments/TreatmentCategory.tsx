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
}

export const TreatmentCategory = ({
  category,
  selectedTreatments,
  onTreatmentToggle
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
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};