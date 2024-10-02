'use client'

import { handleJWTError } from '@/lib/utils/errors'
import {
  ICartItem,
  IAddProductToCartFx,
  IAddProductsFromLSToCartFx,
  IUpdateCartItemCountFx,
  IDeleteCartItemsFx,
} from '@/types/cart'
import { createDomain, createEffect } from 'effector'
import toast from 'react-hot-toast'
import api from '@/api/apiInstance'

export const cart = createDomain()

// загрузка товаров в корзину от какого-то конкретного пользователя
export const loadCartItems = cart.createEvent<{ jwt: string }>()

// добавление товара для неавторизованного
export const setCartFromLS = cart.createEvent<ICartItem[]>()

// получение тех полей которые необходимо для добавление товара на СЕРВЕР
export const addProductToCart = cart.createEvent<IAddProductToCartFx>()

export const addProductsFromLSToCart =
  cart.createEvent<IAddProductsFromLSToCartFx>()

export const updateCartItemCount = cart.createEvent<IUpdateCartItemCountFx>()

// эвент для установки TotlaPrice
export const setTotalPrice = cart.createEvent<number>()

export const deleteProductFromCart = cart.createEvent<IDeleteCartItemsFx>()

export const setShouldShowEmpty = cart.createEvent<boolean>()

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

export const getCartItemsFx = createEffect(async ({ jwt }: { jwt: string }) => {
  try {
    // делаем запрос. отправляем токен
    const { data } = await api.get('/api/cart/all', {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    // если ошибка(протухание) - вызываем фун-ю для повторного запроса
    if (data?.error) {
      const newData: ICartItem[] = await handleJWTError(data.error.name, {
        repeatRequestMethodName: 'getCartItemsFx',
      })
      // возвращаем данные
      return newData
    }

    return data
  } catch (error) {
    toast.error((error as Error).message)
  }
})

export const addProductToCartFx = createEffect(
  async ({ jwt, setSpinner, ...dataField }: IAddProductToCartFx) => {
    try {
      setSpinner(true)
      const { data } = await api.post('/api/cart/add', dataField, {
        headers: { Authorization: `Bearer ${jwt}` },
      })

      if (data?.error) {
        const newData: { newCartItem: ICartItem } = await handleJWTError(
          data.error.name,
          {
            repeatRequestMethodName: 'addProductToCartFx',
            payload: { ...dataField, setSpinner },
          }
        )
        return newData
      }

      toast.success('Добавлено в корзину!')
      return data
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }
)

export const updateCartItemCountFx = createEffect(
  async ({ jwt, id, setSpinner, count }: IUpdateCartItemCountFx) => {
    try {
      setSpinner(true) // у обновлённого эл исп спиннер
      const { data } = await api.patch(
        `/api/cart/count?id=${id}`,
        { count },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      )

      // для рефреша
      if (data?.error) {
        const newData: { count: string; id: string } = await handleJWTError(
          data.error.name,
          {
            repeatRequestMethodName: 'updateCartItemCountFx',
            payload: { id, setSpinner, count },
          }
        )
        return newData
      }

      return data
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }
)

export const deleteCartItemFx = createEffect(
  async ({ jwt, id, setSpinner }: IDeleteCartItemsFx) => {
    try {
      setSpinner(true) // вкл спиннер
      const { data } = await api.delete(`/api/cart/delete?id=${id}`, {
        // делаем запрос и отправляем jwt
        headers: { Authorization: `Bearer ${jwt}` },
      })

      //  повторяем апрос при протухание токена
      if (data?.error) {
        const newData: { id: string } = await handleJWTError(data.error.name, {
          repeatRequestMethodName: 'deleteCartItemFx',
          payload: { id, setSpinner },
        })
        return newData
      }

      toast.success('Удалено из корзины!')
      return data
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }
)
