import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TreatmentCategory } from "./treatments/TreatmentCategory";
import { useTreatments } from "./treatments/useTreatments";
import { BusinessType } from "./treatments/types";
import { useState } from "react";

interface TreatmentsTabProps {
  profileId: string;
}

export const TreatmentsTab = ({ profileId }: TreatmentsTabProps) => {
  const [businessType, setBusinessType] = useState<BusinessType>('med_spa');
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

  // Filter treatments based on business type
  const filteredCategories = categories.map(category => ({
    ...category,
    treatments: category.treatments.filter(treatment => 
      !treatment.business_types || treatment.business_types.includes(businessType)
    )
  })).filter(category => category.treatments.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Treatments</CardTitle>
        <div className="mt-4">
          <Select value={businessType} onValueChange={(value: BusinessType) => setBusinessType(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="med_spa">Med Spa</SelectItem>
              <SelectItem value="aesthetician">Aesthetician</SelectItem>
              <SelectItem value="brow_specialist">Brow Specialist</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {filteredCategories.map((category) => (
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