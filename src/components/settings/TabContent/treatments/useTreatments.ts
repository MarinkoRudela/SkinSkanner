import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TreatmentCategory } from './types';

export const useTreatments = (profileId: string) => {
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<Set<string>>(new Set());
  const [treatmentAreas, setTreatmentAreas] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTreatments();
    fetchSelectedTreatments();
  }, [profileId]);

  const fetchTreatments = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('treatment_categories')
        .select('*')
        .order('display_order');

      if (categoriesError) throw categoriesError;

      const categoriesWithTreatments = await Promise.all(
        categoriesData.map(async (category) => {
          const { data: treatments, error: treatmentsError } = await supabase
            .from('treatments')
            .select('*')
            .eq('category_id', category.id);

          if (treatmentsError) throw treatmentsError;

          return {
            ...category,
            treatments: treatments || []
          };
        })
      );

      setCategories(categoriesWithTreatments);
    } catch (error) {
      console.error('Error fetching treatments:', error);
      toast({
        title: "Error",
        description: "Failed to load treatments",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSelectedTreatments = async () => {
    try {
      const { data, error } = await supabase
        .from('med_spa_treatments')
        .select('treatment_id, treatments(treatment_areas)')
        .eq('profile_id', profileId)
        .eq('is_active', true);

      if (error) throw error;

      const selectedIds = new Set<string>();
      const areas: Record<string, string[]> = {};

      data.forEach(item => {
        selectedIds.add(item.treatment_id);
        if (item.treatments?.treatment_areas) {
          areas[item.treatment_id] = item.treatments.treatment_areas;
        }
      });

      setSelectedTreatments(selectedIds);
      setTreatmentAreas(areas);
    } catch (error) {
      console.error('Error fetching selected treatments:', error);
    }
  };

  const handleTreatmentToggle = async (treatmentId: string) => {
    const isSelected = selectedTreatments.has(treatmentId);
    const newSelectedTreatments = new Set(selectedTreatments);

    if (isSelected) {
      newSelectedTreatments.delete(treatmentId);
      delete treatmentAreas[treatmentId];
      
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
      treatmentAreas[treatmentId] = [];
      
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

    setSelectedTreatments(newSelectedTreatments);
    setTreatmentAreas({ ...treatmentAreas });
    
    toast({
      title: "Success",
      description: `Treatment ${isSelected ? 'removed from' : 'added to'} your services`,
    });
  };

  const handleAreaToggle = async (treatmentId: string, area: string) => {
    const currentAreas = treatmentAreas[treatmentId] || [];
    const newAreas = currentAreas.includes(area)
      ? currentAreas.filter(a => a !== area)
      : [...currentAreas, area];

    try {
      const { error } = await supabase
        .from('treatments')
        .update({ treatment_areas: newAreas })
        .eq('id', treatmentId);

      if (error) throw error;

      setTreatmentAreas({
        ...treatmentAreas,
        [treatmentId]: newAreas
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
    categories,
    selectedTreatments,
    treatmentAreas,
    isLoading,
    handleTreatmentToggle,
    handleAreaToggle
  };
};