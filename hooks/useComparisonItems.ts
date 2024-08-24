import { $comparison, $comparisonFromLS } from '@/context/comparison'
import { useGoodsByAuth } from './useGoodsByAuth'

export const useComparisonItems = (type: string) => {
  const currentComparisonByAuth = useGoodsByAuth($comparison, $comparisonFromLS)

  // получаем по фильтрации товары этого типа
  const items = currentComparisonByAuth.filter(
    (item) => item.characteristics.type === type
  )

  return { items }
}
