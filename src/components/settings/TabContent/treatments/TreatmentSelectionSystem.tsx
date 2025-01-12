import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { TreatmentCategory } from "./TreatmentCategory";
import { useTreatments } from "./useTreatments";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface TreatmentSelectionSystemProps {
  profileId: string;
}

export const TreatmentSelectionSystem = ({ profileId }: TreatmentSelectionSystemProps) => {
  const { 
    categories, 
    selectedTreatments,
    isLoading, 
    handleTreatmentToggle,
  } = useTreatments(profileId);

  const handleTreatmentChange = async (treatmentId: string) => {
    try {
      await handleTreatmentToggle(treatmentId);
      toast({
        title: "Treatment updated",
        description: "Your treatment selection has been saved.",
      });
    } catch (error) {
      console.error('Error updating treatment:', error);
      toast({
        title: "Error",
        description: "Failed to update treatment selection.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading treatments...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Available Treatments</span>
          <Badge variant="secondary">
            {selectedTreatments.size} Selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {categories.map((category) => (
            <TreatmentCategory
              key={category.id}
              category={category}
              selectedTreatments={selectedTreatments}
              onTreatmentToggle={handleTreatmentChange}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};