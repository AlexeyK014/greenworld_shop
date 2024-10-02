import { sample } from 'effector'
import {
  loadComparisonItems,
  getComparisonItemsFx,
  addProductToComparison,
  addProductToComparisonFx,
  addProductsFromLSToComparison,
  addProductFromLSToComparisonFx,
  deleteProductFromComparison,
  deleteComparisonItemFx,
} from '.'
import { $comparison } from './state'

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
