import clientPromise from '@/lib/mongodb'
import { getAuthRouteData } from '@/lib/utils/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  try {
    const { db, reqBody, validatedTokenResult } = await getAuthRouteData(
      clientPromise,
      req
    )

    if (validatedTokenResult.status !== 200) {
      return NextResponse.json(validatedTokenResult)
    }

    const id = req.url.split('id=')[1] // получаем id обновляемого элемента
    const count = reqBody.count // получаем тот count который хотим установить

    await db.collection('cart').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          count,
        },
      }
    )

    return NextResponse.json({ status: 204, id, count })
  } catch (error) {
    throw new Error((error as Error).message)
  }
}
