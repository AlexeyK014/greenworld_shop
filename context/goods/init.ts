import { Effect, sample } from 'effector'
import {
  loadOneProduct,
  loadOneProductFx,
  loadProductsByFilter,
  loadProductsByFillterFx,
  loadWatchedProducts,
  loadWatchedProductsFx,
  getBestsellerProductsFx,
  getNewProductsFx,
  MainPageGate,
} from '.'
import { $currentProduct, $products, $watchedProducts } from './state'
import { Gate } from 'effector-react'

const goodsSampleInstance = (
  effect: Effect<void, [], Error>,
  gate: Gate<unknown>
) =>
  // необходимо для первого рендера
  sample({
    clock: gate.open,
    target: effect,
  })

goodsSampleInstance(getNewProductsFx, MainPageGate)
goodsSampleInstance(getBestsellerProductsFx, MainPageGate)

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

sample({
  clock: loadWatchedProducts,
  source: $watchedProducts,
  fn: (_, data) => data,
  target: loadWatchedProductsFx,
})
