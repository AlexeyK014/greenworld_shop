import ProductPage from '@/components/templates/ProductPage/ProductPage'
import { productCategory } from '@/constants/product'
import { notFound } from 'next/navigation'

export default function Product({
  params,
}: {
  params: { productId: string; category: string }
}) {
  // делаем проверку
  // если тип из url не совпадает с (params.type), тогда показываем страницу notFound() иначе показываем контент
  if (!productCategory.includes(params.category)) {
    notFound()
  }
  return <ProductPage productId={params.productId} category={params.category} />
}
