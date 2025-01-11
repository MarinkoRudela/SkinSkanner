import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TreatmentItem } from "./TreatmentItem";
import { Treatment } from "./types";
import { Badge } from "@/components/ui/badge";

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
    <AccordionItem key={category.id} value={category.id} className="border-b">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">{category.name}</span>
          <Badge variant="secondary" className="ml-2">
            {category.treatments.length} treatments
          </Badge>
        </div>
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