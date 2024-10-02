'use client'

import { ICartItem } from '@/types/cart'
import {
  cart,
  getCartItemsFx,
  addProductsFromLSToCartFx,
  addProductToCartFx,
  updateCartItemCountFx,
  deleteCartItemFx,
  setCartFromLS,
  setTotalPrice,
  setShouldShowEmpty,
} from '.'

// стор для товаров в корзине когда юзер не авторизован
export const $cart = cart
  .createStore<ICartItem[]>([])
  .on(getCartItemsFx.done, (_, { result }) => result)
  .on(addProductsFromLSToCartFx.done, (_, { result }) => result.items)
  .on(addProductToCartFx.done, (cart, { result }) => [
    // для добавления эл-ов в корзину на сервере
    // чтобы не дублировались объекты у которых одно и тоже поле
    ...new Map(
      [...cart, result.newCartItem].map((item) => [item.clientId, item])
    ).values(),
  ])
  .on(updateCartItemCountFx.done, (cart, { result }) =>
    // проходимся по стору, находим искомый эл-т, меняем у него count
    cart.map((item) =>
      item._id === result.id ? { ...item, count: result.count } : item
    )
  )
  .on(deleteCartItemFx.done, (cart, { result }) =>
    // проходимся по стору и удалям товар по id, который возвращается с бека
    cart.filter((item) => item._id !== result.id)
  )

export const $cartFromLs = cart
  .createStore<ICartItem[]>([])
  .on(setCartFromLS, (_, cart) => cart)

export const $totalPrice = cart
  .createStore<number>(0)
  .on(setTotalPrice, (_, value) => value)

// для показа пустой страницы корзины
export const $shouldShowEmpty = cart
  .createStore(false)
  .on(setShouldShowEmpty, (_, value) => value)
