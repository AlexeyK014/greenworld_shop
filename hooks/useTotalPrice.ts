import { $totalPrice, setTotalPrice } from '@/context/cart'
import { useUnit } from 'effector-react'
import { useCartByAuth } from './useCartByAuth'
import { usePriceAnimation } from './usePriceAnimation'
import { useEffect } from 'react'

export const useTotalPrice = () => {
  const totalPrice = useUnit($totalPrice)
  const currentCartByAuth = useCartByAuth() // эл-ты корзины чтобы подсчитывать TotlaPrice

  // фун-я выщитывает TotalPrice
  //  прозодимся по корзине, преобразовываем массив в значение резльтатов умн price на count
  // с помощью reduce всё складываем
  const getNewTotal = () =>
    currentCartByAuth
      .map((item) => +item.price * +item.count)
      .reduce((defaultCount, item) => defaultCount + item, 0)

  // чтобы была анимация при расчете TotalPrice
  // передаём totalPrice и выщитываем новый
  const {
    value: animatedPrice,
    setFrom,
    setTo,
  } = usePriceAnimation(totalPrice, getNewTotal())

  // следим за изменениями товаров в корзине, чтобы считать totalPrice
  useEffect(() => {
    setTotalPrice(getNewTotal())
    setFrom(totalPrice)
    setTo(getNewTotal())
  }, [currentCartByAuth])

  return { animatedPrice }
}
