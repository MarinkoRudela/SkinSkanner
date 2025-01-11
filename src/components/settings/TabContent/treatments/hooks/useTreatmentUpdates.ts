import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useTreatmentUpdates = (profileId: string, refreshTreatments: () => Promise<void>) => {
  const handleTreatmentToggle = async (treatmentId: string) => {
    try {
      const { error } = await supabase
        .from('med_spa_treatments')
        .upsert({
          profile_id: profileId,
          treatment_id: treatmentId,
          is_active: true
        });

      if (error) throw error;

      await refreshTreatments();
      toast({
        title: "Success",
        description: "Treatment updated successfully",
      });
    } catch (error) {
      console.error('Error updating treatment:', error);
      toast({
        title: "Error",
        description: "Failed to update treatment",
        variant: "destructive"
      });
    }
  };

  const handleAreaToggle = async (treatmentId: string, area: string) => {
    try {
      const { data: existingData, error: fetchError } = await supabase
        .from('treatments')
        .select('treatment_areas')
        .eq('id', treatmentId)
        .single();

      if (fetchError) throw fetchError;

      const currentAreas = existingData?.treatment_areas || [];
      const newAreas = currentAreas.includes(area)
        ? currentAreas.filter(a => a !== area)
        : [...currentAreas, area];

      const { error: updateError } = await supabase
        .from('treatments')
        .update({ treatment_areas: newAreas })
        .eq('id', treatmentId);

      if (updateError) throw updateError;

      await refreshTreatments();
      toast({
        title: "Success",
        description: "Treatment areas updated successfully",
      });
    } catch (error) {
      console.error('Error updating treatment areas:', error);
      toast({
        title: "Error",
        description: "Failed to update treatment areas",
        variant: "destructive"
      });
    }
  };

  return {
    handleTreatmentToggle,
    handleAreaToggle
  };
};