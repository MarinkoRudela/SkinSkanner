import { useSelectedTreatments } from './useSelectedTreatments';
import { useTreatmentUpdates } from './useTreatmentUpdates';

export const useTreatmentState = (profileId: string) => {
  const { state, refreshTreatments } = useSelectedTreatments(profileId);
  const { handleTreatmentToggle, handleAreaToggle } = useTreatmentUpdates(profileId, refreshTreatments);

  return {
    selectedTreatments: state.selectedTreatments,
    treatmentAreas: state.treatmentAreas,
    handleTreatmentToggle,
    handleAreaToggle
  };
};