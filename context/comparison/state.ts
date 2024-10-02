'use client'

import { IComparisonItem } from '@/types/comparison'
import {
  comparison,
  getComparisonItemsFx,
  addProductToComparisonFx,
  addProductFromLSToComparisonFx,
  deleteComparisonItemFx,
  setComparisonFromLS,
  setShouldShowEmptyComparison,
} from '.'

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
