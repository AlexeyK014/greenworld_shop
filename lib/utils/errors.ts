/* eslint-disable indent */
// обрабатываем ошибку протухание токена
// если в login-check появиться сообщение что токен протух, нам необходимо повторить запрос

import { loginCheckFx, refreshTokenFx } from '@/api/auth'
import {
  addProductToCartFx,
  deleteCartItemFx,
  getCartItemsFx,
} from '@/api/cart'
import { JWTError } from '@/constants/jwt'
import { addProductsFromLSToCartFx } from '@/context/cart'
import {
  IAddProductsFromLSToCartFx,
  IAddProductToCartFx,
  IDeleteCartItemsFx,
} from '@/types/cart'

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
        case 'deleteCartitemFx':
          return deleteCartItemFx({
            ...(payload as IDeleteCartItemsFx),
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
