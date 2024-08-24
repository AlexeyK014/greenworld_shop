import {
  setComparisonFromLS,
  setShouldShowEmptyComparison,
} from '@/context/comparison'
import { IProduct } from '@/types/common'
import { IComparisonItem } from '@/types/comparison'
import toast from 'react-hot-toast'
import { idGenerator } from './common'

// добавление товаров в сравнение на клиенте
export const addComparisonItemToLs = (product: IProduct, withToast = true) => {
  // получаем данные из LS
  let comparisonFromLS: IComparisonItem[] = JSON.parse(
    localStorage.getItem('comparison') as string
  )
  // генерируем id для добавляемого товара
  const clientId = idGenerator()

  // если ничего нет в LS, присваеваем пустой массив
  if (!comparisonFromLS) {
    comparisonFromLS = []
  }

  setShouldShowEmptyComparison(false)

  // проверяем, при добавление нет ли этого товар УЖЕ в сравнение
  // в массиве comparisonFromLS ищем элемент по id
  const existingItem = comparisonFromLS.find(
    (item) => item.productId === product._id
  )

  // если элемент УЖЕ СУЩЕСТВУЕТ в сравнение, тогда делаем проверку и показываем сообщение
  if (existingItem) {
    toast.success('Добавлено в сравнение!')
    return existingItem.clientId
  }
  // иначе содаём новый массив
  const comparison = [
    ...comparisonFromLS,
    {
      clientId,
      productId: product._id,
      image: product.images[0],
      name: product.name,
      price: product.price,
      inStock: product.inStock,
      category: product.category,
      characteristics: product.characteristics,
      sizes: product.sizes,
    },
  ]

  // обновлённый массив устанавливаем в LS и состояние
  localStorage.setItem('comparison', JSON.stringify(comparison))
  setComparisonFromLS(comparison as IComparisonItem[])
  withToast && toast.success('Добавлено в сравнение!')

  return clientId
}
