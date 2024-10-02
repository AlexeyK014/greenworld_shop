// получаем сам товар с базы данных
import clientPromise from '@/lib/mongodb'
import { getDbAndReqBody } from '@/lib/utils/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { db, reqBody } = await getDbAndReqBody(clientPromise, req)
    const productsPayload: { _id: string; category: string }[] = reqBody.payload // из LS

    if (!productsPayload) {
      return NextResponse.json({
        message: 'payload field is required',
        status: 404,
      })
    }

    const getWatchedProducts = async (category: string) => {
      const goods = await db
        .collection(category)
        .find({
          //делаем фильтр по полю id. Получаем товары где есть совпадение по id(просмотренные товары из LS)
          // через диструктуризацию достаём id
          _id: { $in: productsPayload.map(({ _id }) => new ObjectId(_id)) },
        })
        .toArray()

      return goods
    }

    const [microgreen, sprouts, seeds, equipment] = await Promise.allSettled([
      getWatchedProducts('microgreen'),
      getWatchedProducts('sprouts'),
      getWatchedProducts('seeds'),
      getWatchedProducts('equipment'),
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
      })
    }

    // когда всё подгрузилось создаём переменну. Разворачиваем все товары
    const allGoods = [
      ...microgreen.value,
      ...sprouts.value,
      ...seeds.value,
      ...equipment.value,
    ]

    return NextResponse.json({
      count: allGoods.length,
      items: allGoods,
    })
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
