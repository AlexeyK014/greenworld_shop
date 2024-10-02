import { loadWatchedProducts } from '@/context/goods/index'
import { $watchedProducts } from '@/context/goods/state'
import { getWatchedProductFromLS } from '@/lib/utils/common'
import { useUnit } from 'effector-react'
import { useEffect } from 'react'

export const useWatchedProducts = (excludedProductId?: string) => {
  const watchedProducts = useUnit($watchedProducts)

  // логика добавления товара который сейчас рассматриваем, в массив просмотренных товаров
  // делаем это в том случаем если товара нет в этом массиве
  useEffect(() => {
    // получаем уже просмотренные товары и используем их в слайдере
    const watchedProducts = getWatchedProductFromLS()

    // проверка, чтобе не показывался тот товар на которм мы сейчас находимся
    // excludedProductId - товар которые нужно исключить
    // если есть товар который нужно исключить, делаем фильтр - исключаем товар, иначе возвр все товары
    loadWatchedProducts({
      payload: excludedProductId
        ? watchedProducts.filter((item) => item._id !== excludedProductId)
        : watchedProducts,
    })
  }, [excludedProductId])

  return { watchedProducts }
}
