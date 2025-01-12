import { useTreatmentData } from './hooks/useTreatmentData';
import { useTreatmentState } from './hooks/useTreatmentState';
import { useCallback } from 'react';

export const useTreatments = (profileId: string) => {
  const { categories, isLoading } = useTreatmentData();
  const {
    selectedTreatments,
    treatmentAreas,
    handleTreatmentToggle: baseTreatmentToggle,
    refreshTreatments
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
    refreshTreatments
  };
};