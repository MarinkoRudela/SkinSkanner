import { useEffect } from 'react';
import { useVisitorTracking } from '@/hooks/use-visitor-tracking';

interface VisitorTrackerProps {
  shortCode: string;
  profileId: string;
  onVisitIdReceived: (visitId: string) => void;
}

export const VisitorTracker = ({ shortCode, profileId, onVisitIdReceived }: VisitorTrackerProps) => {
  useEffect(() => {
    console.log('Initializing visitor tracking');
    const { visitId } = useVisitorTracking({
      shortCode,
      profileId
    });
    
    if (visitId) {
      console.log('Visit ID received:', visitId);
      onVisitIdReceived(visitId);
    }
  }, [shortCode, profileId, onVisitIdReceived]);

  return null;
};