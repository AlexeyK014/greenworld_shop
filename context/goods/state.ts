'use client'

import { IProduct } from '@/types/common'
import { IProducts } from '@/types/goods'
import { Effect } from 'effector'
import {
  setCurrentProduct,
  loadOneProductFx,
  loadProductsByFillterFx,
  goods,
  loadWatchedProductsFx,
  getNewProductsFx,
  getBestsellerProductsFx,
} from '.'

const goodsStoreInstace = (effect: Effect<void, [], Error>) =>
  goods
    .createStore([])
    .on(effect.done, (_, { result }) => result)
    .on(effect.fail, (_, { error }) => {
      console.log(error.message)
    })

export const $newProducts = goodsStoreInstace(getNewProductsFx)
export const $bestsellerProducts = goodsStoreInstace(getBestsellerProductsFx)

export const $currentProduct = goods // получаем продукт из event и добавляем в store
  .createStore<IProduct>({} as IProduct)
  .on(setCurrentProduct, (_, product) => product) //получаем товары с клиента, уже имеющиеся
  .on(loadOneProductFx.done, (_, { result }) => result.productItem) // получаем товары с сервера

export const $products = goods
  .createStore<IProducts>({} as IProducts)
  .on(loadProductsByFillterFx.done, (_, { result }) => result)

// делаем запрос на сервер
// с клиента отправляем id и category, тех товаров которых юзер смотрел
export const $watchedProducts = goods
  .createStore<IProducts>({} as IProducts)
  .on(loadWatchedProductsFx.done, (_, { result }) => result)
