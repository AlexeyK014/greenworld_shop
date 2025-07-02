'use client';

import { Effect } from "effector";
import { getNewsFx, loadOneNewsFx, news, setCurrentNews } from ".";
import { INews } from "@/types/common";

const goodsStoreInstace = (effect: Effect<void, [], Error>) =>
  news
    .createStore([])
    .on(effect.done, (_, { result }) => result)
    .on(effect.fail, (_, { error }) => {
      console.log(error.message);
    });

export const $news = goodsStoreInstace(getNewsFx);


export const $currentNews = news
  .createStore<INews>({} as INews)
  .on(setCurrentNews, (_, news) => news) //получаем товары с клиента, уже имеющиеся
  .on(loadOneNewsFx.done, (_, { result }) => result.newsItem); // получаем товары с сервера
