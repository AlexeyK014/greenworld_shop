'use client';

import { createDomain, createEffect } from "effector";
import api from '@/api/apiInstance';
import { createGate } from "effector-react";
import { ILoadOneNewsFx } from "@/types/news";
import toast from "react-hot-toast";
import { INews } from "@/types/common";

export const news = createDomain();

export const MainPageGate = createGate();

export const loadOneNews = news.createEvent<ILoadOneNewsFx>()
export const setCurrentNews = news.createEvent<INews>(); // сетим товар

export const getNewsFx = createEffect(async () => {
  const { data } = await api.get('/api/news');
  return data;
});

export const loadOneNewsFx = news.createEffect(
  async ({ newsId,
    // category,
    setSpinner }: ILoadOneNewsFx) => {
    try {
      setSpinner && setSpinner(true);
      const { data } = await api.post('/api/news/one', { newsId,
        // category
      });

      console.log('Ответ API:', data);

      if (data?.message === 'Wrong news id') {
        return { newsId: { errorMessage: 'Wrong news id' } };
      }

      return data;
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSpinner && setSpinner(false);
    }
  },
);
