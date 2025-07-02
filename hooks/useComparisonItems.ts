import { $comparison, $comparisonFromLS } from '@/context/comparison/state';
import { useGoodsByAuth } from './useGoodsByAuth';

export const useComparisonItems = (category: string) => {
  const currentComparisonByAuth = useGoodsByAuth($comparison, $comparisonFromLS);

  // получаем по фильтрации товары этого типа
  const items = currentComparisonByAuth.filter((item) => item.category === category);

  return { items };
};
