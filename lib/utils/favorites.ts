import { IProduct } from '@/types/common'
import { IFavoriteItem } from '@/types/favorites'
import { idGenerator } from './common'
import toast from 'react-hot-toast'
import {
  setFavoritesFromLS,
  setShouldShowEmptyFavorites,
} from '@/context/favorites'

// добавление товаров в избранное на клиенте
export const addFavoriteItemToLs = (
  product: IProduct,
  selectedSize: string,
  withToast = true
) => {
  // получаем данные из LS
  let favoritesFromLS: IFavoriteItem[] = JSON.parse(
    localStorage.getItem('favorites') as string
  )
  // генерируем id для добавляемого товара
  const clientId = idGenerator()

  // если ничего нет в LS, присваеваем пустой массив
  if (!favoritesFromLS) {
    favoritesFromLS = []
  }

  setShouldShowEmptyFavorites(false)

  // проверяем, при добавление нет ли этого товар УЖЕ в избранном
  // в массиве favoritesFromLS ищем элемент по id и по размеру
  const existingItem = favoritesFromLS.find(
    (item) => item.productId === product._id && item.size === selectedSize
  )

  // если элемент УЖЕ СУЩЕСТВУЕТ в избранном, тогда делаем проверку и показываем сообщение
  if (existingItem) {
    toast.success('Добавлено в избранное!')
    return existingItem.clientId
  }
  // иначе содаём новый массив
  const favorites = [
    ...favoritesFromLS,
    {
      clientId,
      productId: product._id,
      size: selectedSize,
      image: product.images[0],
      name: product.name,
      price: product.price,
      inStock: product.inStock,
      category: product.category,
      color: product.characteristics.color,
    },
  ]

  // обновлённый массив устанавливаем в LS и состояние
  localStorage.setItem('favorites', JSON.stringify(favorites))
  setFavoritesFromLS(favorites as IFavoriteItem[])
  withToast && toast.success('Добавлено в избранное!')

  return clientId
}
