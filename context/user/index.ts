'use client'

import { handleJWTError } from '@/lib/utils/errors'
import { createDomain, createEffect } from 'effector'
import toast from 'react-hot-toast'
import { setIsAuth } from '../auth'
import api from '@/api/apiInstance'

export const user = createDomain()

export const loginCheck = user.createEvent<{ jwt: string }>()

// делаем запрос на route
// передаём токен
export const loginCheckFx = createEffect(async ({ jwt }: { jwt: string }) => {
  try {
    const { data } = await api.get('/api/users/login-check', {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    // если возникает ошибка с токеном, тогда вызываем handleJWTError, передаём туда название ошибки
    // и передаём название метода, чтобы повторитьб запрос, если токен протух
    if (data?.error) {
      handleJWTError(data.error.name, {
        repeatRequestMethodName: 'loginCheckFx',
      })
      return
    }

    setIsAuth(true)
    return data.user // при успее возр данные юзера
  } catch (error) {
    toast.error((error as Error).message)
  }
})
