import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { TreatmentCategory } from "./TreatmentCategory";
import { useTreatments } from "./useTreatments";
import { useState } from "react";

interface TreatmentsTabProps {
  profileId: string;
}

export const TreatmentsTab = ({ profileId }: TreatmentsTabProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['skin']);
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

  // Filter treatments based on selected categories
  const filteredCategories = categories
    .filter(category => selectedCategories.includes(category.category_type))
    .filter(category => category.treatments.length > 0);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Treatments</CardTitle>
        <div className="mt-4 flex flex-wrap gap-2">
          {['injectable', 'skin', 'eyebrow'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategories.includes(category)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
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