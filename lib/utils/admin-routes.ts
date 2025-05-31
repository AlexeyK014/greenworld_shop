import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'
import { getDbAndReqBody } from './api-routes'
import { corsHeaders } from '@/constants/corsHeader'

export const getFilteredCollection = async (
  collection: string,
  clientPromise: Promise<MongoClient>,
  req: Request
) => {
  const { db } = await getDbAndReqBody(clientPromise, null)
  const url = new URL(req.url)
  const rangeParam = url.searchParams.get('range') || JSON.stringify([0, 4])
  const sortParam =
    url.searchParams.get('sort') || JSON.stringify(['name', 'ASC'])
  const range = JSON.parse(rangeParam)
  const sort = JSON.parse(sortParam)

  const goods = await db
    .collection(collection)
    .find()
    .sort({
      [sort[0] === 'id' ? '_id' : sort[0]]: sort[1] === 'ASC' ? 1 : -1,
    })
    .toArray()

  return NextResponse.json(
    {
      count: goods.length,
      items: goods
        .slice(range[0], range[1])
        .map((item) => ({ ...item, id: item._id })),
    },
    corsHeaders
  )
}

// import { MongoClient } from "mongodb";
// import clientPromise from "../mongodb";
// import { corsHeaders } from "@/constants/corsHeader";
// import { NextResponse } from "next/server";
// import { getDbAndReqBody } from "./api-routes";

// export const getFilteredCollection = async (
//   collection: string,
//   clientPromise: Promise<MongoClient>,
//   req: Request
// ) => {
//   const { db } = await getDbAndReqBody(clientPromise, null);

//   // т.к. получаем query-параметры, создаём инстанс от класса URL
//   //  передаём туда req.url который приход с клиента где есть query параметры
//   const url = new URL(req.url);

//   // получаем от url, который пришёл с клиента 'range', если параметра нет, выставляем по дефолту
//   const rangeParam = url.searchParams.get('range') || JSON.stringify([0, 4]);

//   // получаем параметр 'sort' из URL или по дефолту
//   const sortParam = url.searchParams.get('sort') || JSON.stringify(['name', 'ASC']);

//   const range = JSON.parse(rangeParam);
//   const sort = JSON.parse(sortParam);

//   // фун-я для фильтрации
//   const goods = await db
//     .collection(collection)
//     .find()
//     .sort({
//       // ключ - значение
//       // если сорт=0, делаем сортировку по id. Если это булет поле name-утсанавливаем name
//       // значение: для сортировки если 1-по возратстанию, -1-по убыванию
//       [sort[0] === 'id' ? '_id' : sort[0]]: sort[1] === 'ASC' ? 1 : -1,
//     })
//     .toArray();

//   // возвращаем товары в необходимом диапазоне
//   return NextResponse.json(
//     {
//       count: goods.length,
//       items: goods.slice(range[0], range[1]).map((item) => ({ ...item, id: item._id })), // меняем id
//     },
//     corsHeaders,
//   );
// }
