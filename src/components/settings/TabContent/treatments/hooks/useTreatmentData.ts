import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { TreatmentCategory } from '../types';
import { toast } from "@/hooks/use-toast";

export const useTreatmentData = () => {
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchTreatments();
  }, []);

  return { categories, isLoading };
};