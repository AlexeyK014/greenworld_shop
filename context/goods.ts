'use client'
import { ILoadProductsByFilterFx, IProducts } from './../types/goods'
import { getBestsellerProductsFx, getNewProductsFx } from '@/api/main-page'
import { IProduct } from '@/types/common'
import { ILoadOneProductFx } from '@/types/goods'
import { createDomain, createEffect, Effect, sample } from 'effector'
import { createGate, Gate } from 'effector-react'
import api from '../api/apiInstance'
import { handleShowSizeTable } from '@/lib/utils/common'
import toast from 'react-hot-toast'

export const loadOneProductFx = createEffect(
  async ({
    productId,
    category,
    setSpinner,
    withShowingSizeTable,
  }: ILoadOneProductFx) => {
    try {
      setSpinner(true)
      const { data } = await api.post('/api/goods/one', { productId, category })

      if (withShowingSizeTable) {
        handleShowSizeTable(data.productItem)
      }

      if (data?.message === 'Wrong product id') {
        return { productItem: { errorMessage: 'Wrong product id' } }
      }

      return data
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }
)

// export const loadProductsByFillterFx = createEffect(
//   async ({
//     limit,
//     offset,
//     category,
//     additionalParam,
//     isCatalog,
//   }: ILoadProductsByFilterFx) => {
//     try {
//       // делаем запрос
//       // всегда передаём limit, offset(из параметров), категорию, доп.параметр
//       const { data } = await api.get(
//         `api/goods/filter?limit=${limit}&offset=${offset}&category=${category}&${additionalParam}${
//           isCatalog ? '&catalog=true' : ''
//         }`
//       )

//       return data
//     } catch (error) {
//       toast.error((error as Error).message)
//     }
//   }
// )
export const loadProductsByFillterFx = createEffect(
  async ({
    limit,
    offset,
    category,
    isCatalog,
    additionalParam,
  }: ILoadProductsByFilterFx) => {
    try {
      const { data } = await api.get(
        `/api/goods/filter?limit=${limit}&offset=${offset}&category=${category}&${additionalParam}${
          isCatalog ? '&catalog=true' : ''
        }`
      )

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)

const goods = createDomain()

// createGate - иммитирует поведение useEffect на первый рендер
// с помошью createGate - получаем данные с сервера и преобразовываем их в состояние
export const MainPageGate = createGate()

export const setCurrentProduct = goods.createEvent<IProduct>() // сетим товар
export const loadOneProduct = goods.createEvent<ILoadOneProductFx>()
export const loadProductsByFilter = goods.createEvent<ILoadProductsByFilterFx>()

const goodsStoreInstace = (effect: Effect<void, [], Error>) =>
  goods
    .createStore([])
    .on(effect.done, (_, { result }) => result)
    .on(effect.fail, (_, { error }) => {
      console.log(error.message)
    })

const goodsSampleInstance = (
  effect: Effect<void, [], Error>,
  gate: Gate<unknown>
) =>
  // необходимо для первого рендера
  sample({
    clock: gate.open,
    target: effect,
  })

export const $newProducts = goodsStoreInstace(getNewProductsFx)
export const $bestsellerProducts = goodsStoreInstace(getBestsellerProductsFx)

goodsSampleInstance(getNewProductsFx, MainPageGate)
goodsSampleInstance(getBestsellerProductsFx, MainPageGate)

export const $currentProduct = goods // получаем продукт из event и добавляем в store
  .createStore<IProduct>({} as IProduct)
  .on(setCurrentProduct, (_, product) => product) //получаем товары с клиента, уже имеющиеся
  .on(loadOneProductFx.done, (_, { result }) => result.productItem) // получаем товары с сервера

export const $products = goods
  .createStore<IProducts>({} as IProducts)
  .on(loadProductsByFillterFx.done, (_, { result }) => result)

sample({
  clock: loadOneProduct,
  source: $currentProduct,
  fn: (_, data) => data,
  target: loadOneProductFx,
})

sample({
  clock: loadProductsByFilter,
  source: $products,
  fn: (_, data) => data,
  target: loadProductsByFillterFx,
})
