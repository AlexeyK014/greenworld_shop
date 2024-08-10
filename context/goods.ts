'use client'
import { loadOneProductFx } from '@/api/goods'
import { getBestsellerProductsFx, getNewProductsFx } from '@/api/main-page'
import { IProduct } from '@/types/common'
import { ILoadOneProductFx } from '@/types/goods'
import { createDomain, Effect, sample } from 'effector'
import { createGate, Gate } from 'effector-react'

const goods = createDomain()

// createGate - иммитирует поведение useEffect на первый рендер
// с помошью createGate - получаем данные с сервера и преобразовываем их в состояние
export const MainPageGate = createGate()

export const setCurrentProduct = goods.createEvent<IProduct>() // сетим товар
export const loadOneProduct = goods.createEvent<ILoadOneProductFx>()

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

sample({
  clock: loadOneProduct,
  source: $currentProduct,
  fn: (_, data) => data,
  target: loadOneProductFx,
})
