import { useTreatmentData } from './hooks/useTreatmentData';
import { useTreatmentState } from './hooks/useTreatmentState';

export const useTreatments = (profileId: string) => {
  const { categories, isLoading } = useTreatmentData();
  const {
    selectedTreatments,
    treatmentAreas,
    handleTreatmentToggle,
    handleAreaToggle
  } = useTreatmentState(profileId);

  return {
    categories,
    selectedTreatments,
    treatmentAreas,
    isLoading,
    handleTreatmentToggle,
    handleAreaToggle
  };
};