'use client';

import { handleJWTError } from '@/lib/utils/errors';
import { createDomain, createEffect, createEvent } from 'effector';
import toast from 'react-hot-toast';
import { setIsAuth } from '../auth';
import api from '@/api/apiInstance';
import { ILoginCheckFx, IUserGeolocation } from '@/types/user';
import { IGetGeolocationFx } from '@/types/common';

export const user = createDomain();

export const loginCheck = user.createEvent<ILoginCheckFx>();

// для определения местоположения для оформления заказа
export const setUserGeolocation = user.createEvent<IUserGeolocation>();

export const updateUsername = createEvent<string>()
export const updateUserImage = createEvent<string>()
export const updateUserEmail = createEvent<string>()

// делаем запрос на route
// передаём токен
export const loginCheckFx = createEffect(async ({ jwt }: ILoginCheckFx) => {
  try {
    const { data } = await api.get('/api/users/login-check', {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    // если возникает ошибка с токеном, тогда вызываем handleJWTError, передаём туда название ошибки
    // и передаём название метода, чтобы повторитьб запрос, если токен протух
    if (data?.error) {
      handleJWTError(data.error.name, {
        repeatRequestMethodName: 'loginCheckFx'
      });
      return;
    }

    setIsAuth(true);
    return data.user; // при успее возр данные юзера
  } catch (error) {
    toast.error((error as Error).message);
  }
});

// для получения местоположения
export const getGeolocationFx = createEffect(async ({ lon, lat }: IGetGeolocationFx) => {
  try {
    const data = await api.get(
      // eslint-disable-next-line max-len
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`,
    );

    return data;
  } catch (error) {
    toast.error((error as Error).message);
  }
});
