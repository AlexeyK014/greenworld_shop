/* eslint-disable indent */
// обрабатываем ошибку протухание токена
// если в login-check появиться сообщение что токен протух, нам необходимо повторить запрос

import {
  addProductToCartFx,
  deleteCartItemFx,
  getCartItemsFx,
} from '@/api/cart'
import { JWTError } from '@/constants/jwt'
import { refreshTokenFx } from '@/context/auth'
import { addProductsFromLSToCartFx } from '@/context/cart'
import {
  addProductFromLSToComparisonFx,
  addProductToComparisonFx,
  deleteComparisonItemFx,
  getComparisonItemsFx,
} from '@/context/comparison'
import {
  addProductsFromLSToFavoritesFx,
  addProductToFavoriteFx,
  deleteFavoriteItemFx,
  getFavoriteItemsFx,
} from '@/context/favorites'
import { loginCheckFx } from '@/context/user'
import {
  IAddProductsFromLSToCartFx,
  IAddProductToCartFx,
  IDeleteCartItemsFx,
} from '@/types/cart'
import {
  IAddProductsFromLSToComparisonFx,
  IAddProductToComparisonFx,
  IDeleteComparisonItemsFx,
} from '@/types/comparison'
import { IAddProductsFromLSToFavoriteFx } from '@/types/favorites'

// после того как мы обновим токен
export const handleJWTError = async (
  errorName: string,
  repeatRequestAfterRefreshData?: {
    repeatRequestMethodName: string
    payload?: unknown
  }
) => {
  if (errorName === JWTError.EXPIRED_JWT_TOKEN) {
    // получаем данные из LS, если токен протух, значит юзер авторизован
    const auth = JSON.parse(localStorage.getItem('auth') as string)
    // рефреш токена
    const newTokens = await refreshTokenFx({ jwt: auth.refreshToken })

    if (repeatRequestAfterRefreshData) {
      const { repeatRequestMethodName, payload } = repeatRequestAfterRefreshData

      // смотрим на название метода который нужно повтортить
      switch (repeatRequestMethodName) {
        case 'getCartItemsFx':
          return getCartItemsFx({
            jwt: newTokens.accessToken,
          })
        case 'addProductToCartFx':
          return addProductToCartFx({
            ...(payload as IAddProductToCartFx),
            jwt: newTokens.accessToken,
          })
        case 'addProductsFromLSToCartFx':
          return addProductsFromLSToCartFx({
            ...(payload as IAddProductsFromLSToCartFx),
            jwt: newTokens.accessToken,
          })
        case 'deleteCartItemFx':
          return deleteCartItemFx({
            ...(payload as IDeleteCartItemsFx),
            jwt: newTokens.accessToken,
          })
        case 'getFavoriteItemsFx':
          return getFavoriteItemsFx({
            ...(payload as IDeleteCartItemsFx),
            jwt: newTokens.accessToken,
          })
        case 'addProductToFavoriteFx':
          return addProductToFavoriteFx({
            ...(payload as Omit<IAddProductToCartFx, 'count'>),
            jwt: newTokens.accessToken,
          })
        case 'deleteFavoriteItemFx':
          return deleteFavoriteItemFx({
            ...(payload as IDeleteCartItemsFx),
            jwt: newTokens.accessToken,
          })
        case 'addProductsFromLSToFavoritesFx':
          return addProductsFromLSToFavoritesFx({
            ...(payload as IAddProductsFromLSToFavoriteFx),
            jwt: newTokens.accessToken,
          })
        case 'addProductToComparisonFx':
          return addProductToComparisonFx({
            ...(payload as IAddProductToComparisonFx),
            jwt: newTokens.accessToken,
          })
        case 'getComparisonItemsFx':
          return getComparisonItemsFx({
            jwt: newTokens.accessToken,
          })
        case 'addProductsFromLSToComparisonFx':
          return addProductFromLSToComparisonFx({
            ...(payload as IAddProductsFromLSToComparisonFx),
            jwt: newTokens.accessToken,
          })
        case 'deleteComparisonItemFx':
          return deleteComparisonItemFx({
            ...(payload as IDeleteComparisonItemsFx),
            jwt: newTokens.accessToken,
          })
        case 'loginCheckFx':
          await loginCheckFx({
            jwt: newTokens.accessToken, // если протухнет токен, то повторяем запрос
          })
          break
      }
    }
  }
}
