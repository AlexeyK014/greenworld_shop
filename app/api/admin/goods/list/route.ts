import { corsHeaders } from '@/constants/corsHeader'
import clientPromise from '@/lib/mongodb'
import { getDbAndReqBody } from '@/lib/utils/api-routes'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { db } = await getDbAndReqBody(clientPromise, null)

    // т.к. получаем query-параметры, создаём инстанс от класса URL
    //  передаём туда req.url который приход с клиента где есть query параметры
    const url = new URL(req.url)

    // получаем от url, который пришёл с клиента 'range', если параметра нет, выставляем по дефолту
    const rangeParam = url.searchParams.get('range') || JSON.stringify([0, 4])

    // получаем параметр 'sort' из URL или по дефолту
    const sortParam =
      url.searchParams.get('sort') || JSON.stringify(['name', 'ASC'])

    const range = JSON.parse(rangeParam)
    const sort = JSON.parse(sortParam)

    // фун-я для фильтрации
    const getFilterCollection = async (collection: string) => {
      const goods = await db
        .collection(collection)
        .find()
        .sort({
          // ключ - значение
          [sort[0] === 'id' ? '_id' : sort[0]]: sort[1] === 'ASC' ? 1 : -1,
        })
        .toArray()

      return goods
    }

    const [microgreen, sprouts] = await Promise.allSettled([
      getFilterCollection('microgreen'),
      getFilterCollection('sprouts'),
    ])

    if (microgreen.status !== 'fulfilled' || sprouts.status !== 'fulfilled') {
      return NextResponse.json(
        {
          count: 0,
          items: [],
        },
        corsHeaders
      )
    }

    const allGoods = [...microgreen.value, ...sprouts.value]

    // возвращаем товары в необходимом диапазоне
    return NextResponse.json(
      {
        count: allGoods.length,
        items: allGoods
          .slice(range[0], range[1])
          .map((item) => ({ ...item, id: item._id })), // меняем id
      },
      corsHeaders
    )
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export const dynamic = 'force-dynamic'
