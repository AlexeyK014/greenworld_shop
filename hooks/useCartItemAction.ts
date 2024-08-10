import { ICartItem } from '@/types/cart'
import { useState } from 'react'
import { usePriceAction } from './usePriceAction'
import { usePriceAnimation } from './usePriceAnimation'
import { deleteProductFromLS, isUserAuth } from '@/lib/utils/common'
import {
  deleteProductFromCart,
  setCartFromLS,
  setShouldShowEmpty,
} from '@/context/cart'

export const useCartItemAction = (cartItem: ICartItem) => {
  const [deleteSpinner, setDeleteSpinner] = useState(false)
  const [count, setCount] = useState(+cartItem.count)
  const { price, increasePrice, decreasePrice } = usePriceAction(
    +cartItem.count,
    +cartItem.price
  )

  const {
    setFrom,
    setTo,
    value: animatedPrice,
    // начальная цена товара и умноженная на count
  } = usePriceAnimation(+cartItem.price, +cartItem.price * +cartItem.count)

  const increasePriceWithAnimation = () => {
    setFrom(price) // устанавливаем начальную цену
    setTo(price + +cartItem.price) // цена которая увеличилась
    increasePrice() // вызываем фун-ю из хук аusePriceAction
  }

  const decreasePriceWithAnimation = () => {
    setFrom(price) // устанавливаем начальную цену
    setTo(price - +cartItem.price) // цена которая уменьшилась
    increasePrice() // вызываем фун-ю из хук аusePriceAction
  }

  const handleDeleteCartItem = () => {
    if (!isUserAuth()) {
      // если не авторизован, тогда удаляем из LS
      deleteProductFromLS(
        cartItem.clientId,
        'cart',
        setCartFromLS,
        setShouldShowEmpty,
        'Удалено из корзины!'
      )
      return
    }

    const auth = JSON.parse(localStorage.getItem('auth') as string)

    deleteProductFromLS(
      cartItem.clientId,
      'cart',
      setCartFromLS,
      setShouldShowEmpty,
      '',
      false
    )
    deleteProductFromCart({
      jwt: auth.accessToken,
      id: cartItem._id,
      setSpinner: setDeleteSpinner,
    })
  }
  return {
    deleteSpinner,
    price,
    count,
    setCount,
    increasePrice,
    decreasePrice,
    increasePriceWithAnimation,
    decreasePriceWithAnimation,
    setFrom,
    setTo,
    animatedPrice,
    handleDeleteCartItem,
  }
}
