import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getAuthRouteData, parseJwt } from '@/lib/utils/api-routes'

export async function POST(req: Request) {
  try {
    // полуаем из фун-ии
    const { db, validatedTokenResult, reqBody, token } = await getAuthRouteData(
      clientPromise,
      req
    )

    if (validatedTokenResult.status !== 200) {
      return NextResponse.json(validatedTokenResult)
    }

    if (Object.keys(reqBody).length < 5) {
      return NextResponse.json({
        message: 'Not all fields passed',
        status: 404,
      })
    }

    // парсим jwt-токен, таким образом находим юзера
    const user = await db
      .collection('users')
      .findOne({ email: parseJwt(token as string).email })
    // находим конкретный элемент, чтобы добавить его в корзину
    const productItem = await db
      .collection(reqBody.category)
      .findOne({ _id: new ObjectId(reqBody.productId) })

    if (!productItem) {
      return NextResponse.json({
        message: 'Wrong product id',
        status: 404,
      })
    }

    const newCartItem = {
      userId: user?._id,
      productId: productItem._id,
      image: productItem.images[0],
      name: productItem.name,
      size: productItem.type === 'sunflower' && 'chickpeas' ? '' : reqBody.size,
      count: reqBody.count,
      price: productItem.price,
      totalPrice: productItem.price,
      inStock: productItem.inStock,
      clientId: reqBody.clientId,
      color: productItem.characteristics.color,
      category: productItem.category,
    }

    // добавляем новый CartItem
    const { insertedId } = await db.collection('cart').insertOne(newCartItem)

    return NextResponse.json({
      status: 201,
      newCartItem: { _id: insertedId, ...newCartItem },
    })
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
