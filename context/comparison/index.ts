'use client'

import { handleJWTError } from '@/lib/utils/errors'
import {
  IAddProductToComparisonFx,
  IComparisonItem,
  IAddProductsFromLSToComparisonFx,
  IDeleteComparisonItemsFx,
} from '@/types/comparison'
import { createEffect, createDomain } from 'effector'
import toast from 'react-hot-toast'
import api from '@/api/apiInstance'

export const comparison = createDomain()

////////// Эвенты ////////////

export const loadComparisonItems = comparison.createEvent<{ jwt: string }>()
export const addProductToComparison =
  comparison.createEvent<IAddProductToComparisonFx>()
export const setComparisonFromLS = comparison.createEvent<IComparisonItem[]>()
export const setShouldShowEmptyComparison = comparison.createEvent<boolean>()

// export const addProductsFromLSToComparison =
//   comparison.createEvent<IAddProductsFromLSToComparisonFx>()
export const addProductsFromLSToComparison =
  comparison.createEvent<IAddProductsFromLSToComparisonFx>()
export const deleteProductFromComparison =
  comparison.createEvent<IDeleteComparisonItemsFx>()

export const addProductToComparisonFx = createEffect(
  async ({ jwt, setSpinner, ...payload }: IAddProductToComparisonFx) => {
    try {
      setSpinner(true) // вкл спиннер
      const { data } = await api.post(`/api/comparison/add`, payload, {
        // делаем запрос и отправляем jwt
        headers: { Authorization: `Bearer ${jwt}` },
      })

      //  повторяем апрос при протухание токена
      if (data?.error) {
        const newData: { newComparisonItem: IComparisonItem } =
          await handleJWTError(data.error.name, {
            repeatRequestMethodName: 'addProductToComparisonFx',
            payload: { payload, setSpinner },
          })
        return newData
      }

      toast.success('Добавлено в сравнение!')
      return data
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }
)

export const getComparisonItemsFx = createEffect(
  async ({ jwt }: { jwt: string }) => {
    try {
      const { data } = await api.get(`/api/comparison/all`, {
        // делаем запрос и отправляем jwt
        headers: { Authorization: `Bearer ${jwt}` },
      })

      //  повторяем апрос при протухание токена
      if (data?.error) {
        const newData: IComparisonItem[] = await handleJWTError(
          data.error.name,
          {
            repeatRequestMethodName: 'getComparisonItemsFx',
          }
        )
        return newData
      }

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)

export const addProductFromLSToComparisonFx = createEffect(
  async ({ jwt, comparisonItems }: IAddProductsFromLSToComparisonFx) => {
    try {
      const { data } = await api.post(
        '/api/comparison/add-many',
        { items: comparisonItems },
        {
          // делаем запрос и отправляем jwt
          headers: { Authorization: `Bearer ${jwt}` },
        }
      )

      //  повторяем апрос при протухание токена
      if (data?.error) {
        const newData: { comparisonItems: IComparisonItem[] } =
          await handleJWTError(data.error.name, {
            repeatRequestMethodName: 'addProductsFromLSToComparisonFx',
            payload: { items: comparisonItems },
          })
        return newData
      }

      // подгуржаем товары с сервера
      loadComparisonItems({ jwt })
      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)

export const deleteComparisonItemFx = createEffect(
  async ({ jwt, id, setSpinner }: IDeleteComparisonItemsFx) => {
    try {
      setSpinner(true)

      // делаем запрос
      const { data } = await api.delete(`/api/comparison/delete?id=${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })

      // если токен протух
      if (data?.error) {
        const newData: { id: string } = await handleJWTError(data.error.name, {
          repeatRequestMethodName: 'deleteComparisonItemFx',
          payload: { id, setSpinner },
        })
        return newData
      }

      toast.success('Удалено из сравнения!')
      return data
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }
)
