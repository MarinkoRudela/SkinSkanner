import { TreatmentSelectionSystem } from "./TreatmentSelectionSystem";

interface TreatmentsTabProps {
  profileId: string;
}

export const TreatmentsTab = ({ profileId }: TreatmentsTabProps) => {
  return <TreatmentSelectionSystem profileId={profileId} />;
};