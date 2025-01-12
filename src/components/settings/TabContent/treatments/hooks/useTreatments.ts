import { useTreatmentData } from './useTreatmentData';
import { useTreatmentState } from './useTreatmentState';
import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useTreatments = (profileId: string) => {
  const { categories, isLoading } = useTreatmentData();
  const {
    selectedTreatments,
    treatmentAreas,
    handleTreatmentToggle: baseTreatmentToggle,
    handleAreaToggle: baseAreaToggle,
  } = useTreatmentState(profileId);

  const handleTreatmentToggle = useCallback(async (treatmentId: string) => {
    await baseTreatmentToggle(treatmentId);
    
    // Update the treatment expertise areas in the database
    const { error } = await supabase
      .from('med_spa_treatments')
      .update({ 
        expertise_areas: treatmentAreas[treatmentId] || [] 
      })
      .eq('treatment_id', treatmentId)
      .eq('profile_id', profileId);

    if (error) throw error;
  }, [profileId, treatmentAreas, baseTreatmentToggle]);

  const handleAreaToggle = useCallback(async (treatmentId: string, area: string) => {
    await baseAreaToggle(treatmentId, area);
  }, [baseAreaToggle]);

  return {
    categories,
    selectedTreatments,
    treatmentAreas,
    isLoading,
    handleTreatmentToggle,
    handleAreaToggle
  };
};