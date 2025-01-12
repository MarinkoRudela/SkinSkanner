import { CategoryType } from '@/components/settings/TabContent/treatments/types';

const validCategoryTypes: CategoryType[] = ['injectable', 'skin', 'eyebrow'];

export const isValidCategoryType = (type: string | null | undefined): type is CategoryType => {
  return typeof type === 'string' && validCategoryTypes.includes(type as CategoryType);
};

export const validateCategoryType = (type: string | null | undefined): CategoryType => {
  if (!type || !isValidCategoryType(type)) {
    return 'skin'; // Default to 'skin' as per database schema
  }
  return type;
};