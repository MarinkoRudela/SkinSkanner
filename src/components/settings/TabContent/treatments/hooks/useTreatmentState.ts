import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { TreatmentState, TreatmentData, RawTreatmentData } from '../types';
import { toast } from "@/hooks/use-toast";
import { validateCategoryType } from '@/utils/categoryTypeValidation';

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
          treatments:treatment_id (
            id,
            name,
            description,
            requires_license,
            category_id,
            business_types,
            category:treatment_categories (
              id,
              name,
              category_type
            )
          )
        `)
        .eq('profile_id', profileId)
        .eq('is_active', true);

      if (error) throw error;

      const selectedIds = new Set<string>();

      if (data) {
        (data as RawTreatmentData[]).forEach((item) => {
          selectedIds.add(item.treatment_id);
          if (item.treatments?.category?.category_type) {
            item.treatments.category.category_type = validateCategoryType(
              item.treatments.category.category_type
            );
          }
        });
      }

      setState({
        selectedTreatments: selectedIds,
        treatmentAreas: {}
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

  const handleTreatmentToggle = async (treatmentId: string) => {
    try {
      const isCurrentlySelected = state.selectedTreatments.has(treatmentId);
      console.log('Toggling treatment:', treatmentId, 'Currently selected:', isCurrentlySelected);

      // Upsert the treatment record with is_active flag
      const { error } = await supabase
        .from('med_spa_treatments')
        .upsert({
          profile_id: profileId,
          treatment_id: treatmentId,
          is_active: !isCurrentlySelected,
        }, {
          onConflict: 'profile_id,treatment_id'
        });

      if (error) {
        console.error('Error in handleTreatmentToggle:', error);
        throw error;
      }

      // Update local state
      const newSelectedTreatments = new Set(state.selectedTreatments);
      if (isCurrentlySelected) {
        newSelectedTreatments.delete(treatmentId);
      } else {
        newSelectedTreatments.add(treatmentId);
      }
      
      setState(prev => ({
        ...prev,
        selectedTreatments: newSelectedTreatments
      }));

      console.log('Treatment toggle successful');
    } catch (error) {
      console.error('Error toggling treatment:', error);
      throw error;
    }
  };

  return {
    selectedTreatments: state.selectedTreatments,
    treatmentAreas: state.treatmentAreas,
    handleTreatmentToggle,
    refreshTreatments: fetchSelectedTreatments
  };
};