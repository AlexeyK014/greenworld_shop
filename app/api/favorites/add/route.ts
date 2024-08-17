// добавление в избранное

import clientPromise from '@/lib/mongodb'
import { getAuthRouteData, parseJwt } from '@/lib/utils/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

// когда юзер тригеррит этот эндпоинт, значит он АВТОРИЗОВАЛСЯ
// значит нам нужно понимать какой именно пользователь добавляет товары в корзину
// если юхер не авторизован всё происходит на клиенте, без запросов на сервер
export async function POST(req: Request) {
  try {
    const { db, validatedTokenResult, reqBody, token } = await getAuthRouteData(
      clientPromise,
      req
    )

    // если токен не валидный
    if (validatedTokenResult.status !== 200) {
      return NextResponse.json(validatedTokenResult)
    }

    // с клиента присылаем 4 поля
    // проверяем чтобы все 4 поля были переданы, иначе выдаём ошибку
    if (Object.keys(reqBody).length < 4) {
      return NextResponse.json({
        message: 'Not all fields passed',
        status: 404,
      })
    }

    // находи пользователя по email из токена
    const user = await db
      .collection('user')
      .findOne({ email: parseJwt(token as string).email })

    // находим товар который добавляется с клиента
    const productItem = await db
      .collection(reqBody.category)
      .findOne({ _id: new ObjectId(reqBody.productId) })

    // проверка, если не productItem, начит был передан неправильный productId
    if (!productItem) {
      return NextResponse.json({
        message: 'Wrong product id',
        status: 404,
      })
    }

    // иначе создаём такой товар
    const newFavoriteItem = {
      userId: user?._id, // прикрепляем id юзера, который хранится на сервере
      productId: productItem._id,
      image: productItem.images[0],
      name: productItem.name,
      size: productItem.type === 'chickpeas' && 'sunflower' ? '' : reqBody.size,
      price: productItem.price,
      vendorCode: productItem.vendorCode,
      category: reqBody.category,
      clientId: reqBody.clientId, //который хранится на клиента, для синхронизации
    }

    // добавляем товар в кол-ию favorites
    const { insertedId } = await db
      .collection('favorites')
      .insertOne(newFavoriteItem)

    return NextResponse.json({
      status: 201,
      newFavoriteItem: { _id: insertedId, ...newFavoriteItem },
    })
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
