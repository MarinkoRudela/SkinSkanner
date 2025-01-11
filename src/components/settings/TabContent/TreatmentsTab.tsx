import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { TreatmentCategory } from "./treatments/TreatmentCategory";
import { useTreatments } from "./treatments/useTreatments";

interface TreatmentsTabProps {
  profileId: string;
}

export const TreatmentsTab = ({ profileId }: TreatmentsTabProps) => {
  const { 
    categories, 
    selectedTreatments, 
    treatmentAreas,
    isLoading, 
    handleTreatmentToggle,
    handleAreaToggle 
  } = useTreatments(profileId);

  if (isLoading) {
    return <div>Loading treatments...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Treatments</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {categories.map((category) => (
            <TreatmentCategory
              key={category.id}
              category={category}
              selectedTreatments={selectedTreatments}
              onTreatmentToggle={handleTreatmentToggle}
              treatmentAreas={treatmentAreas}
              onAreaToggle={handleAreaToggle}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};