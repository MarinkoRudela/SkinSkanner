import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { TreatmentState } from '../types';
import { toast } from "@/hooks/use-toast";

export const useSelectedTreatments = (profileId: string) => {
  const [state, setState] = useState<TreatmentState>({
    selectedTreatments: new Set<string>(),
    treatmentAreas: {}
  });

  useEffect(() => {
    fetchSelectedTreatments();
  }, [profileId]);

  const fetchSelectedTreatments = async () => {
    try {
      const { data, error } = await supabase
        .from('med_spa_treatments')
        .select(`
          treatment_id,
          treatments:treatment_id (
            id,
            treatment_areas
          )
        `)
        .eq('profile_id', profileId)
        .eq('is_active', true);

      if (error) throw error;

      const selectedIds = new Set<string>();
      const areas: Record<string, string[]> = {};

      if (data) {
        data.forEach((item: any) => {
          selectedIds.add(item.treatment_id);
          if (item.treatments?.length > 0 && item.treatments[0].treatment_areas) {
            areas[item.treatment_id] = item.treatments[0].treatment_areas;
          }
        });
      }

      setState({
        selectedTreatments: selectedIds,
        treatmentAreas: areas
      });
    } catch (error) {
      console.error('Error fetching selected treatments:', error);
    }
  };

  return {
    state,
    setState,
    refreshTreatments: fetchSelectedTreatments
  };
};