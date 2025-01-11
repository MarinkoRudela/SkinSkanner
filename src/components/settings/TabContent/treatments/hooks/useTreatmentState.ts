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

const useSelectedTreatments = (profileId: string) => {
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

const useTreatmentUpdates = (profileId: string, refreshTreatments: () => Promise<void>) => {
  const handleTreatmentToggle = async (treatmentId: string) => {
    try {
      // First, check if the record exists and get its current state
      const { data: existingData, error: fetchError } = await supabase
        .from('med_spa_treatments')
        .select('is_active')
        .eq('profile_id', profileId)
        .eq('treatment_id', treatmentId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw fetchError;
      }

      const newIsActive = existingData ? !existingData.is_active : true;

      // Use upsert to handle both insert and update cases
      const { error: upsertError } = await supabase
        .from('med_spa_treatments')
        .upsert({
          profile_id: profileId,
          treatment_id: treatmentId,
          is_active: newIsActive
        }, {
          onConflict: 'profile_id,treatment_id',
          ignoreDuplicates: false
        });

      if (upsertError) throw upsertError;

      await refreshTreatments();
      toast({
        title: "Success",
        description: "Treatment updated successfully",
      });
    } catch (error) {
      console.error('Error updating treatment:', error);
      toast({
        title: "Error",
        description: "Failed to update treatment",
        variant: "destructive"
      });
    }
  };

  const handleAreaToggle = async (treatmentId: string, area: string) => {
    try {
      const { data: existingData, error: fetchError } = await supabase
        .from('treatments')
        .select('treatment_areas')
        .eq('id', treatmentId)
        .single();

      if (fetchError) throw fetchError;

      const currentAreas = existingData?.treatment_areas || [];
      const newAreas = currentAreas.includes(area)
        ? currentAreas.filter(a => a !== area)
        : [...currentAreas, area];

      const { error: updateError } = await supabase
        .from('treatments')
        .update({ treatment_areas: newAreas })
        .eq('id', treatmentId);

      if (updateError) throw updateError;

      await refreshTreatments();
      toast({
        title: "Success",
        description: "Treatment areas updated successfully",
      });
    } catch (error) {
      console.error('Error updating treatment areas:', error);
      toast({
        title: "Error",
        description: "Failed to update treatment areas",
        variant: "destructive"
      });
    }
  };

  return {
    handleTreatmentToggle,
    handleAreaToggle
  };
};

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