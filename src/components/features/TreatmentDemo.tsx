import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Syringe, Sparkles, Zap } from "lucide-react";
import { TreatmentCategory } from './TreatmentCategory';

const TreatmentDemo = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['treatment-categories-demo'],
    queryFn: async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('treatment_categories')
        .select(`
          *,
          treatments (
            id,
            name,
            description,
            requires_license
          )
        `)
        .order('display_order');

      if (categoriesError) throw categoriesError;
      return categoriesData;
    }
  });

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'injectables':
        return Syringe;
      case 'laser treatments':
        return Zap;
      default:
        return Sparkles;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-xl bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-indigo-900 mb-2">
          Available Treatments
        </h3>
        <p className="text-gray-600">
          Configure which treatments you offer to ensure AI recommendations match your services
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {categories?.map((category, index) => {
          const icon = getCategoryIcon(category.name);
          const mappedCategory = {
            category: category.name,
            icon,
            requiresLicense: false,
            treatments: category.treatments?.map(t => ({
              name: t.name,
              description: t.description,
              requiresLicense: t.requires_license
            })) || []
          };

          return (
            <TreatmentCategory
              key={category.id}
              category={mappedCategory}
              selectedTreatments={new Set()}
              onTreatmentToggle={() => {}}
              index={index}
            />
          );
        })}
      </Accordion>

      <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Note:</span> These are the treatments available for configuration in your dashboard
        </div>
      </div>
    </div>
  );
};

export default TreatmentDemo;