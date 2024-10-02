'use client'

import { IFavoriteItem } from '@/types/favorites'
import {
  favorites,
  getFavoriteItemsFx,
  addProductToFavoriteFx,
  addProductsFromLSToFavoritesFx,
  deleteFavoriteItemFx,
  setFavoritesFromLS,
  setIsAddToFavorites,
  setShouldShowEmptyFavorites,
} from '.'

export const $favorites = favorites
  .createStore<IFavoriteItem[]>([])
  .on(getFavoriteItemsFx.done, (_, { result }) => result)
  .on(addProductToFavoriteFx.done, (cart, { result }) => [
    // для добавления эл-ов в избранное на сервере
    // чтобы не дублировались объекты у которых одно и тоже поле
    ...new Map(
      [...cart, result.newFavoriteItem].map((item) => [item.clientId, item])
    ).values(),
  ])
  .on(addProductsFromLSToFavoritesFx.done, (_, { result }) => result.items)
  .on(deleteFavoriteItemFx.done, (state, { result }) =>
    state.filter((item) => item._id !== result.id)
  )

// избранные товары для LS, добавляютяс когда юзер не залогинен
// export const $favoritesFromLS = favorites
//   .createStore<IFavoriteItem[]>([])
//   .on(setFavoritesFromLS, (_, favorites) => favorites)
export const $favoritesFromLS = favorites
  .createStore<IFavoriteItem[]>([])
  .on(setFavoritesFromLS, (_, favorites) => favorites)

export const $isAddToFavorites = favorites
  .createStore(false)
  .on(setIsAddToFavorites, (_, value) => value)

// для показа пустой страницы избранных
export const $shouldShowEmptyFavorites = favorites
  .createStore(false)
  .on(setShouldShowEmptyFavorites, (_, value) => value)
