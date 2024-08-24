import { ISignUpFx } from '@/types/authPopup'
import { createDomain, createEffect, sample } from 'effector'
import toast from 'react-hot-toast'
import api from '../api/apiInstance'
import { onAuthSuccess } from '@/lib/utils/auth'

export const oauthFx = createEffect(
  async ({ name, password, email }: ISignUpFx) => {
    try {
      const { data } = await api.post('/api/users/oauth', {
        name,
        password,
        email,
      })

      await api.post('/api/users/email', {
        password,
        email,
      })

      onAuthSuccess('Авторизация выполнена!', data)
      return data.user
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)

export const signUpFx = createEffect(
  async ({ name, password, email, isOAuth }: ISignUpFx) => {
    if (isOAuth) {
      await oauthFx({
        email,
        password,
        name,
      })
      return
    }
    const { data } = await api.post('/api/users/signup', {
      name,
      password,
      email,
    })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return
    }

    onAuthSuccess('Регистрация прошла успешно', data)
    return data
  }
)

export const signInFx = createEffect(
  async ({ email, password, isOAuth }: ISignUpFx) => {
    if (isOAuth) {
      await oauthFx({
        email,
        password,
      })
      return
    }
    const { data } = await api.post('/api/users/login', { email, password })

    if (data.warningMessage) {
      toast.error(data.warningMessage)
      return
    }
    onAuthSuccess('Вход выполнен!', data)

    return data
  }
)

export const refreshTokenFx = createEffect(async ({ jwt }: { jwt: string }) => {
  const { data } = await api.post('/api/users/refresh', { jwt })

  localStorage.setItem('auth', JSON.stringify(data))

  return data
})

const auth = createDomain()

export const openAuthPopup = auth.createEvent()
export const closeAuthPopup = auth.createEvent()
export const setIsAuth = auth.createEvent<boolean>() // авторизован пользватель иди нет

// тригеррит логин или регистрацию
export const handleSignUp = auth.createEvent<ISignUpFx>()
export const handleSignIn = auth.createEvent<ISignUpFx>()

export const $openAuthPopup = auth
  .createStore<boolean>(false)
  .on(openAuthPopup, () => true)
  .on(closeAuthPopup, () => false)

// устанавлваем true - если юзер залогинется или зарегается
export const $isAuth = auth
  .createStore(false)
  .on(setIsAuth, (_, isAuth) => isAuth)

export const $auth = auth
  .createStore({})
  .on(signUpFx.done, (_, { result }) => result)
  .on(signUpFx.fail, (_, { error }) => {
    toast.error(error.message)
  })
  .on(signInFx.done, (_, { result }) => result)
  .on(signInFx.fail, (_, { error }) => {
    toast.error(error.message)
  })

sample({
  clock: handleSignUp,
  source: $auth,
  fn: (_, { name, email, password, isOAuth }) => ({
    name,
    email,
    password,
    isOAuth,
  }),
  target: signUpFx,
})

sample({
  clock: handleSignIn,
  source: $auth,
  fn: (_, { name, email, password, isOAuth }) => ({
    name,
    email,
    password,
    isOAuth,
  }),
  target: signInFx,
})
