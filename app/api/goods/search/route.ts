// добавление в избранное

import clientPromise from '@/lib/mongodb';
import { getDbAndReqBody } from '@/lib/utils/api-routes';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { db, reqBody } = await getDbAndReqBody(clientPromise, req);

    // находим нужные нам товары
    // делаем поиск по полям категории, типы, имена товаров
    const getFilteredGoods = async (field: string, collection: string) => {

      // reqBody.search - делаем проверку, если там есть значения с клиента, то туда передаём фильтр
      // и указываем по какому полю делаем фильтрацию
      // поле ДИНАМИЧЕСКОЕ
      const goods = await db
        .collection(collection)
        .find({
          ...(reqBody.search && {
            [field]: {
              // регулярное выражение, для поиска ищем совпадения в произвольном месте
              $regex: `(s+${reqBody.search}|^${reqBody.search})`,
              $options: 'i' // не важно какой регистр
            }
          })
        })
        .toArray()

      return goods
    }

    const getGoodsByCollection = async (collection: string) => {
      const [goodsByType, goodsByCategory, goodsByName] = await Promise.allSettled([
        getFilteredGoods('type', collection),
        getFilteredGoods('category', collection),
        getFilteredGoods('name', collection)
      ])

      // делаем доп проверку
      if (
        goodsByType.status !== 'fulfilled' ||
        goodsByCategory.status !== 'fulfilled' ||
        goodsByName.status !== 'fulfilled'
      ) {
        return [] // возвращаем пустой массив
      }
      // а иначе возвращаем данные
      return [
        ...goodsByType.value,
        ...goodsByCategory.value,
        ...goodsByName.value,
      ]

    }

    // вызываем фун-ю для каждой коллекции
    const [microgreen, sprouts, seeds, equipment] = await Promise.allSettled([
      getGoodsByCollection('microgreen'),
      getGoodsByCollection('sprouts'),
      getGoodsByCollection('seeds'),
      getGoodsByCollection('equipment')
    ])


    if (
      microgreen.status !== 'fulfilled' ||
      sprouts.status !== 'fulfilled' ||
      seeds.status !== 'fulfilled' ||
      equipment.status !== 'fulfilled'
    ) {
      return NextResponse.json({
        count: 0,
        items: [],
      });
    }

    const allGoods = [
      ...microgreen.value,
      ...sprouts.value,
      ...seeds.value,
      ...equipment.value,
    ]

    return NextResponse.json({
      count: allGoods.length,
      items: allGoods,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
