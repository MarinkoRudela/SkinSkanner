import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { TreatmentWithAreas, TreatmentState } from '../types';
import { toast } from "@/hooks/use-toast";

export const useTreatmentState = (profileId: string) => {
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
          treatments (
            id,
            treatment_areas
          )
        `)
        .eq('profile_id', profileId)
        .eq('is_active', true);

      if (error) throw error;

      const selectedIds = new Set<string>();
      const areas: Record<string, string[]> = {};

      data.forEach((item: TreatmentWithAreas) => {
        if (item.treatment_id) {
          selectedIds.add(item.treatment_id);
          if (item.treatments?.treatment_areas) {
            areas[item.treatment_id] = item.treatments.treatment_areas;
          }
        }
      });

      setState({
        selectedTreatments: selectedIds,
        treatmentAreas: areas
      });
    } catch (error) {
      console.error('Error fetching selected treatments:', error);
    }
  };

  const handleTreatmentToggle = async (treatmentId: string) => {
    const isSelected = state.selectedTreatments.has(treatmentId);
    const newSelectedTreatments = new Set(state.selectedTreatments);
    const newAreas = { ...state.treatmentAreas };

    if (isSelected) {
      newSelectedTreatments.delete(treatmentId);
      delete newAreas[treatmentId];
      
      try {
        const { error } = await supabase
          .from('med_spa_treatments')
          .update({ is_active: false })
          .eq('profile_id', profileId)
          .eq('treatment_id', treatmentId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating treatment:', error);
        toast({
          title: "Error",
          description: "Failed to update treatment",
          variant: "destructive"
        });
        return;
      }
    } else {
      newSelectedTreatments.add(treatmentId);
      newAreas[treatmentId] = [];
      
      try {
        const { error } = await supabase
          .from('med_spa_treatments')
          .upsert({
            profile_id: profileId,
            treatment_id: treatmentId,
            is_active: true
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error updating treatment:', error);
        toast({
          title: "Error",
          description: "Failed to update treatment",
          variant: "destructive"
        });
        return;
      }
    }

    setState({
      selectedTreatments: newSelectedTreatments,
      treatmentAreas: newAreas
    });
    
    toast({
      title: "Success",
      description: `Treatment ${isSelected ? 'removed from' : 'added to'} your services`,
    });
  };

  const handleAreaToggle = async (treatmentId: string, area: string) => {
    const currentAreas = state.treatmentAreas[treatmentId] || [];
    const newAreas = currentAreas.includes(area)
      ? currentAreas.filter(a => a !== area)
      : [...currentAreas, area];

    try {
      const { error } = await supabase
        .from('treatments')
        .update({ treatment_areas: newAreas })
        .eq('id', treatmentId);

      if (error) throw error;

      setState({
        ...state,
        treatmentAreas: {
          ...state.treatmentAreas,
          [treatmentId]: newAreas
        }
      });

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
    selectedTreatments: state.selectedTreatments,
    treatmentAreas: state.treatmentAreas,
    handleTreatmentToggle,
    handleAreaToggle
  };
};