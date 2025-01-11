import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Treatment {
  id: string;
  name: string;
  description: string;
  requires_license: boolean;
}

interface TreatmentCategory {
  id: string;
  name: string;
  description: string;
  treatments: Treatment[];
}

export const TreatmentsTab = ({ profileId }: { profileId: string }) => {
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTreatments();
    fetchSelectedTreatments();
  }, [profileId]);

  const fetchTreatments = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('treatment_categories')
        .select('*')
        .order('display_order');

      if (categoriesError) throw categoriesError;

      const categoriesWithTreatments = await Promise.all(
        categoriesData.map(async (category) => {
          const { data: treatments, error: treatmentsError } = await supabase
            .from('treatments')
            .select('*')
            .eq('category_id', category.id);

          if (treatmentsError) throw treatmentsError;

          return {
            ...category,
            treatments: treatments || []
          };
        })
      );

      setCategories(categoriesWithTreatments);
    } catch (error) {
      console.error('Error fetching treatments:', error);
      toast({
        title: "Error",
        description: "Failed to load treatments",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSelectedTreatments = async () => {
    try {
      const { data, error } = await supabase
        .from('med_spa_treatments')
        .select('treatment_id')
        .eq('profile_id', profileId)
        .eq('is_active', true);

      if (error) throw error;

      setSelectedTreatments(new Set(data.map(item => item.treatment_id)));
    } catch (error) {
      console.error('Error fetching selected treatments:', error);
    }
  };

  const handleTreatmentToggle = async (treatmentId: string) => {
    const isSelected = selectedTreatments.has(treatmentId);
    const newSelectedTreatments = new Set(selectedTreatments);

    if (isSelected) {
      newSelectedTreatments.delete(treatmentId);
      try {
        const { error } = await supabase
          .from('med_spa_treatments')
          .update({ is_active: false })
          .eq('profile_id', profileId)
          .eq('treatment_id', treatmentId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating treatment:', error);
        toast({
          title: "Error",
          description: "Failed to update treatment",
          variant: "destructive"
        });
        return;
      }
    } else {
      newSelectedTreatments.add(treatmentId);
      try {
        const { error } = await supabase
          .from('med_spa_treatments')
          .upsert({
            profile_id: profileId,
            treatment_id: treatmentId,
            is_active: true
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error updating treatment:', error);
        toast({
          title: "Error",
          description: "Failed to update treatment",
          variant: "destructive"
        });
        return;
      }
    }

    setSelectedTreatments(newSelectedTreatments);
    toast({
      title: "Success",
      description: `Treatment ${isSelected ? 'removed from' : 'added to'} your services`,
    });
  };

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
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="text-lg font-semibold">
                {category.name}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <div className="space-y-4">
                  {category.treatments.map((treatment) => (
                    <div key={treatment.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={treatment.id}
                        checked={selectedTreatments.has(treatment.id)}
                        onCheckedChange={() => handleTreatmentToggle(treatment.id)}
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
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};