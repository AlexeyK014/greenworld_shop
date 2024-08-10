import { loginCheckFx } from '@/api/auth'
import { IUser } from '@/types/user'
import { createDomain, sample } from 'effector'

const user = createDomain()

export const loginCheck = user.createEvent<{ jwt: string }>()

export const $user = user
  .createStore<IUser>({} as IUser)
  .on(loginCheckFx.done, (_, { result }) => result) // при успехе, получаем данные юзера и прокидываем в стор

sample({
  clock: loginCheck,
  source: $user,
  fn: (_, { jwt }) => ({
    jwt,
  }),
  target: loginCheckFx,
})
