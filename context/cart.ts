import {
  addProductToCartFx,
  deleteCartItemFx,
  getCartItemsFx,
  updateCartItemCountFx,
} from '@/api/cart'
import {
  IAddProductsFromLSToCartFx,
  IAddProductToCartFx,
  ICartItem,
  IDeleteCartItemsFx,
  IUpdateCartItemCountFx,
} from './../types/cart'
import { createDomain, createEffect, sample } from 'effector'
import { handleJWTError } from '@/lib/utils/errors'
import api from '../api/apiInstance'
import toast from 'react-hot-toast'

export const addProductsFromLSToCartFx = createEffect(
  async ({ jwt, cartItems }: IAddProductsFromLSToCartFx) => {
    try {
      const { data } = await api.post(
        '/api/cart/add-many',
        { items: cartItems },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      )

      // если ошибка повторяем запрос после refresh
      if (data?.error) {
        const newData: { cartItems: ICartItem[] } = await handleJWTError(
          data.error.name,
          {
            repeatRequestMethodName: 'addProductsFromLSToCartFx',
            payload: { items: cartItems },
          }
        )
        return newData
      }

      // для обновления стора с БД
      loadCartItems({ jwt })
      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)

const cart = createDomain()

// загрузка товаров в корзину от какого-то конкретного пользователя
export const loadCartItems = cart.createEvent<{ jwt: string }>()

// добавление товара для неавторизованного
export const setCartFromLS = cart.createEvent<ICartItem[]>()

// получение тех полей которые необходимо для добавление товара на СЕРВЕРЕ
export const addProductToCart = cart.createEvent<IAddProductToCartFx>()

export const addProductsFromLSToCart =
  cart.createEvent<IAddProductsFromLSToCartFx>()

export const updateCartItemCount = cart.createEvent<IUpdateCartItemCountFx>()

// эвент для установки TotlaPrice
export const setTotalPrice = cart.createEvent<number>()

export const deleteProductFromCart = cart.createEvent<IDeleteCartItemsFx>()

export const setShouldShowEmpty = cart.createEvent<boolean>()

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

sample({
  clock: loadCartItems,
  source: $cart,
  fn: (_, data) => data,
  target: getCartItemsFx,
})

sample({
  clock: addProductToCart,
  source: $cart,
  fn: (_, data) => data,
  target: addProductToCartFx,
})

sample({
  clock: addProductsFromLSToCart,
  source: $cart,
  fn: (_, data) => data,
  target: addProductsFromLSToCartFx,
})

sample({
  clock: updateCartItemCount,
  source: $cart,
  fn: (_, data) => data,
  target: updateCartItemCountFx,
})

sample({
  clock: deleteProductFromCart,
  source: $cart,
  fn: (_, data) => data,
  target: deleteCartItemFx,
})
