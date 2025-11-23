import { apiClient } from './api-client';

export type AnalyzeNutritionResponse = {
  protein: number;
  carbohydrates: number;
  fats: number;
  calories: number;
  imageUrl: string;
  mealName?: string;
};

export const analyzeNutritionImage = async (
  imageBase64: string,
  mealName?: string,
): Promise<AnalyzeNutritionResponse> => {
  const { data } = await apiClient.post<AnalyzeNutritionResponse>(
    '/api/nutrition-intakes/analyze',
    {
      imageBase64,
      mealName,
    },
  );
  return data;
};
