import { Treatment } from './types.ts';

export const fetchMedSpaTreatments = async (supabase: any, profileId: string): Promise<Treatment[]> => {
  const { data: medSpaTreatments, error } = await supabase
    .from('med_spa_treatments')
    .select(`
      treatment_id,
      treatments:treatment_id (
        name,
        description,
        category:category_id (
          name
        ),
        treatment_areas
      )
    `)
    .eq('profile_id', profileId)
    .eq('is_active', true);

  if (error) throw error;
  
  return medSpaTreatments.map((t: any) => ({
    name: t.treatments.name,
    category: t.treatments.category,
    description: t.treatments.description,
    treatment_areas: t.treatments.treatment_areas
  }));
};