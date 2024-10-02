import { allowedColors, allowedSizes } from '@/constants/product'
import clientPromise from '@/lib/mongodb'
import { getDbAndReqBody } from '@/lib/utils/api-routes'
import { checkPriceParam, getCheckedArrayParam } from '@/lib/utils/common'
import { Sort } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { db } = await getDbAndReqBody(clientPromise, null)

    // передаём url из Request
    const url = new URL(req.url)

    const limit = url.searchParams.get('limit') || 12
    const offset = url.searchParams.get('offset') || 0

    // когда юзер выбирает Все Товары, нас переносит на Каталог
    const isCatalogParam = url.searchParams.get('catalog')

    const typeParam = url.searchParams.get('type') // получаем query-параметр type

    // чтобы обращаться к нужной категории
    const categoryParam = url.searchParams.get('category')

    // получаем параметры которые получаем с клиента
    const priceFromParam = url.searchParams.get('priceFrom')
    const priceToParam = url.searchParams.get('priceTo')
    const sizesParam = url.searchParams.get('sizes')
    const colorsParam = url.searchParams.get('colors')
    const colectionParam = url.searchParams.get('collection')
    const sortParam = url.searchParams.get('sort') || 'default'

    // делаем проверку на валидность этих параметров
    const isFullPriceRange =
      priceFromParam &&
      priceToParam &&
      checkPriceParam(+priceFromParam) &&
      checkPriceParam(+priceToParam)
    const sizesArr = getCheckedArrayParam(sizesParam as string)
    const colorsArr = getCheckedArrayParam(colorsParam as string)

    const isValidColors =
      colorsArr && colorsArr.every((color) => allowedColors.includes(color))
    const isValidSizes =
      sizesArr &&
      sizesArr.every((size) => allowedSizes.includes(size.toLowerCase()))

    const filter = {
      // указываем динамическое поле, чтобы с помощью mongodb достать параметры у которых совпадает type
      ...(typeParam && { type: typeParam }), // получаем определённый тип
      ...(isFullPriceRange && {
        price: { $gt: +priceFromParam, $lt: +priceToParam },
      }), // чтобы через mongodb доставать товары в нужном диапазоне
      ...(isValidSizes && {
        // $and - возвращает несколько совпадений
        // получаем размеры которые true. В and передаём массив с объектами в котором
        // ключ для размера 's', 'l'... и берём только true
        $and: (sizesArr as string[]).map((sizes) => ({
          [`sizes.${sizes.toLowerCase()}`]: true,
        })),
      }),
      ...(isValidColors && {
        // $and - принимает массив с объектами тех полей у которых есть одно совпадение у каждого товара
        $or: (colorsArr as string[]).map((color) => ({
          ['characteristics.color']: color.toLowerCase(),
        })),
      }),
      ...(colectionParam && {
        // обращаемся к 'characteristics.collection' и к той коллекции которая приодит в параме
        ['characteristics.collection']: colectionParam,
      }),
    }

    const sort = {
      ...(sortParam.includes('cheap_first') && {
        price: 1,
      }),
      ...(sortParam.includes('expensive_first') && {
        price: -1,
      }),
      ...(sortParam.includes('new') && {
        isNew: -1,
      }),
      ...(sortParam.includes('popular') && {
        popularity: -1,
      }),
    }

    // если находимся на 'catalog'
    // созд фун-ю, где принимаем кол-ю и возвращаем товары
    if (isCatalogParam) {
      const getFilteredCollection = async (collection: string) => {
        const goods = await db
          .collection(collection)
          .find()
          .sort(sort as Sort)
          .toArray()

        return goods
      }

      const [microgreen, sprouts, seeds, equipment] = await Promise.allSettled([
        getFilteredCollection('microgreen'),
        getFilteredCollection('sprouts'),
        getFilteredCollection('seeds'),
        getFilteredCollection('equipment'),
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
      ].sort((a, b) => {
        if (sortParam.includes('cheap_first')) {
          return +a.price - +b.price
        }

        if (sortParam.includes('expensive_first')) {
          return +b.price - +a.price
        }

        if (sortParam.includes('new')) {
          // приводим к Number поле isNew
          // булевое значение при проиведение к числе превращются к 0 или 1
          return Number(b.isNew) - Number(a.isNew)
        }

        if (sortParam.includes('popular')) {
          return +b.popularity - +a.popularity
        }
        return 0
      })

      return NextResponse.json({
        count: allGoods.length,
        items: allGoods.slice(+offset, +limit),
      })
    }

    // чтобы вернуть товары отфильтрованные
    const currentGoods = await db
      .collection(categoryParam as string)
      .find(filter)
      .sort(sort as Sort)
      .toArray()

    return NextResponse.json({
      count: currentGoods.length,
      items: currentGoods.slice(+offset, +limit),
    })
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export const dynamic = 'force-dynamic'
