import { handleJWTError } from '@/lib/utils/errors'
import {
  IAddProductsFromLSToComparisonFx,
  IAddProductToComparisonFx,
  IComparisonItem,
  IDeleteComparisonItemsFx,
} from '@/types/comparison'
import { createDomain, createEffect, sample } from 'effector'
import toast from 'react-hot-toast'
import api from '../api/apiInstance'

////////// Эффекты ////////////

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

///////////////////////////////

const comparison = createDomain()

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

////////////////////////////

////////// Стор ////////////

export const $comparison = comparison
  .createStore<IComparisonItem[]>([])
  .on(getComparisonItemsFx.done, (_, { result }) => result)
  // на состяние done, создаём новый массив, разворачиваем прежний state, добавляем новый newComparisonItem
  // который нам возвращается с бэка
  .on(addProductToComparisonFx.done, (state, { result }) => [
    ...state,
    result.newComparisonItem,
  ])
  .on(addProductFromLSToComparisonFx.done, (_, { result }) => result.items)

  // смотрим на состояние done и по возвращающемуся id обновляем состояние
  .on(deleteComparisonItemFx.done, (state, { result }) =>
    state.filter((item) => item._id !== result.id)
  )

// стэйт для клиентских товаров, которые были добавлены в LS
// обновляем стор с товарами LS
export const $comparisonFromLS = comparison
  .createStore<IComparisonItem[]>([])
  .on(setComparisonFromLS, (_, comparison) => comparison)

// для показа пустой страницы
export const $shouldShowEmptyComparison = comparison
  .createStore(false)
  .on(setShouldShowEmptyComparison, (_, value) => value)

////////// Самплы ////////////

sample({
  clock: loadComparisonItems,
  source: $comparison,
  fn: (_, data) => data,
  target: getComparisonItemsFx,
})

sample({
  clock: addProductToComparison,
  source: $comparison,
  fn: (_, data) => data,
  target: addProductToComparisonFx,
})

sample({
  clock: addProductsFromLSToComparison,
  source: $comparison,
  fn: (_, data) => data,
  target: addProductFromLSToComparisonFx,
})

sample({
  clock: deleteProductFromComparison,
  source: $comparison,
  fn: (_, data) => data,
  target: deleteComparisonItemFx,
})
