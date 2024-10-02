'use client'

import { IUser } from '@/types/user'
import { loginCheckFx, user } from '.'

export const $user = user
  .createStore<IUser>({} as IUser)
  .on(loginCheckFx.done, (_, { result }) => result) // при успехе, получаем данные юзера и прокидываем в стор
