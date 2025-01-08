import { useEffect } from 'react';
import { useVisitorTracking } from '@/hooks/use-visitor-tracking';

interface VisitorTrackerProps {
  shortCode: string;
  profileId: string;
  onVisitIdReceived: (visitId: string) => void;
}

export const VisitorTracker = ({ shortCode, profileId, onVisitIdReceived }: VisitorTrackerProps) => {
  // Move hook to top level for proper React hooks compliance
  const { visitId } = useVisitorTracking({
    shortCode,
    profileId
  });
  
  useEffect(() => {
    if (visitId) {
      console.log('Visit ID received:', visitId);
      onVisitIdReceived(visitId);
    }
  }, [visitId, onVisitIdReceived]);

  return null;
};