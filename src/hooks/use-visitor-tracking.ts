import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface VisitorData {
  shortCode: string;
  profileId: string;
}

export const useVisitorTracking = ({ shortCode, profileId }: VisitorData) => {
  const [visitId, setVisitId] = useState<string | null>(null);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Generate or retrieve visitor ID from localStorage
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = uuidv4();
          localStorage.setItem('visitor_id', visitorId);
        }

        // Get basic device/browser info
        const userAgent = window.navigator.userAgent;
        const deviceType = /Mobile|Tablet|iPad|iPhone|Android/.test(userAgent) 
          ? 'mobile' 
          : 'desktop';
        const browser = getBrowserInfo(userAgent);

        // Record the visit
        const { data, error } = await supabase
          .from('link_analytics')
          .insert({
            short_code: shortCode,
            profile_id: profileId,
            visitor_id: visitorId,
            device_type: deviceType,
            browser: browser,
            visit_timestamp: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (error) {
          console.error('Error tracking visit:', error);
          return;
        }

        setVisitId(data.id);
      } catch (error) {
        console.error('Error in visit tracking:', error);
      }
    };

    // Only track visit if we have both required parameters
    if (shortCode && profileId) {
      trackVisit();
    }
  }, [shortCode, profileId]);

  return { visitId };
};

// Helper function to determine browser
const getBrowserInfo = (userAgent: string): string => {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Other';
};