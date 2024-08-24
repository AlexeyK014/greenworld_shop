import clientPromise from '@/lib/mongodb'
import { getAuthRouteData, parseJwt } from '@/lib/utils/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

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

    // с клиента присылаем 3 поля
    // проверяем чтобы все 3 поля были переданы, иначе выдаём ошибку
    if (Object.keys(reqBody).length < 3) {
      return NextResponse.json({
        message: 'Not all fields passed',
        status: 404,
      })
    }

    //находим юзера по email
    // чтобы id юзера прикреплять к товару в сранения
    const user = await db
      .collection('users')
      .findOne({ email: parseJwt(token as string).email })

    // находим сам товар с помощью поля productId, который передаём с клиента в body
    const productItem = await db
      .collection(reqBody.category)
      .findOne({ _id: new ObjectId(reqBody.productId) })

    // если в productId - null
    if (!productItem) {
      return NextResponse.json({
        message: 'Wrong product id',
        status: 404,
      })
    }

    // создаём новый объект
    const newComparisonItem = {
      userId: user?._id,
      productId: productItem._id,
      image: productItem.images[0],
      name: productItem.name,
      sizes: productItem.sizes,
      price: productItem.price,
      category: reqBody.category,
      characteristics: { ...productItem.characteristics },
      clientId: reqBody.clientId,
    }

    // добавляем в коллекцию comparison новый созданный объект
    // при добавление возращается id
    const { insertedId } = await db
      .collection('comparison')
      .insertOne(newComparisonItem)

    // возвращаем на клиент
    return NextResponse.json({
      status: 201,
      newComparisonItem: { _id: insertedId, ...newComparisonItem },
    })
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
