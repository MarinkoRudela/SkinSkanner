import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
        {categories?.map((category) => (
          <Card key={category.id} className="p-4">
            <h4 className="text-lg font-semibold text-indigo-900 mb-3">
              {category.name}
            </h4>
            <div className="space-y-2">
              {category.treatments?.map((treatment) => (
                <div
                  key={treatment.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/20"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-gray-900">
                        {treatment.name}
                      </h5>
                      {treatment.requires_license && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          License Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {treatment.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
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