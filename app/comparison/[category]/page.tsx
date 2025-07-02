'use client';
import ComparisonList from '@/components/modules/Comparison/ComparisonList';
import { productTypes } from '@/constants/product';
import { useComparisonItems } from '@/hooks/useComparisonItems';
import { notFound } from 'next/navigation';

export default function ComparisonType({ params }: { params: { category: string } }) {
  // делаем проверку
  // если тип из url не совпадает с (params.type), тогда показываем страницу notFound() иначе показываем контент
  if (!productTypes.includes(params.category)) {
    notFound();
  }

  const { items } = useComparisonItems(params.category);
  return <ComparisonList items={items} />;
}
