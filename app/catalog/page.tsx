// на этой странице показываются все товары, если юзер выберет такой фильтр
// если выбирают определённую категорию, мы переносимся во вложенный layout

import ProductsPage from '@/components/templates/ProductsPage/ProductsPage'
import { SearchParams } from '@/types/catalog'

export default function Catalog({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  return <ProductsPage searchParams={searchParams || {}} pageName='catalog' />
}
