import {
  addCartItemToLS,
  addItemToCart,
  addProductToCartBySizeTable,
} from './../lib/utils/cart'
import { $currentProduct } from '@/context/goods'
import { useUnit } from 'effector-react'
import { useMemo, useState } from 'react'
import { useCartByAuth } from './useCartByAuth'
import { isUserAuth } from '@/lib/utils/common'
import { updateCartItemCount } from '@/context/cart'

export const useCartAction = (isSizeTable = false) => {
  const product = useUnit($currentProduct)
  const [selectedSize, setSelectedSize] = useState('')
  const currentCartByAuth = useCartByAuth()

  // переменная для показа индикатора сколько товаров в корзине
  const currentCartItems = currentCartByAuth.filter(
    (item) => item.productId === product._id
  )
  // изменяем count у товара
  const cartItemBySize = currentCartItems.find(
    (item) => item.size === selectedSize
  )

  const existingItem = currentCartByAuth.find(
    (item) => item.productId === product._id && item.size === selectedSize
  )
  // переменная для спиннера
  const [addToCartSpinner, setAddToCartSpinner] = useState(false)
  const [updateCountSpinner, setUpdateCountSpinner] = useState(false)

  // локально состояние для count
  // если у товара уже есть count ставим его, иначе = 1
  const [count, setCount] = useState(+(existingItem?.count as string) || 1)

  // если увеличивают или именьшают счётчик
  // const handleAddToCart = (countFromCounter?: number) => {
  //   // если товар добавляют через таблицу, тогда параметр countFromCounter не используется

  //   // если при добавление в корзину, товар уже есть в корзине
  //   // и если юзер не авторизован, добавляем товар в LS
  //   if (existingItem) {
  //     if (!isUserAuth()) {
  //       addCartItemToLS(product, selectedSize, countFromCounter || 1)
  //       return
  //     }

  //     const auth = JSON.parse(localStorage.getItem('auth') as string)
  //     // проверяем если старый count не равен новому, значит юзер его обновил
  //     // если юзер не трогал count, тогда просто увелчиваем на 1
  //     const updatedCountWithSize = !!countFromCounter
  //       ? +existingItem.count !== countFromCounter
  //         ? countFromCounter
  //         : +existingItem.count + 1
  //       : +existingItem.count + 1

  //     updateCartItemCount({
  //       jwt: auth.accessToken,
  //       id: existingItem._id as string,
  //       setSpinner: setUpdateCountSpinner,
  //       count: selectedSize.length
  //         ? updatedCountWithSize
  //         : +existingItem.count + 1,
  //     })

  //     addCartItemToLS(product, selectedSize, count)
  //     return
  //   }

  //   // если, при добавление товара мы находимся в модалке размеров
  //   if (isSizeTable) {
  //     addItemToCart(
  //       product,
  //       setAddToCartSpinner,
  //       countFromCounter || 1,
  //       selectedSize
  //     )
  //     return
  //   }

  //   // если мы не находимся в таблице размеров, тогда вызываем фун-ю
  //   addProductToCartBySizeTable(
  //     product,
  //     setAddToCartSpinner,
  //     countFromCounter || 1,
  //     selectedSize
  //   )
  // }

  const handleAddToCart = (countFromCounter?: number) => {
    if (existingItem) {
      if (!isUserAuth()) {
        addCartItemToLS(product, selectedSize, countFromCounter || 1)
        return
      }

      const auth = JSON.parse(localStorage.getItem('auth') as string)
      const updatedCountWithSize = !!countFromCounter
        ? +existingItem.count !== countFromCounter
          ? countFromCounter
          : +existingItem.count + 1
        : +existingItem.count + 1

      updateCartItemCount({
        jwt: auth.accessToken,
        id: existingItem._id as string,
        setSpinner: setUpdateCountSpinner,
        count: selectedSize.length
          ? updatedCountWithSize
          : +existingItem.count + 1,
      })

      addCartItemToLS(product, selectedSize, countFromCounter || 1)
      return
    }

    if (isSizeTable) {
      addItemToCart(
        product,
        setAddToCartSpinner,
        countFromCounter || 1,
        selectedSize
      )
      return
    }

    addProductToCartBySizeTable(
      product,
      setAddToCartSpinner,
      countFromCounter || 1,
      selectedSize
    )
  }

  // счетаем обшее кол-во товаров
  // чтобы не превышало кол-во товаров на складе
  const allCurrentCartItemCount = useMemo(
    () => currentCartItems.reduce((a, { count }) => a + +count, 0),
    [currentCartItems]
  )

  return {
    product,
    setSelectedSize,
    selectedSize,
    addToCartSpinner,
    cartItemBySize,
    currentCartItems,
    handleAddToCart,
    count,
    setCount,
    existingItem,
    currentCartByAuth,
    setAddToCartSpinner,
    updateCountSpinner,
    allCurrentCartItemCount,
  }
}

// import { useUnit } from 'effector-react'
// import { useMemo, useState } from 'react'
// import { isUserAuth } from '@/lib/utils/common'
// import {
//   addCartItemToLS,
//   addItemToCart,
//   addProductToCartBySizeTable,
// } from '@/lib/utils/cart'
// import { updateCartItemCount } from '@/context/cart'
// import { $currentProduct } from '@/context/goods'
// import { useCartByAuth } from './useCartByAuth'

// export const useCartAction = (isSizeTable = false) => {
//   const product = useUnit($currentProduct)
//   const [selectedSize, setSelectedSize] = useState('')
//   const currentCartByAuth = useCartByAuth()
//   const currentCartItems = currentCartByAuth.filter(
//     (item) => item.productId === product._id
//   )
//   const cartItemBySize = currentCartItems.find(
//     (item) => item.size === selectedSize
//   )
//   const existingItem = currentCartByAuth.find(
//     (item) => item.productId === product._id && item.size === selectedSize
//   )
//   const [addToCartSpinner, setAddToCartSpinner] = useState(false)
//   const [updateCountSpinner, setUpdateCountSpinner] = useState(false)
//   const [count, setCount] = useState(+(existingItem?.count as string) || 1)

//   const handleAddToCart = (countFromCounter?: number) => {
//     if (existingItem) {
//       if (!isUserAuth()) {
//         addCartItemToLS(product, selectedSize, countFromCounter || 1)
//         return
//       }

//       const auth = JSON.parse(localStorage.getItem('auth') as string)
//       const updatedCountWithSize = !!countFromCounter
//         ? +existingItem.count !== countFromCounter
//           ? countFromCounter
//           : +existingItem.count + 1
//         : +existingItem.count + 1

//       updateCartItemCount({
//         jwt: auth.accessToken,
//         id: existingItem._id as string,
//         setSpinner: setUpdateCountSpinner,
//         count: selectedSize.length
//           ? updatedCountWithSize
//           : +existingItem.count + 1,
//       })

//       addCartItemToLS(product, selectedSize, countFromCounter || 1)
//       return
//     }

//     if (isSizeTable) {
//       addItemToCart(
//         product,
//         setAddToCartSpinner,
//         countFromCounter || 1,
//         selectedSize
//       )
//       return
//     }

//     addProductToCartBySizeTable(
//       product,
//       setAddToCartSpinner,
//       countFromCounter || 1,
//       selectedSize
//     )
//   }

//   const allCurrentCartItemCount = useMemo(
//     () => currentCartItems.reduce((a, { count }) => a + +count, 0),
//     [currentCartItems]
//   )

//   return {
//     product,
//     setSelectedSize,
//     selectedSize,
//     addToCartSpinner,
//     currentCartItems,
//     cartItemBySize,
//     handleAddToCart,
//     setCount,
//     count,
//     existingItem,
//     currentCartByAuth,
//     setAddToCartSpinner,
//     updateCountSpinner,
//     allCurrentCartItemCount,
//   }
// }
