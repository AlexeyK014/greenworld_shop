import ProductsPage from '@/components/templates/ProductsPage/ProductsPage'
import { productCategory } from '@/constants/product'
import { notFound } from 'next/navigation'

export default function Category({ params }: { params: { category: string } }) {
  // делаем проверку
  // если тип из url не совпадает с (params.type), тогда показываем страницу notFound() иначе показываем контент
  if (!productCategory.includes(params.category)) {
    notFound()
  }
  return <ProductsPage searchParams={params || {}} pageName={params.category} />
}
