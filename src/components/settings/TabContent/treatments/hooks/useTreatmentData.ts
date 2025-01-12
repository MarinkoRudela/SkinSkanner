import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { TreatmentCategory, CategoryType } from '../types';
import { toast } from "@/hooks/use-toast";

const isValidCategoryType = (type: string): type is CategoryType => {
  return ['injectable', 'skin', 'eyebrow'].includes(type);
};

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
            .select(`
              *,
              category:treatment_categories (
                id,
                name,
                category_type
              )
            `)
            .eq('category_id', category.id);

          if (treatmentsError) throw treatmentsError;

          const categoryType = isValidCategoryType(category.category_type) 
            ? category.category_type 
            : 'skin';

          return {
            ...category,
            category_type: categoryType,
            treatments: treatments || []
          } as TreatmentCategory;
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