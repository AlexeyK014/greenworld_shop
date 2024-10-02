'use client'

import { handleJWTError } from '@/lib/utils/errors'
import { IAddProductToCartFx } from '@/types/cart'
import {
  IFavoriteItem,
  IAddProductsFromLSToFavoriteFx,
  IDeleteFavoriteItemsFx,
} from '@/types/favorites'
import { createDomain, createEffect } from 'effector'
import toast from 'react-hot-toast'
import api from '@/api/apiInstance'

export const favorites = createDomain()

export const getFavoriteItemsFx = createEffect(
  async ({ jwt }: { jwt: string }) => {
    try {
      const { data } = await api.get('/api/favorites/all', {
        headers: { Authorization: `Bearer ${jwt}` },
      })

      // протухание токена
      if (data?.error) {
        const newData: IFavoriteItem[] = await handleJWTError(data.error.name, {
          repeatRequestMethodName: 'getFavoriteItemsFx',
        })
        return newData
      }

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)

export const addProductToFavoriteFx = createEffect(
  async ({
    jwt,
    setSpinner,
    ...dataFields
  }: Omit<IAddProductToCartFx, 'count'>) => {
    try {
      setSpinner(true)
      const { data } = await api.post('/api/favorites/add', dataFields, {
        headers: { Authorization: `Bearer: ${jwt}` },
      })

      // при повторном запросе после рефреш токена, нам возвращается тот же самый newFavoriteItem
      if (data?.error) {
        const newData: { newFavoriteItem: IFavoriteItem } =
          await handleJWTError(data.error.name, {
            repeatRequestMethodName: 'addProductToFavoriteFx',
            payload: { ...dataFields, setSpinner },
          })
        return newData
      }

      // при успехе
      toast.success('Добавлено в избранное!')
      return data
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }
)

export const addProductsFromLSToFavoritesFx = createEffect(
  async ({ jwt, favoriteItems }: IAddProductsFromLSToFavoriteFx) => {
    try {
      // делаем запрос
      const { data } = await api.post(
        '/api/favorites/add-many',
        { items: favoriteItems }, // отправляем товары из LS
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      )

      // если протухание токена
      if (data?.error) {
        const newData: { cartItems: IFavoriteItem[] } = await handleJWTError(
          data.error.name,
          // повторяем запрос
          {
            repeatRequestMethodName: 'addProductsFromLSToFavoritesFx',
            payload: { items: favoriteItems },
          }
        )
        return newData
      }

      // дополнительно подгружаем товары с сервера
      loadFavoriteItems({ jwt })
      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)

export const deleteFavoriteItemFx = createEffect(
  async ({ jwt, id, setSpinner }: IDeleteFavoriteItemsFx) => {
    try {
      setSpinner(true)

      // отправляем запрос
      const { data } = await api.delete(`/api/favorites/delete?id=${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })

      // протухание токена
      if (data?.error) {
        const newData: { id: string } = await handleJWTError(data.error.name, {
          repeatRequestMethodName: 'deleteFavoriteItemFx',
          payload: { id, setSpinner },
        })
        return newData
      }

      toast.success('Удалено из избранных!')
      return data
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }
)

// эвент для добавления товаров в избранное
export const addProductToFavorites =
  favorites.createEvent<Omit<IAddProductToCartFx, 'count'>>()

// эвент для загрузки всех избранных товаров
export const loadFavoriteItems = favorites.createEvent<{ jwt: string }>()

// эвент для добавления товара в LS
export const setFavoritesFromLS = favorites.createEvent<IFavoriteItem[]>()

// для поределения, для чего открылась таблица размеров(для корзины или избранного)
export const setIsAddToFavorites = favorites.createEvent<boolean>()

export const setShouldShowEmptyFavorites = favorites.createEvent<boolean>()

export const addProductsFromLSToFavorites =
  favorites.createEvent<IAddProductsFromLSToFavoriteFx>()

export const deleteProductFromFavorites =
  favorites.createEvent<IDeleteFavoriteItemsFx>()
