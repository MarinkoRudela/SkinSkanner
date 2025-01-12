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
            treatment_areas,
            category_id,
            business_types,
            category:treatment_categories (
              id,
              name,
              category_type
            )
          ),
          expertise_areas
        `)
        .eq('profile_id', profileId)
        .eq('is_active', true);

      if (error) throw error;

      const selectedIds = new Set<string>();
      const areas: Record<string, string[]> = {};

      if (data) {
        (data as RawTreatmentData[]).forEach((item) => {
          selectedIds.add(item.treatment_id);
          if (item.expertise_areas) {
            areas[item.treatment_id] = item.expertise_areas;
          }
          if (item.treatments?.category?.category_type) {
            item.treatments.category.category_type = validateCategoryType(
              item.treatments.category.category_type
            );
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

  const handleTreatmentToggle = async (treatmentId: string) => {
    const newSelectedTreatments = new Set(state.selectedTreatments);
    if (newSelectedTreatments.has(treatmentId)) {
      newSelectedTreatments.delete(treatmentId);
      
      // Delete the treatment record
      const { error } = await supabase
        .from('med_spa_treatments')
        .delete()
        .eq('profile_id', profileId)
        .eq('treatment_id', treatmentId);
        
      if (error) throw error;
    } else {
      newSelectedTreatments.add(treatmentId);
      
      // Insert new treatment record
      const { error } = await supabase
        .from('med_spa_treatments')
        .insert({
          profile_id: profileId,
          treatment_id: treatmentId,
          is_active: true,
          expertise_areas: []
        });
        
      if (error) throw error;
    }
    
    setState(prev => ({
      ...prev,
      selectedTreatments: newSelectedTreatments
    }));
  };

  const handleAreaToggle = async (treatmentId: string, area: string) => {
    const currentAreas = state.treatmentAreas[treatmentId] || [];
    const newAreas = currentAreas.includes(area)
      ? currentAreas.filter(a => a !== area)
      : [...currentAreas, area];
    
    // Update expertise areas in database
    const { error } = await supabase
      .from('med_spa_treatments')
      .update({ expertise_areas: newAreas })
      .eq('profile_id', profileId)
      .eq('treatment_id', treatmentId);
      
    if (error) throw error;
    
    setState(prev => ({
      ...prev,
      treatmentAreas: {
        ...prev.treatmentAreas,
        [treatmentId]: newAreas
      }
    }));
  };

  return {
    selectedTreatments: state.selectedTreatments,
    treatmentAreas: state.treatmentAreas,
    handleTreatmentToggle,
    handleAreaToggle,
    refreshTreatments: fetchSelectedTreatments
  };
};