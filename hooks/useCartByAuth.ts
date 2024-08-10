// получение конкретных товаров корзины, СОГЛАСОВЫВАЯ авторизован юзер или нет

import { $isAuth } from '@/context/auth';
import { $cart, $cartFromLs } from "@/context/cart"
import { useUnit } from "effector-react"

export const useCartByAuth = () => {
  const cart = useUnit($cart) // стор для товаров с сервера
  const isAuth = useUnit($isAuth)
  const cartFromLS = useUnit($cartFromLs) // стор для товаров с клиента
  const currentCartByAuth = isAuth ? cart : cartFromLS // если авторизован, показываем одно, если не авторизован другое

  return currentCartByAuth
}
