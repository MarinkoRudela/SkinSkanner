import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { TreatmentState } from '../types';
import { toast } from "@/hooks/use-toast";

interface TreatmentData {
  treatment_id: string;
  treatments: {
    id: string;
    treatment_areas: string[];
  }[];
}

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
        data.forEach((item: TreatmentData) => {
          selectedIds.add(item.treatment_id);
          // Access the first element of the treatments array if it exists
          if (item.treatments && item.treatments[0]?.treatment_areas) {
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
      toast({
        title: "Error",
        description: "Failed to fetch selected treatments",
        variant: "destructive"
      });
    }
  };

  return {
    state,
    setState,
    refreshTreatments: fetchSelectedTreatments
  };
};