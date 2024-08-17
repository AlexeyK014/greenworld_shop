// import { IProduct } from '@/types/common'
// import { useState } from 'react'
// import { useGoodsByAuth } from './useGoodsByAuth'
// import {
//   $favorites,
//   $favoritesFromLS,
//   addProductToFavorites,
//   setIsAddToFavorites,
// } from '@/context/favorites'
// import { productsWithoutSizes } from '@/constants/product'
// import toast from 'react-hot-toast'
// import { handleShowSizeTable, isUserAuth } from '@/lib/utils/common'
// import { addFavoriteItemToLs } from '@/lib/utils/favorites'

// // для добавления товара в избранное
// export const useFavoritesAction = (product: IProduct) => {
//   // создаём локальный state для спиннера
//   const [addToFavoritesSpinner, setAddToFavoritesSpinner] = useState(false)

//   // результат хука useGoodsByAuth
//   const currentFavoritesByAuth = useGoodsByAuth($favorites, $favoritesFromLS)

//   // получаем уже существующий товар из списка избранных товаров
//   const existingItem = currentFavoritesByAuth.find(
//     (item) => item.productId === product._id
//   )

//   // фун-я которая возвр из хука
//   const handleAddProductToFavorites = () => {
//     // проверка, добавляем мы товар с размером или нет
//     if (productsWithoutSizes.includes(product.type)) {
//       // если товар без размеров
//       if (existingItem) {
//         toast.success('Добавлено в избранное!')
//         return
//       }

//       // если товара не было в избранном, тогда просто на клиенте добавляем товар в избранное
//       // передавая туда пустой размер и сам товар
//       if (!isUserAuth()) {
//         addFavoriteItemToLs(product, '')
//         return
//       }

//       // если юзер авторизован
//       // получаем то что в LS
//       // получаем clientId при добавление товара в избранное для синронизации с сервером
//       const auth = JSON.parse(localStorage.getItem('auth') as string)
//       const clientId = addFavoriteItemToLs(product, '', false)

//       addProductToFavorites({
//         jwt: auth.accessToken,
//         productId: product._id,
//         setSpinner: setAddToFavoritesSpinner,
//         size: '',
//         category: product.category,
//         clientId,
//       })
//       return
//     }

//     // если есть размеры, тогда будет открывать таблица размеров
//     setIsAddToFavorites(true)
//     handleShowSizeTable(product)
//   }

//   return {
//     handleAddProductToFavorites,
//     addToFavoritesSpinner,
//     setAddToFavoritesSpinner,

//     // добавлен ли этот товар в избранное за пределами этого хука
//     isProductInFavorites: existingItem,
//   }
// }

import toast from 'react-hot-toast'
import { useState } from 'react'
import { IProduct } from '@/types/common'
import { useGoodsByAuth } from './useGoodsByAuth'
import { addProductToFavorites, setIsAddToFavorites } from '@/context/favorites'
import { productsWithoutSizes } from '@/constants/product'
import { handleShowSizeTable, isUserAuth } from '@/lib/utils/common'
import { $favorites, $favoritesFromLS } from '@/context/favorites'
import { addFavoriteItemToLs } from '@/lib/utils/favorites'

export const useFavoritesAction = (product: IProduct) => {
  const [addToFavoritesSpinner, setAddToFavoritesSpinner] = useState(false)
  const currentFavoritesByAuth = useGoodsByAuth($favorites, $favoritesFromLS)
  const existingItem = currentFavoritesByAuth.find(
    (item) => item.productId === product._id
  )

  const handleAddProductToFavorites = () => {
    if (productsWithoutSizes.includes(product.type)) {
      if (existingItem) {
        toast.success('Добавлено в избранное!')
        return
      }

      if (!isUserAuth()) {
        addFavoriteItemToLs(product, '')
        return
      }

      const auth = JSON.parse(localStorage.getItem('auth') as string)
      const clientId = addFavoriteItemToLs(product, '', false)

      addProductToFavorites({
        jwt: auth.accessToken,
        productId: product._id,
        setSpinner: setAddToFavoritesSpinner,
        size: '',
        category: product.category,
        clientId,
      })
      return
    }

    setIsAddToFavorites(true)
    handleShowSizeTable(product)
  }

  return {
    handleAddProductToFavorites,
    addToFavoritesSpinner,
    setAddToFavoritesSpinner,
    isProductInFavorites: existingItem,
  }
}
