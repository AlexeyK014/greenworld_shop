// 'use client'

// import { IUser, IUserGeolocation } from '@/types/user'
// import { loginCheckFx, setUserGeolocation, user } from '.'

// export const $user = user
//   .createStore<IUser>({} as IUser)
//   .on(loginCheckFx.done, (_, { result }) => result) // при успехе, получаем данные юзера и прокидываем в стор

// export const $userGeolocation = user
//   .createStore<IUserGeolocation>({} as IUserGeolocation)
//   .on(setUserGeolocation, (_, data) => data)

'use client';
import { IUser, IUserGeolocation } from '@/types/user';
import { user, loginCheckFx, setUserGeolocation } from '.';

export const $user = user
  .createStore<IUser>({} as IUser)
  .on(loginCheckFx.done, (_, { result }) => result);

export const $userGeolocation = user
  .createStore<IUserGeolocation>({} as IUserGeolocation)
  .on(setUserGeolocation, (_, data) => data);
