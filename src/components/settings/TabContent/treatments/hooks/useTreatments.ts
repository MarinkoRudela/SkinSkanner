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
  } = useTreatmentState(profileId);

  const handleTreatmentToggle = useCallback(async (treatmentId: string) => {
    await baseTreatmentToggle(treatmentId);
  }, [profileId, baseTreatmentToggle]);

  return {
    categories,
    selectedTreatments,
    treatmentAreas,
    isLoading,
    handleTreatmentToggle,
  };
};